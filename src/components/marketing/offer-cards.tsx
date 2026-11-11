import Link from 'next/link';
import { Photo } from '@/components/ui/photo';
import { Wipe } from '@/components/ui/motion';
import type { PhotoKey } from '@/lib/photos';

type Offer = {
  href: string;
  photo: PhotoKey;
  eyebrow: string;
  title: string;
  body: string;
  span: string;
  ratio: string;
};

const offers: Offer[] = [
  {
    href: '/events',
    photo: 'parties',
    eyebrow: 'Already running',
    title: 'Parties & private events',
    body: 'Birthdays, family gatherings and celebrations. We set up, run the session and pack down.',
    span: 'md:col-span-7',
    ratio: 'aspect-[16/11]',
  },
  {
    href: '/boxing',
    photo: 'boxing',
    eyebrow: 'Our lead programme',
    title: 'VR fitness & boxing',
    body: 'Technique, footwork, defence and combinations. Full effort, no contact.',
    span: 'md:col-span-5',
    ratio: 'aspect-[16/11] md:aspect-[4/5]',
  },
  {
    href: '/schools',
    photo: 'schools',
    eyebrow: 'Workshops & programmes',
    title: 'Schools & youth clubs',
    body: 'A 60 minute taster session, or a longer programme built around your group.',
    span: 'md:col-span-5',
    ratio: 'aspect-[16/11] md:aspect-[4/5]',
  },
  {
    href: '/boxing#gyms',
    photo: 'gym',
    eyebrow: 'Licensed per gym',
    title: 'Boxing gyms & coaches',
    body: 'A supplement to pad work and sparring, for group use on your gym floor.',
    span: 'md:col-span-7',
    ratio: 'aspect-[16/11]',
  },
  {
    href: '/schools#swim',
    photo: 'swim',
    eyebrow: 'Specialist, on request',
    title: 'Swim familiarisation',
    body: 'Where we started. Dry land stroke practice and water confidence, for schools and charities.',
    span: 'md:col-span-12',
    ratio: 'aspect-[16/11] md:aspect-[21/7]',
  },
];

export function OfferCards() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2 className="max-w-xl font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.02]">
          What we actually do
        </h2>
        <p className="measure text-muted md:max-w-sm md:text-right">
          Five things, run on site at your venue. Pick the one that fits.
        </p>
      </div>

      <ul className="grid gap-5 md:grid-cols-12">
        {offers.map((o, i) => (
          <li key={o.href + o.title} className={o.span}>
            <Wipe delay={(i % 2) * 0.08}>
              <Link
                href={o.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-[border-color,transform] duration-500 hover:border-blue/60 motion-safe:hover:-rotate-[0.35deg]"
              >
                <Photo
                  name={o.photo}
                  ratio={o.ratio}
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.04]"
                />
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <span className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent">
                    {o.eyebrow}
                  </span>
                  <h3 className="mt-2.5 font-display text-2xl leading-tight sm:text-[1.7rem]">{o.title}</h3>
                  <p className="measure mt-3 flex-1 text-sm leading-relaxed text-muted">{o.body}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                    Find out more
                    <span className="transition-transform duration-300 motion-safe:group-hover:translate-x-1" aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </Wipe>
          </li>
        ))}
      </ul>
    </section>
  );
}
