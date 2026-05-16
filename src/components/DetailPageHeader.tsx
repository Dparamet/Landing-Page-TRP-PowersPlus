'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

type DetailPageHeaderProps = {
  section: string;
  title: { th: string; en: string };
  description: { th: string; en: string };
};

export default function DetailPageHeader({ section, title, description }: DetailPageHeaderProps) {
  const { language } = useLanguage();

  return (
    <header className="bg-gradient-to-br from-[#0f2a5f] to-[#1e4f8f] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div>
              <Link
                href={`/#${section}`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur transition-all duration-300 hover:bg-white/20 hover:border-white/50"
              >
                <span>←</span>
                {language === 'th' ? 'ย้อนกลับหน้าแรก' : 'Back to home'}
              </Link>
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              {title[language]}
            </h1>

            <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-blue-100 sm:text-lg">
              {description[language]}
            </p>
          </div>

          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/15 to-white/5 px-6 py-4 text-center backdrop-blur">
            <div className="text-sm font-semibold text-blue-100">{language === 'th' ? 'ระบบ' : 'System'}</div>
            <div className="mt-2 text-lg font-black text-white">TRP Powers Plus</div>
          </div>
        </div>

        <div className="mt-8 h-1 origin-left rounded-full bg-gradient-to-r from-[#f08a24] to-transparent" style={{ maxWidth: '240px' }} />
      </div>
    </header>
  );
}
