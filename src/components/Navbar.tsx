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
    { href: '#calculator', label: t('nav.calculator') },
    { href: '#contact', label: t('nav.contact') },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur" role="navigation" aria-label="Main navigation">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        
        {/* โลโก้: พร้อม SEO-friendly alt text */}
        <Link 
          href="/" 
          className="relative flex h-12 w-40 shrink-0 items-center md:h-14 md:w-48"
          aria-label="TRP Powers Plus - บริษัทติดตั้งระบบไฟฟ้าและโซลาร์เซลล์"
        > 
          <Image 
            src="/images/LogoTRP.webp" 
            alt="TRP Powers Plus - ผู้เชี่ยวชาญด้านระบบไฟฟ้าและพลังงาน" 
            fill 
            className="object-contain"
            priority 
          />
        </Link>

        {/* เมนูเดสก์ทอป */}
        <div className="hidden items-center gap-7 text-sm font-bold text-slate-700 lg:flex">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="relative transition-colors duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-[#f08a24] after:transition-all hover:text-[#12345f] hover:after:w-full"
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
            className="rounded-lg bg-[#f08a24] px-6 py-2 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b85c00] hover:shadow-lg hover:shadow-orange-100"
          >
            {t('hero.cta')}
          </Link>
        </div>

        {/* Hamburger Menu - Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex flex-col gap-1.5 lg:hidden"
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className={`h-0.5 w-6 bg-slate-700 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-slate-700 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-slate-700 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
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
                className="font-semibold text-slate-700 transition-colors hover:text-[#12345f]"
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
              className="rounded-lg bg-[#f08a24] py-3 text-center font-bold text-white transition-all hover:bg-[#b85c00]"
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
