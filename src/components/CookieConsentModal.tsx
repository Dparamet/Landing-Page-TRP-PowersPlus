'use client';

import { useState } from 'react';
import { useCookieConsent } from '@/context/CookieConsentContext';
import { useLanguage } from '@/context/LanguageContext';
import { COOKIE_CATEGORIES, CookieCategoryId, COOKIE_COLORS } from '@/lib/cookieConfig';
import { CookieConsent } from '@/lib/cookieStorage';

export default function CookieConsentModal() {
  const { showModal, consent, saveSettings, closeSettings } = useCookieConsent();
  const { t, language } = useLanguage();

  if (!showModal) return null;

  return (
    <CookieConsentDialog
      key={consent.timestamp}
      consent={consent}
      language={language}
      saveSettings={saveSettings}
      closeSettings={closeSettings}
      t={t}
    />
  );
}

function CookieConsentDialog({
  consent,
  language,
  saveSettings,
  closeSettings,
  t,
}: {
  consent: CookieConsent;
  language: 'th' | 'en';
  saveSettings: (options: CookieConsent) => void;
  closeSettings: () => void;
  t: (key: string) => string;
}) {
  const [settings, setSettings] = useState<CookieConsent>(consent);

  const categories: CookieCategoryId[] = ['necessary', 'analytics', 'marketing', 'preferences'];

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/35 p-3 sm:items-center sm:p-6">
      <div className={`w-full max-w-xl overflow-hidden rounded-lg ${COOKIE_COLORS.bgPrimary} ${COOKIE_COLORS.textPrimary} shadow-2xl shadow-slate-950/15 border ${COOKIE_COLORS.borderPrimary}`}>
        <div className={`border-b ${COOKIE_COLORS.borderPrimary} bg-[#f8fafc] p-5 sm:p-6`}>
          <h2 className="text-xl font-black text-[#0f2a5f]">{t('cookie.settingsTitle')}</h2>
          <p className={`mt-2 text-sm ${COOKIE_COLORS.textSecondary}`}>
            {t('cookie.settingsDescription')}
          </p>
        </div>

        <div className="max-h-[58vh] space-y-3 overflow-y-auto p-4 sm:p-5">
          {categories.map((categoryId) => {
            const category = COOKIE_CATEGORIES[categoryId];
            const isEnabled = settings[categoryId];

            return (
              <label
                key={categoryId}
                className={`flex cursor-pointer items-start justify-between gap-4 rounded-lg border ${COOKIE_COLORS.borderPrimary} ${COOKIE_COLORS.bgSecondary} p-4 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  !category.required ? 'hover:border-orange-400' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{language === 'th' ? category.nameTh : category.nameEn}</p>
                    {category.required && (
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                        {t('cookie.required')}
                      </span>
                    )}
                  </div>
                  <p className={`mt-1 text-sm ${COOKIE_COLORS.textTertiary}`}>
                    {language === 'th' ? category.descTh : category.descEn}
                  </p>
                  <div className="mt-2 hidden flex-wrap gap-2 sm:flex">
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
                    <span className={`inline-flex h-7 w-12 items-center justify-center rounded-full ${COOKIE_COLORS.enabledBg} ${COOKIE_COLORS.enabledText} text-xs font-bold`}>
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

        <div className={`border-t ${COOKIE_COLORS.borderPrimary} flex flex-col gap-2 p-4 sm:flex-row sm:justify-end sm:p-5`}>
          <button
            type="button"
            onClick={closeSettings}
            className={`rounded-md border ${COOKIE_COLORS.borderPrimary} px-5 py-2.5 text-sm font-bold transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${COOKIE_COLORS.btnSecondaryBgHover}`}
          >
            {t('cookie.cancel')}
          </button>
          <button
            type="button"
            onClick={() => saveSettings(settings)}
            className={`rounded-md ${COOKIE_COLORS.btnPrimaryBg} px-5 py-2.5 text-sm font-bold text-white transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${COOKIE_COLORS.btnPrimaryBgHover}`}
          >
            {t('cookie.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
