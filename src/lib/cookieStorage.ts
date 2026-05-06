import { STORAGE_KEY, CONSENT_EVENT, STORAGE_EXPIRY } from './cookieConfig';

export type CookieConsent = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  timestamp: number;
};

const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
  timestamp: 0,
};

// Stable cache for useSyncExternalStore - must return same reference if unchanged
let cachedSnapshot = { ...DEFAULT_CONSENT };

export function readConsentFromStorage(): CookieConsent | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as CookieConsent & { timestamp?: number };

    // Check if consent is expired
    if (parsed.timestamp) {
      const ageInSeconds = (Date.now() - parsed.timestamp) / 1000;
      if (ageInSeconds > STORAGE_EXPIRY) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
    }

    const result: CookieConsent = {
      necessary: Boolean(parsed.necessary),
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      preferences: Boolean(parsed.preferences),
      timestamp: parsed.timestamp || Date.now(),
    };

    // Update cache with new reference
    cachedSnapshot = result;
    return result;
  } catch {
    return null;
  }
}

export function writeConsentToStorage(consent: CookieConsent) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  const data: CookieConsent = {
    necessary: consent.necessary,
    analytics: consent.analytics,
    marketing: consent.marketing,
    preferences: consent.preferences,
    timestamp: Date.now(),
  };

  // Update cache first
  cachedSnapshot = data;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  // Emit change event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }
}

export function subscribeToConsentChanges(listener: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener(CONSENT_EVENT, listener);

  return () => {
    window.removeEventListener(CONSENT_EVENT, listener);
  };
}

// Cached server snapshot to avoid infinite loops in useSyncExternalStore
const SERVER_CONSENT_SNAPSHOT: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
  timestamp: 0,
};

export function getConsentSnapshot() {
  // Always return the cached snapshot (same reference)
  return cachedSnapshot;
}

export function getServerConsentSnapshot() {
  return SERVER_CONSENT_SNAPSHOT;
}
