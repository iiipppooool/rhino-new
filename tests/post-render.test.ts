import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateHTML } from '@tiptap/html/server';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

/**
 * Post bodies are stored as Tiptap JSON and rendered to HTML on the server,
 * then injected with dangerouslySetInnerHTML. These tests mirror the extension
 * set in src/lib/posts.ts and pin the properties that make that safe.
 */
const EXT = [
  StarterKit.configure({ link: false }),
  Image,
  Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener', target: '_blank' } }),
];

const doc = (content: unknown[]) => ({ type: 'doc', content }) as never;

test('renders ordinary content', () => {
  const html = generateHTML(doc([
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Hello' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Body text.' }] },
  ]), EXT);
  assert.equal(html, '<h2>Hello</h2><p>Body text.</p>');
});

test('strips a javascript: link', () => {
  const html = generateHTML(doc([{ type: 'paragraph', content: [
    { type: 'text', text: 'click', marks: [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }] },
  ]}]), EXT);
  assert.ok(!html.includes('javascript:'), html);
});

test('strips a data: URI link', () => {
  const html = generateHTML(doc([{ type: 'paragraph', content: [
    { type: 'text', text: 'x', marks: [{ type: 'link', attrs: { href: 'data:text/html,<script>alert(1)</script>' } }] },
  ]}]), EXT);
  assert.ok(!html.includes('data:text/html'), html);
  assert.ok(!html.includes('<script'), html);
});

test('escapes an attribute injection attempt on an image', () => {
  const html = generateHTML(doc([
    { type: 'image', attrs: { src: 'x" onerror="alert(1)', alt: 'a' } },
  ]), EXT);
  // The quote is escaped to &quot;, so the payload stays inside the src value
  // and never becomes a real attribute. Checking for the literal text
  // "onerror" would match the escaped form and fail on safe output, so the
  // assertion is that no unescaped quote breaks out of the attribute.
  assert.ok(!html.includes('" onerror="'), html);
  assert.ok(html.includes('&quot;'), 'the quote should be escaped');
});

test('escapes raw HTML held as text', () => {
  const html = generateHTML(doc([{ type: 'paragraph', content: [
    { type: 'text', text: '<script>alert(1)</script>' },
  ]}]), EXT);
  assert.ok(!html.includes('<script>'), html);
  assert.ok(html.includes('&lt;script&gt;'), html);
});

test('external links carry rel="noopener"', () => {
  const html = generateHTML(doc([{ type: 'paragraph', content: [
    { type: 'text', text: 'x', marks: [{ type: 'link', attrs: { href: 'https://example.com' } }] },
  ]}]), EXT);
  assert.ok(html.includes('rel="noopener"'), html);
});

test('a malformed document throws, which renderPostBody catches', () => {
  // Pinned because renderPostBody relies on this to return '' rather than
  // crashing the whole post page.
  assert.throws(() => generateHTML({ nonsense: true } as never, EXT));
});
