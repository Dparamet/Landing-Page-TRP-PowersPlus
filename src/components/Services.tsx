'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useServiceCategories } from '@/hooks/useServiceCategories';

export default function Services() {
  const { t, language } = useLanguage();
  const serviceCategories = useServiceCategories();

  return (
    <section id="services" className="section-reveal relative z-0 bg-transparent py-16 text-white md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div className="reveal-item">
            <span className="inline-flex rounded-full border border-orange-400 bg-white px-4 py-2 text-sm font-black text-[#111827] shadow-sm transition-all duration-300 hover:scale-105">
              {t('services.eyebrow')}
            </span>
            <h2 className="mt-5 max-w-2xl text-3xl font-black leading-[1.12] text-white sm:text-4xl md:text-5xl">
              {t('services.title')}
            </h2>
          </div>
          <p className="reveal-item max-w-3xl px-4 py-4 text-sm font-semibold leading-7 text-white/90 sm:px-5 sm:text-base md:text-lg md:leading-8">{t('services.description')}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {serviceCategories.map((service, index) => {
            const isOrange = service.accent === 'orange';

            return (
              <article
                key={service.key}
                className="reveal-item glass-card group rounded-lg border border-[#f08a24] bg-white p-6 shadow-lg transition-all duration-300 ease-out hover:shadow-2xl hover:border-[#d66d0c] hover:-translate-y-2"
              >
                <div className="mb-6 flex items-start justify-between gap-4 transition-all duration-300">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-lg border-2 border-[#f08a24] text-base font-black transition-all duration-300 ${
                      isOrange ? 'bg-[#fff7ed] text-[#d66d0c]' : 'bg-[#fff7ed] text-[#d66d0c]'
                    } group-hover:scale-110 group-hover:shadow-md`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <span
                    className={`rounded-full border border-[#f08a24] px-3 py-1.5 text-xs font-bold tracking-wide transition-all duration-300 ${
                      isOrange ? 'bg-[#fff7ed] text-[#d66d0c]' : 'bg-[#fff7ed] text-[#d66d0c]'
                    } group-hover:scale-105`}
                  >
                    {service.shortTitle[language]}
                  </span>
                </div>
                <h3 className="text-lg font-bold leading-snug text-[#182230] transition-colors duration-300">{service.title[language]}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600 transition-colors duration-300">{service.description[language]}</p>
                <ul className="mt-5 space-y-3 text-sm font-medium text-slate-700">
                  {service.includes.slice(0, 2).map((item) => (
                    <li key={item.en} className="flex gap-3 transition-all duration-300 group-hover:translate-x-1">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#f08a24] flex-shrink-0 transition-all duration-300 group-hover:scale-125" />
                      <span>{item[language]}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="#service-selector"
                  className="mt-6 inline-flex rounded-full bg-[#f08a24] px-4 py-2 text-sm font-bold text-white transition-all duration-300 group-hover:bg-[#d66d0c] group-hover:shadow-lg group-hover:-translate-y-1 active:translate-y-0"
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
