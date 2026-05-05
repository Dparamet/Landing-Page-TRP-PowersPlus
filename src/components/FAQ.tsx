'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import th from '@/locales/th.json';
import en from '@/locales/en.json';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { t, language } = useLanguage();

  // Get FAQ data from translations
  const translations = language === 'th' ? th : en;
  const faqs = translations.faq.questions;

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('faq.title')}
          </h2>
          <p className="text-gray-600 text-lg">
            {t('faq.subtitle')}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
            >
              {/* Question Button */}
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
              >
                <h3 className="font-semibold text-gray-900 text-lg">{faq.question}</h3>
                <span
                  className={`text-orange-600 text-2xl transition-transform duration-300 ${
                    activeIndex === index ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>

              {/* Answer */}
              {activeIndex === index && (
                <div className="px-6 py-4 bg-white border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            {t('faq.cta')}
          </p>
          <a
            href="#contact"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-bold transition-colors"
          >
            {t('contact.title')}
          </a>
        </div>
      </div>
    </section>
  );
}
