import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SiteChrome } from '@/components/marketing/site-chrome';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteChrome
      analytics={
        <>
          {/*
            Mounted here rather than in the root layout, so neither runs on
            /admin. Both are cookieless; see section 8 of the privacy policy.
          */}
          <Analytics />
          <SpeedInsights />
        </>
      }
    >
      {children}
    </SiteChrome>
  );
}
