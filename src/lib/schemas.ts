import { z } from 'zod';

export const ENQUIRY_TYPES = ['prebook', 'service', 'general'] as const;
export const SERVICES = ['Party', 'Corporate', 'School or youth', 'Gym', 'Swim'] as const;

const trimmed = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) =>
  trimmed(max).optional().transform((v) => (v === '' ? undefined : v));

/** Rejects a date in the past, allowing for the visitor's timezone. */
const futureDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the date picker.')
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    if (Number.isNaN(d.getTime())) return false;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return d.getTime() >= today.getTime() - 86_400_000;
  }, 'Pick a date in the future.');

const base = z.object({
  name: trimmed(120).min(2, 'Tell us your name.'),
  email: z.email('That email address does not look right.').max(254),
  phone: optionalText(40),
  organisation: optionalText(160),
  message: trimmed(4000).min(10, 'A sentence or two is plenty, but we need something.'),

  over18_or_org: z.literal(true, {
    message: 'You need to confirm this to send an enquiry.',
  }),
  privacy_accepted: z.literal(true, {
    message: 'Please accept the privacy policy.',
  }),
  marketing_opt_in: z.boolean().default(false),

  // Anti-spam. Both are stripped before the record is saved. The honeypot is
  // not named website/url/phone, because autofill fills those and a real
  // enquiry would then be discarded as spam.
  vr_site_ref: z.string().max(0, 'Rejected.').optional(),
  turnstileToken: z.string().optional(),
});

/** Extra fields shared by the two booking-shaped intents. */
const bookingDetails = {
  service: z.enum(SERVICES, { message: 'Pick a service.' }),
  preferred_date: futureDate,
  backup_date: futureDate.optional().or(z.literal('').transform(() => undefined)),
  start_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Use the time picker.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  group_size: z.coerce
    .number({ message: 'Roughly how many people?' })
    .int('Whole numbers only.')
    .min(1, 'At least one person.')
    .max(10_000, 'That is more people than we can bring headsets for.'),
  age_range: trimmed(80).min(1, 'Roughly what ages?'),
  venue_postcode: trimmed(12)
    .min(2, 'We need a postcode to work out travel.')
    .regex(
      /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d?[A-Za-z]{0,2}$/,
      'That does not look like a UK postcode.',
    ),
  source: optionalText(160),
};

export const enquirySchema = z.discriminatedUnion('type', [
  base.extend({ type: z.literal('prebook'), ...bookingDetails }),
  base.extend({ type: z.literal('service'), ...bookingDetails }),
  base.extend({ type: z.literal('general') }),
]);

export type EnquiryInput = z.input<typeof enquirySchema>;
export type EnquiryParsed = z.output<typeof enquirySchema>;

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------
export const slugSchema = z
  .string()
  .trim()
  .min(1, 'A slug is required.')
  .max(120)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Lower case letters, numbers and hyphens only.');

export const postSchema = z.object({
  title: z.string().trim().min(3, 'Give the post a title.').max(200),
  slug: slugSchema,
  excerpt: z.string().trim().max(400).optional().or(z.literal('')),
  cover_image_url: z.string().trim().url('That is not a valid URL.').optional().or(z.literal('')),
  tags: z.array(z.string().trim().min(1).max(40)).max(8).default([]),
  body: z.unknown(),
  status: z.enum(['draft', 'published']),
});

export type PostInput = z.input<typeof postSchema>;

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}
