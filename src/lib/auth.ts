import 'server-only';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env';

export type Staff = {
  id: string;
  email: string;
  fullName: string | null;
  role: 'admin' | 'editor';
};

/**
 * The single server-side gate for admin access.
 *
 * Called by the admin layout AND independently by every admin server action.
 * Middleware is a convenience redirect, not a security boundary: a server
 * action can be invoked directly over HTTP without ever passing through it.
 */
export async function getStaff(): Promise<Staff | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();

  // getUser() revalidates the JWT with Supabase. getSession() only reads the
  // cookie, which a client could forge, so it must not be used for authorisation.
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, role')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) return null;

  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    role: profile.role,
  };
}

/** Throws the caller out to the login page unless they are staff. */
export async function requireStaff(): Promise<Staff> {
  const staff = await getStaff();
  if (!staff) redirect('/admin/login');
  return staff;
}

/** Admin-only operations, such as deleting an enquiry. */
export async function requireAdmin(): Promise<Staff> {
  const staff = await requireStaff();
  if (staff.role !== 'admin') redirect('/admin?error=admin-only');
  return staff;
}
