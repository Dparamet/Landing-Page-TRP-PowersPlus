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
  const processDescription =
    language === 'th' ? (
      <>
        ลดความเสี่ยงจากการคาดเดา <wbr />
        ด้วยขั้นตอนสั้น ชัดเจน <wbr />
        และตรวจสอบได้ก่อนตัดสินใจติดตั้งจริง
      </>
    ) : (
      t('process.description')
    );

  return (
    <section id="process" className="section-reveal bg-transparent py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="reveal-item">
            <span className="inline-flex rounded-full border border-[#f08a24] bg-[#e3f2fd] px-4 py-2 text-sm font-bold text-[#0f2a5f] transition-all duration-300 hover:scale-105">
              {t('process.eyebrow')}
            </span>
            <h2 className="mt-5 text-3xl font-black leading-tight text-current sm:text-4xl md:text-5xl">
              {t('process.title')}
            </h2>
          </div>
          <p className="reveal-item max-w-2xl text-balance text-left text-sm font-semibold leading-7 text-current opacity-90 sm:text-base md:text-lg">{processDescription}</p>
        </div>

        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {visibleSteps.map((step, index) => (
            <li
              key={step.id}
              className="reveal-item group rounded-lg border-2 border-[#f08a24] bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:border-[#d66d0c] hover:shadow-lg hover:-translate-y-1"
              style={{ 
                transitionDelay: `${index * 50}ms`
              }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f08a24] text-sm font-black !text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-black text-[#182230] transition-colors duration-300">{step.title[language]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 transition-colors duration-300">{step.description[language]}</p>
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

        {hasMore ? (
          <div className="glass-panel mt-8 flex flex-col gap-3 rounded-lg border border-[#f08a24] bg-[#fff7ed] p-5 transition-all duration-300 sm:flex-row sm:items-center sm:justify-between hover:shadow-md hover:border-[#d66d0c]">
            <Link
              href="/process"
              className="inline-flex rounded-lg border border-[#f08a24] bg-white px-5 py-3 text-sm font-black text-[#0f2a5f] transition hover:bg-[#fff7ed] hover:text-[#d66d0c]"
            >
              {language === 'th' ? 'อ่านเพิ่มเติมขั้นตอนทั้งหมด' : 'View all steps'}
            </Link>
          </div>
        ) : null}

        <div className="glass-panel mt-8 flex flex-col gap-3 rounded-lg border border-[#f08a24] bg-[#fff7ed] p-5 transition-all duration-300 sm:flex-row sm:items-center sm:justify-between hover:shadow-md hover:border-[#d66d0c]">
          <p className="max-w-3xl text-sm font-semibold leading-relaxed text-[#7a3b00]">{t('process.note')}</p>
          <Link
            href="#contact"
            className="inline-flex shrink-0 items-center justify-center rounded-lg glass-button bg-[#f08a24] px-5 py-3 text-sm font-black text-white shadow-sm transition-all duration-300 hover:bg-[#d66d0c] hover:shadow-lg hover:-translate-y-1 active:translate-y-0"
          >
            {t('hero.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
