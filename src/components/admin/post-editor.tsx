'use client';

import { useActionState, useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import LinkExt from '@tiptap/extension-link';
import { savePost, type PostState } from '@/app/admin/(dashboard)/posts/actions';
import { slugify } from '@/lib/schemas';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

const field =
  'w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-blue focus:outline-none';

export type EditablePost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: unknown;
  cover_image_url: string | null;
  tags: string[];
  status: 'draft' | 'published';
  published_at: string | null;
};

export function PostEditor({ post }: { post?: EditablePost }) {
  const [state, formAction, pending] = useActionState<PostState, FormData>(savePost, { status: 'idle' });
  const [title, setTitle] = useState(post?.title ?? '');
  // Derived, not stored: the slug follows the title until it is edited by
  // hand, at which point the override takes over. No effect needed.
  const [slugOverride, setSlugOverride] = useState<string | null>(post?.slug ?? null);
  const slug = slugOverride ?? slugify(title);
  const [cover, setCover] = useState(post?.cover_image_url ?? '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const bodyRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Image,
      LinkExt.configure({ openOnClick: false }),
    ],
    content: (post?.body as object) ?? { type: 'doc', content: [] },
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none min-h-[22rem] focus:outline-none prose-headings:font-display prose-p:text-muted prose-strong:text-ink prose-a:text-blue-light prose-img:rounded-lg',
      },
    },
  });

  // Keep the hidden field in step with the editor so a submit always carries
  // the current document, including changes made since the last keystroke.
  const syncBody = useCallback(() => {
    if (editor && bodyRef.current) {
      bodyRef.current.value = JSON.stringify(editor.getJSON());
    }
  }, [editor]);

  useEffect(() => {
    syncBody();
    if (!editor) return;
    editor.on('update', syncBody);
    return () => { editor.off('update', syncBody); };
  }, [editor, syncBody]);

  async function uploadImage(file: File, into: 'cover' | 'body') {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('That is not an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Images must be under 5MB.');
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage.from('blog-images').upload(path, file, {
        cacheControl: '31536000',
        upsert: false,
      });
      if (error) throw error;

      const { data } = supabase.storage.from('blog-images').getPublicUrl(path);
      if (into === 'cover') setCover(data.publicUrl);
      else editor?.chain().focus().setImage({ src: data.publicUrl }).run();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  const err = state.fieldErrors ?? {};
  const cls = (n: string) => `${field} ${err[n] ? 'border-accent' : 'border-line'}`;

  return (
    <form action={formAction} onSubmit={syncBody} className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
      {post && <input type="hidden" name="id" value={post.id} />}
      <input ref={bodyRef} type="hidden" name="body" defaultValue={JSON.stringify(post?.body ?? { type: 'doc', content: [] })} />

      <div className="min-w-0 space-y-5">
        {state.message && (
          <p
            role={state.status === 'error' ? 'alert' : 'status'}
            className={`rounded-lg border px-4 py-3 text-sm ${
              state.status === 'error'
                ? 'border-accent/60 bg-accent/10'
                : 'border-blue/50 bg-blue/10'
            }`}
          >
            {state.message}
          </p>
        )}

        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium">Title</label>
          <input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)}
            className={`${cls('title')} font-display text-lg`} required />
          {err.title && <p role="alert" className="mt-1.5 text-sm text-accent">{err.title}</p>}
        </div>

        <div>
          <label htmlFor="excerpt" className="mb-1.5 block text-sm font-medium">
            Excerpt <span className="font-normal text-muted">(shown on the listing page)</span>
          </label>
          <textarea id="excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt ?? ''} className={`${cls('excerpt')} resize-y`} />
          {err.excerpt && <p role="alert" className="mt-1.5 text-sm text-accent">{err.excerpt}</p>}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Body</span>
            <EditorToolbar editor={editor} onInsertImage={(f) => uploadImage(f, 'body')} busy={uploading} />
          </div>
          <div className="rounded-lg border border-line bg-surface p-4">
            {editor && <EditorContent editor={editor} />}
          </div>
          {uploadError && <p role="alert" className="mt-1.5 text-sm text-accent">{uploadError}</p>}
        </div>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-xl border border-line bg-surface p-5">
          <h2 className="font-display text-sm uppercase tracking-wider text-muted">Publish</h2>
          <p className="mt-3 text-sm">
            Status:{' '}
            <span className={post?.status === 'published' ? 'text-blue-light' : 'text-flag'}>
              {post?.status === 'published' ? 'Published' : 'Draft'}
            </span>
          </p>
          {post?.published_at && (
            <p className="mt-1 text-xs text-muted">
              Published {new Date(post.published_at).toLocaleString('en-GB')}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="submit" name="intent" value="draft" variant="outline" disabled={pending} className="px-5 py-2.5 text-sm">
              {pending ? 'Saving…' : 'Save draft'}
            </Button>
            <Button type="submit" name="intent" value="publish" disabled={pending} className="px-5 py-2.5 text-sm">
              {post?.status === 'published' ? 'Update' : 'Publish'}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5">
          <label htmlFor="slug" className="mb-1.5 block text-sm font-medium">Slug</label>
          <input id="slug" name="slug" value={slug}
            onChange={(e) => setSlugOverride(e.target.value)}
            className={`${cls('slug')} font-mono text-xs`} />
          <p className="mt-1.5 text-xs text-muted">/blog/{slug || 'your-post'}</p>
          {err.slug && <p role="alert" className="mt-1.5 text-sm text-accent">{err.slug}</p>}
        </div>

        <div className="rounded-xl border border-line bg-surface p-5">
          <span className="mb-1.5 block text-sm font-medium">Cover image</span>
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="mb-3 aspect-[16/9] w-full rounded-lg object-cover" />
          )}
          <input type="hidden" name="cover_image_url" value={cover} />
          <label className="inline-block cursor-pointer rounded-lg border border-line px-3.5 py-2 text-sm hover:border-blue">
            {uploading ? 'Uploading…' : cover ? 'Replace image' : 'Upload image'}
            <input type="file" accept="image/*" className="sr-only" disabled={uploading}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, 'cover'); e.target.value = ''; }} />
          </label>
          {cover && (
            <button type="button" onClick={() => setCover('')} className="ml-3 text-sm text-muted underline underline-offset-4 hover:text-ink">
              Remove
            </button>
          )}
          {err.cover_image_url && <p role="alert" className="mt-1.5 text-sm text-accent">{err.cover_image_url}</p>}
        </div>

        <div className="rounded-xl border border-line bg-surface p-5">
          <label htmlFor="tags" className="mb-1.5 block text-sm font-medium">Tags</label>
          <input id="tags" name="tags" defaultValue={post?.tags.join(', ') ?? ''}
            placeholder="Events, Fitness, Schools" className={cls('tags')} />
          <p className="mt-1.5 text-xs text-muted">Separate with commas.</p>
        </div>
      </aside>
    </form>
  );
}

function EditorToolbar({
  editor, onInsertImage, busy,
}: {
  editor: Editor | null;
  onInsertImage: (file: File) => void;
  busy: boolean;
}) {
  if (!editor) return null;

  const btn = (active: boolean) =>
    `rounded px-2 py-1 text-xs transition-colors ${
      active ? 'bg-accent text-canvas' : 'bg-surface-2 text-muted hover:text-ink'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1">
      <button type="button" className={btn(editor.isActive('heading', { level: 2 }))}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button type="button" className={btn(editor.isActive('heading', { level: 3 }))}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
      <button type="button" className={btn(editor.isActive('bold'))}
        onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
      <button type="button" className={btn(editor.isActive('italic'))}
        onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
      <button type="button" className={btn(editor.isActive('bulletList'))}
        onClick={() => editor.chain().focus().toggleBulletList().run()}>List</button>
      <button type="button" className={btn(editor.isActive('blockquote'))}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</button>
      <button type="button" className={btn(editor.isActive('link'))}
        onClick={() => {
          const prev = editor.getAttributes('link').href as string | undefined;
          const url = window.prompt('Link URL', prev ?? 'https://');
          if (url === null) return;
          if (url === '') editor.chain().focus().unsetLink().run();
          else editor.chain().focus().setLink({ href: url }).run();
        }}>Link</button>
      <label className={`${btn(false)} cursor-pointer`}>
        {busy ? 'Uploading…' : 'Image'}
        <input type="file" accept="image/*" className="sr-only" disabled={busy}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onInsertImage(f); e.target.value = ''; }} />
      </label>
    </div>
  );
}
