'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroContent() {
  const { t } = useLanguage();

  return (
    <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
      <p className="mb-4 inline-flex rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#b85c00] shadow-sm">
        {t('hero.eyebrow')}
      </p>

      <h1 className="mb-6 text-5xl font-black leading-tight text-[#182230] md:text-7xl">
        {t('hero.title')}
      </h1>

      <p className="mx-auto mb-6 max-w-3xl text-xl font-bold text-[#12345f] md:text-2xl">
        {t('hero.subtitle')}
      </p>

      <p className="mx-auto mb-10 max-w-3xl text-base leading-relaxed text-slate-700 md:text-lg">
        {t('hero.description')}
      </p>

      <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
        <Link 
          href="#calculator" 
          className="w-full rounded-lg bg-[#b85c00] px-8 py-4 text-lg font-black text-white shadow-lg shadow-orange-100 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:bg-[#8a4300] hover:shadow-xl md:w-auto"
        >
          {t('nav.calculator')}
        </Link>
        <Link 
          href="#portfolio" 
          className="w-full rounded-lg border-2 border-slate-200 bg-white/85 px-8 py-4 text-lg font-bold text-[#12345f] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[#f08a24] hover:bg-white hover:text-[#b85c00] md:w-auto"
        >
          {t('nav.portfolio')}
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-3 md:text-base">
        <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
          <span className="text-2xl text-[#f08a24]">✓</span>
          <span>{t('hero.trust.engineers')}</span>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
          <span className="text-2xl text-[#f08a24]">✓</span>
          <span>{t('hero.trust.warranty')}</span>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
          <span className="text-2xl text-[#f08a24]">✓</span>
          <span>{t('hero.trust.survey')}</span>
        </div>
      </div>
    </div>
  );
}
