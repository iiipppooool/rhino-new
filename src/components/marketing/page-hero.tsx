import { Reveal } from '@/components/ui/motion';

/** Shared top block for inner pages. Clears the fixed header. */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative border-b border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_20%_0%,rgba(59,130,246,0.14),transparent_70%)]"
      />
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
        <Reveal>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.4rem,6.5vw,4.6rem)] leading-[0.98] tracking-[-0.035em]">
            {title}
          </h1>
          {lead && <p className="measure mt-6 text-lg leading-relaxed text-muted">{lead}</p>}
          {children && <div className="mt-8">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}
