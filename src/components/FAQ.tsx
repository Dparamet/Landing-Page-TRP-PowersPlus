'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useFaqItems } from '@/hooks/useFaqItems';

const LANDING_FAQ_LIMIT = 6;

export default function FAQ({ showAll = false }: { showAll?: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { t, language } = useLanguage();
  const pathname = usePathname();
  const faqs = useFaqItems();
  const visibleFaqs = showAll ? faqs : faqs.slice(0, LANDING_FAQ_LIMIT);
  const hasMore = faqs.length > visibleFaqs.length;
  const sectionHref = (sectionId: string) => (pathname === '/' ? `#${sectionId}` : `/#${sectionId}`);

  return (
    <section id="faq" className="section-reveal bg-transparent py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-16 rounded-2xl glass-header px-5 py-6 text-center shadow-sm transition-all duration-300 hover:shadow-md sm:px-8">
          <h2 className="mb-4 text-4xl font-black text-[#111827] md:text-5xl">
            {t('faq.title')}
          </h2>
          <p className="text-lg text-slate-800">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {visibleFaqs.map((faq, index) => (
            <div
              key={index}
              className={`reveal-item overflow-hidden rounded-lg glass-accordion border border-[#f08a24] bg-white shadow-sm transition-all duration-300 ease-out hover:border-[#d66d0c] hover:shadow-md hover:-translate-y-1 ${
                activeIndex === index ? 'active' : ''
              }`}
              style={{ 
                transitionDelay: `${index * 30}ms`
              }}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-all duration-300 hover:bg-[#fff7ed]"
                aria-expanded={activeIndex === index}
              >
                <h3 className="text-lg font-bold text-[#182230] transition-colors duration-300">{faq.question[language]}</h3>
                <span
                  className={`text-2xl font-bold text-[#f08a24] transition-all duration-400 ${
                    activeIndex === index ? 'rotate-45 scale-110' : 'scale-100'
                  }`}
                >
                  +
                </span>
              </button>

              {activeIndex === index && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 border-t border-[#f08a24] bg-white px-6 py-4">
                  <p className="leading-relaxed text-slate-700 transition-all duration-300">{faq.answer[language]}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {hasMore ? (
          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="inline-flex rounded-lg border border-[#f08a24] bg-white px-5 py-3 text-sm font-black text-[#0f2a5f] transition hover:bg-[#fff7ed] hover:text-[#d66d0c]"
            >
              {language === 'th' ? 'อ่านเพิ่มเติมคำถามทั้งหมด' : 'View all questions'}
            </Link>
          </div>
        ) : null}

        <div className="mt-16 text-center">
          <p className="mb-6 rounded-2xl glass-panel px-5 py-4 text-slate-800 shadow-sm transition-all duration-300 hover:shadow-md">
            {t('faq.cta')}
          </p>
          <a
            href={sectionHref('contact')}
            className="inline-block rounded-lg glass-button bg-[#f08a24] px-8 py-4 font-black text-white transition-all duration-300 hover:bg-[#d66d0c] hover:shadow-lg hover:-translate-y-1 active:translate-y-0"
          >
            {t('contact.title')}
          </a>
        </div>
      </div>
    </section>
  );
}
