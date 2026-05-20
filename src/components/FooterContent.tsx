'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CompanyLogo from '@/components/CompanyLogo';
import { useLanguage } from '@/context/LanguageContext';
import { useCookieConsent } from '@/context/CookieConsentContext';
import { useCompanyProfile } from '@/hooks/useCompanyProfile';

export default function FooterContent() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { openSettings } = useCookieConsent();
  const companyProfile = useCompanyProfile();
  const sectionHref = (sectionId: string) => (pathname === '/' ? `#${sectionId}` : `/#${sectionId}`);

  return (
    <>
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <div className="mb-4 flex flex-col items-start gap-3">
              <CompanyLogo alt="TRP Powers Plus" className="h-auto w-40 object-contain" />
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
              <li><Link href={sectionHref('hero')} className="relative transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#0f2a5f] after:transition-all hover:text-[#0f2a5f] hover:after:w-full">{t('nav.home')}</Link></li>
              <li><Link href={sectionHref('services')} className="relative transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#0f2a5f] after:transition-all hover:text-[#0f2a5f] hover:after:w-full">{t('nav.services')}</Link></li>
              <li><Link href={sectionHref('portfolio')} className="relative transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#0f2a5f] after:transition-all hover:text-[#0f2a5f] hover:after:w-full">{t('nav.portfolio')}</Link></li>
              <li><Link href={sectionHref('calculator')} className="relative transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#0f2a5f] after:transition-all hover:text-[#0f2a5f] hover:after:w-full">{t('nav.calculator')}</Link></li>
              <li><Link href={sectionHref('contact')} className="relative transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#0f2a5f] after:transition-all hover:text-[#0f2a5f] hover:after:w-full">{t('nav.contact')}</Link></li>
              <li>
                <button type="button" onClick={openSettings} className="no-hover-bounce relative text-left transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#0f2a5f] after:transition-all hover:text-[#0f2a5f] hover:after:w-full">
                  {t('footer.cookieSettings')}
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-bold text-[#0f2a5f]">{t('footer.services')}</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href={sectionHref('services')} className="relative transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#0f2a5f] after:transition-all hover:text-[#0f2a5f] hover:after:w-full">{t('services.solar')}</a></li>
              <li><a href={sectionHref('services')} className="relative transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#0f2a5f] after:transition-all hover:text-[#0f2a5f] hover:after:w-full">{t('services.electrical')}</a></li>
              <li><a href={sectionHref('services')} className="relative transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#0f2a5f] after:transition-all hover:text-[#0f2a5f] hover:after:w-full">{t('services.maintenance')}</a></li>
              <li><a href={sectionHref('contact')} className="relative transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#0f2a5f] after:transition-all hover:text-[#0f2a5f] hover:after:w-full">{t('services.consultation')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-bold text-[#0f2a5f]">{t('contact.title')}</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href={`tel:${companyProfile.phoneHref}`} className="relative transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#0f2a5f] after:transition-all hover:text-[#0f2a5f] hover:after:w-full">☎: {companyProfile.phoneDisplay}</a></li>
              <li><a href={`mailto:${companyProfile.email}`} className="relative transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#0f2a5f] after:transition-all hover:text-[#0f2a5f] hover:after:w-full">Gmail: {companyProfile.email}</a></li>
              <li><a href={companyProfile.lineUrl} target="_blank" rel="noopener noreferrer" className="relative transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#0f2a5f] after:transition-all hover:text-[#0f2a5f] hover:after:w-full">LINE: {companyProfile.lineId}</a></li>
              <li><a href={companyProfile.facebookUrl} target="_blank" rel="noopener noreferrer" className="relative transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#0f2a5f] after:transition-all hover:text-[#0f2a5f] hover:after:w-full">Facebook: {companyProfile.facebookDisplay}</a></li>
              <li><a href={companyProfile.instagramUrl} target="_blank" rel="noopener noreferrer" className="relative transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#0f2a5f] after:transition-all hover:text-[#0f2a5f] hover:after:w-full">Instagram: {companyProfile.instagramDisplay}</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
