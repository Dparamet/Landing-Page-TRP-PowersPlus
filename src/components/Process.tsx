'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import th from '@/locales/th.json';
import en from '@/locales/en.json';

export default function Process() {
  const { t, language } = useLanguage();
  const translations = language === 'th' ? th : en;
  const steps = translations.process.steps;

  return (
    <section id="process" className="section-reveal bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <span className="inline-flex rounded-full border border-blue-100 bg-[#f4f8ff] px-4 py-2 text-sm font-bold text-[#12345f]">
              {t('process.eyebrow')}
            </span>
            <h2 className="mt-5 text-3xl font-black leading-tight text-[#12345f] md:text-5xl">
              {t('process.title')}
            </h2>
          </div>
          <p className="max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">{t('process.description')}</p>
        </div>

        <ol className="grid gap-3 md:grid-cols-5">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="reveal-item rounded-lg border border-slate-200 bg-[#f8fafc] p-4 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[#f08a24] hover:bg-white hover:shadow-lg hover:shadow-slate-100"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#12345f] text-sm font-black text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-black text-[#182230]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col gap-3 rounded-lg border border-orange-100 bg-[#fff7ed] p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl text-sm font-semibold leading-relaxed text-[#7a3b00]">{t('process.note')}</p>
          <Link
            href="#contact"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#b85c00] px-5 py-3 text-sm font-black text-white shadow-md shadow-orange-100 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-[#8a4300] hover:shadow-lg active:translate-y-0"
          >
            {t('hero.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
