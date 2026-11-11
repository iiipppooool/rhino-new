'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getStaff } from '@/lib/auth';

export type ResetState = { error?: string };

const schema = z
  .object({
    password: z
      .string()
      .min(12, 'Use at least 12 characters. Length beats complexity.')
      .max(200),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: 'The two passwords do not match.',
    path: ['confirm'],
  });

export async function setNewPassword(_prev: ResetState, formData: FormData): Promise<ResetState> {
  // The link created a session, but only staff may use it to change a password.
  const staff = await getStaff();
  if (!staff) return { error: 'That reset link is no longer valid. Request a new one.' };

  const parsed = schema.safeParse({
    password: formData.get('password'),
    confirm: formData.get('confirm'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Check the passwords.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: error.message };

  redirect('/admin/posts');
}
