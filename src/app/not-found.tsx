import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteChrome } from '@/components/marketing/site-chrome';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'That page does not exist. Here is how to find what you were after.',
  robots: { index: false, follow: true },
};

const suggestions = [
  { href: '/events', label: 'Parties and events', body: 'Birthdays, team socials and community events.' },
  { href: '/schools', label: 'Schools and youth', body: 'The 60 minute workshop and longer programmes.' },
  { href: '/boxing', label: 'VR boxing', body: 'What you actually do in the headset, and gym licensing.' },
  { href: '/blog', label: 'Journal', body: 'Notes on sessions we have run.' },
];

/**
 * Global 404. Wrapped in the site chrome so a wrong URL still lands on a real
 * page with navigation, rather than Next's unstyled default.
 */
export default function NotFound() {
  return (
    <SiteChrome>
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          404
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,6.5vw,4.6rem)] leading-[0.98] tracking-[-0.035em]">
          That one slipped the guard.
        </h1>
        <p className="measure mt-6 text-lg leading-relaxed text-muted">
          The page you were after does not exist, or it has moved. Nothing you did was wrong.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/" punch>Back to the home page</Button>
          <Button href="/book" variant="outline">Book an event</Button>
        </div>

        <h2 className="mt-16 font-display text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Or try one of these
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {suggestions.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="group block h-full rounded-xl border border-line bg-surface p-5 transition-colors hover:border-blue/60"
              >
                <h3 className="font-display text-base">{s.label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </SiteChrome>
  );
}
