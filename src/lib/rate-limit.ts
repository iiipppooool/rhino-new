import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Per-identifier rate limiting, held in Postgres.
 *
 * An in-memory counter is useless here: Vercel runs each request in its own
 * isolate, so a module-level Map resets constantly and is not shared between
 * concurrent instances. The database is the only shared state we have.
 */
export async function checkRateLimit(opts: {
  bucket: string;
  identifier: string;
  limit: number;
  windowSeconds: number;
}): Promise<{ allowed: boolean; degraded: boolean }> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc('bump_rate_limit', {
      p_bucket: opts.bucket,
      p_identifier: opts.identifier,
      p_limit: opts.limit,
      p_window: `${opts.windowSeconds} seconds`,
    });

    if (error) {
      // Fail open rather than block real enquiries if the limiter is broken,
      // but say so to the caller so it can be logged.
      console.error('[rate-limit] rpc failed, failing open:', error.message);
      return { allowed: true, degraded: true };
    }
    return { allowed: data === true, degraded: false };
  } catch (err) {
    console.error('[rate-limit] unavailable, failing open:', err);
    return { allowed: true, degraded: true };
  }
}

/**
 * Best-effort client IP. Vercel sets x-forwarded-for; the left-most entry is
 * the client. Headers are spoofable, so this is one signal among several
 * (honeypot, Turnstile), never the only defence.
 */
export function clientIp(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return headers.get('x-real-ip')?.trim() || 'unknown';
}
