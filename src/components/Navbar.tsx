'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import CompanyLogo from '@/components/CompanyLogo';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { id: 'hero', label: t('nav.home') },
    { id: 'services', label: t('nav.services') },
    { id: 'calculator', label: t('nav.calculator') },
    { id: 'portfolio', label: t('nav.portfolio') },
    { id: 'contact', label: t('nav.contact') },
  ];

  const scrollToSection = (sectionId: string) => {
    if (pathname !== '/') {
      router.push(`/#${sectionId}`);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="main-site-nav sticky top-0 z-50 w-full border-b border-slate-200 bg-gradient-to-r from-white/80 via-white/70 to-slate-50 shadow-sm backdrop-blur-lg" role="navigation" aria-label={t('nav.mainNavigation')}>
      <div className="relative mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        
        {/* Logo with smooth hover */}
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-16 w-48 shrink-0 items-center transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-xl lg:static lg:top-auto lg:-translate-y-0 lg:translate-x-0 lg:h-20 lg:w-60"
          aria-label={t('nav.logoLinkLabel')}
        >
          <CompanyLogo alt={t('nav.logoAlt')} priority className="h-full w-full object-contain transition-transform duration-300 ease-in-out" />
        </Link>

        {/* เมนูเดสก์ทอป */}
        <div className="hidden items-center gap-7 text-sm font-bold text-[#0f2a5f] lg:flex lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:transform lg:z-40">
          {navLinks.map((link) => (
            <button 
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="relative transition-colors duration-300 ease-in-out hover:text-[#f08a24] focus:outline-none cursor-pointer after:content-[''] after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-[#f08a24] after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Language Switcher + CTA Button - Desktop */}
        <div className="hidden items-center gap-3 md:flex md:ml-auto">
          <LanguageSwitcher />
          <button 
            onClick={() => scrollToSection('contact')}
            className="rounded-full bg-[#f08a24] px-6 py-2 font-bold text-white transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#d66d0c] hover:shadow-lg hover:shadow-orange-200 focus:outline-none cursor-pointer"
          >
            {t('hero.cta')}
          </button>
        </div>
        {/* Hamburger Menu - Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex flex-col gap-1.5 lg:hidden transition-transform duration-300 ease-in-out md:absolute md:left-4 md:top-1/2 md:-translate-y-1/2 md:z-50 will-change-transform"
          aria-label={t('nav.toggleMenu')}
          aria-expanded={mobileMenuOpen}
        >
          <span className={`h-0.5 w-6 bg-[#0f2a5f] transition-transform duration-300 ease-in-out origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-2 shadow-md' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-[#0f2a5f] transition-opacity duration-200 ease-in-out ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-[#0f2a5f] transition-transform duration-300 ease-in-out origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-2 shadow-md' : ''}`}></span>
        </button>
        {/* Mobile Language Switcher (moved out of menu) - swapped side on mobile */}
        <div className="flex items-center md:hidden ml-3">
          <LanguageSwitcher className="scale-90" />
        </div>
      </div>
      
      {/* Mobile Menu with smooth animation (always rendered, toggles max-height/opacity) */}
      <div className={`border-t border-slate-200 bg-white/70 backdrop-blur-md lg:hidden transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className={`flex flex-col gap-4 px-4 ${mobileMenuOpen ? 'py-4' : 'py-0'}`}>
          {navLinks.map((link) => (
            <button 
              key={link.id}
              onClick={() => {
                scrollToSection(link.id);
                setMobileMenuOpen(false);
              }}
              className="font-semibold text-[#0f2a5f] transition-colors duration-300 ease-in-out hover:text-[#f08a24] text-left cursor-pointer focus:outline-none"
            >
              {link.label}
            </button>
          ))}
          {/* LanguageSwitcher moved to navbar for mobile */}
          <button 
            onClick={() => {
              scrollToSection('contact');
              setMobileMenuOpen(false);
            }}
            className="rounded-lg bg-[#f08a24] py-3 text-center font-bold text-white transition-transform duration-300 ease-in-out hover:bg-[#d66d0c] focus:outline-none cursor-pointer md:hidden"
          >
            {t('hero.cta')}
          </button>
        </div>
      </div>
    </nav>
  );
}
