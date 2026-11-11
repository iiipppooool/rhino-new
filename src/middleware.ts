import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and image files, so the auth cookie is
     * refreshed on normal navigation without running on every asset request.
     */
    '/((?!_next/static|_next/image|favicon.ico|photos/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|xml|txt)$).*)',
  ],
};
