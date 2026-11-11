'use client';

import Script from 'next/script';
import { useConsent } from './consent-provider';

/**
 * Loads tracking only after the relevant consent is given.
 *
 * Deliberately strict: nothing from Google or Meta is requested at all until
 * the visitor has opted in. Google Consent Mode would allow loading gtag in a
 * denied state, but that still sends the visitor's IP address to Google before
 * they have agreed to anything, so we do not do it.
 *
 * IDs come from environment variables. With none set, nothing is injected and
 * the consent banner still behaves correctly.
 */
export function TrackingScripts({
  gaMeasurementId,
  metaPixelId,
}: {
  gaMeasurementId?: string;
  metaPixelId?: string;
}) {
  const { consent } = useConsent();
  if (!consent) return null;

  const analytics = consent.analytics && Boolean(gaMeasurementId);
  const marketing = consent.marketing && Boolean(metaPixelId);

  return (
    <>
      {analytics && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'granted'
              });
              ${consent.marketing ? `gtag('consent', 'update', {
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted'
              });` : ''}
              gtag('config', '${gaMeasurementId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {marketing && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
            s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
