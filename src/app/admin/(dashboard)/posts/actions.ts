'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { postSchema, slugify } from '@/lib/schemas';

export type PostState = {
  status: 'idle' | 'saved' | 'error';
  message?: string;
  fieldErrors?: Record<string, string>;
};

/** Re-renders the public pages a post affects, so changes appear without a redeploy. */
function revalidatePublic(slug: string) {
  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);
  revalidatePath('/feed.xml');
  revalidatePath('/sitemap.xml');
}

function readForm(formData: FormData) {
  const tagsRaw = String(formData.get('tags') ?? '');
  let body: unknown = { type: 'doc', content: [] };
  try {
    const raw = formData.get('body');
    if (typeof raw === 'string' && raw) body = JSON.parse(raw);
  } catch {
    // Falls back to an empty document; validation below reports the problem.
  }

  const title = String(formData.get('title') ?? '');
  return {
    title,
    slug: String(formData.get('slug') ?? '').trim() || slugify(title),
    excerpt: String(formData.get('excerpt') ?? ''),
    cover_image_url: String(formData.get('cover_image_url') ?? ''),
    tags: tagsRaw.split(',').map((t) => t.trim()).filter(Boolean),
    body,
    status: (formData.get('intent') === 'publish' ? 'published' : 'draft') as 'draft' | 'published',
  };
}

export async function savePost(_prev: PostState, formData: FormData): Promise<PostState> {
  // Authorisation is checked here, not only in the layout: a server action is
  // a POST endpoint and can be invoked without ever rendering the page.
  const staff = await requireStaff();

  const parsed = postSchema.safeParse(readForm(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join('.') || 'form'] ??= issue.message;
    }
    return { status: 'error', message: 'Check the highlighted fields.', fieldErrors };
  }

  const id = formData.get('id');
  const supabase = await createClient();
  const isPublishing = parsed.data.status === 'published';

  const payload = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt || null,
    cover_image_url: parsed.data.cover_image_url || null,
    tags: parsed.data.tags,
    body: parsed.data.body,
    status: parsed.data.status,
  };

  if (typeof id === 'string' && id) {
    // Only set published_at the first time it is published, so re-editing a
    // live post does not quietly move it to the top of the blog.
    const { data: existing } = await supabase
      .from('posts').select('published_at').eq('id', id).maybeSingle();

    const { error } = await supabase
      .from('posts')
      .update({
        ...payload,
        published_at: isPublishing
          ? (existing?.published_at ?? new Date().toISOString())
          : existing?.published_at ?? null,
      })
      .eq('id', id);

    if (error) return { status: 'error', message: friendly(error.message) };
    revalidatePublic(parsed.data.slug);
    revalidatePath('/admin/posts');
    return { status: 'saved', message: isPublishing ? 'Published.' : 'Draft saved.' };
  }

  const { data: created, error } = await supabase
    .from('posts')
    .insert({
      ...payload,
      author_id: staff.id,
      published_at: isPublishing ? new Date().toISOString() : null,
    })
    .select('id, slug')
    .single();

  if (error || !created) return { status: 'error', message: friendly(error?.message ?? '') };

  revalidatePublic(created.slug);
  revalidatePath('/admin/posts');
  redirect(`/admin/posts/${created.id}?saved=1`);
}

export async function unpublishPost(formData: FormData) {
  await requireStaff();
  const id = String(formData.get('id'));
  const supabase = await createClient();
  const { data } = await supabase
    .from('posts').update({ status: 'draft' }).eq('id', id).select('slug').single();
  if (data) revalidatePublic(data.slug);
  revalidatePath('/admin/posts');
}

export async function deletePost(formData: FormData) {
  await requireStaff();
  const id = String(formData.get('id'));
  const supabase = await createClient();
  const { data } = await supabase.from('posts').select('slug').eq('id', id).maybeSingle();
  await supabase.from('posts').delete().eq('id', id);
  if (data) revalidatePublic(data.slug);
  revalidatePath('/admin/posts');
  redirect('/admin/posts');
}

function friendly(message: string) {
  if (message.includes('posts_slug_key') || message.includes('duplicate key')) {
    return 'That slug is already used by another post. Pick a different one.';
  }
  if (message.includes('posts_published_has_date')) {
    return 'A published post needs a publish date.';
  }
  return message || 'Something went wrong saving the post.';
}
