'use client';

import { useReducedMotion } from 'motion/react';

const items = [
  'Boxing', 'Rhythm games', 'Parties', 'Workshops', 'Team socials', 'Swim familiarisation',
];

/** Slow horizontal marquee. Freezes into a static list under reduced motion. */
export function Marquee() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className="border-y border-line py-5">
        <ul className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-6 gap-y-2 px-5 font-display text-sm uppercase tracking-[0.2em] text-muted sm:px-8">
          {items.map((i) => <li key={i}>{i}</li>)}
        </ul>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden border-y border-line py-5" aria-hidden="true">
      <div className="flex w-max animate-[marquee_42s_linear_infinite] gap-10 whitespace-nowrap will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-10">
            {items.map((item) => (
              <span key={`${copy}-${item}`} className="flex items-center gap-10 font-display text-xl uppercase tracking-[0.12em] text-muted sm:text-2xl">
                {item}
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
            ))}
          </div>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translate3d(0,0,0) } to { transform: translate3d(-50%,0,0) } }`}</style>
      <span className="sr-only">Boxing, rhythm games, parties, workshops, team socials, swim familiarisation.</span>
    </div>
  );
}
