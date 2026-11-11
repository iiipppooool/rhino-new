'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';

/** Sections fade and rise in on scroll. Reduced motion gets a plain fade. */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article';
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: reduce ? 0.3 : 0.65, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Comp>
  );
}

/** Headline words slide up in sequence. */
export function SplitHeadline({ text, className = '' }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(' ');

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: 0.08 } },
  };
  const word: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: '0.9em' },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0.3 : 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <motion.h1 variants={container} initial="hidden" animate="show" className={className}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span variants={word} className="inline-block">
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}

/** Image cards reveal with a clip-path wipe. */
export function Wipe({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
      whileInView={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduce ? 0.3 : 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
