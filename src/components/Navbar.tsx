'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { href: '#hero', label: t('nav.home') },
    { href: '#services', label: t('nav.services') },
    { href: '#portfolio', label: t('nav.portfolio') },
    { href: '#calculator', label: t('nav.calculator') },
    { href: '#contact', label: t('nav.contact') },
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
    <nav 
      className={`sticky top-0 z-50 w-full glass-navbar transition-all duration-300 ease-out ${
        hasScrolled 
          ? 'scrolled shadow-[0_12px_32px_rgba(15,23,42,0.12)]' 
          : 'shadow-[0_8px_24px_rgba(15,23,42,0.08)]'
      }`}
      role="navigation" 
      aria-label={t('nav.mainNavigation')}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-3 sm:px-4 md:px-6 transition-all duration-300">
        
        {/* Logo with smooth hover */}
        <Link 
          href="/" 
          className="relative flex h-10 w-32 shrink-0 items-center transition-transform duration-300 hover:scale-105 md:h-12 md:w-40"
          aria-label={t('nav.logoLinkLabel')}
        > 
          <Image 
            src="/images/LogoTRP.webp" 
            alt={t('nav.logoAlt')} 
            fill 
            className="object-contain transition-transform duration-300"
            sizes="(min-width: 768px) 192px, 160px"
            priority 
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-5 text-sm font-bold text-slate-800 lg:flex">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="group relative transition-colors duration-280 hover:text-[#f08a24]"
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
            className="group relative rounded-lg bg-[#f08a24] px-5 py-2 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d66d0c] hover:shadow-lg hover:shadow-orange-200/60 active:translate-y-0 active:shadow-md"
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
          <span className={`h-0.5 w-6 bg-slate-800 transition-all duration-320 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-slate-800 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-slate-800 transition-all duration-320 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu with smooth animation */}
      {mobileMenuOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 border-t border-slate-200 bg-white/96 duration-300 lg:hidden">
          <div className="flex flex-col gap-3 px-4 py-3">
            {navLinks.map((link, index) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="font-semibold text-slate-800 transition-colors duration-240 hover:text-[#f08a24] hover:translate-x-1"
                style={{ 
                  animationDelay: `${index * 50}ms`
                }}
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
              className="rounded-lg bg-[#f08a24] py-3 text-center font-bold text-white transition-all duration-300 hover:bg-[#d66d0c] hover:-translate-y-1 active:translate-y-0"
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
