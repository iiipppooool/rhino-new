'use client';

import { useActionState, useEffect, useId, useRef, useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { submitEnquiry, type EnquiryState } from '@/app/(site)/book/actions';
import { SERVICES } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { site, isTodo } from '@/config/site';
import { Todo } from '@/components/ui/placeholder';

type Intent = 'prebook' | 'service' | 'general';

const INTENTS: { id: Intent; label: string; blurb: string }[] = [
  { id: 'prebook', label: 'Pre-book a date', blurb: 'You have a date in mind and want to hold it.' },
  { id: 'service', label: 'Request a service', blurb: 'You know what you want but not when yet.' },
  { id: 'general', label: 'General question', blurb: 'Anything else.' },
];

const field =
  'w-full rounded-lg border bg-surface px-4 py-3 text-ink placeholder:text-muted/60 transition-colors focus:border-blue focus:outline-none';

function Field({
  label, name, error, children, hint, required,
}: {
  label: string; name: string; error?: string; children: React.ReactNode; hint?: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-1 text-accent" aria-hidden="true">*</span>}
        {!required && <span className="ml-1.5 text-xs font-normal text-muted">(optional)</span>}
      </label>
      {hint && <p className="mb-1.5 text-xs text-muted">{hint}</p>}
      {children}
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1.5 flex items-start gap-1.5 text-sm text-accent">
          <span aria-hidden="true">▲</span>{error}
        </p>
      )}
    </div>
  );
}

export function EnquiryForm({ turnstileSiteKey }: { turnstileSiteKey: string }) {
  const [intent, setIntent] = useState<Intent>('prebook');
  const [state, formAction, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, {
    status: 'idle',
  });
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const widgetId = useId();
  const showBookingFields = intent !== 'general';
  const err = state.fieldErrors ?? {};
  const inputCls = (n: string) => `${field} ${err[n] ? 'border-accent' : 'border-line'}`;

  useEffect(() => {
    if (state.status === 'error') errorRef.current?.focus();
    if (state.status === 'success') successRef.current?.focus();
  }, [state.status]);

  if (state.status === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-xl border border-line bg-surface p-8 sm:p-10"
      >
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-base" aria-hidden="true">
          <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 10.5l4 4 8-9" />
          </svg>
        </span>
        <h2 className="mt-5 font-display text-2xl">We have got it.</h2>
        <p className="measure mt-3 text-muted">
          We will reply within{' '}
          {isTodo(site.replyWithinWorkingDays) ? <Todo value={site.replyWithinWorkingDays} /> : site.replyWithinWorkingDays}{' '}
          working days. Check your inbox for a confirmation that we received this.
        </p>
        {showBookingFields && (
          <p className="measure mt-4 border-l-2 border-accent pl-4 text-sm text-ink">
            This was a request, not a confirmed booking. Nothing is held in the diary until we write
            back and confirm the date with you.
          </p>
        )}
        <Button href="/" variant="outline" className="mt-7">Back to the site</Button>
      </div>
    );
  }

  return (
    <>
      {turnstileSiteKey && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      )}

      <form action={formAction} noValidate className="space-y-9">
        <input type="hidden" name="type" value={intent} />

        {/* Honeypot. Hidden from sight and from assistive tech, never autofilled. */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
          <label htmlFor={`website-${widgetId}`}>Leave this field empty</label>
          <input id={`website-${widgetId}`} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <fieldset>
          <legend className="mb-3 text-sm font-medium text-ink">What is this about?</legend>
          <div role="tablist" aria-label="Enquiry type" className="grid gap-2 sm:grid-cols-3">
            {INTENTS.map((opt) => {
              const active = intent === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setIntent(opt.id)}
                  className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                    active ? 'border-accent bg-accent/10' : 'border-line bg-surface hover:border-blue/60'
                  }`}
                >
                  <span className={`block text-sm font-semibold ${active ? 'text-accent' : 'text-ink'}`}>
                    {opt.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-muted">{opt.blurb}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {state.status === 'error' && state.message && (
          <div
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            className="rounded-lg border border-accent/60 bg-accent/10 px-4 py-3 text-sm text-ink"
          >
            {state.message}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name" name="name" error={err.name} required>
            <input id="name" name="name" autoComplete="name" className={inputCls('name')}
              aria-invalid={!!err.name} aria-describedby={err.name ? 'name-error' : undefined} />
          </Field>
          <Field label="Email" name="email" error={err.email} required>
            <input id="email" name="email" type="email" autoComplete="email" className={inputCls('email')}
              aria-invalid={!!err.email} aria-describedby={err.email ? 'email-error' : undefined} />
          </Field>
          <Field label="Phone" name="phone" error={err.phone}>
            <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputCls('phone')} />
          </Field>
          <Field label="Organisation" name="organisation" error={err.organisation}>
            <input id="organisation" name="organisation" autoComplete="organization" className={inputCls('organisation')} />
          </Field>
        </div>

        {showBookingFields && (
          <div className="grid gap-5 border-t border-line pt-9 sm:grid-cols-2">
            <Field label="Service" name="service" error={err.service} required>
              <select id="service" name="service" defaultValue="" className={inputCls('service')} aria-invalid={!!err.service}>
                <option value="" disabled>Choose one</option>
                {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Group size" name="group_size" error={err.group_size} hint="Roughly is fine." required>
              <input id="group_size" name="group_size" type="number" min={1} inputMode="numeric" className={inputCls('group_size')} aria-invalid={!!err.group_size} />
            </Field>
            <Field label="Preferred date" name="preferred_date" error={err.preferred_date} required>
              <input id="preferred_date" name="preferred_date" type="date" className={inputCls('preferred_date')} aria-invalid={!!err.preferred_date} />
            </Field>
            <Field label="Backup date" name="backup_date" error={err.backup_date}>
              <input id="backup_date" name="backup_date" type="date" className={inputCls('backup_date')} />
            </Field>
            <Field label="Start time" name="start_time" error={err.start_time}>
              <input id="start_time" name="start_time" type="time" className={inputCls('start_time')} />
            </Field>
            <Field label="Age range" name="age_range" error={err.age_range} hint="For example 13 to 16." required>
              <input id="age_range" name="age_range" className={inputCls('age_range')} aria-invalid={!!err.age_range} />
            </Field>
            <Field label="Venue postcode" name="venue_postcode" error={err.venue_postcode} required>
              <input id="venue_postcode" name="venue_postcode" autoComplete="postal-code" className={inputCls('venue_postcode')} aria-invalid={!!err.venue_postcode} />
            </Field>
            <Field label="How did you hear about us?" name="source" error={err.source}>
              <input id="source" name="source" className={inputCls('source')} />
            </Field>
          </div>
        )}

        <div className="border-t border-line pt-9">
          <Field
            label={showBookingFields ? 'Anything else we should know?' : 'Your question'}
            name="message"
            error={err.message}
            hint={showBookingFields ? 'Venue, access, anything unusual about the group.' : undefined}
            required
          >
            <textarea id="message" name="message" rows={5} className={`${inputCls('message')} resize-y`} aria-invalid={!!err.message} />
          </Field>
        </div>

        <fieldset className="space-y-4 border-t border-line pt-9">
          <legend className="sr-only">Consent</legend>

          <Checkbox name="over18_or_org" error={err.over18_or_org} required>
            I am 18 or over, or I am booking on behalf of an organisation.
          </Checkbox>

          <Checkbox name="privacy_accepted" error={err.privacy_accepted} required>
            I have read and accept the{' '}
            <Link href="/privacy" className="text-blue-light underline underline-offset-4">privacy policy</Link>.
          </Checkbox>

          <Checkbox name="marketing_opt_in">
            Send me occasional updates from VRhino. You can unsubscribe at any time.
          </Checkbox>
        </fieldset>

        {turnstileSiteKey && (
          <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="dark" data-response-field-name="turnstileToken" />
        )}

        {showBookingFields && (
          <p className="rounded-lg border-l-2 border-accent bg-surface px-4 py-3 text-sm text-muted">
            Sending this is a <strong className="text-ink">request</strong>, not a confirmed booking.
            We will come back to you to confirm whether the date works.
          </p>
        )}

        <Button type="submit" disabled={pending} punch className="w-full py-4 text-base sm:w-auto sm:px-10">
          {pending ? 'Sending…' : showBookingFields ? 'Send request' : 'Send question'}
        </Button>
      </form>
    </>
  );
}

function Checkbox({
  name, children, error, required,
}: { name: string; children: React.ReactNode; error?: string; required?: boolean }) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink">
        <input
          type="checkbox"
          name={name}
          aria-invalid={!!error}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[var(--color-accent)]"
        />
        <span>
          {children}
          {required && <span className="ml-1 text-accent" aria-hidden="true">*</span>}
        </span>
      </label>
      {error && <p role="alert" className="ml-8 mt-1.5 text-sm text-accent">{error}</p>}
    </div>
  );
}
