import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { isSupabaseConfigured, supabaseUrl, supabaseAnonKey } from '@/lib/env';

/**
 * Refreshes the auth cookie on every request and bounces logged-out visitors
 * away from /admin. This is a redirect for convenience. The real authorisation
 * check is `requireStaff()`, called inside the admin layout and inside every
 * admin server action.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginRoute = request.nextUrl.pathname.startsWith('/admin/login');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/admin/auth');

  if (!isSupabaseConfigured) {
    // Without a database there is nothing to protect and no way to sign in.
    // Fail closed: block admin pages rather than rendering them unguarded.
    if (isAdminRoute && !isLoginRoute) {
      return NextResponse.redirect(new URL('/admin/login?error=not-configured', request.url));
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (isAdminRoute && !isLoginRoute && !isAuthRoute && !user) {
    const url = new URL('/admin/login', request.url);
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && user) {
    return NextResponse.redirect(new URL('/admin/posts', request.url));
  }

  return response;
}
