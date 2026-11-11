import { requireStaff } from '@/lib/auth';
import { site, isTodo, todoHint } from '@/config/site';
import { photos } from '@/lib/photos';

export const metadata = { title: 'Settings' };

/**
 * Read-only on purpose. Site facts live in version control, not in the
 * database, so a change is reviewable and cannot be made by accident.
 */
export default async function SettingsPage() {
  const staff = await requireStaff();

  const outstanding: { label: string; value: string }[] = [];
  const check = (label: string, value: string) => {
    if (isTodo(value)) outstanding.push({ label, value });
  };

  check('Contact email', site.email);
  check('Phone', site.phone);
  check('Instagram', site.social.instagram);
  check('TikTok', site.social.tiktok);
  check('Founder one', site.founders[0].name);
  check('Founder two', site.founders[1].name);
  check('Reply time', site.replyWithinWorkingDays);
  check('Age guidance', site.ageGuidance);
  check('Session duration', site.sessionDuration);

  const missingPhotos = Object.values(photos).filter((p) => !p.src);
  const temporaryPhotos = Object.values(photos).filter((p) => p.temporary);

  return (
    <div className="p-6 sm:p-10">
      <h1 className="font-display text-3xl">Settings</h1>
      <p className="mt-1 text-sm text-muted">Signed in as {staff.email} ({staff.role})</p>

      <section className="mt-9 rounded-xl border border-line bg-surface p-6">
        <h2 className="font-display text-lg">Still to fill in</h2>
        <p className="mt-1.5 text-sm text-muted">
          These appear on the live site as amber placeholder chips. Edit{' '}
          <code className="rounded bg-base px-1.5 py-0.5 text-xs">src/config/site.ts</code> and deploy.
        </p>
        {outstanding.length === 0 ? (
          <p className="mt-4 text-sm text-blue-light">Nothing outstanding. Every fact is filled in.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {outstanding.map((o) => (
              <li key={o.label} className="flex flex-wrap items-baseline gap-x-3 border-t border-line pt-2 text-sm">
                <span className="font-medium text-ink">{o.label}</span>
                <span className="text-flag">{todoHint(o.value)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-line bg-surface p-6">
        <h2 className="font-display text-lg">Photography</h2>
        <p className="mt-1.5 text-sm text-muted">
          See <code className="rounded bg-base px-1.5 py-0.5 text-xs">PHOTOS.md</code> for the full
          sourcing brief. Replace a file in{' '}
          <code className="rounded bg-base px-1.5 py-0.5 text-xs">public/photos</code> and nothing
          else needs changing.
        </p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted">Slots with no photo yet</dt>
            <dd className="mt-0.5 text-sm text-flag">{missingPhotos.length}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Temporary stock to replace</dt>
            <dd className="mt-0.5 text-sm text-flag">{temporaryPhotos.length}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-xl border border-line bg-surface p-6">
        <h2 className="font-display text-lg">Company details</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted">Registered name</dt>
            <dd className="mt-0.5 text-sm">{site.legalName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Company number</dt>
            <dd className="mt-0.5 text-sm">{site.companyNumber}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-muted">Registered office</dt>
            <dd className="mt-0.5 text-sm">{site.registeredOffice}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Incorporated</dt>
            <dd className="mt-0.5 text-sm">{site.incorporatedOn}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-xl border border-line bg-surface p-6">
        <h2 className="font-display text-lg">Admin accounts</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          There is no sign-up route anywhere on the site. Create a user in the Supabase dashboard
          under Authentication, then add a matching row to the{' '}
          <code className="rounded bg-base px-1.5 py-0.5 text-xs">profiles</code> table with the role{' '}
          <code className="rounded bg-base px-1.5 py-0.5 text-xs">admin</code> or{' '}
          <code className="rounded bg-base px-1.5 py-0.5 text-xs">editor</code>. A user without a
          profile row cannot reach the admin area. The README has the exact SQL.
        </p>
      </section>
    </div>
  );
}
