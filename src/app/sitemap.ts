import type { MetadataRoute } from 'next';
import { getPublishedSlugs } from '@/lib/posts';
import { siteUrl } from '@/lib/env';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { path: '', priority: 1 },
    { path: '/events', priority: 0.9 },
    { path: '/schools', priority: 0.9 },
    { path: '/boxing', priority: 0.9 },
    { path: '/book', priority: 0.9 },
    { path: '/our-story', priority: 0.7 },
    { path: '/blog', priority: 0.7 },
    { path: '/privacy', priority: 0.3 },
    { path: '/terms', priority: 0.3 },
  ].map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: r.priority,
  }));

  const posts = await getPublishedSlugs();

  return [
    ...staticRoutes,
    ...posts.map((p) => ({
      url: `${siteUrl}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
