'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setLanguage('th')}
        className={`px-4 py-2 font-semibold rounded-md transition-all duration-200 ${
          language === 'th'
            ? 'bg-orange-600 text-white'
            : 'bg-transparent text-gray-700 hover:text-orange-600'
        }`}
        title="Switch to Thai"
      >
        ไทย
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-4 py-2 font-semibold rounded-md transition-all duration-200 ${
          language === 'en'
            ? 'bg-orange-600 text-white'
            : 'bg-transparent text-gray-700 hover:text-orange-600'
        }`}
        title="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
