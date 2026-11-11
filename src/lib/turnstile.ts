import 'server-only';

import { turnstileSecret } from '@/lib/env';

/**
 * Verifies a Cloudflare Turnstile token.
 *
 * If no secret is configured the check is skipped and reported as `skipped`,
 * so a missing key shows up in logs rather than silently disabling the
 * protection while appearing to pass.
 */
export async function verifyTurnstile(
  token: string | undefined,
  ip: string,
): Promise<{ ok: boolean; skipped: boolean; reason?: string }> {
  if (!turnstileSecret) {
    console.warn('[turnstile] TURNSTILE_SECRET_KEY is not set. Spam check skipped.');
    return { ok: true, skipped: true };
  }
  if (!token) return { ok: false, skipped: false, reason: 'missing-token' };

  try {
    const body = new URLSearchParams({ secret: turnstileSecret, response: token });
    if (ip && ip !== 'unknown') body.set('remoteip', ip);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(8000),
    });

    const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] };
    return {
      ok: data.success === true,
      skipped: false,
      reason: data['error-codes']?.join(',') ,
    };
  } catch (err) {
    // A Cloudflare outage should not silently let every bot through, but it
    // should also not block every genuine enquiry. Allow, and log loudly.
    console.error('[turnstile] verification failed, allowing through:', err);
    return { ok: true, skipped: true, reason: 'verifier-unreachable' };
  }
}
