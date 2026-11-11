'use client';

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from 'react';
import {
  CONSENT_COOKIE, readConsentCookie, writeConsentCookie, clearCategoryCookies,
  DENY_ALL, ALLOW_ALL, type ConsentCategories, type ConsentRecord,
} from '@/lib/consent';

/**
 * The consent cookie is external state the server cannot see, so it is read
 * through useSyncExternalStore rather than an effect that calls setState.
 *
 * getSnapshot must be referentially stable between renders or React loops, so
 * the raw cookie string is cached and only re-parsed when it actually changes.
 */
const CONSENT_EVENT = 'vrhino:consent-changed';

let cachedRaw: string | null = null;
let cachedValue: ConsentRecord | null = null;

function rawConsentCookie(): string {
  if (typeof document === 'undefined') return '';
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${CONSENT_COOKIE}=`)) ?? '';
}

function getSnapshot(): ConsentRecord | null {
  const raw = rawConsentCookie();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = readConsentCookie();
  }
  return cachedValue;
}

/** The server has no cookie, so it always renders as "no choice yet". */
function getServerSnapshot(): ConsentRecord | null {
  return null;
}

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_EVENT, onChange);
}

type ConsentContextValue = {
  /** null means no choice has been made yet, so nothing may load. */
  consent: ConsentRecord | null;
  bannerOpen: boolean;
  panelOpen: boolean;
  save: (categories: ConsentCategories) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  openPanel: () => void;
  closePanel: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used inside ConsentProvider');
  return ctx;
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [panelOpen, setPanelOpen] = useState(false);

  const save = useCallback((categories: ConsentCategories) => {
    const previous = getSnapshot();
    writeConsentCookie(categories);

    // Withdrawing has to remove what was set, or the choice is cosmetic.
    if (!categories.analytics) clearCategoryCookies('analytics');
    if (!categories.marketing) clearCategoryCookies('marketing');

    window.dispatchEvent(new Event(CONSENT_EVENT));
    setPanelOpen(false);

    // A third-party script that has already run cannot be unloaded by React,
    // so withdrawing a previously granted consent reloads the page. Without
    // this the tracker keeps running and the withdrawal is not honoured.
    const withdrew =
      (previous?.analytics && !categories.analytics) ||
      (previous?.marketing && !categories.marketing);
    if (withdrew) window.location.reload();
  }, []);

  const value = useMemo<ConsentContextValue>(() => ({
    consent,
    // On the server and on first paint this is false, so the banner appears
    // only once the client confirms there is no stored choice. That avoids
    // flashing the banner at someone who has already decided.
    bannerOpen: consent === null,
    panelOpen,
    save,
    acceptAll: () => save(ALLOW_ALL),
    rejectAll: () => save(DENY_ALL),
    openPanel: () => setPanelOpen(true),
    closePanel: () => setPanelOpen(false),
  }), [consent, panelOpen, save]);

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}
