import type { Metadata } from 'next';
import { PageHero } from '@/components/marketing/page-hero';
import { EnquiryForm } from '@/components/marketing/enquiry-form';
import { Reveal } from '@/components/ui/motion';
import { Todo } from '@/components/ui/placeholder';
import { site, isTodo } from '@/config/site';
import { turnstileSiteKey } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Book or enquire',
  description:
    'Pre-book a date, request a service or ask a general question. Tell us your group size, ages and venue and we will come back with a quote.',
  alternates: { canonical: '/book' },
  robots: { index: true, follow: true },
};

export default function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Book or enquire"
        title="Tell us what you need."
        lead="One form for all three. Pick what fits and fill in what you know. You do not need every answer."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <Reveal>
            <EnquiryForm turnstileSiteKey={turnstileSiteKey} />
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="space-y-8 lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-xl border border-line bg-surface p-6">
                <h2 className="font-display text-lg">What happens next</h2>
                <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                  <li className="flex gap-3">
                    <span className="font-display text-accent">1.</span>
                    You send this form and get an email confirming we received it.
                  </li>
                  <li className="flex gap-3">
                    <span className="font-display text-accent">2.</span>
                    We reply within{' '}
                    {isTodo(site.replyWithinWorkingDays)
                      ? <Todo value={site.replyWithinWorkingDays} />
                      : site.replyWithinWorkingDays}{' '}
                    working days with what we can do and what it costs.
                  </li>
                  <li className="flex gap-3">
                    <span className="font-display text-accent">3.</span>
                    If it works for both of us, we confirm the date and it goes in the diary.
                  </li>
                </ol>
              </div>

              <div className="rounded-xl border border-line p-6">
                <h2 className="font-display text-lg">Rather just email?</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {isTodo(site.email) ? (
                    <>Contact address: <Todo value={site.email} /></>
                  ) : (
                    <a href={`mailto:${site.email}`} className="text-blue-light underline underline-offset-4">{site.email}</a>
                  )}
                </p>
                {isTodo(site.phone) ? (
                  <p className="mt-2 text-sm text-muted">Phone: <Todo value={site.phone} /></p>
                ) : (
                  <p className="mt-2 text-sm text-muted">{site.phone}</p>
                )}
              </div>

              <div className="rounded-xl border border-line p-6">
                <h2 className="font-display text-lg">Your details</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  We store only what is on this form, and we use it to answer your enquiry. We do not
                  collect personal details from under 18s through this form, which is why the age
                  declaration is required.
                </p>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}
