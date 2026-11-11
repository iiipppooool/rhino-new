import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { signOut } from '@/app/admin/login/actions';
import type { Staff } from '@/lib/auth';
import { AdminNav } from './admin-nav';

/** Calmer than the marketing site: same fonts and colours, no motion. */
export function AdminShell({ staff, children }: { staff: Staff; children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col lg:flex-row">
      <aside className="shrink-0 border-b border-line bg-surface lg:w-60 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 p-5 lg:block">
          <Link href="/" className="text-ink" aria-label="VRhino home">
            <Logo />
          </Link>
          <p className="hidden text-xs text-muted lg:mt-3 lg:block">Admin</p>
        </div>

        <AdminNav />

        <div className="border-t border-line p-5 lg:mt-auto">
          <p className="truncate text-xs text-muted" title={staff.email}>{staff.email}</p>
          <p className="mt-0.5 text-xs capitalize text-muted">{staff.role}</p>
          <form action={signOut}>
            <button type="submit" className="mt-3 text-sm text-ink underline underline-offset-4 hover:text-accent">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 bg-canvas">{children}</main>
    </div>
  );
}
