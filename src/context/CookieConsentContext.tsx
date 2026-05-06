'use client';

import { createContext, ReactNode, useContext, useEffect, useSyncExternalStore, useState } from 'react';
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
  const [hasDecision, setHasDecision] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize mounted state and check localStorage on client side only
  useEffect(() => {
    setIsMounted(true);
    const saved = readConsentFromStorage();
    if (saved) {
      setHasDecision(true);
    }
  }, []);

  // Check if user has already made a decision (only show banner on first visit)
  const showBanner = isMounted && !hasDecision;

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