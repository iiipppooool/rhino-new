import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PostEditor, type EditablePost } from '@/components/admin/post-editor';
import { deletePost } from '../actions';
import { ConfirmButton } from '@/components/admin/confirm-button';

export const metadata = { title: 'Edit post' };
export const dynamic = 'force-dynamic';

export default async function EditPostPage({
  params, searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireStaff();
  const { id } = await params;
  const { saved } = await searchParams;

  const supabase = await createClient();
  const { data } = await supabase.from('posts').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const post = data as EditablePost;

  return (
    <div className="p-6 sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin/posts" className="text-sm text-muted underline underline-offset-4 hover:text-ink">
          Back to posts
        </Link>
        <form action={deletePost}>
          <input type="hidden" name="id" value={post.id} />
          <ConfirmButton
            message={`Delete "${post.title}"? This cannot be undone.`}
            className="text-sm text-accent underline underline-offset-4"
          >
            Delete post
          </ConfirmButton>
        </form>
      </div>

      <h1 className="mb-2 mt-4 font-display text-3xl">Edit post</h1>
      {saved && (
        <p role="status" className="mb-6 rounded-lg border border-blue/50 bg-blue/10 px-4 py-2.5 text-sm">
          Saved.
        </p>
      )}
      <div className="mt-6">
        <PostEditor post={post} />
      </div>
    </div>
  );
}
