'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const pathname = usePathname();
  const anchorPrefix = pathname === '/' ? '' : '/';

  const navLinks = [
    { href: `${anchorPrefix}#hero`, label: t('nav.home') },
    { href: `${anchorPrefix}#services`, label: t('nav.services') },
    { href: `${anchorPrefix}#portfolio`, label: t('nav.portfolio') },
    { href: `${anchorPrefix}#calculator`, label: t('nav.calculator') },
    { href: `${anchorPrefix}#contact`, label: t('nav.contact') },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm backdrop-blur" role="navigation" aria-label={t('nav.mainNavigation')}>
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        
        {/* โลโก้: พร้อม SEO-friendly alt text */}
        <Link 
          href="/" 
          className="relative flex h-12 w-40 shrink-0 items-center md:h-14 md:w-48"
          aria-label={t('nav.logoLinkLabel')}
        > 
          <Image 
            src="/images/LogoTRP.webp" 
            alt={t('nav.logoAlt')} 
            fill 
            className="object-contain"
            sizes="(min-width: 768px) 192px, 160px"
            priority 
          />
        </Link>

        {/* เมนูเดสก์ทอป */}
        <div className="hidden items-center gap-7 text-sm font-bold text-[#182230] lg:flex">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="relative transition-colors duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-[#f08a24] after:transition-all hover:text-[#d66d0c] hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Language Switcher + CTA Button - Desktop */}
        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          <Link 
            href={`${anchorPrefix}#contact`}
            className="rounded-lg bg-[#f08a24] px-6 py-2 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#d66d0c] hover:shadow-lg hover:shadow-orange-200"
          >
            {t('hero.cta')}
          </Link>
        </div>

        {/* Hamburger Menu - Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex flex-col gap-1.5 lg:hidden"
          aria-label={t('nav.toggleMenu')}
          aria-expanded={mobileMenuOpen}
        >
          <span className={`h-0.5 w-6 bg-[#182230] transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-[#182230] transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-[#182230] transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="flex flex-col gap-4 px-4 py-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="font-semibold text-[#182230] transition-colors hover:text-[#d66d0c]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="py-2">
              <LanguageSwitcher />
            </div>
            <Link 
              href={`${anchorPrefix}#contact`}
              className="rounded-lg bg-[#f08a24] py-3 text-center font-bold text-white transition-all hover:bg-[#d66d0c]"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('hero.cta')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
