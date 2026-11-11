import type { Metadata } from 'next';
import { PageHero } from '@/components/marketing/page-hero';
import { LegalDoc, LegalTable, ContactLine, SeeAlso, type LegalSection } from '@/components/marketing/legal-doc';
import { Todo } from '@/components/ui/placeholder';
import { site, isTodo } from '@/config/site';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description:
    'How VRhino collects, uses and protects personal data submitted through vrhino.org, and the rights you have over it under UK GDPR.',
  alternates: { canonical: '/privacy' },
};

function Email() {
  return isTodo(site.email) ? <Todo value={site.email} /> : (
    <a href={`mailto:${site.email}`}>{site.email}</a>
  );
}

export default function PrivacyPage() {
  const { retention, dataRegion } = site.legal;

  const sections: LegalSection[] = [
    {
      id: 'who-we-are',
      heading: 'Who we are',
      body: (
        <>
          <ContactLine email={<Email />} />
          <p>
            We are the data controller for personal data collected through this website. That means
            we decide why and how it is used, and we are responsible for looking after it.
          </p>
          <p>
            We are not required to appoint a Data Protection Officer. Questions about this policy
            go to the address above.
          </p>
        </>
      ),
    },
    {
      id: 'what-we-collect',
      heading: 'What we collect',
      body: (
        <>
          <p>
            We only collect what you actively give us, plus the minimum needed to stop the contact
            form being abused. We do not buy data, we do not scrape it, and we do not build
            profiles of visitors.
          </p>
          <p><strong>If you send an enquiry</strong></p>
          <LegalTable
            caption="Personal data collected through the enquiry form"
            head={['Data', 'When', 'Why']}
            rows={[
              [<><strong>Name and email address</strong></>, 'Always', 'To identify you and reply'],
              [<><strong>Phone number</strong></>, 'Optional', 'To reply faster if you prefer a call'],
              [<><strong>Organisation</strong></>, 'Optional', 'To understand who we would be working with'],
              [<><strong>Your message</strong></>, 'Always', 'To answer your question'],
              [
                <><strong>Service, preferred and backup dates, start time, group size, age range, venue postcode, and how you heard about us</strong></>,
                'Booking and service requests only',
                'To work out whether we can do it, what it costs and how far we are travelling',
              ],
              [
                <><strong>Your declarations</strong>: that you are 18 or over or acting for an organisation, that you accepted this policy, and whether you opted in to marketing</>,
                'Always',
                'To show we had a lawful basis and your consent',
              ],
            ]}
          />
          <p>
            The age range field is for a group as a whole, such as &ldquo;13 to 16&rdquo;. Please do
            not use it, or the message box, to send us details about individual young people.
          </p>

          <p><strong>Automatically, for abuse prevention</strong></p>
          <ul>
            <li>
              <strong>Your IP address</strong>, used to limit how many enquiries can be sent from
              one connection in an hour. It is stored only for as long as that limit window is open
              and is then deleted. It is not linked to your enquiry and we do not use it for
              anything else.
            </li>
            <li>
              <strong>A Cloudflare Turnstile check</strong>, which confirms you are a person rather
              than a bot. See the Turnstile entry in section 5.
            </li>
            <li>
              <strong>Standard server logs</strong> kept by our hosting provider, which include IP
              addresses and are used for security and diagnostics.
            </li>
          </ul>

          <p><strong>Automatically, to measure traffic and speed</strong></p>
          <ul>
            <li>
              <strong>Page views</strong>: which page was viewed, the page that referred you, your
              country, and your device and browser type.
            </li>
            <li>
              <strong>Page performance</strong>: how quickly pages loaded and responded, so we can
              find and fix slow pages.
            </li>
          </ul>
          <p>
            This is measured by Vercel Web Analytics and Vercel Speed Insights, and it is covered in
            full in section 8. Neither sets a cookie, neither identifies you, and neither runs on
            our admin pages.
          </p>

          <p><strong>What we do not collect</strong></p>
          <ul>
            <li>No advertising, no ad networks and no tracking of you across other websites.</li>
            <li>No analytics that identifies you. See section 8 for what our traffic measurement does and does not do.</li>
            <li>No special category data. Please do not send us health or medical information
              through the form. If a participant has a condition we need to know about, we will
              agree with you how to handle that once a booking is confirmed.</li>
            <li>No payment card details. This website never takes payments.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'children',
      heading: "Children's data",
      body: (
        <>
          <p>
            <strong>We do not knowingly collect personal data about anyone under 18 through this
            website.</strong> The enquiry form cannot be submitted without confirming that you are
            18 or over, or that you are enquiring on behalf of an organisation. That confirmation
            is enforced by our database, not just by the form.
          </p>
          <p>
            Our sessions are frequently run for young people, but the arrangements are made with an
            adult: a parent, a teacher, a youth worker or a coach. Where we run a session for a
            school, youth club, charity or gym, that organisation remains the controller of its own
            records about its young people, including registers, consent forms and safeguarding
            information. We do not ask for or keep those records.
          </p>
          <p>
            If you believe a young person has given us their details through this website, email us
            and we will delete them.
          </p>
        </>
      ),
    },
    {
      id: 'lawful-basis',
      heading: 'Why we use it, and our lawful basis',
      body: (
        <>
          <p>
            Under UK GDPR we must have a lawful basis for each use of your data. Ours are as
            follows.
          </p>
          <LegalTable
            caption="Lawful basis for each purpose"
            head={['What we do', 'Lawful basis']}
            rows={[
              [
                'Reply to your enquiry and discuss what you need',
                <><strong>Legitimate interests</strong>, Article 6(1)(f). Our interest is in answering someone who deliberately contacted us. We judged this has no real privacy downside, because you chose to get in touch and we only use what you sent.</>,
              ],
              [
                'Prepare a quote and arrange a booking',
                <><strong>Contract</strong>, Article 6(1)(b), covering steps taken at your request before entering into a contract, and performing it once agreed.</>,
              ],
              [
                'Send you marketing emails',
                <><strong>Consent</strong>, Article 6(1)(a), and only if you ticked the box. The box is never pre-ticked. You can withdraw at any time and every email has an unsubscribe link.</>,
              ],
              [
                'Stop spam and abuse of the form',
                <><strong>Legitimate interests</strong>, Article 6(1)(f), in keeping our systems working and our inbox usable.</>,
              ],
              [
                'Keep records of bookings and payments',
                <><strong>Legal obligation</strong>, Article 6(1)(c), for tax and accounting records.</>,
              ],
            ]}
          />
          <p>
            Where we rely on legitimate interests you have the right to object, and we will stop
            unless we have compelling grounds to continue. See section 7.
          </p>
        </>
      ),
    },
    {
      id: 'processors',
      heading: 'Who we share it with',
      body: (
        <>
          <p>
            <strong>We never sell your data, and we never share it for advertising.</strong> We use
            a small number of suppliers to run the site. Each one processes data on our instructions
            under a contract that meets Article 28 of UK GDPR.
          </p>
          <LegalTable
            caption="Processors we use"
            head={['Supplier', 'What it does', 'Where data is held']}
            rows={[
              [
                <><strong>Supabase</strong></>,
                'Database and file storage. Holds enquiries and journal posts.',
                isTodo(dataRegion) ? <Todo value={dataRegion} /> : dataRegion,
              ],
              [
                <><strong>Vercel</strong></>,
                'Website hosting, plus Web Analytics and Speed Insights. Server logs include IP addresses.',
                'Processing in the United States and other regions',
              ],
              [
                <><strong>Resend</strong></>,
                'Sends the notification to us and your acknowledgement email. Receives your name, email address and message.',
                'United States',
              ],
              [
                <><strong>Cloudflare</strong></>,
                'Turnstile anti-spam check. Receives a verification token and your IP address. It does not set tracking cookies and does not profile you across sites.',
                'Global network, including the United States',
              ],
            ]}
          />
          <p>
            We may also disclose data where the law requires it, for example to a regulator or in
            response to a valid court order, or to our professional advisers where necessary.
          </p>
          <p>
            <strong>Transfers outside the UK.</strong> Some of these suppliers process data in the
            United States. Where that happens, the transfer is covered by the UK International Data
            Transfer Addendum to the EU Standard Contractual Clauses, or by the UK Extension to the
            EU-US Data Privacy Framework where the supplier is certified under it.
          </p>
        </>
      ),
    },
    {
      id: 'retention',
      heading: 'How long we keep it',
      body: (
        <>
          <p>We do not keep data indefinitely. Our periods are:</p>
          <LegalTable
            caption="Retention periods"
            head={['What', 'How long', 'Why']}
            rows={[
              [
                'Enquiries that do not become bookings',
                <><strong>{retention.enquiryMonths} months</strong> from your last contact with us</>,
                'So we have context if you come back to us, and so we can show we handled your enquiry properly',
              ],
              [
                'Booking and payment records',
                <><strong>{retention.bookingYears} years</strong> from the end of the relevant financial year</>,
                'HMRC requires business records to be kept for six years',
              ],
              [
                'Marketing consent',
                'Until you withdraw it',
                'To prove we had consent, and to stop emailing you when you withdraw it',
              ],
              [
                'IP addresses used for rate limiting',
                <><strong>Up to one hour</strong>, then deleted automatically</>,
                'Only as long as the abuse-prevention window is open',
              ],
            ]}
          />
          <p>
            You can ask us to delete your enquiry sooner and we will, unless we are required to keep
            it for the tax reasons above. Our admin tools include a delete function for exactly this
            purpose.
          </p>
        </>
      ),
    },
    {
      id: 'your-rights',
      heading: 'Your rights',
      body: (
        <>
          <p>Under UK GDPR you have the right to:</p>
          <ul>
            <li><strong>Be informed</strong> about how your data is used, which is what this page is for.</li>
            <li><strong>Access</strong> a copy of the data we hold about you.</li>
            <li><strong>Rectification</strong>, meaning correction of anything inaccurate.</li>
            <li><strong>Erasure</strong>, sometimes called the right to be forgotten.</li>
            <li><strong>Restrict processing</strong> while a dispute about your data is resolved.</li>
            <li><strong>Data portability</strong>, meaning a copy in a machine-readable format.</li>
            <li><strong>Object</strong> to processing based on legitimate interests, and to direct marketing at any time.</li>
            <li><strong>Withdraw consent</strong> at any time, where we relied on it.</li>
          </ul>
          <p>
            Email us to exercise any of these. We will respond within one month. There is no charge,
            unless a request is manifestly unfounded or excessive. We may ask you to confirm your
            identity before we release data, so we do not hand it to the wrong person.
          </p>
          <p>
            <strong>Complaints.</strong> If you are unhappy with how we have handled your data,
            please tell us first so we can put it right. You also have the right to complain to the
            Information Commissioner&rsquo;s Office, the UK supervisory authority, at{' '}
            <a href="https://ico.org.uk/make-a-complaint/" rel="noopener" target="_blank">ico.org.uk</a>{' '}
            or on 0303 123 1113.
          </p>
        </>
      ),
    },
    {
      id: 'cookies',
      heading: 'Cookies and analytics',
      body: (
        <>
          <p>
            <strong>We measure traffic and page speed, but we do not set analytics cookies, and we
            do not track you.</strong> That is why you have not been shown a cookie banner. Under
            the Privacy and Electronic Communications Regulations, consent is required before
            storing or accessing information on your device for non-essential purposes. Our
            measurement tools do not store anything on your device, so there is nothing to consent
            to.
          </p>

          <p><strong>What we use</strong></p>
          <LegalTable
            caption="Analytics tools"
            head={['Tool', 'What it measures', 'How it counts visitors']}
            rows={[
              [
                <><strong>Vercel Web Analytics</strong></>,
                'Page views, the page that referred you, country, device and browser type.',
                'A short-lived hash derived from the incoming request, which rotates regularly. No cookie, no identifier stored on your device, and no way to recognise you on a later visit or on another site.',
              ],
              [
                <><strong>Vercel Speed Insights</strong></>,
                'How quickly pages load and respond, so we can find slow pages and fix them.',
                'Performance timings only. It does not identify visitors.',
              ],
            ]}
          />

          <p><strong>What these tools do not do</strong></p>
          <ul>
            <li>They do not set cookies or store anything in your browser.</li>
            <li>They do not follow you to other websites, and the data is not shared with ad networks.</li>
            <li>They do not build a profile of you, and we cannot use them to identify an individual.</li>
            <li>They do not run on our admin pages, only on the public site.</li>
          </ul>
          <p>
            Measuring this is in our legitimate interests under Article 6(1)(f): we need to know
            which pages people find useful and which ones are too slow, and the measurement is
            designed so that it cannot identify you. You can block it with a content blocker and the
            site will work exactly the same.
          </p>

          <p><strong>Cookies</strong></p>
          <p>The only cookies this site sets are:</p>
          <LegalTable
            caption="Cookies"
            head={['Cookie', 'Purpose', 'Who gets it']}
            rows={[
              [
                <><strong>Supabase authentication cookies</strong></>,
                'Keeps a VRhino administrator signed in to the admin area. Strictly necessary, so no consent is required.',
                'VRhino staff only. Never set for ordinary visitors.',
              ],
            ]}
          />
          <p>
            If we ever add something that does set non-essential cookies or similar identifiers, for
            example an advertising pixel or a third-party analytics product, we will update this
            page and add a consent banner before switching it on.
          </p>
        </>
      ),
    },
    {
      id: 'security',
      heading: 'How we protect it',
      body: (
        <>
          <p>We take the following measures, which are a description of what the site actually does:</p>
          <ul>
            <li>All traffic is encrypted in transit over HTTPS, and data is encrypted at rest by our database provider.</li>
            <li>Enquiries are not readable by the public. Our database denies access by default and only signed-in VRhino staff can read them.</li>
            <li>The admin area is protected by email and password sign-in, and every administrative action is re-checked on the server rather than relying on hidden buttons.</li>
            <li>There is no sign-up page. Admin accounts are created by hand by us.</li>
            <li>Access is limited to the people who need it to do their job.</li>
          </ul>
          <p>
            No system is perfectly secure. If a breach occurs that is likely to risk your rights and
            freedoms, we will report it to the ICO within 72 hours and tell you without undue delay
            where the risk to you is high.
          </p>
        </>
      ),
    },
    {
      id: 'automated',
      heading: 'Automated decisions and profiling',
      body: (
        <p>
          We do not carry out automated decision-making that produces legal or similarly significant
          effects, and we do not profile you. The only automated step in the process is the spam
          check on the form. If it wrongly blocks you, the page tells you to try again, and you can
          always email us directly instead.
        </p>
      ),
    },
    {
      id: 'changes',
      heading: 'Changes to this policy',
      body: (
        <p>
          We will update this page when what we do changes, and the date at the top will change with
          it. If we make a significant change to how we use data you have already given us, we will
          contact you directly where we can. This policy was last updated on{' '}
          {site.legal.lastUpdated}.
        </p>
      ),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        lead="What we collect, why we collect it, who sees it and how to get it removed."
      />
      <LegalDoc
        intro={
          <>
            <p>
              This policy covers personal data collected through vrhino.org. It is written to be
              read, not to be impenetrable. If anything here is unclear, email us and ask.
            </p>
            <p>
              The short version: the only personal data we collect is what you type into the enquiry
              form. We use it to reply to you and to arrange a session. We do not sell it, we do not
              track you, and we delete it when we no longer need it.
            </p>
          </>
        }
        sections={sections}
        footerNote={<SeeAlso href="/terms" label="terms" />}
      />
    </>
  );
}
