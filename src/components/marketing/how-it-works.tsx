import { Reveal } from '@/components/ui/motion';
import { site, isTodo } from '@/config/site';
import { Todo } from '@/components/ui/placeholder';

const steps = [
  {
    n: '01',
    title: 'Tell us about your event',
    body: 'Date, rough numbers, ages and where you are. Send it through the enquiry form and we will come back with what fits.',
  },
  {
    n: '02',
    title: 'We bring the kit and a host',
    body: 'Headsets, charged and cleaned, plus a facilitator who runs the whole session. You need a clear floor and a plug socket.',
  },
  {
    n: '03',
    title: 'Everyone plays',
    body: 'We brief the group, run the rounds and keep it moving so nobody stands about waiting for a turn.',
  },
];

/** The one light section, so the page is not a single long dark slab. */
export function HowItWorks() {
  return (
    <section className="bg-paper text-paper-ink">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <h2 className="max-w-2xl font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.02]">
            How a session runs
          </h2>
          <p className="measure mt-5 text-paper-muted">
            No venue hire, no travel for your group, no kit to buy. We come to you.
          </p>
        </Reveal>

        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.1}>
              <div className="border-t-2 border-paper-ink/15 pt-6">
                <span className="font-display text-sm font-bold tracking-[0.2em] text-accent">{s.n}</span>
                <h3 className="mt-3 font-display text-xl leading-snug sm:text-2xl">{s.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-paper-muted">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.2}>
          <p className="mt-14 inline-flex flex-wrap items-center gap-2 rounded-lg border border-paper-ink/15 bg-white/60 px-5 py-4 text-sm text-paper-muted">
            <span className="font-semibold text-paper-ink">Typical session length:</span>
            {isTodo(site.sessionDuration) ? <Todo value={site.sessionDuration} /> : site.sessionDuration}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
