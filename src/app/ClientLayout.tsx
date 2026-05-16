'use client';

import { LanguageProvider } from '@/context/LanguageContext';
import { CookieConsentProvider } from '@/context/CookieConsentContext';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import ScrollEffects from '@/components/ScrollEffects';
import { ReactNode, Suspense } from 'react';
import dynamic from 'next/dynamic';

const CookieConsentModal = dynamic(() => import('@/components/CookieConsentModal'), {
  ssr: false,
});

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <CookieConsentProvider>
        <ScrollEffects />
        {children}
        <CookieConsentBanner />
        <CookieConsentModal />
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
      </CookieConsentProvider>
    </LanguageProvider>
  );
}
