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

  const messages: Record<string, string> = {
    'not-configured': 'This deployment is not connected to Supabase yet.',
    'link-invalid': 'That link was not valid. Request a new password reset below.',
    'link-expired': 'That link has expired or has already been used. Request a new one below.',
    'no-access': 'That account does not have access to the admin area.',
    'admin-only': 'That action is restricted to administrators.',
  };

  return (
    <main className="flex min-h-svh items-center justify-center px-5 py-20">
      <LoginForm next={next} initialError={error ? messages[error] : undefined} />
    </main>
  );
}
