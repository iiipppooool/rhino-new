import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/marketing/page-hero';
import { site, isTodo } from '@/config/site';
import { Todo } from '@/components/ui/placeholder';

export const metadata: Metadata = {
  title: 'Terms',
  description: 'The terms that apply to using this website and to booking a VRhino session.',
  alternates: { canonical: '/terms' },
};

function Draft({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-3 rounded-lg border border-dashed border-flag/50 bg-flag/[0.05] p-5">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-flag">
          Placeholder, needs your wording
        </p>
        <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-ink/90">{children}</div>
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms"
        lead="The rules for using this site and for booking a session with us."
      />

      <article className="measure mx-auto px-5 py-16 sm:px-8">
        <p className="rounded-lg border border-accent/50 bg-accent/10 px-4 py-3 text-sm">
          This page is a working draft. Supply your own wording before launch.
        </p>

        <h2 className="mt-10 font-display text-2xl">Who you are dealing with</h2>
        <p className="mt-3 leading-relaxed text-muted">
          {site.legalName}, registered in England and Wales, company number {site.companyNumber}.
          Registered office: {site.registeredOffice}. Contact:{' '}
          {isTodo(site.email) ? <Todo value={site.email} /> : (
            <a href={`mailto:${site.email}`} className="text-blue-light underline underline-offset-4">{site.email}</a>
          )}
        </p>

        <Draft title="Enquiries are not bookings">
          <p>
            Sending the enquiry form is a request. It does not reserve a date and it does not create
            a contract. A booking only exists once we have confirmed it with you in writing.
          </p>
        </Draft>

        <Draft title="Prices and quotes">
          <p>
            We quote per session based on your group size, how long you need us and where you are.
            A quote is valid for the period stated in it.
          </p>
        </Draft>

        <Draft title="Cancellation and changes">
          <p>Set out your notice periods, deposits, refunds and what happens if we have to cancel.</p>
        </Draft>

        <Draft title="What you need to provide">
          <p>
            A suitable space, power, and supervision of your own group where the session involves
            under 18s. Set out anything else you require of a venue.
          </p>
        </Draft>

        <Draft title="Safety and participation">
          <p>
            Sessions are no contact and supervised by a VRhino facilitator. Set out your rules on
            medical conditions, photosensitivity, participation and the facilitator&rsquo;s right to
            stop a session.
          </p>
        </Draft>

        <Draft title="Liability">
          <p>This needs drafting properly. Do not copy wording from another company&rsquo;s site.</p>
        </Draft>

        <Draft title="Governing law">
          <p>Set out that these terms are governed by the law of England and Wales.</p>
        </Draft>

        <p className="mt-12 text-sm text-muted">
          See also our <Link href="/privacy" className="text-blue-light underline underline-offset-4">privacy policy</Link>.
        </p>
      </article>
    </>
  );
}
