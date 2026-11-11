import { getPublishedPosts } from '@/lib/posts';
import { siteUrl } from '@/lib/env';

export const revalidate = 600;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export async function GET() {
  const { posts } = await getPublishedPosts({ page: 1 });

  const items = posts
    .map((p) => {
      const url = `${siteUrl}/blog/${p.slug}`;
      const description = p.excerpt?.trim() || '';
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      ${p.published_at ? `<pubDate>${new Date(p.published_at).toUTCString()}</pubDate>` : ''}
      ${description ? `<description>${esc(description)}</description>` : ''}
      ${p.tags.map((t) => `<category>${esc(t)}</category>`).join('')}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>VRhino Journal</title>
    <link>${esc(siteUrl)}/blog</link>
    <description>Notes from VRhino on VR boxing, events and youth programmes.</description>
    <language>en-GB</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${esc(siteUrl)}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=600, stale-while-revalidate=3600',
    },
  });
}
