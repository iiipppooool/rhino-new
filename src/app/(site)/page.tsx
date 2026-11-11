import type { Metadata } from 'next';
import { Hero } from '@/components/marketing/hero';
import { Marquee } from '@/components/marketing/marquee';
import { OfferCards } from '@/components/marketing/offer-cards';
import { HowItWorks } from '@/components/marketing/how-it-works';
import { StoryTeaser } from '@/components/marketing/story-teaser';
import { SafetyStrip } from '@/components/marketing/safety-strip';
import { CtaBand } from '@/components/marketing/cta-band';
import { ProofPlaceholder } from '@/components/ui/placeholder';
import { Reveal } from '@/components/ui/motion';

export const metadata: Metadata = {
  description:
    'VRhino brings VR games, fitness and events to your venue. Headsets, a facilitator and everything set up, for parties, schools, youth clubs and boxing gyms across the UK.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <OfferCards />
      <HowItWorks />
      <StoryTeaser />
      <SafetyStrip />

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Reveal>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)]">What people say</h2>
          <p className="measure mt-3 text-muted">
            VRhino is new. We are not going to put words in anyone&rsquo;s mouth until we have run
            enough sessions to quote people properly.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <ProofPlaceholder label="Add real testimonial" />
          <ProofPlaceholder label="Add real testimonial" />
          <ProofPlaceholder label="Add real number" />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
