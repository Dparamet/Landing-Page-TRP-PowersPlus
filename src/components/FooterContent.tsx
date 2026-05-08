'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useCookieConsent } from '@/context/CookieConsentContext';
import { companyProfile } from '@/content/site';

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
            <div className="mb-4 flex flex-col items-start gap-3">
              <Image
                src="/images/LogoTRP.webp"
                alt="TRP Powers Plus"
                width={190}
                height={74}
                className="h-auto w-40 object-contain"
              />
              <h3 className="text-lg font-black text-[#12345f]">{companyProfile.name}</h3>
            </div>
            <p className="text-sm leading-relaxed">
              {t('footer.companySummary')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-bold text-[#182230]">{t('footer.menu')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#hero" className="transition hover:text-[#f08a24]">{t('nav.home')}</Link></li>
              <li><Link href="#services" className="transition hover:text-[#f08a24]">{t('nav.services')}</Link></li>
              <li><Link href="#portfolio" className="transition hover:text-[#f08a24]">{t('nav.portfolio')}</Link></li>
              <li><Link href="#calculator" className="transition hover:text-[#f08a24]">{t('nav.calculator')}</Link></li>
              <li><Link href="#contact" className="transition hover:text-[#f08a24]">{t('nav.contact')}</Link></li>
              <li>
                <button type="button" onClick={openSettings} className="text-left transition hover:text-[#f08a24]">
                  {t('footer.cookieSettings')}
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-bold text-[#182230]">{t('footer.services')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="transition hover:text-[#f08a24]">{t('services.solar')}</a></li>
              <li><a href="#services" className="transition hover:text-[#f08a24]">{t('services.electrical')}</a></li>
              <li><a href="#services" className="transition hover:text-[#f08a24]">{t('services.maintenance')}</a></li>
              <li><a href="#contact" className="transition hover:text-[#f08a24]">{t('services.consultation')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-bold text-[#182230]">{t('contact.title')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href={`tel:${companyProfile.phoneHref}`} className="transition hover:text-[#f08a24]">☎ {companyProfile.phoneDisplay}</a></li>
              <li><a href={`mailto:${companyProfile.email}`} className="transition hover:text-[#f08a24]">@ {companyProfile.email}</a></li>
              <li><a href={companyProfile.lineUrl} target="_blank" rel="noopener noreferrer" className="transition hover:text-[#f08a24]">LINE {companyProfile.lineId}</a></li>
              <li><a href={companyProfile.facebookUrl} target="_blank" rel="noopener noreferrer" className="transition hover:text-[#f08a24]">Facebook {companyProfile.facebookDisplay}</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 pt-8"></div>
      </div>
    </>
  );
}
