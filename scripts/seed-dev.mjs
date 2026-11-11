/**
 * Inserts one clearly-marked example post for local development.
 *
 * Refuses to run unless SEED_CONFIRM=yes, so it cannot be pointed at
 * production by accident. There is no seeding of fake enquiries at all.
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first.');
  process.exit(1);
}

if (process.env.NODE_ENV === 'production') {
  console.error('Refusing to seed with NODE_ENV=production.');
  process.exit(1);
}

if (process.env.SEED_CONFIRM !== 'yes') {
  console.error(`About to insert an example post into: ${url}`);
  console.error('If that is a development project, re-run with SEED_CONFIRM=yes');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const body = {
  type: 'doc',
  content: [
    { type: 'paragraph', content: [{ type: 'text', text: 'This is an example post for local development. Delete it before you go live.' }] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'What a post looks like' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Headings, paragraphs, lists, quotes and images all render through the same styles as a real post, so you can check the typography without writing anything real.' }] },
    { type: 'bulletList', content: [
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'A list item' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Another one' }] }] },
    ]},
    { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'A pull quote sits here.' }] }] },
  ],
};

const { error } = await supabase.from('posts').upsert(
  {
    title: 'Example post (delete me)',
    slug: 'example-post',
    excerpt: 'A development-only placeholder so the journal has something in it.',
    body,
    tags: ['Behind the scenes'],
    status: 'published',
    published_at: new Date().toISOString(),
  },
  { onConflict: 'slug' },
);

if (error) {
  console.error('Seed failed:', error.message);
  process.exit(1);
}
console.log('Inserted "Example post (delete me)" at /blog/example-post');
