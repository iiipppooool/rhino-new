'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useConsent } from './consent-provider';
import { CATEGORIES, DENY_ALL, type ConsentCategories } from '@/lib/consent';

/**
 * Consent banner and preferences panel.
 *
 * "Accept all" and "Reject all" are the same component with the same size and
 * weight, side by side. The ICO has been explicit that refusing must be as easy
 * as accepting, and a banner that buries refusal behind a settings link is the
 * most common way UK sites fail this.
 */
export function CookieBanner() {
  const { bannerOpen, panelOpen, acceptAll, rejectAll, openPanel, closePanel, save, consent } =
    useConsent();

  if (panelOpen) return <PreferencesPanel onClose={closePanel} onSave={save} current={consent} />;
  if (!bannerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-0 bottom-0 z-[90] border-t border-line bg-surface/98 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:gap-8">
        <div className="min-w-0 flex-1">
          <h2 id="cookie-banner-title" className="font-display text-base text-ink">
            Cookies on vrhino.org
          </h2>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted">
            We use cookies that are needed to run the site. We would also like to set analytics and
            marketing cookies, to see how the site is used and to measure our advertising. We will
            only do that if you say yes.{' '}
            <Link href="/privacy#cookies" className="text-blue-light underline underline-offset-4">
              Read our cookie policy
            </Link>
            .
          </p>
        </div>

        {/* Equal weight, equal size, same row. Reject is not a link. */}
        <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={rejectAll}
            className="rounded-full border border-line bg-surface-2 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-blue"
          >
            Reject all
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="rounded-full border border-line bg-surface-2 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-blue"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={openPanel}
            className="rounded-full px-6 py-3 text-sm font-semibold text-muted underline underline-offset-4 transition-colors hover:text-ink"
          >
            Choose
          </button>
        </div>
      </div>
    </div>
  );
}

function PreferencesPanel({
  onClose, onSave, current,
}: {
  onClose: () => void;
  onSave: (c: ConsentCategories) => void;
  current: { analytics: boolean; marketing: boolean } | null;
}) {
  const [choice, setChoice] = useState<ConsentCategories>({
    analytics: current?.analytics ?? DENY_ALL.analytics,
    marketing: current?.marketing ?? DENY_ALL.marketing,
  });
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !panelRef.current) return;
      // Keep focus inside the dialog while it is open.
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center bg-base/80 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-panel-title"
        className="max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-t-xl border border-line bg-surface p-6 sm:rounded-xl sm:p-8"
      >
        <h2 id="cookie-panel-title" className="font-display text-2xl">Cookie settings</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Choose what we may use. You can change this at any time from the link in the footer.
        </p>

        <ul className="mt-6 space-y-3">
          {CATEGORIES.map((cat) => {
            const locked = Boolean(cat.locked);
            const key = cat.id as keyof ConsentCategories;
            const on = locked ? true : choice[key];
            return (
              <li key={cat.id} className="rounded-lg border border-line bg-base p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-display text-base text-ink">{cat.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{cat.body}</p>
                  </div>
                  <label className="flex shrink-0 cursor-pointer items-center gap-2 pt-0.5">
                    <span className="sr-only">{cat.name}</span>
                    <input
                      type="checkbox"
                      checked={on}
                      disabled={locked}
                      onChange={(e) => setChoice((c) => ({ ...c, [key]: e.target.checked }))}
                      className="h-5 w-5 cursor-pointer accent-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </label>
                </div>
                {locked && (
                  <p className="mt-2 text-xs text-muted">Always on. No consent required.</p>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
          <button
            ref={firstRef}
            type="button"
            onClick={() => onSave(DENY_ALL)}
            className="flex-1 rounded-full border border-line bg-surface-2 px-5 py-3 text-sm font-semibold text-ink hover:border-blue"
          >
            Reject all
          </button>
          <button
            type="button"
            onClick={() => onSave({ analytics: true, marketing: true })}
            className="flex-1 rounded-full border border-line bg-surface-2 px-5 py-3 text-sm font-semibold text-ink hover:border-blue"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={() => onSave(choice)}
            className="flex-1 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-base hover:bg-accent-dark"
          >
            Save choices
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-sm text-muted underline underline-offset-4 hover:text-ink"
        >
          Close without changing
        </button>
      </div>
    </div>
  );
}

/** Permanent control so consent can be withdrawn as easily as it was given. */
export function CookieSettingsLink({ className = '' }: { className?: string }) {
  const { openPanel } = useConsent();
  return (
    <button type="button" onClick={openPanel} className={className}>
      Cookie settings
    </button>
  );
}
