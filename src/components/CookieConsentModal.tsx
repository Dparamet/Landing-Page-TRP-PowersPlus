'use client';

import { useState } from 'react';
import { useCookieConsent } from '@/context/CookieConsentContext';
import { COOKIE_CATEGORIES, CookieCategoryId, COOKIE_COLORS } from '@/lib/cookieConfig';
import { CookieConsent } from '@/lib/cookieStorage';

export default function CookieConsentModal() {
  const { showModal, consent, saveSettings, closeSettings } = useCookieConsent();
  const [settings, setSettings] = useState<CookieConsent>(consent);

  if (!showModal) return null;

  const categories: CookieCategoryId[] = ['necessary', 'analytics', 'marketing', 'preferences'];

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-4 sm:items-center sm:p-6 animate-in fade-in duration-300">
      <div className={`w-full max-w-2xl rounded-2xl ${COOKIE_COLORS.bgPrimary} ${COOKIE_COLORS.textPrimary} shadow-2xl border-2 ${COOKIE_COLORS.borderPrimary}`}>
        {/* Header */}
        <div className={`border-b-2 ${COOKIE_COLORS.borderPrimary} p-6 sm:p-8 bg-gradient-to-r from-orange-50 to-blue-50`}>
          <h2 className="text-2xl font-bold text-orange-600">Cookie Settings</h2>
          <p className={`mt-2 text-sm ${COOKIE_COLORS.textSecondary}`}>
            Manage your cookie preferences. Some cookies are essential for the website to work.
          </p>
        </div>

        {/* Content */}
        <div className={`space-y-4 p-6 sm:p-8 max-h-[60vh] overflow-y-auto`}>
          {categories.map((categoryId) => {
            const category = COOKIE_CATEGORIES[categoryId];
            const isEnabled = settings[categoryId];

            return (
              <label
                key={categoryId}
                className={`flex cursor-pointer items-start justify-between gap-4 rounded-xl border ${COOKIE_COLORS.borderPrimary} ${COOKIE_COLORS.bgSecondary} p-4 transition ${
                  !category.required && `hover:${COOKIE_COLORS.borderHover}`
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{category.nameTh}</p>
                    {category.required && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                        Required
                      </span>
                    )}
                  </div>
                  <p className={`mt-1 text-sm ${COOKIE_COLORS.textTertiary}`}>{category.descTh}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {category.examples.map((ex, i) => (
                      <code key={i} className={`text-xs px-2 py-1 rounded ${COOKIE_COLORS.bgTertiary}`}>
                        {ex}
                      </code>
                    ))}
                  </div>
                </div>

                {/* Toggle Switch */}
                <div className="flex-shrink-0 pt-1">
                  {category.required ? (
                    <span className={`inline-flex items-center justify-center w-12 h-7 rounded-full ${COOKIE_COLORS.enabledBg} ${COOKIE_COLORS.enabledText} text-xs font-semibold`}>
                      ON
                    </span>
                  ) : (
                    <>
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) =>
                          setSettings({ ...settings, [categoryId]: e.target.checked })
                        }
                        className="peer sr-only"
                        disabled={category.required}
                      />
                      <span className={`inline-flex h-7 w-12 items-center rounded-full transition ${isEnabled ? COOKIE_COLORS.toggleActive : COOKIE_COLORS.toggleBg}`}>
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                            isEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </span>
                    </>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`border-t ${COOKIE_COLORS.borderPrimary} flex flex-col gap-3 p-6 sm:p-8 sm:flex-row sm:justify-end`}>
          <button
            type="button"
            onClick={closeSettings}
            className={`rounded-lg border ${COOKIE_COLORS.borderPrimary} px-6 py-2.5 font-semibold transition ${COOKIE_COLORS.btnSecondaryBgHover}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => saveSettings(settings)}
            className={`rounded-lg ${COOKIE_COLORS.btnPrimaryBg} px-6 py-2.5 font-semibold text-white transition ${COOKIE_COLORS.btnPrimaryBgHover}`}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
