import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { site } from '@/config/site';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'VRhino | VR boxing, games and events, brought to your venue',
    template: '%s | VRhino',
  },
  description:
    'VRhino brings VR games, fitness and events to your venue. Headsets, a facilitator and everything set up, for parties, schools, youth clubs and boxing gyms across the UK.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'VRhino',
    url: site.url,
    title: 'VRhino | VR boxing, games and events, brought to your venue',
    description:
      'We bring the headsets and a facilitator to your venue. Parties, school workshops, youth programmes and VR boxing for gyms.',
    images: [{ url: '/brand/og.jpg', width: 1200, height: 630, alt: 'VRhino' }],
  },
  icons: {
    icon: [
      { url: '/brand/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#060D18',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* Motion sets inline opacity:0 during SSR. Without JS those elements
            would stay invisible for ever, so force them visible when scripting
            is unavailable. Enhancement, never a dependency. */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important}
            [style*="clip-path"]{clip-path:none!important}
            [style*="translate"]{transform:none!important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
