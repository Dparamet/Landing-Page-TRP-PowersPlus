'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useServiceCategories } from '@/hooks/useServiceCategories';

export default function Services() {
  const { t, language } = useLanguage();
  const serviceCategories = useServiceCategories();

  return (
    <section id="services" className="section-reveal relative z-0 bg-transparent py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-[#111827] shadow-sm">
              {t('services.eyebrow')}
            </span>
            <h2 className="mt-5 max-w-2xl text-3xl font-black leading-[1.12] text-[#111827] sm:text-4xl md:text-5xl">
              {t('services.title')}
            </h2>
          </div>
          <p className="max-w-3xl rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold leading-7 text-[#111827] shadow-sm sm:px-5 sm:text-base md:text-lg md:leading-8">{t('services.description')}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {serviceCategories.map((service, index) => {
            const isOrange = service.accent === 'orange';

            return (
              <article
                key={service.key}
                className="reveal-item group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 hover:border-[#f08a24]/70 hover:bg-[#fffdf8]"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-sm font-black ${
                      isOrange ? 'bg-[#fff7ed]/90 text-[#b85c00]' : 'bg-[#f4f8ff]/90 text-[#12345f]'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <span
                    className={`rounded-full border border-slate-200 px-3 py-1 text-xs font-black ${
                      isOrange ? 'bg-[#fff7ed]/90 text-[#b85c00]' : 'bg-[#f4f8ff]/90 text-[#12345f]'
                    }`}
                  >
                    {service.shortTitle[language]}
                  </span>
                </div>
                <h3 className="text-xl font-black leading-snug text-[#182230]">{service.title[language]}</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{service.description[language]}</p>
                <ul className="mt-5 space-y-2.5 text-sm font-semibold leading-6 text-slate-700">
                  {service.includes.slice(0, 2).map((item) => (
                    <li key={item.en} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f08a24]" />
                      <span>{item[language]}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="#service-selector"
                  className="mt-5 inline-flex rounded-full bg-[#f8fafc] px-3 py-1.5 text-sm font-black text-[#12345f] transition-colors duration-200 group-hover:bg-[#fff7ed] group-hover:text-[#b85c00]"
                >
                  {t('services.checkFit')}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
