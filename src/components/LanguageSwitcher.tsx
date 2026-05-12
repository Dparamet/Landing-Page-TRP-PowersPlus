'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-[#f08a24] bg-slate-50 p-1">
      <button
        type="button"
        onClick={() => setLanguage('th')}
        aria-pressed={language === 'th'}
        className={`px-4 py-2 font-semibold rounded-md transition-all duration-200 ${
          language === 'th'
            ? 'bg-[#f08a24] text-white shadow-sm'
            : 'bg-transparent text-slate-700 hover:text-[#0f2a5f]'
        }`}
        title={t('language.switchToThai')}
      >
        {language === 'th' ? 'ไทย' : 'TH'}
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`px-4 py-2 font-semibold rounded-md transition-all duration-200 ${
          language === 'en'
            ? 'bg-[#f08a24] text-white shadow-sm'
            : 'bg-transparent text-slate-700 hover:text-[#0f2a5f]'
        }`}
        title={t('language.switchToEnglish')}
      >
        EN
      </button>
    </div>
  );
}
