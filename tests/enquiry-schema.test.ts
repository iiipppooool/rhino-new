import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enquirySchema, slugify, postSchema } from '../src/lib/schemas.ts';

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
};

const validGeneral = {
  type: 'general',
  name: 'Sam Taylor',
  email: 'sam@example.com',
  message: 'Do you run sessions in Croydon?',
  over18_or_org: true,
  privacy_accepted: true,
  marketing_opt_in: false,
};

const validPrebook = {
  ...validGeneral,
  type: 'prebook',
  service: 'School or youth',
  preferred_date: tomorrow(),
  group_size: '24',
  age_range: '13 to 16',
  venue_postcode: 'SW1A 1AA',
};

test('accepts a valid general enquiry', () => {
  assert.equal(enquirySchema.safeParse(validGeneral).success, true);
});

test('accepts a valid pre-booking and coerces group size to a number', () => {
  const r = enquirySchema.safeParse(validPrebook);
  assert.equal(r.success, true);
  if (r.success && r.data.type === 'prebook') {
    assert.equal(r.data.group_size, 24);
    assert.equal(typeof r.data.group_size, 'number');
  }
});

test('rejects a missing age declaration', () => {
  const r = enquirySchema.safeParse({ ...validGeneral, over18_or_org: false });
  assert.equal(r.success, false);
});

test('rejects a missing privacy acceptance', () => {
  const r = enquirySchema.safeParse({ ...validGeneral, privacy_accepted: false });
  assert.equal(r.success, false);
});

test('rejects a malformed email', () => {
  const r = enquirySchema.safeParse({ ...validGeneral, email: 'not-an-email' });
  assert.equal(r.success, false);
});

test('rejects an empty message', () => {
  const r = enquirySchema.safeParse({ ...validGeneral, message: 'hi' });
  assert.equal(r.success, false);
});

test('rejects a booking date in the past', () => {
  const r = enquirySchema.safeParse({ ...validPrebook, preferred_date: '2020-01-01' });
  assert.equal(r.success, false);
});

test('rejects a booking with no postcode', () => {
  const { venue_postcode: _omit, ...rest } = validPrebook;
  assert.equal(enquirySchema.safeParse(rest).success, false);
});

test('rejects a nonsense postcode', () => {
  const r = enquirySchema.safeParse({ ...validPrebook, venue_postcode: 'nope!!' });
  assert.equal(r.success, false);
});

test('rejects a group size of zero', () => {
  const r = enquirySchema.safeParse({ ...validPrebook, group_size: '0' });
  assert.equal(r.success, false);
});

test('rejects a filled honeypot', () => {
  const r = enquirySchema.safeParse({ ...validGeneral, website: 'http://spam.example' });
  assert.equal(r.success, false);
});

test('a general enquiry does not require booking fields', () => {
  const r = enquirySchema.safeParse(validGeneral);
  assert.equal(r.success, true);
  if (r.success) assert.equal('service' in r.data, false);
});

test('slugify produces url-safe slugs', () => {
  assert.equal(slugify('Step In. Swing First!'), 'step-in-swing-first');
  assert.equal(slugify('  Spaces   &  symbols  '), 'spaces-symbols');
  assert.equal(slugify('Café résumé'), 'cafe-resume');
});

test('post slug rejects uppercase and spaces', () => {
  const base = { title: 'A post', body: {}, status: 'draft', tags: [] };
  assert.equal(postSchema.safeParse({ ...base, slug: 'Valid Slug' }).success, false);
  assert.equal(postSchema.safeParse({ ...base, slug: 'valid-slug' }).success, true);
});
