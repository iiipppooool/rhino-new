import 'server-only';

import { Resend } from 'resend';
import { resendApiKey, notifyEmail, fromEmail, siteUrl } from '@/lib/env';
import type { EnquiryParsed } from '@/lib/schemas';

const resend = resendApiKey ? new Resend(resendApiKey) : null;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const TYPE_LABEL: Record<EnquiryParsed['type'], string> = {
  prebook: 'Pre-booking request',
  service: 'Service request',
  general: 'General question',
};

function detailRows(e: EnquiryParsed) {
  const rows: [string, string | undefined][] = [
    ['Type', TYPE_LABEL[e.type]],
    ['Name', e.name],
    ['Email', e.email],
    ['Phone', e.phone],
    ['Organisation', e.organisation],
  ];
  if (e.type !== 'general') {
    rows.push(
      ['Service', e.service],
      ['Preferred date', e.preferred_date],
      ['Backup date', e.backup_date],
      ['Start time', e.start_time],
      ['Group size', e.group_size != null ? String(e.group_size) : undefined],
      ['Age range', e.age_range],
      ['Venue postcode', e.venue_postcode],
      ['Heard about us', e.source],
    );
  }
  rows.push(['Marketing opt in', e.marketing_opt_in ? 'Yes' : 'No']);
  return rows.filter(([, v]) => v != null && v !== '') as [string, string][];
}

/** Notifies VRhino. Returns false rather than throwing: the enquiry is saved either way. */
export async function sendEnquiryNotification(e: EnquiryParsed, id: string): Promise<boolean> {
  if (!resend || !notifyEmail) {
    console.warn('[email] RESEND_API_KEY or NOTIFY_EMAIL missing. Notification not sent.');
    return false;
  }
  try {
    const rows = detailRows(e)
      .map(([k, v]) => `<tr><td style="padding:6px 14px 6px 0;color:#667;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0"><strong>${esc(v)}</strong></td></tr>`)
      .join('');

    await resend.emails.send({
      from: fromEmail,
      to: notifyEmail,
      replyTo: e.email,
      subject: `${TYPE_LABEL[e.type]} from ${e.name}`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:640px">
        <h2 style="margin:0 0 4px">${esc(TYPE_LABEL[e.type])}</h2>
        <p style="margin:0 0 18px;color:#667">Received ${new Date().toLocaleString('en-GB')}</p>
        <table style="border-collapse:collapse;font-size:14px">${rows}</table>
        <h3 style="margin:22px 0 6px">Message</h3>
        <p style="white-space:pre-wrap;line-height:1.6;margin:0">${esc(e.message)}</p>
        <p style="margin-top:24px"><a href="${siteUrl}/admin/enquiries/${id}">Open in admin</a></p>
      </div>`,
    });
    return true;
  } catch (err) {
    console.error('[email] notification failed:', err);
    return false;
  }
}

/** Confirms receipt to the enquirer. Makes clear this is not a confirmed booking. */
export async function sendEnquiryAcknowledgement(
  e: EnquiryParsed,
  replyWithin: string,
): Promise<boolean> {
  if (!resend) {
    console.warn('[email] RESEND_API_KEY missing. Acknowledgement not sent.');
    return false;
  }
  try {
    const isBooking = e.type !== 'general';
    await resend.emails.send({
      from: fromEmail,
      to: e.email,
      subject: isBooking ? 'We have got your request' : 'We have got your message',
      html: `<div style="font-family:system-ui,sans-serif;max-width:560px;line-height:1.6">
        <p>Hi ${esc(e.name.split(' ')[0] ?? e.name)},</p>
        <p>Thanks for getting in touch with VRhino. We have got your ${isBooking ? 'request' : 'message'} and we will reply within ${esc(replyWithin)} working days.</p>
        ${isBooking ? `<p style="padding:12px 16px;background:#FFF4E5;border-left:3px solid #FF5A1F;margin:18px 0"><strong>This is a request, not a confirmed booking.</strong> Nothing is held in the diary until we write back and confirm the date with you.</p>` : ''}
        <p>What you sent us:</p>
        <blockquote style="margin:0;padding:0 0 0 14px;border-left:2px solid #ddd;color:#555;white-space:pre-wrap">${esc(e.message)}</blockquote>
        <p style="margin-top:22px;color:#667;font-size:13px">VRhino, ${esc(siteUrl.replace(/^https?:\/\//, ''))}</p>
      </div>`,
    });
    return true;
  } catch (err) {
    console.error('[email] acknowledgement failed:', err);
    return false;
  }
}
