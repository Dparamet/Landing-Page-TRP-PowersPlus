'use client';

import { useCookieConsent } from '@/context/CookieConsentContext';
import { useLanguage } from '@/context/LanguageContext';
import { COOKIE_COLORS } from '@/lib/cookieConfig';

export default function CookieConsentBanner() {
  const { showBanner, acceptAll, rejectAll, openSettings } = useCookieConsent();
  const { t } = useLanguage();

  if (!showBanner) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-5">
      <div className={`pointer-events-auto mx-auto max-w-3xl overflow-hidden rounded-lg border ${COOKIE_COLORS.borderPrimary} ${COOKIE_COLORS.bgPrimary} ${COOKIE_COLORS.textPrimary} shadow-xl shadow-slate-900/10`}>
        <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className={`inline-flex items-center rounded-full border ${COOKIE_COLORS.badgeBorder} ${COOKIE_COLORS.badgeBg} px-2.5 py-1 text-[11px] font-bold ${COOKIE_COLORS.badgeText}`}>
              {t('cookie.badge')}
            </div>
            <h2 className="mt-3 text-base font-black text-[#0f2a5f] sm:text-lg">
              {t('cookie.title')}
            </h2>
            <p className={`mt-1.5 text-sm leading-relaxed ${COOKIE_COLORS.textSecondary}`}>
              {t('cookie.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex lg:flex-shrink-0">
            <button
              type="button"
              onClick={rejectAll}
              className={`rounded-md border border-[#f08a24] ${COOKIE_COLORS.btnSecondaryBg} px-4 py-2 text-sm font-bold transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${COOKIE_COLORS.btnSecondaryBgHover} whitespace-nowrap`}
            >
              {t('cookie.reject')}
            </button>
            <button
              type="button"
              onClick={openSettings}
              className={`rounded-md border border-[#f08a24] ${COOKIE_COLORS.btnSecondaryBg} px-4 py-2 text-sm font-bold text-[#0f2a5f] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${COOKIE_COLORS.btnSecondaryBgHover} whitespace-nowrap`}
            >
              {t('cookie.customize')}
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className={`rounded-md ${COOKIE_COLORS.btnPrimaryBg} px-4 py-2 text-sm font-bold text-white transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${COOKIE_COLORS.btnPrimaryBgHover} whitespace-nowrap`}
            >
              {t('cookie.accept')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
