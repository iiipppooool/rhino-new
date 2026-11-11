import type { Metadata } from 'next';
import { PageHero } from '@/components/marketing/page-hero';
import { Checklist, Specs, Faq } from '@/components/marketing/sections';
import { CtaBand } from '@/components/marketing/cta-band';
import { Photo } from '@/components/ui/photo';
import { Wipe, Reveal } from '@/components/ui/motion';
import { Button } from '@/components/ui/button';
import { Todo } from '@/components/ui/placeholder';
import { site, isTodo, TODO } from '@/config/site';

export const metadata: Metadata = {
  title: 'Parties, corporate and community events',
  description:
    'VR for birthdays, team socials, open days and community events. We bring the headsets and a facilitator to your venue anywhere we can reach.',
  alternates: { canonical: '/events' },
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Parties, corporate and community"
        title="We turn up, set up and run it."
        lead="Birthdays, family celebrations, team socials, open days and charity events. You provide the room. We do the rest."
      >
        <Button href="/book" punch>Get a quote</Button>
      </PageHero>

      <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-8">
        <Wipe>
          <Photo name="parties" ratio="aspect-[21/9]" sizes="100vw" className="rounded-xl" />
        </Wipe>
      </section>

      <Checklist
        heading="What is included"
        lead="One price, nothing to hire separately."
        items={[
          'VR headsets, charged and ready, cleaned between users',
          'A VRhino facilitator who runs the whole session',
          'Safety briefing and play space setup',
          'A mix of games picked for your group and ages',
          'Scoreboards and friendly challenges if you want them',
          'Full pack down, so you get the room back as you left it',
        ]}
      />

      <Specs
        rows={[
          { label: 'Group size', value: TODO('confirm min and max group size') },
          { label: 'Duration', value: site.sessionDuration },
          { label: 'Space needed', value: TODO('confirm floor area, e.g. 3m x 3m per headset') },
          { label: 'Age guidance', value: site.ageGuidance },
        ]}
      />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            { t: 'Birthdays and family events', b: 'Everyone takes a turn, nobody stands about. Works for mixed ages and for people who have never tried VR.' },
            { t: 'Team socials and open days', b: 'A shared thing to do that is not a pub quiz. Good for stands at open days where people drop in and out.' },
            { t: 'Community and charity events', b: 'Fetes, fun days and fundraisers. Tell us the footfall and we will work out how many headsets you need.' },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.08}>
              <h2 className="border-t-2 border-accent pt-4 font-display text-xl">{c.t}</h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{c.b}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <Faq
        items={[
          { q: 'How much does it cost?', a: 'It depends on group size, how long you want us there and where you are. Send an enquiry and we will give you a quote.' },
          { q: 'What do we need to provide?', a: 'A clear floor area, a standard plug socket and somewhere to set up. No ceiling height tricks, no special flooring.' },
          { q: 'Do you travel?', a: <>We are based in London and we bring the kit to you. Tell us your postcode on the form and we will confirm whether we can reach you{isTodo(site.phone) ? '' : ', or call us'}.</> },
          { q: 'Is it safe for people who have never used VR?', a: 'Yes. Every session starts with a briefing, the facilitator watches the play space, and nobody makes contact with anyone else.' },
          { q: 'Can people wear glasses?', a: <>Most headsets take glasses. If someone in your group is unsure, mention it on the form{isTodo(site.email) ? ' ' : ` or email ${site.email} `}and we will check.</> },
          { q: 'Is booking a date confirmed straight away?', a: <>No. The form sends a request. We come back to you within <Todo value={site.replyWithinWorkingDays} /> working days to confirm whether we can do it.</> },
        ]}
      />

      <CtaBand heading="Got a date in mind?" body="Send it over with rough numbers and we will tell you what we can do." />
    </>
  );
}
