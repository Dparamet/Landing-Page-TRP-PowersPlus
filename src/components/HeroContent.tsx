'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroContent({ withBackgroundImage = false }: { withBackgroundImage?: boolean }) {
  const { t } = useLanguage();
  const headingClass = withBackgroundImage ? 'hero-title-on-image text-white' : 'text-[#111827]';
  const subtitleClass = withBackgroundImage ? 'hero-copy-on-image text-white' : 'text-[#111827]';
  const descriptionClass = withBackgroundImage ? 'hero-description-on-image text-white' : 'text-[#111827]';

  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl px-4 text-center sm:px-6">
      <div className="relative mx-auto">
        <p className="mb-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black uppercase tracking-wide text-[#111827] shadow-sm">
          {t('hero.eyebrow')}
        </p>

        <h1 className={`mx-auto mb-5 max-w-4xl text-4xl font-black leading-[1.08] sm:text-5xl md:mb-6 md:text-7xl ${headingClass}`}>
          {t('hero.title')}
        </h1>

        <p className={`mx-auto mb-5 max-w-3xl text-lg font-black leading-snug md:text-2xl ${subtitleClass}`}>
          {t('hero.subtitle')}
        </p>

        <p className={`mx-auto mb-8 max-w-3xl text-sm font-semibold leading-7 sm:text-base md:mb-10 md:text-lg md:leading-8 ${descriptionClass}`}>
          {t('hero.description')}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          <Link 
            href="#calculator" 
            className="w-full rounded-lg bg-[#f08a24] px-8 py-4 text-lg font-black text-white shadow-lg shadow-orange-200 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:bg-[#d66d0c] hover:shadow-xl md:w-auto"
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
        <div className="flex items-center justify-center gap-2 rounded-full border border-[#f08a24] bg-white px-4 py-3 shadow-sm">
          <span className="text-2xl text-[#f08a24]">✓</span>
          <span>{t('hero.trust.engineers')}</span>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-full border border-[#f08a24] bg-white px-4 py-3 shadow-sm">
          <span className="text-2xl text-[#f08a24]">✓</span>
          <span>{t('hero.trust.warranty')}</span>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-full border border-[#f08a24] bg-white px-4 py-3 shadow-sm">
          <span className="text-2xl text-[#f08a24]">✓</span>
          <span>{t('hero.trust.survey')}</span>
        </div>
      </div>
    </div>
  );
}
