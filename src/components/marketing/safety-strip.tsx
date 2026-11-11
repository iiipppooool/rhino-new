import { Reveal } from '@/components/ui/motion';
import { site, isTodo } from '@/config/site';
import { Todo } from '@/components/ui/placeholder';

export function SafetyStrip() {
  const points = [
    { title: 'No contact', body: 'Nobody gets hit. Beginners learn technique without taking a punch.' },
    { title: 'Always supervised', body: 'A VRhino facilitator runs every session and watches the play space.' },
    { title: 'Kit cleaned between users', body: 'Headsets and controllers are wiped down after every turn.' },
    { title: 'Age guidance', body: null as string | null },
  ];

  return (
    <section className="border-y border-line bg-surface/50">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <h2 className="font-display text-xl uppercase tracking-[0.14em] text-muted">Safety</h2>
        </Reveal>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.07}>
              <div className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-base">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {p.body ?? (isTodo(site.ageGuidance) ? <Todo value={site.ageGuidance} /> : site.ageGuidance)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
