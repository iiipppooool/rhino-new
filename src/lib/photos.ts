/**
 * Photo manifest.
 *
 * Every entry here was checked by fetching it: `verified` means the URL
 * returned HTTP 200 AND the image was visually inspected and genuinely shows
 * what the caption claims. Entries with `src: null` are slots where no
 * suitable photo was found. Those render as a marked placeholder rather than
 * an unrelated stock image.
 *
 * Unsplash's licence does not require attribution, but the brief asked for
 * credit. The Unsplash CDN filename does not map back to a photographer, and
 * the search API now needs a key, so `credit` is left null and recorded in
 * PHOTOS.md as outstanding. Add it when you swap these for your own photos.
 */

export type Photo = {
  id: string;
  src: string | null;
  /** Where a placeholder image came from, for provenance. */
  source?: string;
  alt: string;
  /** What this slot needs, for whoever sources the real photo. */
  brief: string;
  credit: { name: string; url: string } | null;
  /** True only if a human-equivalent check confirmed the content matches. */
  verified: boolean;
  /** Temporary stand-in that should be swapped for a real VRhino photo. */
  temporary: boolean;
};

/**
 * Placeholder photos are self-hosted in /public/photos rather than hot-linked.
 * Hot-linking costs an extra third-party connection on LCP and ties the site to
 * a CDN we do not control. Self-hosting also makes the swap trivial: drop a real
 * VRhino photo over the file of the same name and nothing else changes.
 * The Unsplash source is kept below for provenance.
 */
const local = (name: string) => `/photos/${name}.jpg`;

export const photos = {
  hero: {
    id: 'hero',
    src: local('hero'),
    source: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620',
    alt: 'A person wearing a VR headset with both hands raised in a guard position',
    brief: 'Teenager in a headset mid-punch, real venue, motion blur. Replace this studio shot.',
    credit: null,
    verified: true,
    temporary: true,
  },
  parties: {
    id: 'parties',
    src: local('parties'),
    source: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769',
    alt: 'A young person wearing a VR headset laughing during a game',
    brief: 'Birthday or party group, headsets on, people laughing, real room.',
    credit: null,
    verified: true,
    temporary: true,
  },
  boxing: {
    id: 'boxing',
    src: local('boxing'),
    source: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed',
    alt: 'Boxing gloves resting on a bench in a dimly lit gym',
    brief: 'Boxing gym, gloves and wraps, warm practical light.',
    credit: null,
    verified: true,
    temporary: true,
  },
  swim: {
    id: 'swim',
    src: local('swim'),
    source: 'https://images.unsplash.com/photo-1530549387789-4c1017266635',
    alt: 'A swimmer mid-stroke in a marked pool lane',
    brief: 'Pool lane lines, or a swim lesson on poolside.',
    credit: null,
    verified: true,
    temporary: true,
  },
  gym: {
    id: 'gym',
    src: local('gym'),
    source: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5',
    alt: 'A dimly lit gym interior',
    brief: 'Boxing gym interior with a ring or bags, not a weights room.',
    credit: null,
    verified: true,
    temporary: true,
  },

  // --- No suitable photo found. These render as marked placeholders. -------
  schools: {
    id: 'schools',
    src: null,
    alt: '',
    brief: 'School sports hall or youth club, teenagers taking part, supervising adult in frame.',
    credit: null,
    verified: false,
    temporary: false,
  },
  coaching: {
    id: 'coaching',
    src: null,
    alt: '',
    brief: 'Coach working one to one with a young boxer, pads or shadow work.',
    credit: null,
    verified: false,
    temporary: false,
  },
  corporate: {
    id: 'corporate',
    src: null,
    alt: '',
    brief: 'Adults at a work social or open day taking turns on a headset.',
    credit: null,
    verified: false,
    temporary: false,
  },
  founderOne: {
    id: 'founderOne',
    src: null,
    alt: '',
    brief: 'Portrait of co-founder one.',
    credit: null,
    verified: false,
    temporary: false,
  },
  founderTwo: {
    id: 'founderTwo',
    src: null,
    alt: '',
    brief: 'Portrait of co-founder two.',
    credit: null,
    verified: false,
    temporary: false,
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
