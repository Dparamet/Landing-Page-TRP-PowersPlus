'use client';

import { useMemo, useState } from 'react';
import { serviceCategories } from '@/content/site';
import { useLanguage } from '@/context/LanguageContext';
import { useCompanyProfile } from '@/hooks/useCompanyProfile';

export default function ServiceSelector() {
  const { t, language } = useLanguage();
  const companyProfile = useCompanyProfile();
  const [activeKey, setActiveKey] = useState(serviceCategories[0]?.key ?? 'residential');

  const activeService = useMemo(() => {
    return serviceCategories.find((service) => service.key === activeKey) ?? serviceCategories[0];
  }, [activeKey]);

  const lineMessage = activeService.lineMessage[language];

  return (
    <section id="service-selector" className="section-reveal bg-transparent py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <span className="inline-flex rounded-full border border-orange-100 bg-[#fff7ed] px-4 py-2 text-sm font-bold text-[#b85c00]">
              {t('serviceSelector.eyebrow')}
            </span>
            <h2 className="mt-5 text-3xl font-black leading-tight text-[#12345f] md:text-5xl">
              {t('serviceSelector.title')}
            </h2>
          </div>
          <p className="max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
            {t('serviceSelector.description')}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1" role="tablist" aria-label={t('serviceSelector.tabLabel')}>
            {serviceCategories.map((service) => {
              const selected = service.key === activeService.key;
              return (
                <button
                  key={service.key}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="selected-service-panel"
                  onClick={() => setActiveKey(service.key)}
                  className={`rounded-lg border p-4 text-left transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:translate-y-0 ${
                    selected
                      ? 'border-[#12345f] bg-[#12345f] text-white shadow-lg shadow-slate-200'
                      : 'border-slate-200 bg-white text-[#12345f] hover:border-[#f08a24] hover:bg-[#fff7ed]'
                  }`}
                >
                  <span className="block text-sm font-black">{service.shortTitle[language]}</span>
                  <span className={`mt-1 block text-xs font-semibold ${selected ? 'text-blue-100' : 'text-slate-500'}`}>
                    {service.title[language]}
                  </span>
                </button>
              );
            })}
          </div>

          <article id="selected-service-panel" role="tabpanel" className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5 sm:p-6">
              <p className="text-sm font-black text-[#b85c00]">{activeService.shortTitle[language]}</p>
              <h3 className="mt-2 text-2xl font-black leading-tight text-[#12345f] md:text-3xl">
                {activeService.title[language]}
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
                {activeService.description[language]}
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-3">
              <InfoColumn title={t('serviceSelector.bestFor')} items={[activeService.bestFor]} />
              <InfoColumn title={t('serviceSelector.includes')} items={activeService.includes} />
              <InfoColumn title={t('serviceSelector.prepare')} items={activeService.prepare} />
            </div>

            <div className="grid gap-4 border-t border-slate-200 bg-[#fff7ed] p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
              <div>
                <p className="text-sm font-black text-[#7a3b00]">{t('serviceSelector.linePrompt')}</p>
                <p className="mt-1 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#12345f]">
                  {lineMessage}
                </p>
              </div>
              <a
                href={companyProfile.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-[#b85c00] px-5 py-3 text-sm font-black text-white shadow-md shadow-orange-100 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-[#8a4300] hover:shadow-lg active:translate-y-0"
              >
                {t('serviceSelector.lineCta')}
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function InfoColumn({ title, items }: { title: string; items: Array<{ th: string; en: string }> }) {
  const { language } = useLanguage();

  return (
    <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-4">
      <h4 className="text-sm font-black text-[#12345f]">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
        {items.map((item) => (
          <li key={item.en} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f08a24]" />
            <span>{item[language]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
