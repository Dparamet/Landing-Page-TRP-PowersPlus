'use client';

import { LanguageProvider } from '@/context/LanguageContext';
import { CookieConsentProvider } from '@/context/CookieConsentContext';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import CookieConsentModal from '@/components/CookieConsentModal';
import { ReactNode } from 'react';

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <CookieConsentProvider>
        {children}
        <CookieConsentBanner />
        <CookieConsentModal />
      </CookieConsentProvider>
    </LanguageProvider>
  );
}
