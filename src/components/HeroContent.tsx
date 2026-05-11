'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroContent() {
  const { t } = useLanguage();

  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl px-4 text-center sm:px-6">
      <div className="pointer-events-none absolute left-2 top-4 h-24 w-48 rounded-t-full border border-white/60 bg-white/35" />
      <div className="pointer-events-none absolute bottom-12 right-4 hidden h-20 w-40 rounded-b-full border border-white/60 bg-white/30 md:block" />

      <div className="relative mx-auto">
        <p className="mb-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black uppercase tracking-wide text-[#111827] shadow-sm">
          {t('hero.eyebrow')}
        </p>

        <h1 className="mx-auto mb-5 max-w-4xl text-4xl font-black leading-[1.08] text-[#111827] sm:text-5xl md:mb-6 md:text-7xl">
          {t('hero.title')}
        </h1>

        <p className="mx-auto mb-5 max-w-3xl text-lg font-black leading-snug text-[#111827] md:text-2xl">
          {t('hero.subtitle')}
        </p>

        <p className="mx-auto mb-8 max-w-3xl text-sm font-semibold leading-7 text-[#111827] sm:text-base md:mb-10 md:text-lg md:leading-8">
          {t('hero.description')}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          <Link 
            href="#calculator" 
            className="w-full rounded-lg bg-[#b85c00] px-8 py-4 text-lg font-black text-white shadow-lg shadow-orange-200/60 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:bg-[#8a4300] hover:shadow-xl md:w-auto"
          >
            {t('nav.calculator')}
          </Link>
          <Link 
            href="#portfolio" 
            className="w-full rounded-lg bg-white/78 px-8 py-4 text-lg font-black text-[#0f2f55] shadow-sm transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:bg-white/92 hover:text-[#8a4300] md:w-auto"
          >
            {t('nav.portfolio')}
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 text-sm font-black text-[#111827] sm:grid-cols-3 md:mt-8 md:text-base">
        <div className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <span className="text-2xl text-[#f08a24]">✓</span>
          <span>{t('hero.trust.engineers')}</span>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <span className="text-2xl text-[#f08a24]">✓</span>
          <span>{t('hero.trust.warranty')}</span>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <span className="text-2xl text-[#f08a24]">✓</span>
          <span>{t('hero.trust.survey')}</span>
        </div>
      </div>
    </div>
  );
}
