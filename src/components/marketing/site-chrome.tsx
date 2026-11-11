import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { ConsentProvider } from '@/components/consent/consent-provider';
import { CookieBanner } from '@/components/consent/cookie-banner';
import { TrackingScripts } from '@/components/consent/tracking-scripts';
import { gaMeasurementId, metaPixelId } from '@/lib/env';

/**
 * Header, footer, consent and tracking.
 *
 * Shared by the public layout and the global not-found page, so a 404 is a
 * real page of the site rather than Next's unstyled default.
 */
export function SiteChrome({
  children,
  analytics = null,
}: {
  children: React.ReactNode;
  /** Vercel Analytics and Speed Insights, passed in by the layout only. */
  analytics?: React.ReactNode;
}) {
  return (
    <ConsentProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-canvas"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />

      {analytics}

      {/* Nothing here loads until the visitor opts in. */}
      <CookieBanner />
      <TrackingScripts gaMeasurementId={gaMeasurementId} metaPixelId={metaPixelId} />
    </ConsentProvider>
  );
}
