'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useCookieConsent } from '@/context/CookieConsentContext';
import { useCompanyProfile } from '@/hooks/useCompanyProfile';

export default function FooterContent() {
  const { t } = useLanguage();
  const { openSettings } = useCookieConsent();
  const companyProfile = useCompanyProfile();

  return (
    <>
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
              <h3 className="text-lg font-black text-[#0f2a5f]">{companyProfile.name}</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              {t('footer.companySummary')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-bold text-[#0f2a5f]">{t('footer.menu')}</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="#hero" className="transition hover:text-[#0f2a5f]">{t('nav.home')}</Link></li>
              <li><Link href="#services" className="transition hover:text-[#0f2a5f]">{t('nav.services')}</Link></li>
              <li><Link href="#portfolio" className="transition hover:text-[#0f2a5f]">{t('nav.portfolio')}</Link></li>
              <li><Link href="#calculator" className="transition hover:text-[#0f2a5f]">{t('nav.calculator')}</Link></li>
              <li><Link href="#contact" className="transition hover:text-[#0f2a5f]">{t('nav.contact')}</Link></li>
              <li>
                <button type="button" onClick={openSettings} className="text-left transition hover:text-[#0f2a5f]">
                  {t('footer.cookieSettings')}
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-bold text-[#0f2a5f]">{t('footer.services')}</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#services" className="transition hover:text-[#0f2a5f]">{t('services.solar')}</a></li>
              <li><a href="#services" className="transition hover:text-[#0f2a5f]">{t('services.electrical')}</a></li>
              <li><a href="#services" className="transition hover:text-[#0f2a5f]">{t('services.maintenance')}</a></li>
              <li><a href="#contact" className="transition hover:text-[#0f2a5f]">{t('services.consultation')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-bold text-[#0f2a5f]">{t('contact.title')}</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href={`tel:${companyProfile.phoneHref}`} className="transition hover:text-[#0f2a5f]">☎ {companyProfile.phoneDisplay}</a></li>
              <li><a href={`mailto:${companyProfile.email}`} className="transition hover:text-[#0f2a5f]">@ {companyProfile.email}</a></li>
              <li><a href={companyProfile.lineUrl} target="_blank" rel="noopener noreferrer" className="transition hover:text-[#0f2a5f]">LINE {companyProfile.lineId}</a></li>
              <li><a href={companyProfile.facebookUrl} target="_blank" rel="noopener noreferrer" className="transition hover:text-[#0f2a5f]">Facebook {companyProfile.facebookDisplay}</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
