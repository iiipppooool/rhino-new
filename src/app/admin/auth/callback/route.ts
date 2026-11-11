import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env';

/**
 * Exchanges the one-time code in a Supabase email link for a session.
 *
 * Password reset emails land here. Without this route the link in the email
 * resolved to a 404 and reset was impossible.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const errorDescription = searchParams.get('error_description');

  const fail = (reason: string) =>
    NextResponse.redirect(new URL(`/admin/login?error=${reason}`, origin));

  if (errorDescription || !code || !isSupabaseConfigured) return fail('link-invalid');

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) return fail('link-expired');

  // Authentication is not authorisation. A valid link for an account with no
  // profile row must not create a usable admin session.
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', data.user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();
    return fail('no-access');
  }

  // Only ever redirect to our own admin paths, never to a URL from the query
  // string, which would make this an open redirect.
  const next = searchParams.get('next');
  const target = next && /^\/admin(\/|$)/.test(next) && !next.startsWith('/admin/login')
    ? next
    : '/admin/posts';

  return NextResponse.redirect(new URL(target, origin));
}
