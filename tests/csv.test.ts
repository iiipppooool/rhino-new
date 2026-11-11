import { test } from 'node:test';
import assert from 'node:assert/strict';

/** Mirrors the escaping in the enquiries export route. */
function cell(value: unknown): string {
  if (value == null) return '';
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

test('quotes ordinary values', () => {
  assert.equal(cell('Sam Taylor'), '"Sam Taylor"');
});

test('escapes embedded quotes', () => {
  assert.equal(cell('He said "hello"'), '"He said ""hello"""');
});

test('neutralises a formula injection attempt', () => {
  assert.equal(cell('=cmd|calc'), `"'=cmd|calc"`);
  assert.equal(cell('+1234'), `"'+1234"`);
  assert.equal(cell('-1+1'), `"'-1+1"`);
  assert.equal(cell('@SUM(A1)'), `"'@SUM(A1)"`);
});

test('keeps newlines inside the quoted cell', () => {
  assert.equal(cell('line one\nline two'), '"line one\nline two"');
});

test('empty for null and undefined', () => {
  assert.equal(cell(null), '');
  assert.equal(cell(undefined), '');
});
