import type { Metadata } from 'next';
import Link from 'next/link';
import NextImage from 'next/image';
import { notFound } from 'next/navigation';
import { CtaBand } from '@/components/marketing/cta-band';
import { Button } from '@/components/ui/button';
import {
  getPublishedPost, getPublishedPosts, getPublishedSlugs,
  renderPostBody, postPlainText, readingTime, formatDate,
} from '@/lib/posts';
import { siteUrl } from '@/lib/env';

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: 'Post not found' };

  const description =
    post.excerpt?.trim() || `${postPlainText(post.body).slice(0, 155).trim()}…`;

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: `${siteUrl}/blog/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      tags: post.tags,
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
    },
    twitter: {
      card: post.cover_image_url ? 'summary_large_image' : 'summary',
      title: post.title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const html = renderPostBody(post.body);
  const mins = readingTime(post.body);
  const author = post.author?.full_name ?? 'VRhino';
  const { posts: more } = await getPublishedPosts({ page: 1 });
  const others = more.filter((p) => p.slug !== post.slug).slice(0, 3);
  const shareUrl = `${siteUrl}/blog/${post.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { '@type': 'Organization', name: 'VRhino' },
    publisher: { '@type': 'Organization', name: 'VRhino' },
    mainEntityOfPage: shareUrl,
    ...(post.cover_image_url && { image: post.cover_image_url }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header className="mx-auto max-w-3xl px-5 pb-10 pt-32 sm:px-8 sm:pt-40">
          <Link href="/blog" className="text-sm text-muted underline underline-offset-4 hover:text-ink">
            Back to the journal
          </Link>
          {post.tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <li key={t}>
                  <Link href={`/blog?tag=${encodeURIComponent(t)}`}
                    className="inline-block rounded-full border border-line px-3 py-1 text-xs text-muted hover:border-blue hover:text-ink">
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <h1 className="mt-5 font-display text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1] tracking-[-0.03em]">
            {post.title}
          </h1>
          {post.excerpt && <p className="mt-5 text-lg leading-relaxed text-muted">{post.excerpt}</p>}

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-6 text-sm text-muted">
            <span className="flex items-center gap-2.5">
              <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 font-display text-xs text-ink">
                {author.slice(0, 1).toUpperCase()}
              </span>
              <span className="text-ink">{author}</span>
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
            <span aria-hidden="true">·</span>
            <span>{mins} min read</span>
          </div>
        </header>

        {post.cover_image_url && (
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="relative aspect-[21/9] overflow-hidden rounded-xl">
              <NextImage src={post.cover_image_url} alt="" fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" />
            </div>
          </div>
        )}

        <div
          className="prose prose-invert mx-auto max-w-[68ch] px-5 py-14 sm:px-8
            prose-headings:font-display prose-headings:tracking-[-0.02em]
            prose-p:leading-relaxed prose-p:text-muted
            prose-li:text-muted
            prose-strong:text-ink
            prose-a:text-blue-light prose-a:underline prose-a:underline-offset-4
            prose-blockquote:border-l-accent prose-blockquote:not-italic prose-blockquote:text-ink
            prose-img:rounded-xl
            prose-hr:border-line"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="mx-auto max-w-[68ch] px-5 pb-14 sm:px-8">
          <div className="flex flex-wrap items-center gap-4 border-y border-line py-6 text-sm">
            <span className="text-muted">Share</span>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank" rel="noopener" className="text-blue-light underline underline-offset-4">LinkedIn</a>
            <a href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${shareUrl}`)}`}
              target="_blank" rel="noopener" className="text-blue-light underline underline-offset-4">WhatsApp</a>
            <a href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(shareUrl)}`}
              className="text-blue-light underline underline-offset-4">Email</a>
          </div>
        </div>
      </article>

      {others.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
          <h2 className="font-display text-2xl">More from the journal</h2>
          <ul className="mt-7 grid gap-6 sm:grid-cols-3">
            {others.map((p) => (
              <li key={p.id}>
                <Link href={`/blog/${p.slug}`} className="group block rounded-xl border border-line bg-surface p-6 transition-colors hover:border-blue/60">
                  <h3 className="font-display text-lg leading-snug">{p.title}</h3>
                  <p className="mt-2 text-xs text-muted">{formatDate(p.published_at)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto max-w-[68ch] px-5 pb-20 sm:px-8">
        <div className="rounded-xl border border-line bg-surface p-8 text-center">
          <h2 className="font-display text-2xl">Fancy trying it?</h2>
          <p className="mt-3 text-muted">We bring the headsets and a host to your venue.</p>
          <Button href="/book" punch className="mt-6">Book an event</Button>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
