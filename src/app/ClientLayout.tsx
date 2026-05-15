'use client';

import { LanguageProvider } from '@/context/LanguageContext';
import { CookieConsentProvider } from '@/context/CookieConsentContext';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

const CookieConsentModal = dynamic(() => import('@/components/CookieConsentModal'), {
  ssr: false,
});

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <CookieConsentProvider>
        {children}
        <CookieConsentBanner />
        <CookieConsentModal />
        <AnalyticsTracker />
      </CookieConsentProvider>
    </LanguageProvider>
  );
}
