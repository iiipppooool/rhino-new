import type { Metadata } from 'next';
import { requireStaff } from '@/lib/auth';
import { AdminShell } from '@/components/admin/admin-shell';

/**
 * Never prerender an admin page. Without this, a build where Supabase env vars
 * are absent resolves the auth check at build time and bakes in a static
 * redirect, which would then be served to a signed-in administrator.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | VRhino admin' },
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Server-side gate for every page in the dashboard group.
 *
 * This runs on the server for each request. The middleware redirect is a
 * convenience; this is the check that matters for pages. Server actions do
 * their own check independently, because an action can be called directly.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaff();
  return <AdminShell staff={staff}>{children}</AdminShell>;
}
