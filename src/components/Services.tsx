'use client';

import { useLanguage } from '@/context/LanguageContext';
import th from '@/locales/th.json';
import en from '@/locales/en.json';

export default function Services() {
  const { t, language } = useLanguage();
  const translations = language === 'th' ? th : en;
  const services = translations.services.items;

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('services.title')}</h2>
          <p className="text-gray-600 text-lg">{t('services.description')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={service.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-xl font-bold text-orange-700">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
