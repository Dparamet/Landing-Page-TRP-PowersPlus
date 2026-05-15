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
    <header className="bg-[#0f2a5f] text-white">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end lg:py-10">
        <div>
          <Link
            href={`/#${section}`}
            className="inline-flex rounded-lg border border-white/30 bg-white px-4 py-2 text-sm font-black text-[#0f2a5f] transition hover:bg-[#e3f2fd]"
          >
            {language === 'th' ? 'ย้อนกลับหน้าแรก' : 'Back to home'}
          </Link>
          <h1 className="mt-5 text-3xl font-black leading-tight sm:text-4xl md:text-5xl">{title[language]}</h1>
          <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-blue-100 sm:text-base">{description[language]}</p>
        </div>
        <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm font-black text-blue-50">
          TRP Powers Plus
        </div>
      </div>
    </header>
  );
}
