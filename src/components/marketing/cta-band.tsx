import Link from 'next/link';
import { Reveal } from '@/components/ui/motion';

export function CtaBand({
  heading = 'Fancy a go?',
  body = 'Tell us the date, the numbers and the venue. We will come back with what we can do and what it costs.',
}: { heading?: string; body?: string }) {
  return (
    <section className="bg-accent text-canvas">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-20 sm:px-8 sm:py-24 lg:flex-row lg:items-center lg:justify-between">
        <Reveal>
          <h2 className="max-w-xl font-display text-[clamp(2rem,5.5vw,3.6rem)] leading-[1] text-canvas">{heading}</h2>
          <p className="measure mt-4 text-canvas/90 font-medium">{body}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-full bg-canvas px-7 py-4 text-base font-semibold text-ink transition-transform duration-200 hover:scale-[1.02]"
            >
              Get a quote
            </Link>
            {/*
              Deliberately a plain Link, not a ghost Button. The ghost variant
              sets text-ink, and overriding it from className only wins by
              stylesheet order: here it lost, leaving white on orange at
              2.85:1. Spelling the colour out removes the fight.
            */}
            <Link
              href="/schools"
              className="inline-flex items-center justify-center rounded-full border border-canvas/35 px-7 py-4 text-base font-semibold text-canvas transition-colors hover:bg-canvas/10"
            >
              Schools & youth
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
