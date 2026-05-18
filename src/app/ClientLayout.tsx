'use client';

import { usePathname } from 'next/navigation';
import { LanguageProvider } from '@/context/LanguageContext';
import { CookieConsentProvider } from '@/context/CookieConsentContext';
import { ReactNode, Suspense } from 'react';
import dynamic from 'next/dynamic';

const AnalyticsTracker = dynamic(() => import('@/components/AnalyticsTracker'), {
  ssr: false,
});

const CookieConsentBanner = dynamic(() => import('@/components/CookieConsentBanner'), {
  ssr: false,
});

const CookieConsentModal = dynamic(() => import('@/components/CookieConsentModal'), {
  ssr: false,
});

const ScrollEffects = dynamic(() => import('@/components/ScrollEffects'), {
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
