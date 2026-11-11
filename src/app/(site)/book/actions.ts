'use server';

import { headers } from 'next/headers';
import { enquirySchema } from '@/lib/schemas';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit, clientIp } from '@/lib/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';
import { sendEnquiryNotification, sendEnquiryAcknowledgement } from '@/lib/email';
import { site, isTodo } from '@/config/site';
import { isSupabaseConfigured } from '@/lib/env';

export type EnquiryState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const raw = Object.fromEntries(formData.entries()) as Record<string, unknown>;

  // Checkboxes only appear in FormData when ticked.
  raw.over18_or_org = formData.get('over18_or_org') === 'on';
  raw.privacy_accepted = formData.get('privacy_accepted') === 'on';
  raw.marketing_opt_in = formData.get('marketing_opt_in') === 'on';

  // 1. Honeypot. A real browser never fills a hidden field. Answer as though
  // it succeeded so a bot cannot tell it was caught.
  if (typeof raw.website === 'string' && raw.website.trim() !== '') {
    return { status: 'success' };
  }

  // 2. Validate. Same schema the client uses, re-run on the server, because
  // the client check is a convenience and can be bypassed entirely.
  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.') || 'form';
      fieldErrors[key] ??= issue.message;
    }
    return {
      status: 'error',
      message: 'Some details need another look.',
      fieldErrors,
    };
  }
  const data = parsed.data;

  const hdrs = await headers();
  const ip = clientIp(hdrs);

  // 3. Rate limit per IP.
  const rl = await checkRateLimit({
    bucket: 'enquiry',
    identifier: ip,
    limit: 5,
    windowSeconds: 60 * 60,
  });
  if (!rl.allowed) {
    return {
      status: 'error',
      message: 'That is a few enquiries in a short time. Please try again later, or email us directly.',
    };
  }

  // 4. Turnstile.
  const turnstile = await verifyTurnstile(data.turnstileToken, ip);
  if (!turnstile.ok) {
    return {
      status: 'error',
      message: 'We could not verify that you are human. Please refresh the page and try again.',
    };
  }

  if (!isSupabaseConfigured) {
    return {
      status: 'error',
      message: 'The enquiry form is not connected yet. Please email us instead.',
    };
  }

  // 5. Save. Service role, because the public has no RLS policy on this table.
  const supabase = createAdminClient();
  const { data: inserted, error } = await supabase
    .from('enquiries')
    .insert({
      type: data.type,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      organisation: data.organisation ?? null,
      service: data.type === 'general' ? null : data.service,
      preferred_date: data.type === 'general' ? null : data.preferred_date,
      backup_date: data.type === 'general' ? null : (data.backup_date ?? null),
      start_time: data.type === 'general' ? null : (data.start_time ?? null),
      group_size: data.type === 'general' ? null : data.group_size,
      age_range: data.type === 'general' ? null : data.age_range,
      venue_postcode: data.type === 'general' ? null : data.venue_postcode,
      source: data.type === 'general' ? null : (data.source ?? null),
      message: data.message,
      over18_or_org: data.over18_or_org,
      privacy_accepted: data.privacy_accepted,
      marketing_opt_in: data.marketing_opt_in,
    })
    .select('id')
    .single();

  if (error || !inserted) {
    console.error('[enquiry] insert failed:', error?.message);
    return {
      status: 'error',
      message: 'Something went wrong saving your enquiry. Please try again, or email us directly.',
    };
  }

  // 6. Email. The enquiry is already saved, so a mail failure must not be
  // reported to the visitor as a failed submission.
  const replyWithin = isTodo(site.replyWithinWorkingDays)
    ? 'a few'
    : site.replyWithinWorkingDays;

  await Promise.allSettled([
    sendEnquiryNotification(data, inserted.id),
    sendEnquiryAcknowledgement(data, replyWithin),
  ]);

  return { status: 'success' };
}
