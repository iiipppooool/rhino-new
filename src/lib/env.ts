/**
 * Environment access.
 *
 * Supabase is optional at build time so the marketing site can be built and
 * previewed before the database exists. Anything that genuinely needs a key
 * calls the `require*` helpers, which throw a clear error at the point of use
 * rather than failing an unrelated build step.
 */

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function requireSupabasePublic() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }
  return { url: supabaseUrl, anonKey: supabaseAnonKey };
}

/** Server-only. Never import this from a client component. */
export function requireServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set.');
  if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set.');
  return { url: supabaseUrl, serviceKey: key };
}

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vrhino.org';
export const notifyEmail = process.env.NOTIFY_EMAIL ?? '';
export const resendApiKey = process.env.RESEND_API_KEY ?? '';
export const fromEmail = process.env.FROM_EMAIL ?? 'VRhino <noreply@vrhino.org>';
export const turnstileSecret = process.env.TURNSTILE_SECRET_KEY ?? '';
export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

/**
 * Tracking IDs. Both optional: with neither set, nothing is injected and the
 * consent banner still works. Nothing loads before consent either way.
 */
export const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '';
export const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';
