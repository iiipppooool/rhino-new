import Link from 'next/link';
import { site, isTodo } from '@/config/site';
import { Logo } from '@/components/ui/logo';
import { Todo } from '@/components/ui/placeholder';
import { photos } from '@/lib/photos';
import { CookieSettingsLink } from '@/components/consent/cookie-banner';

const columns = [
  {
    heading: 'What we do',
    links: [
      { href: '/events', label: 'Parties & events' },
      { href: '/boxing', label: 'VR boxing & fitness' },
      { href: '/schools', label: 'Schools & youth' },
      { href: '/boxing#gyms', label: 'For boxing gyms' },
      { href: '/schools#swim', label: 'Swim familiarisation' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/our-story', label: 'Our story' },
      { href: '/blog', label: 'Journal' },
      { href: '/book', label: 'Book or enquire' },
      { href: '/privacy', label: 'Privacy policy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
];

export function SiteFooter() {
  const temporaryPhotos = Object.values(photos).filter((p) => p.src);

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="text-ink" aria-label="VRhino home">
              <Logo />
            </Link>
            <p className="measure mt-4 text-sm leading-relaxed text-muted">{site.mission}</p>

            <div className="mt-6 space-y-1.5 text-sm">
              {isTodo(site.email) ? (
                <div><Todo value={site.email} /></div>
              ) : (
                <a href={`mailto:${site.email}`} className="text-blue-light underline underline-offset-4 hover:text-accent">
                  {site.email}
                </a>
              )}
              <div>
                {isTodo(site.phone) ? <Todo value={site.phone} /> : (
                  <a href={`tel:${String(site.phone).replace(/\s/g, '')}`} className="text-muted hover:text-ink">{site.phone}</a>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              {isTodo(site.social.instagram) ? <Todo value={site.social.instagram} /> : (
                <a href={site.social.instagram} className="text-muted underline underline-offset-4 hover:text-ink" rel="me noopener">Instagram</a>
              )}
              {isTodo(site.social.tiktok) ? <Todo value={site.social.tiktok} /> : (
                <a href={site.social.tiktok} className="text-muted underline underline-offset-4 hover:text-ink" rel="me noopener">TikTok</a>
              )}
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-muted">{col.heading}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-sm text-ink/90 transition-colors hover:text-accent">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 border-t border-line pt-8 text-xs leading-relaxed text-muted">
          <p>
            {site.legalName} is a private limited company {site.jurisdiction.toLowerCase()}, company number {site.companyNumber}.
            Registered office: {site.registeredOffice}.
          </p>
          <p className="mt-3">
            Photography: placeholder stock images, marked for replacement with VRhino event photography.
            {temporaryPhotos.length > 0 && ' Credits to be added when final images are selected.'}
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</span>
            <span aria-hidden="true">·</span>
            {/* Withdrawing consent must be as easy as giving it. */}
            <CookieSettingsLink className="underline underline-offset-4 hover:text-ink" />
          </p>
        </div>
      </div>
    </footer>
  );
}
