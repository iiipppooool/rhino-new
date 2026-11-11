'use client';

import { createBrowserClient } from '@supabase/ssr';
import { requireSupabasePublic } from '@/lib/env';

export function createClient() {
  const { url, anonKey } = requireSupabasePublic();
  return createBrowserClient(url, anonKey);
}
