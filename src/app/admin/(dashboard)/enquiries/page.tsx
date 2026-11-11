import Link from 'next/link';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Enquiries' };
export const dynamic = 'force-dynamic';

const TYPES = { prebook: 'Pre-booking', service: 'Service', general: 'General' } as const;
const STATUSES = ['new', 'replied', 'booked', 'closed'] as const;

const statusStyle: Record<string, string> = {
  new: 'bg-accent/15 text-accent',
  replied: 'bg-blue/15 text-blue-light',
  booked: 'bg-emerald-500/15 text-emerald-300',
  closed: 'bg-surface-2 text-muted',
};

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string; deleted?: string; error?: string }>;
}) {
  await requireStaff();
  const { type, status, deleted, error: notice } = await searchParams;

  const supabase = await createClient();
  let query = supabase
    .from('enquiries')
    .select('id, type, name, email, organisation, service, preferred_date, status, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  if (type && type in TYPES) query = query.eq('type', type);
  if (status && (STATUSES as readonly string[]).includes(status)) query = query.eq('status', status);

  const { data: enquiries, error } = await query;

  const chip = (href: string, label: string, active: boolean) => (
    <Link
      key={href + label}
      href={href}
      aria-current={active ? 'true' : undefined}
      className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
        active ? 'border-accent bg-accent text-canvas' : 'border-line text-muted hover:border-blue hover:text-ink'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="p-6 sm:p-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Enquiries</h1>
          <p className="mt-1 text-sm text-muted">{enquiries?.length ?? 0} shown, newest first</p>
        </div>
        <a
          href="/admin/enquiries/export"
          className="rounded-full border border-line px-5 py-2.5 text-sm hover:border-blue"
          download
        >
          Export CSV
        </a>
      </header>

      {deleted && (
        <p role="status" className="mb-5 rounded-lg border border-blue/50 bg-blue/10 px-4 py-2.5 text-sm">
          Enquiry deleted.
        </p>
      )}

      {notice === 'admin-only' && (
        <p role="alert" className="mb-5 rounded-lg border border-accent/60 bg-accent/10 px-4 py-2.5 text-sm">
          Only an administrator can delete an enquiry. Nothing was changed.
        </p>
      )}

      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-muted">Type</span>
          {chip('/admin/enquiries', 'All', !type)}
          {Object.entries(TYPES).map(([k, label]) =>
            chip(`/admin/enquiries?type=${k}${status ? `&status=${status}` : ''}`, label, type === k),
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-muted">Status</span>
          {chip(`/admin/enquiries${type ? `?type=${type}` : ''}`, 'All', !status)}
          {STATUSES.map((s) =>
            chip(`/admin/enquiries?${type ? `type=${type}&` : ''}status=${s}`, s, status === s),
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-6 rounded-lg border border-accent/60 bg-accent/10 px-4 py-3 text-sm">
          {error.message}
        </p>
      )}

      {!enquiries || enquiries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line px-8 py-16 text-center">
          <h2 className="font-display text-xl">Nothing here</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            {type || status ? 'No enquiries match that filter.' : 'Enquiries from the website will appear here.'}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line">
          {enquiries.map((e) => (
            <li key={e.id}>
              <Link href={`/admin/enquiries/${e.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-surface/40 px-5 py-4 transition-colors hover:bg-surface">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyle[e.status]}`}>
                  {e.status}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-ink">{e.name}</span>
                  <span className="block truncate text-xs text-muted">
                    {e.organisation ? `${e.organisation} · ` : ''}{e.email}
                  </span>
                </span>
                <span className="text-xs text-muted">{TYPES[e.type as keyof typeof TYPES]}</span>
                {e.service && <span className="text-xs text-muted">{e.service}</span>}
                {e.preferred_date && (
                  <span className="text-xs text-ink">
                    {new Date(e.preferred_date).toLocaleDateString('en-GB')}
                  </span>
                )}
                <span className="text-xs text-muted">
                  {new Date(e.created_at).toLocaleDateString('en-GB')}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
