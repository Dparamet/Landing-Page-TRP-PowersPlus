'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function BackToHome({ section = 'hero' }: { section?: string }) {
  const { language } = useLanguage();

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <Link
        href={`/#${section}`}
        className="inline-flex rounded-lg border border-[#f08a24] bg-white px-4 py-2 text-sm font-black text-[#0f2a5f] transition hover:bg-[#fff7ed] hover:text-[#d66d0c]"
      >
        {language === 'th' ? 'ย้อนกลับหน้าแรก' : 'Back to home'}
      </Link>
    </div>
  );
}
