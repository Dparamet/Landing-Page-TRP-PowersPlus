'use client';

import { useLanguage } from '@/context/LanguageContext';
import FooterContent from './FooterContent';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-slate-700">
      <FooterContent />

      {/* Copyright Bar */}
      <div className="bg-white px-4 pb-6 pt-2 text-center text-sm">
        <p className="text-slate-600">
          © {currentYear} <span className="font-bold text-[#0f2a5f]">TRP Powers Plus</span>. {t('footer.legal')}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {t('footer.tagline')}
        </p>
      </div>
    </footer>
  );
}
