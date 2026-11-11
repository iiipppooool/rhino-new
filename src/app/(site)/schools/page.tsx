import type { Metadata } from 'next';
import { PageHero } from '@/components/marketing/page-hero';
import { Checklist, Specs, Faq } from '@/components/marketing/sections';
import { CtaBand } from '@/components/marketing/cta-band';
import { Photo } from '@/components/ui/photo';
import { Wipe, Reveal } from '@/components/ui/motion';
import { Button } from '@/components/ui/button';
import { ProofPlaceholder, Todo } from '@/components/ui/placeholder';
import { site, TODO } from '@/config/site';

export const metadata: Metadata = {
  title: 'Schools, youth clubs and charities',
  description:
    'A 60 minute VR workshop for schools, youth clubs and charities. Safety briefing, try-out rounds, technique drills, a friendly challenge and feedback. We bring everything.',
  alternates: { canonical: '/schools' },
};

const workshop = [
  { n: '01', t: 'Welcome and safety', b: 'Who we are, what the kit does, how the play space works and what the rules are. Everyone knows what is happening before a headset goes on.' },
  { n: '02', t: 'Try-out rounds', b: 'Short first turns so every young person gets used to the headset without an audience waiting on them.' },
  { n: '03', t: 'Technique drills', b: 'Guard, footwork, the basic punches and defence. Repetition, with the headset giving feedback on what they actually did.' },
  { n: '04', t: 'Friendly challenge', b: 'A scored round so there is something to aim at. Competitive without anyone getting hit.' },
  { n: '05', t: 'Feedback and close', b: 'What they did well, what to work on, and where they could take it next if they want to keep going.' },
];

export default function SchoolsPage() {
  return (
    <>
      <PageHero
        eyebrow="Schools, youth clubs and charities"
        title="A 60 minute session that actually teaches something."
        lead="We bring the headsets and a facilitator to your hall. Your group learns technique, gets moving and nobody takes a punch."
      >
        <Button href="/book" punch>Enquire for your group</Button>
      </PageHero>

      <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-8">
        <Wipe>
          <Photo name="schools" ratio="aspect-[21/9]" sizes="100vw" className="rounded-xl" />
        </Wipe>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)]">The 60 minute workshop</h2>
          <p className="measure mt-4 text-muted">
            This is the standard format. We will adapt it to your group size, ages and how long you have.
          </p>
        </Reveal>
        <ol className="mt-12 space-y-px overflow-hidden rounded-xl border border-line">
          {workshop.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.05}>
              <div className="flex flex-col gap-2 bg-surface p-6 sm:flex-row sm:gap-8 sm:p-7">
                <span className="w-12 shrink-0 font-display text-sm font-bold tracking-[0.2em] text-accent">{s.n}</span>
                <div>
                  <h3 className="font-display text-xl leading-snug">{s.t}</h3>
                  <p className="measure mt-2 text-[0.95rem] leading-relaxed text-muted">{s.b}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <Specs
        rows={[
          { label: 'Standard length', value: '60 minutes' },
          { label: 'Group size', value: TODO('confirm max group size per session') },
          { label: 'Space needed', value: TODO('confirm hall size needed') },
          { label: 'Age guidance', value: site.ageGuidance },
        ]}
      />

      <Checklist
        heading="What your venue needs to provide"
        lead="Short list. If you have a hall and a plug socket you are most of the way there."
        items={[
          'A clear indoor space with nothing underfoot',
          'At least one standard plug socket',
          'A member of your staff present throughout',
          'A register of who is taking part, kept by you',
          'Somewhere for young people to leave bags and coats',
          'Parental consent where your own policy requires it',
        ]}
      />

      <section className="mx-auto max-w-7xl px-5 pb-8 sm:px-8">
        <Reveal>
          <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.2rem)]">Safeguarding and paperwork</h2>
          <div className="measure mt-4 space-y-4 text-muted">
            <p>
              Your safeguarding policy governs the session. Our facilitator works alongside your staff,
              and a member of your team stays with the group throughout. We do not take personal details
              from young people, and our enquiry form is for adults and organisations only.
            </p>
            <p>
              If you need documentation before booking, ask on the enquiry form and we will send what we hold.
            </p>
          </div>
          <div className="mt-6">
            <ProofPlaceholder label="Add real compliance detail" className="max-w-xl" />
          </div>
        </Reveal>
      </section>

      <section id="swim" className="scroll-mt-28 border-y border-line bg-surface/50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <span className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent">
                Specialist, on request
              </span>
              <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.05]">
                VR swim familiarisation
              </h2>
              <div className="measure mt-5 space-y-4 text-muted">
                <p>
                  This is where VRhino started. The idea was to let young people practise strokes and build
                  water confidence on dry land, before they get in a pool.
                </p>
                <p>
                  It turned out to be very specialised and hard to deliver well, so it is not our main offer.
                  We keep it available for schools and charities who specifically want it. Ask on the form and
                  we will be straight with you about what it can and cannot do.
                </p>
              </div>
              <Button href="/book" variant="outline" className="mt-7">Ask about swim sessions</Button>
            </Reveal>
            <Wipe>
              <Photo name="swim" ratio="aspect-[4/3]" className="rounded-xl" />
            </Wipe>
          </div>
        </div>
      </section>

      <Faq
        items={[
          { q: 'Do you charge schools the same as private events?', a: 'No two groups are the same, so we quote per session. Tell us your group size and budget on the form and we will be realistic with you.' },
          { q: 'How many young people can take part in an hour?', a: <>That depends on how many headsets we bring. Give us your numbers on the form and we will tell you what is workable. Group size guidance: <Todo value={TODO('confirm max group size per session')} />.</> },
          { q: 'Can you run a longer programme rather than one session?', a: 'Yes. The 60 minute workshop is the standard taster. If you want something that runs over several weeks, say so on the form.' },
          { q: 'What about young people who do not want to put a headset on?', a: 'Nobody is made to. There is plenty to do watching, scoring and coaching from outside, and most join in once they have seen a few turns.' },
          { q: 'Do you work with charities on reduced rates?', a: 'Tell us about your organisation and your funding on the form. We would rather have the conversation than put a number on a page.' },
        ]}
      />

      <CtaBand heading="Bring it to your group" body="Tell us your dates, numbers and ages. We will come back with a plan and a price." />
    </>
  );
}
