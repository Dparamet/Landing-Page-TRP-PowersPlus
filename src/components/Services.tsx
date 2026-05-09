'use client';

import Link from 'next/link';
import { serviceCategories } from '@/content/site';
import { useLanguage } from '@/context/LanguageContext';

export default function Services() {
  const { t, language } = useLanguage();

  return (
    <section id="services" className="section-reveal bg-transparent py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <span className="inline-flex rounded-full border border-blue-100 bg-[#f4f8ff] px-4 py-2 text-sm font-bold text-[#12345f]">
              {t('services.eyebrow')}
            </span>
            <h2 className="mt-5 text-3xl font-black leading-tight text-[#12345f] md:text-5xl">
              {t('services.title')}
            </h2>
          </div>
          <p className="max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">{t('services.description')}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {serviceCategories.map((service, index) => {
            const isOrange = service.accent === 'orange';

            return (
              <article
                key={service.key}
                className="reveal-item group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[#f08a24] hover:shadow-lg hover:shadow-slate-100"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg text-sm font-black ${
                      isOrange ? 'bg-[#fff7ed] text-[#b85c00]' : 'bg-[#f4f8ff] text-[#12345f]'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      isOrange ? 'bg-[#fff7ed] text-[#b85c00]' : 'bg-[#f4f8ff] text-[#12345f]'
                    }`}
                  >
                    {service.shortTitle[language]}
                  </span>
                </div>
                <h3 className="text-xl font-black leading-tight text-[#182230]">{service.title[language]}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.description[language]}</p>
                <ul className="mt-5 space-y-2 text-sm text-slate-700">
                  {service.includes.slice(0, 2).map((item) => (
                    <li key={item.en} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f08a24]" />
                      <span>{item[language]}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="#service-selector"
                  className="mt-5 inline-flex text-sm font-black text-[#12345f] transition duration-300 group-hover:text-[#b85c00]"
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
