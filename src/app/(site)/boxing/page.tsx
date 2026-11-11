import type { Metadata } from 'next';
import { PageHero } from '@/components/marketing/page-hero';
import { Checklist, Faq } from '@/components/marketing/sections';
import { CtaBand } from '@/components/marketing/cta-band';
import { Photo } from '@/components/ui/photo';
import { Wipe, Reveal } from '@/components/ui/motion';
import { Button } from '@/components/ui/button';
import { ProofPlaceholder } from '@/components/ui/placeholder';

export const metadata: Metadata = {
  title: 'VR boxing and fitness',
  description:
    'VR boxing teaches technique, footwork, defence and combinations with no contact. Safe for beginners, and available to licence for boxing gyms and coaches.',
  alternates: { canonical: '/boxing' },
};

const inside = [
  { t: 'Technique', b: 'Jab, cross, hook and uppercut, thrown properly. The headset tracks what you actually did, not what you meant to do.' },
  { t: 'Footwork', b: 'Moving in and out of range, angles and staying balanced while you throw. The hardest thing to teach without a coach.' },
  { t: 'Defence', b: 'Slips, rolls and guard. You learn to react to something coming at you, which is the bit shadow boxing cannot give you.' },
  { t: 'Combinations', b: 'Stringing punches together to a called sequence, then doing it under time pressure.' },
  { t: 'Gamified challenges', b: 'Scored rounds and targets, so there is a reason to go again. Effort shows up as a number.' },
  { t: 'Progress feedback', b: 'What landed, what missed, what the guard was doing. Something concrete to work on next time.' },
];

export default function BoxingPage() {
  return (
    <>
      <PageHero
        eyebrow="VR boxing and fitness"
        title="Real moves. Nobody gets hit."
        lead="Boxing is the lead programme. It came from a clear problem: plenty of teenagers want to box and cannot get to good coaching, and sparring injures beginners."
      >
        <Button href="/book" punch>Book a session</Button>
      </PageHero>

      <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-8">
        <Wipe>
          <Photo name="boxing" ratio="aspect-[21/9]" sizes="100vw" className="rounded-xl" />
        </Wipe>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)]">What you actually do in the headset</h2>
          <p className="measure mt-4 text-muted">
            It is not waving your arms at floating shapes. The session is built around the things a coach
            would drill you on.
          </p>
        </Reveal>
        <ul className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {inside.map((x, i) => (
            <Reveal as="li" key={x.t} delay={i * 0.05}>
              <h3 className="border-t-2 border-accent pt-4 font-display text-xl">{x.t}</h3>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">{x.b}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="bg-paper text-paper-ink">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <Reveal>
              <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.05]">
                Why it is safe for beginners
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="measure space-y-4 text-paper-muted">
                <p>
                  The thing that puts beginners off boxing, and the thing that injures them, is getting hit
                  before they can defend themselves. Most people quit in that gap.
                </p>
                <p>
                  In VR there is no contact at all. A beginner can spend hours learning to slip a punch and
                  hold a guard while tired, without a headache and without a coach needing to go light on them.
                  When they do step into a real gym, they already know what they are doing.
                </p>
                <p>
                  It is not a replacement for a coach or for real sparring. It is the part that comes first.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="gyms" className="scroll-mt-28 mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent">
              For boxing gyms and coaches
            </span>
            <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.05]">
              Licensed per gym, for group use
            </h2>
            <div className="measure mt-5 space-y-4 text-muted">
              <p>
                This is not a home fitness subscription. It is licensed to your gym for group use on your
                floor, as a supplement to pad work and sparring, not a replacement for either.
              </p>
              <p>
                Useful for beginners sessions, for keeping a large group busy while you work one to one,
                and for giving newcomers somewhere to start before they go near a ring.
              </p>
            </div>
            <Button href="/book" variant="outline" className="mt-7">Talk to us about licensing</Button>
          </Reveal>

          <Wipe delay={0.1}>
            <Photo name="gym" ratio="aspect-[4/3]" className="rounded-xl" />
            <div className="mt-4">
              <ProofPlaceholder label="Add real gym partner" />
            </div>
          </Wipe>
        </div>
      </section>

      <Checklist
        heading="What a gym gets"
        lead="Tell us how your gym runs and we will tell you honestly whether this helps."
        items={[
          'A licence covering group use at your gym',
          'Headsets, set up and configured for your floor',
          'Onboarding for your coaches so they can run it themselves',
          'Session formats you can drop into an existing beginners class',
          'Progress feedback your coaches can actually use',
          'A straight answer on whether it suits your setup',
        ]}
      />

      <Faq
        items={[
          { q: 'Is this the same as FitXR or Thrill of the Fight?', a: 'No. Those are home subscriptions bought per person. Ours is licensed to a gym for group use on your floor, with coach onboarding and session formats built around a class.' },
          { q: 'Does it replace sparring?', a: 'No, and we would not claim it does. It is for the stage before sparring, and for the beginners who would otherwise get hurt or drop out.' },
          { q: 'Can we try it before licensing?', a: 'Yes. Ask on the enquiry form and we will arrange a session at your gym.' },
          { q: 'How many people can use it at once?', a: 'That comes down to how many headsets and how much floor you have. Give us your space and class size and we will work it out with you.' },
          { q: 'Do coaches need to be technical?', a: 'No. We onboard your coaches on the kit, and the session formats are designed to be run by someone who knows boxing, not someone who knows VR.' },
        ]}
      />

      <CtaBand heading="Try it at your gym" body="Tell us about your setup and your beginners classes. We will be honest about the fit." />
    </>
  );
}
