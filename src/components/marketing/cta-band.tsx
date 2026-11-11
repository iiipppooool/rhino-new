import Link from 'next/link';
import { Reveal } from '@/components/ui/motion';
import { Button } from '@/components/ui/button';

export function CtaBand({
  heading = 'Fancy a go?',
  body = 'Tell us the date, the numbers and the venue. We will come back with what we can do and what it costs.',
}: { heading?: string; body?: string }) {
  return (
    <section className="bg-accent text-base">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-20 sm:px-8 sm:py-24 lg:flex-row lg:items-center lg:justify-between">
        <Reveal>
          <h2 className="max-w-xl font-display text-[clamp(2rem,5.5vw,3.6rem)] leading-[1] text-base">{heading}</h2>
          <p className="measure mt-4 text-base/90 font-medium">{body}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-full bg-base px-7 py-4 text-base font-semibold text-ink transition-transform duration-200 hover:scale-[1.02]"
            >
              Get a quote
            </Link>
            <Button href="/schools" variant="ghost" className="border border-base/35 px-7 py-4 text-base text-base hover:bg-base/10 hover:text-base">
              Schools & youth
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
