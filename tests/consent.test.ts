import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseConsent, serialiseConsent, CONSENT_VERSION, DENY_ALL, ALLOW_ALL, CATEGORIES,
} from '../src/lib/consent.ts';

test('no cookie means no consent, so nothing may load', () => {
  assert.equal(parseConsent(undefined), null);
  assert.equal(parseConsent(null), null);
  assert.equal(parseConsent(''), null);
});

test('rubbish in the cookie is treated as no consent, not as consent', () => {
  assert.equal(parseConsent('not-json'), null);
  assert.equal(parseConsent(encodeURIComponent('{"analytics":"yes"}')), null);
  assert.equal(parseConsent(encodeURIComponent('{}')), null);
  assert.equal(parseConsent(encodeURIComponent('null')), null);
});

test('a cookie from an older category version is ignored, so we ask again', () => {
  const stale = encodeURIComponent(
    JSON.stringify({ v: CONSENT_VERSION - 1, analytics: true, marketing: true, ts: '2026-01-01' }),
  );
  assert.equal(parseConsent(stale), null);
});

test('a missing category is treated as no consent rather than defaulted on', () => {
  const partial = encodeURIComponent(
    JSON.stringify({ v: CONSENT_VERSION, analytics: true, ts: '2026-01-01' }),
  );
  assert.equal(parseConsent(partial), null);
});

test('round trips a real choice', () => {
  const parsed = parseConsent(serialiseConsent({ analytics: true, marketing: false }));
  assert.ok(parsed);
  assert.equal(parsed.analytics, true);
  assert.equal(parsed.marketing, false);
  assert.equal(parsed.v, CONSENT_VERSION);
  assert.ok(!Number.isNaN(Date.parse(parsed.ts)), 'records when consent was given');
});

test('reject all really is all off', () => {
  const parsed = parseConsent(serialiseConsent(DENY_ALL));
  assert.deepEqual({ analytics: parsed!.analytics, marketing: parsed!.marketing }, DENY_ALL);
});

test('accept all really is all on', () => {
  const parsed = parseConsent(serialiseConsent(ALLOW_ALL));
  assert.deepEqual({ analytics: parsed!.analytics, marketing: parsed!.marketing }, ALLOW_ALL);
});

test('defaults are off, which is what PECR requires', () => {
  assert.equal(DENY_ALL.analytics, false);
  assert.equal(DENY_ALL.marketing, false);
});

test('only the necessary category is locked on', () => {
  const locked = CATEGORIES.filter((c) => c.locked).map((c) => c.id);
  assert.deepEqual(locked, ['necessary']);
});
