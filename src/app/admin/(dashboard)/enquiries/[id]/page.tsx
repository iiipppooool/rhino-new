import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { updateEnquiry, deleteEnquiry } from '../actions';
import { ConfirmButton } from '@/components/admin/confirm-button';

export const metadata = { title: 'Enquiry' };
export const dynamic = 'force-dynamic';

const TYPES = { prebook: 'Pre-booking request', service: 'Service request', general: 'General question' } as const;
const STATUSES = ['new', 'replied', 'booked', 'closed'] as const;

export default async function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff();
  const { id } = await params;

  const supabase = await createClient();
  const { data: e } = await supabase.from('enquiries').select('*').eq('id', id).maybeSingle();
  if (!e) notFound();

  const rows: [string, string | null][] = [
    ['Type', TYPES[e.type as keyof typeof TYPES]],
    ['Name', e.name],
    ['Email', e.email],
    ['Phone', e.phone],
    ['Organisation', e.organisation],
    ['Service', e.service],
    ['Preferred date', e.preferred_date ? new Date(e.preferred_date).toLocaleDateString('en-GB') : null],
    ['Backup date', e.backup_date ? new Date(e.backup_date).toLocaleDateString('en-GB') : null],
    ['Start time', e.start_time],
    ['Group size', e.group_size != null ? String(e.group_size) : null],
    ['Age range', e.age_range],
    ['Venue postcode', e.venue_postcode],
    ['Heard about us', e.source],
    ['Marketing opt in', e.marketing_opt_in ? 'Yes' : 'No'],
    ['18+ or organisation', e.over18_or_org ? 'Confirmed' : 'Not confirmed'],
    ['Privacy accepted', e.privacy_accepted ? 'Yes' : 'No'],
    ['Received', new Date(e.created_at).toLocaleString('en-GB')],
  ];

  const mailto = `mailto:${encodeURIComponent(e.email)}?subject=${encodeURIComponent(
    `Re: your VRhino ${e.type === 'general' ? 'question' : 'enquiry'}`,
  )}&body=${encodeURIComponent(`Hi ${e.name.split(' ')[0] ?? e.name},\n\n`)}`;

  return (
    <div className="p-6 sm:p-10">
      <Link href="/admin/enquiries" className="text-sm text-muted underline underline-offset-4 hover:text-ink">
        Back to enquiries
      </Link>

      <header className="mb-8 mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">{e.name}</h1>
          <p className="mt-1 text-sm text-muted">{TYPES[e.type as keyof typeof TYPES]}</p>
        </div>
        <a href={mailto} className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-canvas hover:bg-accent-dark">
          Reply by email
        </a>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <section className="rounded-xl border border-line bg-surface p-6">
            <h2 className="font-display text-sm uppercase tracking-wider text-muted">What they sent</h2>
            <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {rows.filter(([, v]) => v).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted">{k}</dt>
                  <dd className="mt-0.5 break-words text-sm text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-xl border border-line bg-surface p-6">
            <h2 className="font-display text-sm uppercase tracking-wider text-muted">Message</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">{e.message}</p>
          </section>
        </div>

        <aside className="space-y-6">
          <form action={updateEnquiry} className="rounded-xl border border-line bg-surface p-6">
            <input type="hidden" name="id" value={e.id} />

            <label htmlFor="status" className="mb-1.5 block text-sm font-medium">Status</label>
            <select id="status" name="status" defaultValue={e.status}
              className="w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-sm capitalize focus:border-blue focus:outline-none">
              {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>

            <label htmlFor="internal_notes" className="mb-1.5 mt-5 block text-sm font-medium">
              Internal notes
            </label>
            <p className="mb-1.5 text-xs text-muted">Only staff see this. Never shown to the enquirer.</p>
            <textarea id="internal_notes" name="internal_notes" rows={7} defaultValue={e.internal_notes ?? ''}
              className="w-full resize-y rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-sm focus:border-blue focus:outline-none" />

            <button type="submit" className="mt-4 w-full rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-canvas hover:bg-accent-dark">
              Save
            </button>
          </form>

          <div className="rounded-xl border border-line p-6">
            <h2 className="font-display text-sm uppercase tracking-wider text-muted">Data protection</h2>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Delete this record if the person asks you to remove their data, or once you no longer
              need it. Deleting is permanent.
            </p>
            {staff.role === 'admin' ? (
              <form action={deleteEnquiry} className="mt-4">
                <input type="hidden" name="id" value={e.id} />
                <ConfirmButton
                  message={`Permanently delete the enquiry from ${e.name}? This cannot be undone.`}
                  className="text-sm text-accent underline underline-offset-4"
                >
                  Delete this enquiry
                </ConfirmButton>
              </form>
            ) : (
              <p className="mt-4 text-xs text-muted">Only an admin can delete an enquiry.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
