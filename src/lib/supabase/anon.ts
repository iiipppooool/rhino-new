import 'server-only';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey, isSupabaseConfigured } from '@/lib/env';

/**
 * Cookie-free anon client for public, non-personalised reads.
 *
 * The request-scoped client in ./server.ts calls `cookies()`, which cannot be
 * used during static generation: `generateStaticParams`, `sitemap.ts` and the
 * RSS route all run without a request. Those paths use this instead.
 *
 * It carries the anon key, so Row Level Security still applies in full. It
 * simply has no user session attached, which is correct for the public blog.
 */
export function createAnonClient() {
  if (!isSupabaseConfigured) return null;
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
