'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireStaff, requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const statusSchema = z.enum(['new', 'replied', 'booked', 'closed']);

export async function updateEnquiry(formData: FormData) {
  // Checked here as well as in the layout: this is a POST endpoint of its own.
  await requireStaff();

  const id = z.uuid().safeParse(formData.get('id'));
  if (!id.success) return;

  const status = statusSchema.safeParse(formData.get('status'));
  const notes = formData.get('internal_notes');

  const patch: Record<string, unknown> = {};
  if (status.success) patch.status = status.data;
  if (typeof notes === 'string') patch.internal_notes = notes.slice(0, 10_000) || null;
  if (Object.keys(patch).length === 0) return;

  const supabase = await createClient();
  const { error } = await supabase.from('enquiries').update(patch).eq('id', id.data);
  if (error) console.error('[enquiries] update failed:', error.message);

  revalidatePath('/admin/enquiries');
  revalidatePath(`/admin/enquiries/${id.data}`);
}

/**
 * Deleting is admin-only, and is the mechanism for honouring a deletion
 * request under UK GDPR. The RLS policy enforces this as well.
 */
export async function deleteEnquiry(formData: FormData) {
  await requireAdmin();

  const id = z.uuid().safeParse(formData.get('id'));
  if (!id.success) return;

  const supabase = await createClient();
  const { error } = await supabase.from('enquiries').delete().eq('id', id.data);
  if (error) console.error('[enquiries] delete failed:', error.message);

  revalidatePath('/admin/enquiries');
  redirect('/admin/enquiries?deleted=1');
}
