/**
 * Single source of truth for every fact that appears on the site.
 *
 * Anything marked TODO is a fact Claude was NOT given and deliberately did not
 * invent. Each one renders on the page as a visible amber placeholder chip so
 * it cannot ship unnoticed. Replace the value and the chip disappears.
 */

export const TODO = (hint: string) => `TODO:${hint}` as const;
export const isTodo = (v: string | null | undefined): v is string =>
  typeof v === 'string' && v.startsWith('TODO:');
export const todoHint = (v: string) => v.replace(/^TODO:/, '');

export const site = {
  name: 'VRhino',
  legalName: 'VRHINO LIMITED',

  /**
   * Verified against Companies House on 2026-11-11.
   * https://find-and-update.company-information.service.gov.uk/company/16965400
   * Status: Active. Incorporated 15 January 2026.
   * Note: the official record includes "5th Floor", which the original brief omitted.
   */
  companyNumber: '16965400',
  registeredOffice: '167-169 Great Portland Street, 5th Floor, London, England, W1W 5PF',
  incorporatedOn: '15 January 2026',
  jurisdiction: 'Registered in England and Wales',

  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vrhino.org',

  // --- Facts not supplied in the brief -------------------------------------
  email: TODO('contact email'),
  phone: TODO('phone, or set to null to remove'),
  social: {
    instagram: TODO('Instagram URL, or null to remove'),
    tiktok: TODO('TikTok URL, or null to remove'),
  },
  founders: [
    { name: TODO('founder 1 name'), role: 'Co-founder' },
    { name: TODO('founder 2 name'), role: 'Co-founder' },
  ],
  replyWithinWorkingDays: TODO('number of working days to reply'),
  ageGuidance: TODO('confirmed age guidance'),
  sessionDuration: TODO('confirmed event duration'),
  // -------------------------------------------------------------------------

  mission:
    'Help young people build confidence, fitness and discipline through safe, accessible VR.',

  values: [
    { name: 'Safety', body: 'No contact. Supervised sessions. Kit cleaned between users.' },
    { name: 'Accessibility', body: 'We bring the kit to you, so cost and travel stop fewer people taking part.' },
    { name: 'Discipline', body: 'Technique and repetition, not button mashing.' },
    { name: 'Innovation', body: 'We use VR where it genuinely teaches something, and say so when it does not.' },
    { name: 'Community', body: 'Built for youth clubs, schools and gyms, not just for people who can afford a headset.' },
  ],
} as const;

export type SiteConfig = typeof site;
