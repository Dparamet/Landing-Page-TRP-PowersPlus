'use client';

import { useCookieConsent } from '@/context/CookieConsentContext';
import { COOKIE_COLORS } from '@/lib/cookieConfig';

export default function CookieConsentBanner() {
  const { showBanner, acceptAll, rejectAll, dismissBanner, openSettings } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] p-4 sm:p-6 animate-in slide-in-from-bottom-4 duration-300">
      <div className={`mx-auto max-w-4xl overflow-hidden rounded-2xl border-2 ${COOKIE_COLORS.borderPrimary} ${COOKIE_COLORS.bgPrimary} ${COOKIE_COLORS.textPrimary} shadow-2xl`}>
        <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          {/* Content */}
          <div className="flex-1">
            <div className={`inline-flex items-center rounded-full border ${COOKIE_COLORS.badgeBorder} ${COOKIE_COLORS.badgeBg} px-3 py-1 text-xs font-semibold uppercase tracking-wider ${COOKIE_COLORS.badgeText}`}>
              🍪 Cookie Policy
            </div>
            <h2 className="mt-4 text-xl font-bold sm:text-2xl text-orange-600">
              We use cookies to enhance your experience
            </h2>
            <p className={`mt-3 text-sm leading-relaxed ${COOKIE_COLORS.textSecondary} sm:text-base`}>
              We use cookies for essential functionality and (with your consent) for analytics and marketing. You can review and customize your preferences.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-shrink-0 sm:gap-4">
            <button
              type="button"
              onClick={rejectAll}
              className={`rounded-lg border-2 border-gray-300 ${COOKIE_COLORS.btnSecondaryBg} px-6 py-2.5 font-semibold transition ${COOKIE_COLORS.btnSecondaryBgHover} whitespace-nowrap hover:border-blue-400`}
            >
              Reject All
            </button>
            <button
              type="button"
              onClick={openSettings}
              className={`rounded-lg border-2 border-blue-300 ${COOKIE_COLORS.btnSecondaryBg} px-6 py-2.5 font-semibold transition ${COOKIE_COLORS.btnSecondaryBgHover} whitespace-nowrap text-blue-700 hover:border-blue-500`}
            >
              Customize
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className={`rounded-lg ${COOKIE_COLORS.btnPrimaryBg} px-6 py-2.5 font-semibold text-white transition ${COOKIE_COLORS.btnPrimaryBgHover} whitespace-nowrap`}
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}