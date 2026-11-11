'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured, siteUrl } from '@/lib/env';

export type AuthState = { error?: string; notice?: string };

const credentials = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
});

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) {
    return { error: 'Supabase is not configured on this deployment.' };
  }

  const parsed = credentials.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Check your details.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  // Deliberately vague: never reveal whether an address has an account.
  if (error || !data.user) {
    return { error: 'That email and password combination did not work.' };
  }

  // Authentication is not authorisation. A Supabase user with no profile row
  // is not staff, so sign them straight back out rather than leaving a valid
  // session sitting on an account that cannot do anything.
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', data.user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();
    return { error: 'That account does not have access to the admin area.' };
  }

  const next = formData.get('next');
  const target =
    typeof next === 'string' && next.startsWith('/admin') && !next.startsWith('/admin/login')
      ? next
      : '/admin/posts';

  revalidatePath('/admin', 'layout');
  redirect(target);
}

export async function requestPasswordReset(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) return { error: 'Supabase is not configured on this deployment.' };

  const email = z.email().safeParse(formData.get('email'));
  // Always answer the same way, so this cannot be used to discover accounts.
  const sameAnswer: AuthState = {
    notice: 'If that address has an admin account, a reset link is on its way.',
  };
  if (!email.success) return sameAnswer;

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email.data, {
    // Goes to the callback route, which swaps the one-time code for a
    // session and only then sends the user to the form.
    redirectTo: `${siteUrl}/admin/auth/callback?next=/admin/reset`,
  });
  return sameAnswer;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/admin', 'layout');
  redirect('/admin/login');
}
