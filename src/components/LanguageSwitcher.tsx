'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
      <button
        type="button"
        onClick={() => setLanguage('th')}
        className={`px-4 py-2 font-semibold rounded-md transition-all duration-200 ${
          language === 'th'
            ? 'bg-[#12345f] text-white shadow-sm'
            : 'bg-transparent text-slate-700 hover:text-[#12345f]'
        }`}
        title="Switch to Thai"
      >
        ไทย
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-4 py-2 font-semibold rounded-md transition-all duration-200 ${
          language === 'en'
            ? 'bg-[#12345f] text-white shadow-sm'
            : 'bg-transparent text-slate-700 hover:text-[#12345f]'
        }`}
        title="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
