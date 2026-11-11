import type { Metadata } from 'next';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Sign in',
  // Keep the admin door out of search results entirely.
  robots: { index: false, follow: false, nocache: true },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return (
    <main className="flex min-h-svh items-center justify-center px-5 py-20">
      <LoginForm next={next} initialError={error === 'not-configured'
        ? 'This deployment is not connected to Supabase yet.'
        : undefined} />
    </main>
  );
}
