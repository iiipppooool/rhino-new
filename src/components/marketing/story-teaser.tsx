import { Reveal, Wipe } from '@/components/ui/motion';
import { Button } from '@/components/ui/button';
import { Photo } from '@/components/ui/photo';
import { site, isTodo } from '@/config/site';
import { Todo } from '@/components/ui/placeholder';

export function StoryTeaser() {
  const [a, b] = site.founders;
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <span className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent">
            Our story
          </span>
          <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.02]">
            We started with swimming. It did not go to plan.
          </h2>
          <div className="measure mt-6 space-y-4 text-muted">
            <p>
              Two brothers, {isTodo(a.name) ? <Todo value={a.name} /> : a.name} and{' '}
              {isTodo(b.name) ? <Todo value={b.name} /> : b.name}, set out to build a VR sports
              company. The first idea was swim training: let young people practise strokes and get
              water confident on dry land.
            </p>
            <p>
              Swimming turned out to be very specialised and hard to deliver well in VR. So we
              broadened out. Today VRhino runs VR games, fitness, events and youth programmes, with
              boxing leading the way. Swim training is still here as a specialist option on request.
            </p>
          </div>
          <Button href="/our-story" variant="outline" className="mt-8">Read the full story</Button>
        </Reveal>

        <Wipe className="lg:order-first">
          <div className="grid grid-cols-2 gap-4">
            <Photo name="founderOne" ratio="aspect-[3/4]" className="rounded-xl" />
            <Photo name="founderTwo" ratio="aspect-[3/4]" className="mt-10 rounded-xl" />
          </div>
        </Wipe>
      </div>
    </section>
  );
}
