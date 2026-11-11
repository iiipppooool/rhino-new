import { Reveal } from '@/components/ui/motion';
import { isTodo } from '@/config/site';
import { Todo } from '@/components/ui/placeholder';

export function Checklist({
  heading,
  items,
  lead,
}: {
  heading: string;
  items: string[];
  lead?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <Reveal>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.05]">{heading}</h2>
          {lead && <p className="measure mt-4 text-muted">{lead}</p>}
        </Reveal>
        <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {items.map((item, i) => (
            <Reveal as="li" key={item} delay={i * 0.04}>
              <div className="flex gap-3 border-t border-line pt-4">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="text-[0.95rem] leading-relaxed text-ink/90">{item}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Specs({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <section className="border-y border-line bg-surface/50">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((r, i) => (
            <Reveal key={r.label} delay={i * 0.05}>
              <dt className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted">
                {r.label}
              </dt>
              <dd className="mt-2 text-lg leading-snug text-ink">
                {isTodo(r.value) ? <Todo value={r.value} /> : r.value}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Faq({ items }: { items: { q: string; a: React.ReactNode }[] }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <Reveal>
        <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)]">Questions</h2>
      </Reveal>
      <div className="mt-10 max-w-3xl divide-y divide-line border-y border-line">
        {items.map((item, i) => (
          <Reveal key={item.q} delay={i * 0.04}>
            <details className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-lg leading-snug marker:content-none">
                {item.q}
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-accent transition-transform duration-300 group-open:rotate-45"
                >
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M8 2v12M2 8h12" />
                  </svg>
                </span>
              </summary>
              <div className="measure mt-3 leading-relaxed text-muted">{item.a}</div>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
