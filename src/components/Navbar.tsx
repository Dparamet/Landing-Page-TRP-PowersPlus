'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
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

  // Detect scroll for smooth navbar enhancement
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 12);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/70 shadow-sm backdrop-blur-md" role="navigation" aria-label={t('nav.mainNavigation')}>
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        
        {/* Logo with smooth hover */}
        <Link 
          href="/" 
          className="relative flex h-12 w-40 shrink-0 items-center transition-transform duration-300 hover:scale-105 md:h-16 md:w-52"
          aria-label={t('nav.logoLinkLabel')}
        > 
          <Image 
            src="/images/LogoTRP.webp" 
            alt={t('nav.logoAlt')} 
            fill 
            className="object-contain transition-transform duration-300"
            sizes="(min-width: 768px) 208px, 160px"
            priority 
          />
        </Link>

        {/* เมนูเดสก์ทอป */}
        <div className="hidden items-center gap-7 text-sm font-bold text-[#0f2a5f] lg:flex">
          {navLinks.map((link) => (
            <button 
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="relative transition-colors duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-[#f08a24] after:transition-all hover:text-[#f08a24] hover:after:w-full cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Language Switcher + CTA Button - Desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <button 
            onClick={() => scrollToSection('contact')}
            className="rounded-lg bg-[#f08a24] px-6 py-2 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#d66d0c] hover:shadow-lg hover:shadow-orange-200 cursor-pointer"
          >
            {t('hero.cta')}
          </button>
        </div>

        {/* Hamburger Menu - Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex flex-col gap-1.5 lg:hidden transition-transform duration-300"
          aria-label={t('nav.toggleMenu')}
          aria-expanded={mobileMenuOpen}
        >
          <span className={`h-0.5 w-6 bg-[#0f2a5f] transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-[#0f2a5f] transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-[#0f2a5f] transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu with smooth animation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white/70 backdrop-blur-md lg:hidden">
          <div className="flex flex-col gap-4 px-4 py-4">
            {navLinks.map((link) => (
              <button 
                key={link.id}
                onClick={() => {
                  scrollToSection(link.id);
                  setMobileMenuOpen(false);
                }}
                className="font-semibold text-[#0f2a5f] transition-colors hover:text-[#f08a24] text-left cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <div className="py-2 transition-all duration-300">
              <LanguageSwitcher />
            </div>
            <button 
              onClick={() => {
                scrollToSection('contact');
                setMobileMenuOpen(false);
              }}
              className="rounded-lg bg-[#f08a24] py-3 text-center font-bold text-white transition-all hover:bg-[#d66d0c] cursor-pointer"
            >
              {t('hero.cta')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
