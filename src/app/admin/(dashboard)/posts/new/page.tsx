import Link from 'next/link';
import { requireStaff } from '@/lib/auth';
import { PostEditor } from '@/components/admin/post-editor';

export const metadata = { title: 'New post' };

export default async function NewPostPage() {
  await requireStaff();
  return (
    <div className="p-6 sm:p-10">
      <Link href="/admin/posts" className="text-sm text-muted underline underline-offset-4 hover:text-ink">
        Back to posts
      </Link>
      <h1 className="mb-8 mt-4 font-display text-3xl">New post</h1>
      <PostEditor />
    </div>
  );
}
