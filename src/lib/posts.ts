import 'server-only';

import { createAnonClient } from '@/lib/supabase/anon';
import { generateHTML } from '@tiptap/html/server';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

export type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: unknown;
  cover_image_url: string | null;
  tags: string[];
  status: 'draft' | 'published';
  published_at: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
};

export type PostWithAuthor = PostRow & {
  author: { full_name: string | null; email: string } | null;
};

export const POSTS_PER_PAGE = 9;

const LIST_COLUMNS =
  'id, title, slug, excerpt, cover_image_url, tags, status, published_at, created_at';

/**
 * Published posts, for the public blog.
 *
 * Uses the cookie-free anon client, so these functions work during static
 * generation as well as at request time. RLS decides what comes back; the
 * `status = 'published'` filter below is a second belt: if the policy were ever
 * loosened by mistake, drafts still would not appear here.
 */
export async function getPublishedPosts(opts: { page?: number; tag?: string } = {}) {
  const supabase = createAnonClient();
  if (!supabase) return { posts: [], total: 0, configured: false };

  const page = Math.max(1, opts.page ?? 1);
  const from = (page - 1) * POSTS_PER_PAGE;

  let query = supabase
    .from('posts')
    .select(LIST_COLUMNS, { count: 'exact' })
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .range(from, from + POSTS_PER_PAGE - 1);

  if (opts.tag) query = query.contains('tags', [opts.tag]);

  const { data, count, error } = await query;
  if (error) {
    console.error('[posts] list failed:', error.message);
    return { posts: [], total: 0, configured: true };
  }
  return {
    posts: (data ?? []) as Pick<PostRow, 'id' | 'title' | 'slug' | 'excerpt' | 'cover_image_url' | 'tags' | 'status' | 'published_at' | 'created_at'>[],
    total: count ?? 0,
    configured: true,
  };
}

export async function getPublishedPost(slug: string): Promise<PostWithAuthor | null> {
  const supabase = createAnonClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('posts')
    .select('*, author:profiles(full_name, email)')
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error('[posts] fetch failed:', error.message);
    return null;
  }
  return (data as PostWithAuthor) ?? null;
}

export async function getAllTags(): Promise<string[]> {
  const supabase = createAnonClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from('posts')
    .select('tags')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString());

  const set = new Set<string>();
  for (const row of data ?? []) for (const t of (row.tags ?? []) as string[]) set.add(t);
  return [...set].sort((a, b) => a.localeCompare(b));
}

export async function getPublishedSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  const supabase = createAnonClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString());
  return (data ?? []) as { slug: string; updated_at: string }[];
}

const EXTENSIONS = [
  StarterKit.configure({ link: false }),
  Image,
  Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener', target: '_blank' } }),
];

/**
 * Body is stored as Tiptap JSON, not raw HTML. Rendering structured JSON means
 * a compromised or careless editor cannot inject a <script> tag into a post:
 * only nodes the schema knows about are emitted.
 */
export function renderPostBody(body: unknown): string {
  if (!body || typeof body !== 'object') return '';
  try {
    return generateHTML(body as any, EXTENSIONS);
  } catch (err) {
    console.error('[posts] render failed:', err);
    return '';
  }
}

/** Plain text, used for reading time and meta descriptions. */
export function postPlainText(body: unknown): string {
  const out: string[] = [];
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return;
    const n = node as { type?: string; text?: string; content?: unknown[] };
    if (n.type === 'text' && typeof n.text === 'string') out.push(n.text);
    if (Array.isArray(n.content)) n.content.forEach(walk);
  };
  walk(body);
  return out.join(' ');
}

export function readingTime(body: unknown): number {
  const words = postPlainText(body).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}
