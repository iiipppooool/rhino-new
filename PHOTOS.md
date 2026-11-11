# Photography

Every image on the site is either a real photo listed here or a visible
"Photo needed" placeholder. Nothing is AI generated, and no image was used
just to fill a gap.

## How to replace one

Drop a new file over the matching name in `public/photos/` and redeploy.
Nothing else changes. The slot sizes are in `src/lib/photos.ts`.

| File | Used on | What it should show |
| --- | --- | --- |
| `hero.jpg` | Home hero | Teenager in a headset mid punch, real venue, motion blur |
| `parties.jpg` | Home, Events | A party group, headsets on, people laughing, real room |
| `boxing.jpg` | Home, VR boxing | Boxing gym, gloves and wraps, warm practical light |
| `swim.jpg` | Home, Schools | Pool lane lines, or a swim lesson on poolside |
| `gym.jpg` | Home, VR boxing | Boxing gym interior with a ring or bags |

## Currently placeholders, nothing shipped

These render as hatched "Photo needed" blocks on the live site. No suitable
stock photo was found, so none was used.

- **Schools** — school sports hall or youth club, teenagers taking part, a supervising adult in frame
- **Coaching** — coach working one to one with a young boxer, pads or shadow work
- **Corporate** — adults at a work social or open day taking turns on a headset
- **Founder one** — portrait
- **Founder two** — portrait

## About the current stock images

All five were verified: the URL returned HTTP 200 and the image was looked at
to confirm it shows what the caption claims. They are still **temporary**.

Two caveats worth knowing:

- `hero.jpg` is a posed studio shot on a lavender background. It is graded
  heavily towards navy in CSS so it sits in the palette. A real photo of a
  VRhino session will be better.
- `gym.jpg` is a weights room, not a boxing gym. It works as texture behind
  the gyms section but it is not on brief. Replace it when you have a photo
  of an actual boxing gym.

Source URLs are recorded in the `source` field of each entry in
`src/lib/photos.ts`.

## Credits

Unsplash's licence does not require attribution. The brief asked for
photographer credits anyway, and these are **outstanding**: the Unsplash CDN
filename does not map back to a photographer, and their search API now needs
an API key, so the names could not be looked up.

If you keep any of these images, find the photographer on unsplash.com and add
them to the `credit` field in `src/lib/photos.ts`. The footer picks it up
automatically. If you replace them all with VRhino photography, the question
goes away.

## Rules

- Real photos only. No AI generated images, no 3D renders of glowing headsets,
  no neon brains, no abstract blobs, no stock models pretending to be customers.
- Prefer real light, motion blur and natural expressions over posed studio shots.
- Every image carries `data-replace="true"` so you can find them all in the DOM.
