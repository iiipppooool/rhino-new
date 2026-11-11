import Link from 'next/link';
import { site } from '@/config/site';

export type LegalSection = { id: string; heading: string; body: React.ReactNode };

/** Shared chrome for the privacy policy and terms: contents list and prose styling. */
export function LegalDoc({
  sections,
  intro,
  footerNote,
}: {
  sections: LegalSection[];
  intro?: React.ReactNode;
  footerNote?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-16">
        <nav aria-label="Contents" className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Contents
          </h2>
          <ol className="mt-4 space-y-2 border-l border-line">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="-ml-px block border-l-2 border-transparent pl-4 text-sm leading-snug text-muted transition-colors hover:border-accent hover:text-ink"
                >
                  <span className="mr-2 text-xs text-muted">{i + 1}</span>
                  {s.heading}
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-6 border-t border-line pt-4 text-xs text-muted">
            Last updated {site.legal.lastUpdated}
          </p>
        </nav>

        <article className="min-w-0">
          {intro && <div className="measure mb-12 space-y-4 text-lg leading-relaxed text-muted">{intro}</div>}

          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-line py-10 first:border-t-0 first:pt-0">
              <h2 className="font-display text-2xl leading-tight sm:text-[1.75rem]">
                <span className="mr-3 text-base font-normal text-accent">{i + 1}</span>
                {s.heading}
              </h2>
              <div className="measure mt-4 space-y-4 leading-relaxed text-muted [&_a]:text-blue-light [&_a]:underline [&_a]:underline-offset-4 [&_li]:leading-relaxed [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                {s.body}
              </div>
            </section>
          ))}

          {footerNote && (
            <div className="measure border-t border-line pt-8 text-sm text-muted">{footerNote}</div>
          )}
        </article>
      </div>
    </div>
  );
}

/** A table of plain facts, used for the data-we-collect and processor lists. */
export function LegalTable({
  caption,
  head,
  rows,
}: {
  caption?: string;
  head: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[34rem] text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="border-b border-line bg-surface text-xs uppercase tracking-wider text-muted">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r, i) => (
            <tr key={i} className="bg-surface/30 align-top">
              {r.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-muted [&_strong]:text-ink">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A commercial term that has not been decided yet. */
export function Undecided({ children }: { children: React.ReactNode }) {
  return (
    <span
      data-todo="true"
      className="inline-flex items-center gap-1.5 rounded border border-dashed border-flag/70 bg-flag/10 px-2 py-0.5 text-[0.85em] font-semibold text-flag"
    >
      {children}
    </span>
  );
}

export function ContactLine({ email }: { email: React.ReactNode }) {
  return (
    <p>
      <strong>{site.legalName}</strong>
      <br />
      {site.registeredOffice}
      <br />
      Company number {site.companyNumber}, registered in England and Wales
      <br />
      {email}
    </p>
  );
}

export function SeeAlso({ href, label }: { href: string; label: string }) {
  return (
    <p>
      See also our <Link href={href}>{label}</Link>.
    </p>
  );
}
