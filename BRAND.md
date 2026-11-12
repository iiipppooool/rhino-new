# Brand assets

Source artwork supplied by VRhino: a rhino head in profile wearing a blue VR
visor, with a "VRhino" wordmark. It arrived as a single 1024x1024 PNG on a
white background with no alpha channel.

## What was done to it

**Background removed.** Flood filled from the four corners only, so white
highlights inside the horn and visor survived. A global white-to-alpha would
have punched holes through the artwork. Enclosed white regions a corner fill
cannot reach, such as the counter of the "o", were then cleared separately.

**Split into parts.** `mark.png` is the head alone. `lockup.png` is the full
logo including the wordmark. Icons use a tighter head-only crop, because the
full mark is 563x394 and at 16px that wastes nearly half the canvas on the
neck sweep.

**Palette reduced** to 128 colours, which cut the set from roughly 800KB to
200KB with no visible change on flat artwork. The Open Graph card is JPEG,
since a social card never needs transparency.

## Files

| File | Used for |
| --- | --- |
| `public/brand/mark.png` | The header, footer and admin logo |
| `public/brand/lockup.png` | Full logo for light backgrounds, email, print |
| `public/brand/icon-32/48/192/512.png` | Favicons and PWA icons |
| `public/apple-touch-icon.png` | iOS home screen, 180px |
| `src/app/favicon.ico` | Multi-resolution, 16 / 32 / 48 |
| `public/brand/og.jpg` | Social sharing card, 1200x630 |

## Two decisions worth knowing

**The wordmark is live text, not artwork.** The supplied wordmark sets "hino"
in dark navy, which measures about 1.3:1 against the site background and is
effectively invisible there. `src/components/ui/logo.tsx` renders the mark as
artwork and the word as Space Grotesk, with "VR" in the lighter blue and
"hino" in the off-white. That keeps the original's two-tone treatment, stays
legible on dark, is crisp at any size, and is selectable text for screen
readers and search engines.

Every current placement is on a dark surface, so there is one variant. Add a
light variant in that component before using the lockup on the cream section.

**The 16px favicon is poor, and cannot be fixed from this artwork.** It was
tested, not assumed: at 16px the mark reduces to a blue smear with no
readable silhouette. 32px is borderline, 48px is fine. The tighter head crop
helped measurably but did not solve it, and automated simplification did not
either. The shape is a side profile with a thin horn, so it depends on detail
that does not survive 256 pixels.

This is the trade the original brief warned about when it asked for a flat,
one-colour, favicon-safe mark. The logo is a detailed mascot instead, which is
a legitimate choice, but it needs a **separate simplified glyph for small
sizes**, drawn by whoever made the logo. Something like the horn alone, or the
visor shape, in two flat colours. Drop it in as `icon-16` and add it to the
`icons` list in `src/app/layout.tsx`.

In practice most browsers on modern screens request 32px or larger, so this
affects fewer people than it used to. It is still worth fixing.
