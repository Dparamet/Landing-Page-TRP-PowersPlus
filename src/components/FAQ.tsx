'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useFaqItems } from '@/hooks/useFaqItems';

const LANDING_FAQ_LIMIT = 6;

export default function FAQ({ showAll = false }: { showAll?: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { t, language } = useLanguage();
  const faqs = useFaqItems();
  const visibleFaqs = showAll ? faqs : faqs.slice(0, LANDING_FAQ_LIMIT);
  const hasMore = faqs.length > visibleFaqs.length;

  return (
    <section id="faq" className="section-reveal bg-transparent py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-16 rounded-2xl bg-white px-5 py-6 text-center shadow-sm sm:px-8">
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
              className="reveal-item overflow-hidden rounded-lg border border-[#f08a24] bg-white shadow-sm transition-all duration-200 hover:border-[#d66d0c] hover:shadow-md"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 bg-white px-6 py-4 text-left transition-colors hover:bg-[#fff7ed]"
                aria-expanded={activeIndex === index}
              >
                <h3 className="text-lg font-bold text-[#182230]">{faq.question[language]}</h3>
                <span
                  className={`text-2xl font-bold text-[#f08a24] transition-transform duration-300 ${
                    activeIndex === index ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>

              {activeIndex === index && (
                <div className="border-t border-[#f08a24] bg-white px-6 py-4">
                  <p className="leading-relaxed text-slate-700">{faq.answer[language]}</p>
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
          <p className="mb-6 rounded-2xl bg-white px-5 py-4 text-slate-800 shadow-sm">
            {t('faq.cta')}
          </p>
          <a
            href="#contact"
            className="inline-block rounded-lg bg-[#f08a24] px-8 py-4 font-black text-white transition-colors duration-200 hover:bg-[#d66d0c]"
          >
            {t('contact.title')}
          </a>
        </div>
      </div>
    </section>
  );
}
