'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { href: '#hero', label: t('nav.home') },
    { href: '#services', label: t('nav.services') },
    { href: '#portfolio', label: t('nav.portfolio') },
    { href: '#contact', label: t('nav.contact') },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md" role="navigation" aria-label="Main navigation">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        
        {/* โลโก้: พร้อม SEO-friendly alt text */}
        <Link 
          href="/" 
          className="relative flex h-12 w-40 shrink-0 items-center md:h-14 md:w-48"
          aria-label="TRP Powers Plus - บริษัทติดตั้งระบบไฟฟ้าและโซลาร์เซลล์"
        > 
          <Image 
            src="/images/LogoTRP.png" 
            alt="TRP Powers Plus - ผู้เชี่ยวชาญด้านระบบไฟฟ้าและพลังงาน" 
            fill 
            className="object-contain"
            priority 
          />
        </Link>

        {/* เมนูเดสก์ทอป */}
        <div className="hidden items-center gap-8 text-base font-semibold text-gray-700 md:flex">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="transition-colors duration-200 hover:text-orange-600"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Language Switcher + CTA Button - Desktop */}
        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          <Link 
            href="#contact" 
            className="rounded-lg bg-orange-600 px-6 py-2 font-bold text-white transition-all duration-200 hover:bg-orange-700"
          >
            {t('hero.cta')}
          </Link>
        </div>

        {/* Hamburger Menu - Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col gap-1.5"
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className={`h-0.5 w-6 bg-gray-800 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-gray-800 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-gray-800 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-white md:hidden">
          <div className="flex flex-col gap-4 px-4 py-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="text-gray-700 font-semibold hover:text-orange-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="py-2">
              <LanguageSwitcher />
            </div>
            <Link 
              href="#contact" 
              className="rounded-lg bg-orange-600 py-2 text-center font-bold text-white hover:bg-orange-700 transition-all"
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