import type { Metadata } from 'next';
import Link from 'next/link';
import NextImage from 'next/image';
import { PageHero } from '@/components/marketing/page-hero';
import { CtaBand } from '@/components/marketing/cta-band';
import { Reveal, Wipe } from '@/components/ui/motion';
import { getPublishedPosts, getAllTags, formatDate, POSTS_PER_PAGE } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'Notes from VRhino: events we have run, what works in VR boxing, and what we are learning along the way.',
  alternates: { canonical: '/blog' },
};

export const revalidate = 300;

type Search = Promise<{ tag?: string; page?: string }>;

export default async function BlogPage({ searchParams }: { searchParams: Search }) {
  const { tag, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [{ posts, total, configured }, tags] = await Promise.all([
    getPublishedPosts({ page, tag }),
    getAllTags(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
  const [featured, ...rest] = page === 1 && !tag ? posts : [];
  const grid = page === 1 && !tag ? rest : posts;

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="What we are learning."
        lead="Sessions we have run, things that worked, things that did not, and the occasional opinion about VR."
      />

      {tags.length > 0 && (
        <nav aria-label="Filter by tag" className="mx-auto max-w-7xl px-5 pt-10 sm:px-8">
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link
                href="/blog"
                aria-current={!tag ? 'true' : undefined}
                className={`inline-block rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  !tag ? 'border-accent bg-accent text-canvas' : 'border-line text-muted hover:border-blue hover:text-ink'
                }`}
              >
                All
              </Link>
            </li>
            {tags.map((t) => (
              <li key={t}>
                <Link
                  href={`/blog?tag=${encodeURIComponent(t)}`}
                  aria-current={tag === t ? 'true' : undefined}
                  className={`inline-block rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    tag === t ? 'border-accent bg-accent text-canvas' : 'border-line text-muted hover:border-blue hover:text-ink'
                  }`}
                >
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        {posts.length === 0 ? (
          <Reveal>
            <div className="rounded-xl border border-dashed border-line px-8 py-20 text-center">
              <h2 className="font-display text-2xl">
                {tag ? `Nothing tagged "${tag}" yet` : 'No posts yet'}
              </h2>
              <p className="measure mx-auto mt-3 text-muted">
                {configured
                  ? 'We are only just getting going. Check back soon, or come and see us at an event.'
                  : 'The journal is not connected to its database yet.'}
              </p>
              <Link href="/book" className="mt-7 inline-block text-blue-light underline underline-offset-4">
                Book an event instead
              </Link>
            </div>
          </Reveal>
        ) : (
          <>
            {featured && (
              <Wipe className="mb-12">
                <Link href={`/blog/${featured.slug}`} className="group grid gap-7 overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-blue/60 lg:grid-cols-2">
                  <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[22rem]">
                    {featured.cover_image_url ? (
                      <NextImage
                        src={featured.cover_image_url}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="h-full w-full bg-surface-2" />
                    )}
                  </div>
                  <div className="flex flex-col justify-center p-7 sm:p-10">
                    <span className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent">
                      Latest
                    </span>
                    <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">{featured.title}</h2>
                    {featured.excerpt && <p className="measure mt-4 text-muted">{featured.excerpt}</p>}
                    <p className="mt-5 text-sm text-muted">{formatDate(featured.published_at)}</p>
                  </div>
                </Link>
              </Wipe>
            )}

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {grid.map((p, i) => (
                <Reveal as="li" key={p.id} delay={(i % 3) * 0.07}>
                  <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-blue/60">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {p.cover_image_url ? (
                        <NextImage src={p.cover_image_url} alt="" fill sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.04]" />
                      ) : (
                        <div className="h-full w-full bg-surface-2" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      {p.tags[0] && (
                        <span className="font-display text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent">
                          {p.tags[0]}
                        </span>
                      )}
                      <h2 className="mt-2 font-display text-xl leading-snug">{p.title}</h2>
                      {p.excerpt && <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">{p.excerpt}</p>}
                      <p className="mt-5 text-xs text-muted">{formatDate(p.published_at)}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </ul>

            {totalPages > 1 && (
              <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-3">
                {page > 1 && (
                  <Link href={{ pathname: '/blog', query: { ...(tag && { tag }), page: page - 1 } }}
                    className="rounded-full border border-line px-5 py-2.5 text-sm hover:border-blue">
                    Previous
                  </Link>
                )}
                <span className="text-sm text-muted">Page {page} of {totalPages}</span>
                {page < totalPages && (
                  <Link href={{ pathname: '/blog', query: { ...(tag && { tag }), page: page + 1 } }}
                    className="rounded-full border border-line px-5 py-2.5 text-sm hover:border-blue">
                    Next
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </section>

      <CtaBand heading="Want us at your place?" />
    </>
  );
}
