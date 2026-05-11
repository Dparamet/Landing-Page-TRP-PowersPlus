'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useProcessSteps } from '@/hooks/useProcessSteps';

export default function Process() {
  const { t, language } = useLanguage();
  const steps = useProcessSteps();

  return (
    <section id="process" className="section-reveal bg-transparent py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <span className="inline-flex rounded-full border border-blue-100 bg-[#f4f8ff] px-4 py-2 text-sm font-bold text-[#12345f]">
              {t('process.eyebrow')}
            </span>
            <h2 className="mt-5 text-3xl font-black leading-tight text-current sm:text-4xl md:text-5xl">
              {t('process.title')}
            </h2>
          </div>
          <p className="max-w-3xl text-sm font-semibold leading-7 text-current opacity-90 sm:text-base md:text-lg">{t('process.description')}</p>
        </div>

        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className="reveal-item rounded-lg border border-slate-200 bg-[#f8fafc] p-4 transition-colors duration-200 hover:border-[#f08a24] hover:bg-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f08a24] text-sm font-black text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-black text-[#182230]">{step.title[language]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description[language]}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col gap-3 rounded-lg border border-orange-100 bg-[#fff7ed] p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl text-sm font-semibold leading-relaxed text-[#7a3b00]">{t('process.note')}</p>
          <Link
            href="#contact"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#b85c00] px-5 py-3 text-sm font-black text-white shadow-sm transition-colors duration-200 hover:bg-[#8a4300]"
          >
            {t('hero.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
