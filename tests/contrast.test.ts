import { test } from 'node:test';
import assert from 'node:assert/strict';

/**
 * WCAG AA contrast guard for the palette in src/app/globals.css.
 *
 * Two real failures were caught by this check during the build: white text on
 * the orange accent (2.85:1), and faded `text-muted/60` and `/70` variants
 * (3.39:1 and 4.22:1). Keep this test green rather than checking by eye.
 */

const hex = (h: string) => h.replace('#', '').match(/../g)!.map((x) => parseInt(x, 16) / 255);
const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminance = (h: string) => {
  const [r, g, b] = hex(h).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
/** Composites a translucent foreground over an opaque background. */
const over = (fg: string, bg: string, alpha: number) => {
  const F = hex(fg);
  const B = hex(bg);
  return '#' + F.map((c, i) => Math.round((c * alpha + B[i]! * (1 - alpha)) * 255)
    .toString(16).padStart(2, '0')).join('');
};

const P = {
  base: '#060D18',
  surface: '#0E1A2B',
  surface2: '#16243A',
  ink: '#F2F5F8',
  muted: '#93A3B8',
  accent: '#FF5A1F',
  blue: '#3B82F6',
  blueLight: '#7FB0FF',
  paper: '#F4F1EC',
  paperInk: '#0B1522',
  paperMuted: '#4A5A6E',
  flag: '#FFB020',
};

const AA = 4.5;

const pairs: [string, string, string][] = [
  ['body text on base', P.ink, P.base],
  ['body text on surface', P.ink, P.surface],
  ['muted on base', P.muted, P.base],
  ['muted on surface', P.muted, P.surface],
  ['muted on surface-2', P.muted, P.surface2],
  ['accent text on base', P.accent, P.base],
  ['accent text on surface', P.accent, P.surface],
  ['blue link on base', P.blue, P.base],
  ['blue-light link on base', P.blueLight, P.base],
  ['navy label on accent button', P.base, P.accent],
  ['navy on light section', P.paperInk, P.paper],
  ['muted on light section', P.paperMuted, P.paper],
  ['flag chip text on base', P.flag, P.base],
  ['navy on flag chip', P.base, P.flag],
];

for (const [label, fg, bg] of pairs) {
  test(`AA: ${label}`, () => {
    const r = ratio(fg, bg);
    assert.ok(r >= AA, `${label} is ${r.toFixed(2)}:1, needs ${AA}:1`);
  });
}

test('white on the accent is NOT used, because it fails AA', () => {
  // Documents why accent buttons carry navy text rather than white.
  assert.ok(ratio(P.ink, P.accent) < AA);
});

test('translucent text variants used in the UI still pass AA', () => {
  for (const [label, fg, bg, alpha] of [
    ['text-ink/90 on base', P.ink, P.base, 0.9],
    ['text-base/90 on accent', P.base, P.accent, 0.9],
  ] as [string, string, string, number][]) {
    const r = ratio(over(fg, bg, alpha), bg);
    assert.ok(r >= AA, `${label} is ${r.toFixed(2)}:1`);
  }
});

test('text-muted below 75% opacity fails, so it must not be reintroduced', () => {
  assert.ok(ratio(over(P.muted, P.base, 0.6), P.base) < AA);
  assert.ok(ratio(over(P.muted, P.base, 0.7), P.base) < AA);
  assert.ok(ratio(over(P.muted, P.base, 0.75), P.base) >= AA);
});
