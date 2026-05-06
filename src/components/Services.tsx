'use client';

import { useLanguage } from '@/context/LanguageContext';
import th from '@/locales/th.json';
import en from '@/locales/en.json';

export default function Services() {
  const { t, language } = useLanguage();
  const translations = language === 'th' ? th : en;
  const services = translations.services.items;

  return (
    <section id="services" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-black text-[#12345f] md:text-4xl">{t('services.title')}</h2>
          <p className="text-lg text-slate-600">{t('services.description')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={service.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#f08a24] hover:shadow-lg hover:shadow-slate-100">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#fff7ed] text-xl font-black text-[#b85c00]">
                {index + 1}
              </div>
              <h3 className="mb-3 text-xl font-black text-[#182230]">{service.title}</h3>
              <p className="leading-relaxed text-slate-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
