import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SiteHeader } from '@/components/marketing/site-header';
import { SiteFooter } from '@/components/marketing/site-footer';
import { ConsentProvider } from '@/components/consent/consent-provider';
import { CookieBanner } from '@/components/consent/cookie-banner';
import { TrackingScripts } from '@/components/consent/tracking-scripts';
import { gaMeasurementId, metaPixelId } from '@/lib/env';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConsentProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-base"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />

      {/*
        Deliberately in the public layout rather than the root layout, so no
        analytics run on /admin. Staff browsing their own enquiries is not
        traffic worth measuring, and it keeps admin activity out of a third
        party. Both products are cookieless; see section 8 of the privacy policy.
      */}
      <Analytics />
      <SpeedInsights />

      {/* Nothing here loads until the visitor opts in. */}
      <CookieBanner />
      <TrackingScripts gaMeasurementId={gaMeasurementId} metaPixelId={metaPixelId} />
    </ConsentProvider>
  );
}
