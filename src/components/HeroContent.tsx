'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroContent() {
  const { t } = useLanguage();

  return (
    <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center">
      <div className="liquid-glass mx-auto rounded-[1.75rem] px-5 py-8 sm:px-8 md:px-12 md:py-12">
        <div className="mx-auto mb-6 flex h-20 w-56 items-center justify-center rounded-2xl bg-white/72 px-5 shadow-sm backdrop-blur md:h-24 md:w-72">
          <Image
            src="/images/LogoTRP.webp"
            alt="TRP Powers Plus"
            width={288}
            height={108}
            priority
            className="h-full w-full object-contain"
            sizes="(min-width: 768px) 288px, 224px"
          />
        </div>

        <p className="mb-4 inline-flex rounded-full border border-orange-200/70 bg-white/70 px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#b85c00] shadow-sm backdrop-blur">
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
            className="w-full rounded-lg bg-[#b85c00] px-8 py-4 text-lg font-black text-white shadow-lg shadow-orange-200/60 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:bg-[#8a4300] hover:shadow-xl md:w-auto"
          >
            {t('nav.calculator')}
          </Link>
          <Link 
            href="#portfolio" 
            className="w-full rounded-lg border-2 border-blue-100 bg-white/74 px-8 py-4 text-lg font-bold text-[#12345f] shadow-sm backdrop-blur transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[#f08a24] hover:bg-white/90 hover:text-[#b85c00] md:w-auto"
          >
            {t('nav.portfolio')}
          </Link>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-3 md:text-base">
        <div className="liquid-glass flex items-center justify-center gap-2 rounded-lg px-4 py-3">
          <span className="text-2xl text-[#f08a24]">✓</span>
          <span>{t('hero.trust.engineers')}</span>
        </div>
        <div className="liquid-glass flex items-center justify-center gap-2 rounded-lg px-4 py-3">
          <span className="text-2xl text-[#f08a24]">✓</span>
          <span>{t('hero.trust.warranty')}</span>
        </div>
        <div className="liquid-glass flex items-center justify-center gap-2 rounded-lg px-4 py-3">
          <span className="text-2xl text-[#f08a24]">✓</span>
          <span>{t('hero.trust.survey')}</span>
        </div>
      </div>
    </div>
  );
}
