'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroContent() {
  const { t } = useLanguage();

  return (
    <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center">
      <div className="liquid-glass mx-auto px-5 py-8 shadow-[0_34px_90px_rgba(18,52,95,0.24)] sm:px-8 md:px-12 md:py-12">
        <p className="mb-5 inline-flex rounded-full border border-white/70 bg-white/76 px-4 py-2 text-sm font-black uppercase tracking-wide text-[#8a4300] shadow-[0_10px_30px_rgba(184,92,0,0.12)] drop-shadow-[0_1px_8px_rgba(255,255,255,0.88)]">
          {t('hero.eyebrow')}
        </p>

        <h1 className="display-stroke mx-auto mb-6 max-w-4xl text-5xl font-black leading-[1.08] text-slate-950 drop-shadow-[0_2px_12px_rgba(255,255,255,0.9)] md:text-7xl">
          {t('hero.title')}
        </h1>

        <p className="glass-text-panel mx-auto mb-5 max-w-3xl rounded-2xl px-4 py-3 text-xl font-black leading-snug text-[#0f2f55] drop-shadow-[0_1px_10px_rgba(255,255,255,0.86)] md:text-2xl">
          {t('hero.subtitle')}
        </p>

        <p className="glass-text-panel mx-auto mb-10 max-w-3xl rounded-2xl px-5 py-4 text-base font-semibold leading-8 text-slate-900 drop-shadow-[0_1px_10px_rgba(255,255,255,0.88)] md:text-lg md:leading-8">
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

      <div className="mt-8 grid grid-cols-1 gap-3 text-sm font-black text-slate-950 md:grid-cols-3 md:text-base">
        <div className="liquid-glass flex items-center justify-center gap-2 px-4 py-3 drop-shadow-[0_10px_28px_rgba(18,52,95,0.12)]">
          <span className="text-2xl text-[#f08a24]">✓</span>
          <span className="drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">{t('hero.trust.engineers')}</span>
        </div>
        <div className="liquid-glass flex items-center justify-center gap-2 px-4 py-3 drop-shadow-[0_10px_28px_rgba(18,52,95,0.12)]">
          <span className="text-2xl text-[#f08a24]">✓</span>
          <span className="drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">{t('hero.trust.warranty')}</span>
        </div>
        <div className="liquid-glass flex items-center justify-center gap-2 px-4 py-3 drop-shadow-[0_10px_28px_rgba(18,52,95,0.12)]">
          <span className="text-2xl text-[#f08a24]">✓</span>
          <span className="drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">{t('hero.trust.survey')}</span>
        </div>
      </div>
    </div>
  );
}
