import Link from 'next/link';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/posts';
import { Button } from '@/components/ui/button';
import { deletePost, unpublishPost } from './actions';
import { ConfirmButton } from '@/components/admin/confirm-button';

export const metadata = { title: 'Posts' };
export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  await requireStaff();
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, slug, status, published_at, updated_at')
    .order('updated_at', { ascending: false });

  return (
    <div className="p-6 sm:p-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Posts</h1>
          <p className="mt-1 text-sm text-muted">
            {posts?.length ?? 0} post{posts?.length === 1 ? '' : 's'}
          </p>
        </div>
        <Button href="/admin/posts/new">New post</Button>
      </header>

      {error && (
        <p role="alert" className="mb-6 rounded-lg border border-accent/60 bg-accent/10 px-4 py-3 text-sm">
          {error.message}
        </p>
      )}

      {!posts || posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line px-8 py-16 text-center">
          <h2 className="font-display text-xl">No posts yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Write the first one. Drafts stay private until you publish them.
          </p>
          <Button href="/admin/posts/new" className="mt-6">Write a post</Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead className="border-b border-line bg-surface text-xs uppercase tracking-wider text-muted">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Title</th>
                <th scope="col" className="px-5 py-3 font-medium">Status</th>
                <th scope="col" className="px-5 py-3 font-medium">Date</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {posts.map((p) => (
                <tr key={p.id} className="bg-surface/40">
                  <th scope="row" className="px-5 py-4 font-normal">
                    <Link href={`/admin/posts/${p.id}`} className="font-medium text-ink hover:text-accent">
                      {p.title}
                    </Link>
                    <span className="mt-0.5 block font-mono text-xs text-muted">/{p.slug}</span>
                  </th>
                  <td className="px-5 py-4">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      p.status === 'published'
                        ? 'bg-blue/15 text-blue-light'
                        : 'bg-flag/15 text-flag'
                    }`}>
                      {p.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted">
                    {formatDate(p.published_at ?? p.updated_at)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/posts/${p.id}`} className="text-ink underline underline-offset-4 hover:text-accent">
                        Edit
                      </Link>
                      {p.status === 'published' && (
                        <>
                          <Link href={`/blog/${p.slug}`} target="_blank" className="text-muted underline underline-offset-4 hover:text-ink">
                            View
                          </Link>
                          <form action={unpublishPost}>
                            <input type="hidden" name="id" value={p.id} />
                            <button type="submit" className="text-muted underline underline-offset-4 hover:text-ink">
                              Unpublish
                            </button>
                          </form>
                        </>
                      )}
                      <form action={deletePost}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmButton
                          message={`Delete "${p.title}"? This cannot be undone.`}
                          className="text-accent underline underline-offset-4"
                        >
                          Delete
                        </ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
