import 'server-only';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { requireSupabasePublic } from '@/lib/env';

/**
 * Request-scoped client that carries the signed-in user's session.
 * Every query through this client is subject to RLS.
 */
export async function createClient() {
  const { url, anonKey } = requireSupabasePublic();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component. The middleware refreshes the
          // session cookie instead, so this is safe to ignore.
        }
      },
    },
  });
}
