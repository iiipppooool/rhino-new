import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getStaff } from '@/lib/auth';
import { ResetForm } from './reset-form';

export const metadata: Metadata = {
  title: 'Set a new password',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function ResetPage() {
  // Reached only with the session created by the emailed link.
  const staff = await getStaff();
  if (!staff) redirect('/admin/login?error=link-expired');

  return (
    <main className="flex min-h-svh items-center justify-center px-5 py-20">
      <ResetForm email={staff.email} />
    </main>
  );
}
