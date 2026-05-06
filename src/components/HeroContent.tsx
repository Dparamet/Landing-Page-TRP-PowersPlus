'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroContent() {
  const { t } = useLanguage();

  return (
    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <p className="text-orange-300 text-sm md:text-base font-semibold mb-3 uppercase tracking-wider">
        {t('hero.eyebrow')}
      </p>

      <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight">
        {t('hero.title')}
      </h1>

      <p className="text-lg md:text-2xl text-gray-100 mb-8 font-medium">
        {t('hero.subtitle')}
      </p>

      <p className="text-base md:text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
        {t('hero.description')}
      </p>

      <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
        <Link 
          href="#contact" 
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-orange-600/50 w-full md:w-auto"
        >
          {t('hero.cta')}
        </Link>
        <Link 
          href="#services" 
          className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 w-full md:w-auto"
        >
          {t('services.title')}
        </Link>
      </div>

      <div className="mt-12 flex flex-col md:flex-row justify-center gap-6 text-white text-sm md:text-base">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">✓</span>
          <span>{t('hero.trust.engineers')}</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">✓</span>
          <span>{t('hero.trust.warranty')}</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">✓</span>
          <span>{t('hero.trust.survey')}</span>
        </div>
      </div>
    </div>
  );
}
