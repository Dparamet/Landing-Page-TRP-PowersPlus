'use client';

import { createContext, ReactNode, useContext, useSyncExternalStore, useState } from 'react';
import { CookieConsent, readConsentFromStorage, writeConsentToStorage, subscribeToConsentChanges, getConsentSnapshot, getServerConsentSnapshot } from '@/lib/cookieStorage';

export type CookieConsentContextValue = {
  consent: CookieConsent;
  showBanner: boolean;
  showModal: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  saveSettings: (options: CookieConsent) => void;
  openSettings: () => void;
  closeSettings: () => void;
  dismissBanner: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const consent = useSyncExternalStore(subscribeToConsentChanges, getConsentSnapshot, getServerConsentSnapshot);
  const [hasDecision, setHasDecision] = useState<boolean | null>(() => {
    if (typeof window === 'undefined') return null;
    return readConsentFromStorage() !== null;
  });
  const [showModal, setShowModal] = useState(false);

  const showBanner = hasDecision === false;

  const persistConsent = (nextConsent: CookieConsent) => {
    writeConsentToStorage(nextConsent);
    setHasDecision(true);
  };

  const acceptAll = () => {
    persistConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: Date.now(),
    });
  };

  const rejectAll = () => {
    persistConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
      timestamp: Date.now(),
    });
  };

  const saveSettings = (options: CookieConsent) => {
    persistConsent({
      ...options,
      necessary: true,
      timestamp: Date.now(),
    });
    setShowModal(false);
  };

  const openSettings = () => {
    setShowModal(true);
  };

  const closeSettings = () => {
    setShowModal(false);
  };

  const dismissBanner = () => {
    setHasDecision(true);
  };

  const value: CookieConsentContextValue = {
    consent,
    showBanner,
    showModal,
    openSettings,
    closeSettings,
    dismissBanner,
    acceptAll,
    rejectAll,
    saveSettings,
  };

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);

  if (!context) {
    throw new Error('useCookieConsent must be within CookieConsentProvider');
  }

  return context;
}
