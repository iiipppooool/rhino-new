import type { Metadata } from 'next';
import { PageHero } from '@/components/marketing/page-hero';
import { CtaBand } from '@/components/marketing/cta-band';
import { Reveal } from '@/components/ui/motion';
import { Photo } from '@/components/ui/photo';
import { Todo } from '@/components/ui/placeholder';
import { site, isTodo } from '@/config/site';

export const metadata: Metadata = {
  title: 'Our story',
  description:
    'VRhino started as a VR swim training idea and became a VR games, fitness and events company. Here is how, and why boxing leads the way.',
  alternates: { canonical: '/our-story' },
};

const timeline = [
  {
    stage: 'The start',
    title: 'Two brothers and a VR sports company',
    body: 'We set out to build a sports company around virtual reality. Not a games studio. Something that got young people moving.',
  },
  {
    stage: 'First idea',
    title: 'VR swim training',
    body: 'The plan was to let young people practise strokes and build water confidence on dry land, before they ever got in a pool.',
  },
  {
    stage: 'The problem',
    title: 'Swimming is harder in VR than it looks',
    body: 'Swim training turned out to be very specialised. Getting it right in VR, to a standard we were happy to put in front of a school, was hard. We were not going to ship something that only half worked.',
  },
  {
    stage: 'The turn',
    title: 'Broadening out',
    body: 'So we widened the company: VR games, VR fitness, events and youth programmes. The same goal, a route that works today.',
  },
  {
    stage: 'Where boxing came in',
    title: 'A clear problem worth solving',
    body: 'Plenty of teenagers want to box and cannot get to good coaching, especially in less well off areas. Sparring injures beginners. VR lets them learn technique, footwork, defence and combinations with nobody getting hit.',
  },
  {
    stage: 'Now',
    title: 'We bring it to you',
    body: 'Headsets and a facilitator, run on site at your venue. Parties, schools, youth clubs, gyms and community events. Swim familiarisation is still here as a specialist option on request.',
  },
];

export default function StoryPage() {
  const [a, b] = site.founders;
  return (
    <>
      <PageHero
        eyebrow="Our story"
        title="We started with swimming. It did not go to plan."
        lead="The honest version, including the bit that did not work."
      />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <Reveal>
              <div className="grid grid-cols-2 gap-4 lg:sticky lg:top-32">
                <figure>
                  <Photo name="founderOne" ratio="aspect-[3/4]" className="rounded-xl" />
                  <figcaption className="mt-2.5 text-xs text-muted">
                    {isTodo(a.name) ? <Todo value={a.name} /> : a.name}, {a.role}
                  </figcaption>
                </figure>
                <figure className="mt-10">
                  <Photo name="founderTwo" ratio="aspect-[3/4]" className="rounded-xl" />
                  <figcaption className="mt-2.5 text-xs text-muted">
                    {isTodo(b.name) ? <Todo value={b.name} /> : b.name}, {b.role}
                  </figcaption>
                </figure>
              </div>
            </Reveal>
          </div>

          <ol className="relative border-l border-line pl-7 sm:pl-9">
            {timeline.map((t, i) => (
              <Reveal as="li" key={t.title} delay={i * 0.06} className="relative pb-12 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute -left-[calc(1.75rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-base sm:-left-[calc(2.25rem+5px)]"
                />
                <span className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent">
                  {t.stage}
                </span>
                <h2 className="mt-2 font-display text-2xl leading-tight sm:text-3xl">{t.title}</h2>
                <p className="measure mt-3 leading-relaxed text-muted">{t.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-line bg-surface/50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)]">What we care about</h2>
            <p className="measure mt-4 text-muted">{site.mission}</p>
          </Reveal>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {site.values.map((v, i) => (
              <Reveal as="li" key={v.name} delay={i * 0.06}>
                <h3 className="border-t-2 border-accent pt-4 font-display text-lg">{v.name}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{v.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand heading="Want us at your venue?" />
    </>
  );
}
