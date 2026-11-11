'use client';

import Image from 'next/image';
import { useScroll, useTransform, useReducedMotion, motion } from 'motion/react';
import { useRef } from 'react';
import { photos } from '@/lib/photos';
import { SplitHeadline } from '@/components/ui/motion';
import { Button } from '@/components/ui/button';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '14%']);
  const p = photos.hero;

  return (
    <section ref={ref} className="relative isolate flex min-h-[88svh] items-end overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 -z-10 h-[116%]">
        {p.src && (
          <Image
            src={p.src}
            alt={p.alt}
            fill
            priority
            sizes="100vw"
            className="graded object-cover object-[60%_center]"
            data-replace="true"
            data-photo-temporary="true"
          />
        )}
        {/* Grades the lavender studio background towards the navy base. */}
        <div className="absolute inset-0 bg-blue/15 mix-blend-color" />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(6,13,24,0.95)_0%,rgba(6,13,24,0.78)_42%,rgba(6,13,24,0.35)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(to_top,var(--color-base),transparent)]" />
      </motion.div>

      <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-36 sm:px-8 sm:pb-28">
        <p className="mb-5 font-display text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          VR games, fitness and events
        </p>

        <SplitHeadline
          text="Step in. Swing first."
          className="max-w-4xl font-display text-[clamp(2.8rem,9vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.035em]"
        />

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="measure mt-7 text-lg leading-relaxed text-muted sm:text-xl"
        >
          We bring VR games, fitness and events to your venue. Headsets, a facilitator and
          everything set up. You just play.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <Button href="/book" punch className="px-7 py-3.5 text-base">Book an event</Button>
          <Button href="/schools" variant="outline" className="px-7 py-3.5 text-base">For schools & clubs</Button>
        </motion.div>
      </div>
    </section>
  );
}
