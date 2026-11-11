/**
 * Cookie consent.
 *
 * UK rules, and why this is built the way it is:
 *
 * - PECR regulation 6 requires opt-in consent BEFORE any non-essential cookie
 *   or similar technology is set. So nothing tracking loads until a choice is
 *   made. Defaults are off, not on.
 * - The ICO has said plainly that refusing must be as easy as accepting, so
 *   "Reject all" is the same size and prominence as "Accept all", not a link.
 * - Consent must be withdrawable as easily as it was given, so the footer
 *   carries a permanent "Cookie settings" control.
 * - Consent must be demonstrable, so we store what was agreed, when, and which
 *   version of the categories it applied to.
 *
 * The consent cookie itself is strictly necessary: it exists only to remember
 * a choice the visitor made, so it does not require consent of its own.
 */

export const CONSENT_COOKIE = 'vrhino_consent';

/** Bump when the categories change, which invalidates stored consent. */
export const CONSENT_VERSION = 1;

/** Six months, after which we ask again rather than assume consent persists. */
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 182;

export type ConsentCategories = {
  /** Page views, traffic sources, which pages work. */
  analytics: boolean;
  /** Advertising and remarketing pixels. */
  marketing: boolean;
};

export type ConsentRecord = ConsentCategories & {
  v: number;
  /** ISO timestamp of the decision, kept so consent can be evidenced. */
  ts: string;
};

export const DENY_ALL: ConsentCategories = { analytics: false, marketing: false };
export const ALLOW_ALL: ConsentCategories = { analytics: true, marketing: true };

export const CATEGORIES: {
  id: keyof ConsentCategories | 'necessary';
  name: string;
  body: string;
  locked?: boolean;
}[] = [
  {
    id: 'necessary',
    name: 'Strictly necessary',
    body:
      'Needed for the site to work. Remembers this cookie choice, keeps the enquiry form secure, and keeps a VRhino administrator signed in. These cannot be switched off and do not require consent.',
    locked: true,
  },
  {
    id: 'analytics',
    name: 'Analytics',
    body:
      'Helps us see which pages people use and where visitors come from, so we can make the site better. Switched off, we still count page views in a way that cannot identify you.',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    body:
      'Lets us measure which adverts bring people to us, and show VRhino adverts to people who have visited before. These cookies can follow you to other websites.',
  },
];

export function parseConsent(raw: string | undefined | null): ConsentRecord | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<ConsentRecord>;
    if (parsed.v !== CONSENT_VERSION) return null;
    if (typeof parsed.analytics !== 'boolean' || typeof parsed.marketing !== 'boolean') return null;
    return {
      v: CONSENT_VERSION,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      ts: typeof parsed.ts === 'string' ? parsed.ts : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function serialiseConsent(categories: ConsentCategories): string {
  const record: ConsentRecord = { v: CONSENT_VERSION, ...categories, ts: new Date().toISOString() };
  return encodeURIComponent(JSON.stringify(record));
}

/** Reads the consent cookie in the browser. Returns null if no choice was made. */
export function readConsentCookie(): ConsentRecord | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${CONSENT_COOKIE}=`));
  return parseConsent(match?.slice(CONSENT_COOKIE.length + 1));
}

export function writeConsentCookie(categories: ConsentCategories) {
  if (typeof document === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    `${CONSENT_COOKIE}=${serialiseConsent(categories)}` +
    `; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

/**
 * Deletes cookies a withdrawn category had set.
 *
 * Withdrawing consent has to actually remove what was dropped, otherwise the
 * tracking carries on and the choice is cosmetic. Third-party cookies set on
 * another domain cannot be removed from here; those stop being sent new data
 * because the script no longer loads, and the privacy policy says so.
 */
export function clearCategoryCookies(category: keyof ConsentCategories) {
  if (typeof document === 'undefined') return;

  const prefixes: Record<keyof ConsentCategories, string[]> = {
    analytics: ['_ga', '_gid', '_gat'],
    marketing: ['_fbp', '_fbc', '_gcl_au'],
  };

  const host = window.location.hostname;
  // A cookie must be deleted with the same domain and path it was set with,
  // and we do not know which the vendor used, so try the plausible ones.
  const domains = [undefined, host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`];

  for (const name of document.cookie.split('; ').map((c) => c.split('=')[0] ?? '')) {
    // Exact name, or the vendor's own suffix form such as _ga_<CONTAINER> and
    // _gat_gtag_<ID>. A bare startsWith would also sweep up unrelated cookies
    // that merely begin with the same letters.
    if (!prefixes[category].some((p) => name === p || name.startsWith(`${p}_`))) {
      continue;
    }
    for (const domain of domains) {
      document.cookie =
        `${name}=; Path=/; Max-Age=0; SameSite=Lax` + (domain ? `; Domain=${domain}` : '');
    }
  }
}
