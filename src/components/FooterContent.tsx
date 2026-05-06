'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useCookieConsent } from '@/context/CookieConsentContext';

export default function FooterContent() {
  const { t } = useLanguage();
  const { openSettings } = useCookieConsent();

  return (
    <>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-lg font-black text-[#12345f]">TRP Powers Plus</h3>
            <p className="text-sm leading-relaxed">
              บริษัทรับเหมาไฟฟ้า ติดตั้งโซลาร์เซลล์ และให้บริการด้านพลังงานทดแทนอย่างมืออาชีพ
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-bold text-[#182230]">เมนู</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#hero" className="transition hover:text-[#f08a24]">{t('nav.home')}</Link></li>
              <li><Link href="#services" className="transition hover:text-[#f08a24]">{t('nav.services')}</Link></li>
              <li><Link href="#portfolio" className="transition hover:text-[#f08a24]">{t('nav.portfolio')}</Link></li>
              <li><Link href="#calculator" className="transition hover:text-[#f08a24]">{t('nav.calculator')}</Link></li>
              <li><Link href="#contact" className="transition hover:text-[#f08a24]">{t('nav.contact')}</Link></li>
              <li>
                <button type="button" onClick={openSettings} className="text-left transition hover:text-[#f08a24]">
                  ตั้งค่าคุกกี้
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-bold text-[#182230]">บริการ</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="transition hover:text-[#f08a24]">{t('services.solar')}</a></li>
              <li><a href="#services" className="transition hover:text-[#f08a24]">{t('services.electrical')}</a></li>
              <li><a href="#services" className="transition hover:text-[#f08a24]">บำรุงรักษา</a></li>
              <li><a href="#contact" className="transition hover:text-[#f08a24]">{t('services.consultation')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-bold text-[#182230]">{t('contact.title')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="tel:+66012345678" className="transition hover:text-[#f08a24]">📞 +66 (0) 12-345-6789</a></li>
              <li><a href="mailto:TRPPowersplus@gmail.com" className="transition hover:text-[#f08a24]">✉️ TRPPowersplus@gmail.com</a></li>
              <li><a href="https://facebook.com/TRPPowersplus" target="_blank" rel="noopener noreferrer" className="transition hover:text-[#f08a24]">📘 Facebook</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 pt-8"></div>
      </div>
    </>
  );
}
