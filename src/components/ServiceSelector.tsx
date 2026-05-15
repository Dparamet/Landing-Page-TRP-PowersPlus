'use client';

import { useMemo, useState } from 'react';
import { serviceCategories as fallbackServiceCategories } from '@/content/site';
import { useLanguage } from '@/context/LanguageContext';
import { useCompanyProfile } from '@/hooks/useCompanyProfile';
import { useServiceCategories } from '@/hooks/useServiceCategories';

export default function ServiceSelector() {
  const { t, language } = useLanguage();
  const companyProfile = useCompanyProfile();
  const serviceCategories = useServiceCategories();
  const [activeKey, setActiveKey] = useState(serviceCategories[0]?.key ?? 'residential');

  const activeService = useMemo(() => {
    return serviceCategories.find((service) => service.key === activeKey) ?? serviceCategories[0] ?? fallbackServiceCategories[0];
  }, [activeKey, serviceCategories]);

  const lineMessage = activeService.lineMessage[language];

  return (
    <section id="service-selector" className="section-reveal bg-transparent py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div className="reveal-item">
            <span className="inline-flex rounded-full border border-[#f08a24] bg-[#fff7ed] px-4 py-2 text-sm font-bold text-[#d66d0c] transition-all duration-300 hover:scale-105">
              {t('serviceSelector.eyebrow')}
            </span>
            <h2 className="mt-5 text-3xl font-black leading-tight text-[#0f2a5f] md:text-5xl">
              {t('serviceSelector.title')}
            </h2>
          </div>
          <p className="reveal-item max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
            {t('serviceSelector.description')}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1" role="tablist" aria-label={t('serviceSelector.tabLabel')}>
            {serviceCategories.map((service, index) => {
              const selected = service.key === activeService.key;
              return (
                <button
                  key={service.key}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="selected-service-panel"
                  onClick={() => setActiveKey(service.key)}
                  className={`rounded-lg border p-4 text-left transition-all duration-300 ease-out ${
                    selected
                      ? 'border-[#0f2a5f] bg-[#0f2a5f] text-white shadow-lg shadow-blue-200 -translate-y-1'
                      : 'border-[#f08a24] bg-white text-[#0f2a5f] hover:border-[#d66d0c] hover:bg-[#fff7ed] hover:-translate-y-0.5'
                  }`}
                  style={{ 
                    transitionDelay: selected ? '0ms' : `${index * 20}ms`
                  }}
                >
                  <span className="block text-sm font-black transition-colors duration-300">{service.shortTitle[language]}</span>
                  <span className={`mt-1 block text-xs font-semibold transition-colors duration-300 ${selected ? 'text-blue-100' : 'text-slate-500'}`}>
                    {service.title[language]}
                  </span>
                </button>
              );
            })}
          </div>

          <article id="selected-service-panel" role="tabpanel" className="animate-in fade-in slide-in-from-right-4 duration-300 glass-card overflow-hidden rounded-lg border border-[#f08a24] bg-white shadow-sm transition-all duration-300">
            <div className="border-b border-[#f08a24] p-5 sm:p-6 transition-all duration-300">
              <p className="text-sm font-black text-[#f08a24]">{activeService.shortTitle[language]}</p>
              <h3 className="mt-2 text-2xl font-black leading-tight text-[#0f2a5f] md:text-3xl transition-colors duration-300">
                {activeService.title[language]}
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 transition-colors duration-300 md:text-base">
                {activeService.description[language]}
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-3 transition-all duration-300">
              <InfoColumn title={t('serviceSelector.bestFor')} items={[activeService.bestFor]} />
              <InfoColumn title={t('serviceSelector.includes')} items={activeService.includes} />
              <InfoColumn title={t('serviceSelector.prepare')} items={activeService.prepare} />
            </div>

            <div className="glass-panel grid gap-4 border-t border-[#f08a24] bg-[#fff7ed] p-5 transition-all duration-300 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6 hover:bg-[#fff0e6]">
              <div>
                <p className="text-sm font-black text-[#7a3b00]">{t('serviceSelector.linePrompt')}</p>
                <p className="mt-1 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#0f2a5f] transition-all duration-300">
                  {lineMessage}
                </p>
              </div>
              <a
                href={companyProfile.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button inline-flex items-center justify-center rounded-lg bg-[#f08a24] px-5 py-3 text-sm font-black text-white shadow-sm transition-all duration-300 hover:bg-[#d66d0c] hover:shadow-lg hover:-translate-y-1 active:translate-y-0"
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
    <div className="glass-card rounded-lg border border-[#f08a24] bg-[#f8fafc] p-4 transition-all duration-300 hover:shadow-md hover:border-[#d66d0c]">
      <h4 className="text-sm font-black text-[#0f2a5f] transition-colors duration-300">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
        {items.map((item, index) => (
          <li key={item.en} className="flex gap-2 transition-all duration-300 hover:translate-x-1">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f08a24] transition-all duration-300" />
            <span>{item[language]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
