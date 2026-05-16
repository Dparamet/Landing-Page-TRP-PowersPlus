'use client';

import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <LanguageProvider>
      <CookieConsentProvider>
        {!isAdminRoute ? <ScrollEffects /> : null}
        {children}
        {!isAdminRoute && <CookieConsentBanner />}
        {!isAdminRoute && <CookieConsentModal />}
        {!isAdminRoute ? (
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
        ) : null}
      </CookieConsentProvider>
    </LanguageProvider>
  );
}
