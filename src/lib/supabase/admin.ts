import 'server-only';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { requireServiceRoleKey } from '@/lib/env';

/**
 * Service-role client. Bypasses RLS entirely.
 *
 * SERVER ONLY. The 'server-only' import above makes importing this from a
 * client component a build error, so the key can never reach the browser.
 *
 * Only used for work the public must be able to trigger but never read:
 * inserting a validated enquiry, and the rate limiter.
 */
export function createAdminClient() {
  const { url, serviceKey } = requireServiceRoleKey();
  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
