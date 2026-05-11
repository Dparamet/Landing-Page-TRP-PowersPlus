'use client';

import { useLanguage } from '@/context/LanguageContext';
import FooterContent from './FooterContent';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent text-slate-700">
      <FooterContent />

      {/* Copyright Bar */}
      <div className="border-t border-orange-100 bg-white/56 px-4 py-6 text-center text-sm backdrop-blur">
        <p className="text-slate-600">
          © {currentYear} <span className="font-bold text-[#12345f]">TRP Powers Plus</span>. {t('footer.legal')}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {t('footer.tagline')}
        </p>
      </div>
    </footer>
  );
}
