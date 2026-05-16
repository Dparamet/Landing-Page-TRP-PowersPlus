'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import CompanyLogo from '@/components/CompanyLogo';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
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

  // Detect scroll for smooth navbar enhancement
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 12);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#d66d0c] bg-[#f08a24] shadow-lg shadow-orange-300/30 backdrop-blur" role="navigation" aria-label={t('nav.mainNavigation')}>
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        
        {/* Logo with smooth hover */}
        <Link 
          href="/" 
          className="relative flex h-10 w-32 shrink-0 items-center transition-transform duration-300 hover:scale-105 md:h-12 md:w-40"
          aria-label={t('nav.logoLinkLabel')}
        > 
          <CompanyLogo alt={t('nav.logoAlt')} className="h-full w-full object-contain transition-transform duration-300" />
        </Link>

        {/* เมนูเดสก์ทอป */}
        <div className="hidden items-center gap-7 text-sm font-bold text-white lg:flex">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="relative transition-colors duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-all hover:text-white/80 hover:after:w-full"
            >
              {link.label}
              <span className="absolute -bottom-2 left-0 h-0.5 w-0 bg-gradient-to-r from-[#f08a24] to-[#d66d0c] transition-all duration-320 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Language Switcher + CTA Button - Desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <Link 
            href="#contact" 
            className="rounded-lg bg-[#f08a24] px-6 py-2 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#d66d0c] hover:shadow-lg hover:shadow-orange-200"
          >
            {t('hero.cta')}
          </Link>
        </div>

        {/* Hamburger Menu - Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex flex-col gap-1.5 lg:hidden transition-transform duration-300"
          aria-label={t('nav.toggleMenu')}
          aria-expanded={mobileMenuOpen}
        >
          <span className={`h-0.5 w-6 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu with smooth animation */}
      {mobileMenuOpen && (
        <div className="border-t border-[#d66d0c] bg-[#f08a24] lg:hidden">
          <div className="flex flex-col gap-4 px-4 py-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="font-semibold text-white transition-colors hover:text-white/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="py-2 transition-all duration-300">
              <LanguageSwitcher />
            </div>
            <Link 
              href="#contact" 
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
