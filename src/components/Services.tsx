'use client';

import Link from 'next/link';
import { serviceCategories } from '@/content/site';
import { useLanguage } from '@/context/LanguageContext';

export default function Services() {
  const { t, language } = useLanguage();

  return (
    <section id="services" className="section-reveal relative z-0 -mt-16 bg-transparent pb-20 pt-24 md:-mt-20 md:pt-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <span className="inline-flex rounded-full border border-white/70 bg-white/72 px-4 py-2 text-sm font-black text-[#12345f] shadow-[0_10px_28px_rgba(18,52,95,0.08)]">
              {t('services.eyebrow')}
            </span>
            <h2 className="readable-heading mt-5 max-w-2xl text-3xl font-black leading-[1.12] md:text-5xl">
              {t('services.title')}
            </h2>
          </div>
          <p className="readable-copy glass-text-panel max-w-3xl rounded-2xl px-5 py-4 text-base font-semibold leading-8 md:text-lg md:leading-8">{t('services.description')}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {serviceCategories.map((service, index) => {
            const isOrange = service.accent === 'orange';

            return (
              <article
                key={service.key}
                className="reveal-item group rounded-xl border border-white/70 bg-white/74 p-5 shadow-[0_18px_46px_rgba(18,52,95,0.08)] backdrop-blur-xl transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[#f08a24]/70 hover:bg-white/86 hover:shadow-[0_24px_58px_rgba(18,52,95,0.13)]"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg border border-white/70 text-sm font-black shadow-inner ${
                      isOrange ? 'bg-[#fff7ed]/90 text-[#b85c00]' : 'bg-[#f4f8ff]/90 text-[#12345f]'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <span
                    className={`rounded-full border border-white/70 px-3 py-1 text-xs font-black shadow-sm ${
                      isOrange ? 'bg-[#fff7ed]/90 text-[#b85c00]' : 'bg-[#f4f8ff]/90 text-[#12345f]'
                    }`}
                  >
                    {service.shortTitle[language]}
                  </span>
                </div>
                <h3 className="text-xl font-black leading-snug text-[#182230] drop-shadow-[0_1px_0_rgba(255,255,255,0.88)]">{service.title[language]}</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{service.description[language]}</p>
                <ul className="mt-5 space-y-2.5 text-sm font-semibold leading-6 text-slate-700">
                  {service.includes.slice(0, 2).map((item) => (
                    <li key={item.en} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f08a24] shadow-[0_0_0_3px_rgba(240,138,36,0.14)]" />
                      <span>{item[language]}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="#service-selector"
                  className="mt-5 inline-flex rounded-full bg-white/72 px-3 py-1.5 text-sm font-black text-[#12345f] shadow-sm transition duration-300 group-hover:bg-[#fff7ed]/90 group-hover:text-[#b85c00]"
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
