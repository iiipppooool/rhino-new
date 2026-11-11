import type { Metadata } from 'next';
import { PageHero } from '@/components/marketing/page-hero';
import { LegalDoc, ContactLine, SeeAlso, Undecided, type LegalSection } from '@/components/marketing/legal-doc';
import { Todo } from '@/components/ui/placeholder';
import { site, isTodo, todoHint } from '@/config/site';

export const metadata: Metadata = {
  title: 'Terms and conditions',
  description:
    'The terms that apply to using vrhino.org and to booking a VRhino session, including payment, cancellation, safety and liability.',
  alternates: { canonical: '/terms' },
};

function Email() {
  return isTodo(site.email) ? <Todo value={site.email} /> : (
    <a href={`mailto:${site.email}`}>{site.email}</a>
  );
}

/** Renders a commercial figure, or a marked blank if it has not been decided. */
function Term({ value, suffix = '' }: { value: string | number; suffix?: string }) {
  if (typeof value === 'string' && isTodo(value)) {
    return <Undecided>{todoHint(value)}</Undecided>;
  }
  return <strong>{value}{suffix}</strong>;
}

export default function TermsPage() {
  const b = site.legal.booking;

  const sections: LegalSection[] = [
    {
      id: 'about',
      heading: 'About these terms',
      body: (
        <>
          <ContactLine email={<Email />} />
          <p>
            These terms apply to your use of this website and to any session you book with us. By
            using the site or confirming a booking, you accept them.
          </p>
          <p>
            Some terms depend on whether you are a <strong>consumer</strong>, meaning you are
            booking for purposes outside a business, such as a family birthday party, or a{' '}
            <strong>business customer</strong>, meaning you are booking for a school, charity, club,
            gym or company. Where the difference matters, it is set out below. Nothing in these
            terms removes the statutory rights a consumer has under the Consumer Rights Act 2015.
          </p>
        </>
      ),
    },
    {
      id: 'enquiries',
      heading: 'An enquiry is not a booking',
      body: (
        <>
          <p>
            <strong>Sending the enquiry form does not reserve a date and does not create a
            contract.</strong> It is a request, and we say so on the form and in the email you
            receive afterwards.
          </p>
          <p>A booking exists only when all of the following have happened:</p>
          <ul>
            <li>we have sent you a written quote setting out the date, times, what we will provide and the price;</li>
            <li>you have accepted that quote in writing, including by email; and</li>
            <li>we have confirmed the booking in writing and received any deposit due.</li>
          </ul>
          <p>
            Until then, the date remains available to anyone else. We will tell you promptly if we
            cannot do what you asked for.
          </p>
        </>
      ),
    },
    {
      id: 'quotes',
      heading: 'Quotes and prices',
      body: (
        <>
          <p>
            We do not publish fixed prices, because what we charge depends on group size, how long
            you need us, how many headsets you need and how far we are travelling. We quote per
            session.
          </p>
          <p>
            A written quote is valid for <Term value={b.quoteValidDays} suffix=" days" /> from the
            date we send it, unless it says otherwise. Prices are in pounds sterling. We will state
            clearly whether a quote includes or excludes VAT and travel.
          </p>
          <p>
            If you change what you need after we have quoted, for example by increasing the group
            size or the session length, we may need to requote. We will tell you before doing any
            extra work.
          </p>
        </>
      ),
    },
    {
      id: 'payment',
      heading: 'Payment',
      body: (
        <>
          <p>
            We take a deposit of <Term value={b.depositPercent} suffix="% of the quoted price" /> to
            confirm a booking. The balance is due{' '}
            <Term value={b.balanceDueDays} suffix=" days" /> before the session, unless your quote
            or invoice says otherwise.
          </p>
          <p>
            We do not take payments through this website. We will invoice you and set out how to
            pay.
          </p>
          <p>
            <strong>Business customers only.</strong> If an invoice is not paid by its due date we
            may charge interest and a fixed recovery sum under the Late Payment of Commercial Debts
            (Interest) Act 1998, and we may decline to run the session until payment is received.
          </p>
        </>
      ),
    },
    {
      id: 'cancellation-by-you',
      heading: 'If you cancel or move a booking',
      body: (
        <>
          <p>Tell us as soon as you can. Our standard position is:</p>
          <ul>
            <li>
              More than <Term value={b.fullRefundNoticeDays} suffix=" days" /> before the session:
              full refund of anything you have paid, including the deposit.
            </li>
            <li>
              Between <Term value={b.partRefundNoticeDays} suffix=" and " />
              <Term value={b.fullRefundNoticeDays} suffix=" days" /> before: we keep the deposit and
              refund the rest.
            </li>
            <li>
              Less than <Term value={b.partRefundNoticeDays} suffix=" days" /> before: the full
              price remains payable, because at that point we have usually turned down other work
              for the date.
            </li>
          </ul>
          <p>
            We would always rather move a date than lose it. If you ask to reschedule and we have
            the availability, we will do our best to move you without charge.
          </p>
          <p>
            <strong>Consumers and the 14 day cancellation right.</strong> When a consumer books at a
            distance, for example online or by email, there is normally a 14 day right to cancel
            under the Consumer Contracts (Information, Cancellation and Additional Charges)
            Regulations 2013. That right does not apply to contracts for leisure activities where
            the contract provides for a specific date or period of performance, which is the case
            for an event booked for a particular day. This is the same exemption that applies to
            concert tickets and restaurant reservations. The cancellation terms above therefore
            apply instead. We are telling you this so you know where you stand, not to take a right
            away that you would otherwise have had.
          </p>
        </>
      ),
    },
    {
      id: 'cancellation-by-us',
      heading: 'If we cancel',
      body: (
        <>
          <p>
            We will only cancel if we genuinely have to, for example because of illness, an
            equipment failure we cannot work around, or something outside our control as described
            in section 13.
          </p>
          <p>
            If we cancel, you choose: a full refund of everything you have paid, or an alternative
            date at no extra cost. We will tell you as soon as we know.
          </p>
          <p>
            If we have to cut a session short for a reason that is our fault, we will refund a fair
            proportion of the price.
          </p>
        </>
      ),
    },
    {
      id: 'your-venue',
      heading: 'What you need to provide',
      body: (
        <>
          <p>We bring the headsets, the software and a facilitator. You provide:</p>
          <ul>
            <li>a clear, flat indoor play space with nothing underfoot and nothing fragile within reach;</li>
            <li>at least one standard mains socket;</li>
            <li>safe access for us to carry equipment in and out, and somewhere to set up;</li>
            <li>adults responsible for your own group, as set out in section 9;</li>
            <li>any permission needed from the venue owner, if the venue is not yours.</li>
          </ul>
          <p>
            We will agree the space we need with you before the session. If the space provided is
            not safe or not large enough and this cannot be resolved on the day, our facilitator may
            reduce or stop the session. Where that happens through no fault of ours, the full price
            remains payable.
          </p>
          <p>
            Please tell us in advance about anything unusual: restricted access, no lift, low
            ceilings, a shared space, or a surface that cannot be walked on in socks.
          </p>
        </>
      ),
    },
    {
      id: 'safety',
      heading: 'Safety and participation',
      body: (
        <>
          <p>
            Every session is run by a VRhino facilitator who briefs the group, supervises the play
            space and can stop any activity at any time. <strong>Our sessions involve no physical
            contact between participants.</strong>
          </p>
          <p>
            <strong>VR has specific risks and you need to know about them before you book.</strong>
          </p>
          <ul>
            <li>
              <strong>Photosensitive epilepsy.</strong> A small number of people have seizures
              triggered by flashing lights or patterns. Anyone who has had a seizure, a loss of
              awareness, or any epilepsy symptom should speak to a doctor before using VR.
            </li>
            <li>
              <strong>Motion sickness.</strong> Some people feel dizzy, nauseous or disoriented in
              VR. Anyone who feels unwell should stop immediately and tell the facilitator.
            </li>
            <li>
              <strong>Physical exertion.</strong> VR boxing and fitness are genuine exercise.
              Participants should take part within their own limits.
            </li>
            <li>
              <strong>Awareness of surroundings.</strong> Wearing a headset means not seeing the
              real room. Participants must stay inside the marked play area and follow the
              facilitator.
            </li>
          </ul>
          <p>
            Please tell us in advance if any participant has a medical condition, disability or
            access need that affects taking part, so we can plan for it properly. Do not send
            medical details through the website enquiry form. We will agree a safe way to share that
            information once a booking is confirmed.
          </p>
          <p>
            Our facilitator may refuse to let someone take part, or ask them to stop, if they
            reasonably believe it is unsafe, including where someone appears to be under the
            influence of alcohol or drugs or is not following instructions.
          </p>
        </>
      ),
    },
    {
      id: 'supervision',
      heading: 'Supervision and safeguarding',
      body: (
        <>
          <p>
            Where a session involves anyone under 18, <strong>you remain responsible for
            safeguarding and for supervising your own group.</strong> A suitable number of your own
            adults must be present throughout. Our facilitator runs the activity; they are not a
            substitute for your supervision and are never left alone in sole charge of young
            people.
          </p>
          <p>
            Your own safeguarding policy applies to the session. You are responsible for registers,
            parental consent where your policy requires it, and for any medical or behavioural
            information about your participants.
          </p>
          <p>
            If you need to see documentation from us before booking, ask and we will send you what
            we hold.
          </p>
        </>
      ),
    },
    {
      id: 'equipment',
      heading: 'Our equipment',
      body: (
        <>
          <p>
            All headsets, controllers and other kit remain our property. We clean headsets and
            controllers between users.
          </p>
          <p>
            Normal wear and tear is our problem, not yours. If equipment is damaged or lost through
            deliberate misuse or clear carelessness by someone in your group, we may charge you the
            reasonable cost of repair or replacement. We will show you evidence of the cost before
            charging anything.
          </p>
        </>
      ),
    },
    {
      id: 'photography',
      heading: 'Photography and filming',
      body: (
        <>
          <p>
            We would like to photograph and film sessions to show what we do. <strong>We will not do
            so without your agreement.</strong>
          </p>
          <p>
            Where young people are involved, we will only photograph or film with the written
            agreement of the organisation and in line with its own consent arrangements. If you
            would rather we did not, say so and we will not. Changing your mind later is fine: tell
            us and we will stop using the material.
          </p>
        </>
      ),
    },
    {
      id: 'liability',
      heading: 'Our responsibility to you',
      body: (
        <>
          <p>
            <strong>We do not exclude or limit our liability where it would be unlawful to do
            so.</strong> That includes liability for death or personal injury caused by our
            negligence, for fraud or fraudulent misrepresentation, and, for consumers, any
            liability that cannot be excluded under the Consumer Rights Act 2015.
          </p>
          <p>
            We will provide our services with reasonable care and skill. If we do not, we will put
            it right or refund you.
          </p>
          <p>
            <strong>If you are a consumer.</strong> We are responsible for loss or damage you suffer
            that is a foreseeable result of our breaking these terms or failing to use reasonable
            care and skill. We are not responsible for loss or damage that was not foreseeable. We
            are not liable for business losses, because our services are supplied to consumers for
            domestic and private use.
          </p>
          <p>
            <strong>If you are a business customer.</strong> We are not liable for loss of profit,
            loss of business, loss of anticipated savings, loss of opportunity, or any indirect or
            consequential loss. Subject to the first paragraph of this section, our total liability
            arising out of a booking is limited to the total amount you paid us for that booking.
          </p>
          <p>
            We are not responsible for the condition or safety of your venue, or for the conduct of
            people in your group whom we do not control.
          </p>
        </>
      ),
    },
    {
      id: 'insurance',
      heading: 'Insurance',
      body: (
        <p>
          We hold {isTodo(site.legal.insurance)
            ? <Todo value={site.legal.insurance} />
            : <strong>{site.legal.insurance}</strong>}. We will provide a certificate on request.
          Your venue remains responsible for its own insurance and for the condition of its
          premises.
        </p>
      ),
    },
    {
      id: 'force-majeure',
      heading: 'Events outside our control',
      body: (
        <p>
          Neither of us is responsible for failing to perform where the cause is outside reasonable
          control, including severe weather, flood, fire, power failure, serious illness affecting
          our facilitators, transport failure, civil emergency or government restriction. If that
          happens we will contact you as soon as possible and agree a new date, or refund you in
          full if a new date cannot be arranged.
        </p>
      ),
    },
    {
      id: 'website',
      heading: 'Using this website',
      body: (
        <>
          <p>
            You may use this site for lawful purposes. Do not attempt to gain unauthorised access to
            it, interfere with it, submit anything malicious through the enquiry form, or use
            automated tools to flood it. We rate limit the form and we may block access where we
            reasonably believe it is being abused.
          </p>
          <p>
            The content of this site, including text, design, the VRhino name and logo, belongs to
            us or our licensors. You may not copy it for commercial use without permission.
            Photographs licensed from third parties remain the property of their owners.
          </p>
          <p>
            We keep the site accurate but we do not guarantee it is complete or up to date at every
            moment. Information on the site is not an offer, and nothing on it forms part of a
            contract until we have confirmed a booking in writing.
          </p>
        </>
      ),
    },
    {
      id: 'complaints',
      heading: 'Complaints',
      body: (
        <p>
          If something goes wrong, tell us. Email us with what happened and we will reply within{' '}
          {isTodo(site.replyWithinWorkingDays)
            ? <Todo value={site.replyWithinWorkingDays} />
            : <strong>{site.replyWithinWorkingDays}</strong>}{' '}
          working days with how we intend to put it right. We would much rather fix a problem than
          argue about it.
        </p>
      ),
    },
    {
      id: 'changes',
      heading: 'Changes to these terms',
      body: (
        <p>
          We may update these terms. The version that applies to your booking is the one in force on
          the date we confirmed it in writing, and we will send you a copy if you ask. Changes to
          the website terms take effect when published here. These terms were last updated on{' '}
          {site.legal.lastUpdated}.
        </p>
      ),
    },
    {
      id: 'law',
      heading: 'Governing law',
      body: (
        <>
          <p>
            These terms are governed by the law of England and Wales, and the courts of England and
            Wales have jurisdiction.
          </p>
          <p>
            If you are a consumer living in Scotland or Northern Ireland, you may also bring
            proceedings in your own country, and you keep the benefit of any mandatory consumer
            protections that apply where you live.
          </p>
          <p>
            Each section of these terms operates separately. If a court decides any part is
            unlawful, the rest continues to apply.
          </p>
        </>
      ),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms and conditions"
        lead="What you can expect from us, what we need from you, and where each of us stands if something goes wrong."
      />
      <LegalDoc
        intro={
          <>
            <p>
              These are the terms for using this website and for booking a VRhino session. They are
              written to be read by a parent or a head teacher, not only by a solicitor.
            </p>
            <p>
              The short version: an enquiry is not a booking until we confirm it in writing, we turn
              up with the kit and run the session safely, you look after your own group, and if
              either of us has to cancel there is a clear process for it.
            </p>
          </>
        }
        sections={sections}
        footerNote={<SeeAlso href="/privacy" label="privacy policy" />}
      />
    </>
  );
}
