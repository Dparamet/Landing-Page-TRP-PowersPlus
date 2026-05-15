'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useProcessSteps } from '@/hooks/useProcessSteps';

const LANDING_PROCESS_LIMIT = 5;

export default function Process({ showAll = false }: { showAll?: boolean }) {
  const { t, language } = useLanguage();
  const steps = useProcessSteps();
  const visibleSteps = showAll ? steps : steps.slice(0, LANDING_PROCESS_LIMIT);
  const hasMore = steps.length > visibleSteps.length;

  return (
    <section id="process" className="section-reveal bg-transparent py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <span className="inline-flex rounded-full border border-[#f08a24] bg-white px-4 py-2 text-sm font-bold text-[#0f2a5f]">
              {t('process.eyebrow')}
            </span>
            <h2 className="mt-5 text-3xl font-black leading-tight text-current sm:text-4xl md:text-5xl">
              {t('process.title')}
            </h2>
          </div>
          <p className="max-w-3xl text-sm font-semibold leading-7 text-current opacity-90 sm:text-base md:text-lg">{t('process.description')}</p>
        </div>

        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {visibleSteps.map((step, index) => (
            <li
              key={step.id}
              className="reveal-item rounded-lg border border-[#f08a24] bg-white p-4 transition-colors duration-200 hover:border-[#d66d0c] hover:bg-[#fffaf4]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#f08a24] bg-white text-sm font-black text-[#0f2a5f]">
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-black text-[#182230]">{step.title[language]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description[language]}</p>
            </li>
          ))}
        </ol>

        {hasMore ? (
          <div className="mt-8 text-center">
            <Link
              href="/process"
              className="inline-flex rounded-lg border border-[#f08a24] bg-white px-5 py-3 text-sm font-black text-[#0f2a5f] transition hover:bg-[#fff7ed] hover:text-[#d66d0c]"
            >
              {language === 'th' ? 'อ่านเพิ่มเติมขั้นตอนทั้งหมด' : 'View all steps'}
            </Link>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 rounded-lg border border-[#f08a24] bg-[#fff7ed] p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl text-sm font-semibold leading-relaxed text-[#7a3b00]">{t('process.note')}</p>
          <Link
            href="#contact"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#f08a24] px-5 py-3 text-sm font-black text-white shadow-sm transition-colors duration-200 hover:bg-[#d66d0c]"
          >
            {t('hero.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
