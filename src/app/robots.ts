import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The admin area is also protected server-side. This just keeps it
        // out of search results.
        disallow: ['/admin', '/admin/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
