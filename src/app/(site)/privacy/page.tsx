import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/marketing/page-hero';
import { site, isTodo } from '@/config/site';
import { Todo } from '@/components/ui/placeholder';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How VRhino handles the personal data you send through this website.',
  alternates: { canonical: '/privacy' },
};

const DRAFT_NOTE =
  'PLACEHOLDER WORDING. This section describes what the site actually does, so it is accurate, but it has not been reviewed by anyone qualified. Replace it with your own wording before launch.';

function Draft({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-lg border border-dashed border-flag/50 bg-flag/[0.05] p-5">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-flag">
        Needs legal review
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted">{DRAFT_NOTE}</p>
      <div className="mt-4 space-y-3 text-[0.95rem] leading-relaxed text-ink/90">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        lead="What we collect through this website, why, and how to get it removed."
      />

      <article className="measure mx-auto px-5 py-16 sm:px-8">
        <p className="rounded-lg border border-accent/50 bg-accent/10 px-4 py-3 text-sm">
          This page is a working draft. Every section below is marked for review. Do not treat it as
          a finished privacy policy until it has been checked.
        </p>

        <h2 className="mt-10 font-display text-2xl">Who we are</h2>
        <p className="mt-3 leading-relaxed text-muted">
          {site.legalName}, a company registered in England and Wales, company number{' '}
          {site.companyNumber}, registered office {site.registeredOffice}. We are the data
          controller for personal data collected through this website.
        </p>
        <p className="mt-3 leading-relaxed text-muted">
          Contact:{' '}
          {isTodo(site.email) ? <Todo value={site.email} /> : (
            <a href={`mailto:${site.email}`} className="text-blue-light underline underline-offset-4">{site.email}</a>
          )}
        </p>

        <h2 className="mt-10 font-display text-2xl">What we collect</h2>
        <Draft>
          <p>
            Only what you type into the enquiry form: your name, email address, and optionally your
            phone number and organisation. If you are asking about a booking we also collect the
            service you want, your preferred and backup dates, start time, group size, age range,
            venue postcode and how you heard about us, plus your message.
          </p>
          <p>
            We record whether you confirmed you are 18 or over or booking for an organisation,
            whether you accepted this policy, and whether you opted in to marketing.
          </p>
          <p>
            Our spam protection uses Cloudflare Turnstile, and we record the IP address a submission
            came from so we can rate limit the form. We do not use this for anything else.
          </p>
        </Draft>

        <h2 className="mt-10 font-display text-2xl">Children&rsquo;s data</h2>
        <Draft>
          <p>
            We do not knowingly collect personal data about anyone under 18 through this website.
            The enquiry form requires you to confirm that you are 18 or over, or that you are
            enquiring on behalf of an organisation. Please do not send us details about individual
            young people through the form.
          </p>
          <p>
            Where we run sessions for a school, youth club or charity, that organisation stays
            responsible for its own records and safeguarding.
          </p>
        </Draft>

        <h2 className="mt-10 font-display text-2xl">Why we use it, and our lawful basis</h2>
        <Draft>
          <p>
            We use your enquiry to reply to you and to arrange a session. Our lawful basis is
            legitimate interests, specifically responding to someone who contacted us, and where a
            booking goes ahead, taking steps to enter into a contract.
          </p>
          <p>
            We only send marketing if you ticked the box, which is consent, and you can withdraw it
            at any time.
          </p>
        </Draft>

        <h2 className="mt-10 font-display text-2xl">Who we share it with</h2>
        <Draft>
          <p>
            Our website runs on Vercel, our database and file storage are provided by Supabase, and
            our email is sent through Resend. Each of these processes data on our behalf. We do not
            sell your data or share it for advertising.
          </p>
        </Draft>

        <h2 className="mt-10 font-display text-2xl">How long we keep it</h2>
        <Draft>
          <p>
            We keep enquiries only as long as we need them to answer you and to run any booking that
            follows. Tell us if you want yours removed sooner and we will delete it.
          </p>
        </Draft>

        <h2 className="mt-10 font-display text-2xl">Analytics and cookies</h2>
        <Draft>
          <p>
            This site sets no analytics or advertising cookies. The only cookies are the ones that
            keep an administrator signed in, which are strictly necessary and are not set for
            ordinary visitors.
          </p>
          <p>
            If Vercel Analytics is switched on in future, note that it is cookieless and does not
            track individuals across sites. Update this section if anything that does set
            non-essential cookies is added, and add a cookie banner at that point.
          </p>
        </Draft>

        <h2 className="mt-10 font-display text-2xl">Your rights</h2>
        <Draft>
          <p>
            You can ask us for a copy of your data, ask us to correct it, ask us to delete it, or
            object to how we use it. Email us and we will deal with it.
          </p>
          <p>
            You can also complain to the Information Commissioner&rsquo;s Office at ico.org.uk.
          </p>
        </Draft>

        <p className="mt-12 text-sm text-muted">
          See also our <Link href="/terms" className="text-blue-light underline underline-offset-4">terms</Link>.
        </p>
      </article>
    </>
  );
}
