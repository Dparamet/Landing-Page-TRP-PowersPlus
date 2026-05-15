'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';

type DetailPageHeaderProps = {
  section: string;
  title: { th: string; en: string };
  description: { th: string; en: string };
};

/**
 * Enhanced detail page header with smooth animations and better visual hierarchy
 */
export default function DetailPageHeader({ section, title, description }: DetailPageHeaderProps) {
  const { language } = useLanguage();

  return (
    <header className="bg-gradient-to-br from-[#0f2a5f] to-[#1e4f8f] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Back button with smooth animation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Link
                href={`/#${section}`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur transition-all duration-300 hover:bg-white/20 hover:border-white/50"
              >
                <span>←</span>
                {language === 'th' ? 'ย้อนกลับหน้าแรก' : 'Back to home'}
              </Link>
            </motion.div>

            {/* Title with staggered animation */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-4xl font-black leading-tight sm:text-5xl md:text-6xl"
            >
              {title[language]}
            </motion.h1>

            {/* Description with fade-in animation */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 max-w-2xl text-base font-semibold leading-7 text-blue-100 sm:text-lg"
            >
              {description[language]}
            </motion.p>
          </motion.div>

          {/* Brand badge with scale animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="rounded-xl border border-white/20 bg-gradient-to-br from-white/15 to-white/5 px-6 py-4 text-center backdrop-blur"
          >
            <div className="text-sm font-semibold text-blue-100">{language === 'th' ? 'ระบบ' : 'System'}</div>
            <div className="mt-2 text-lg font-black text-white">TRP Powers Plus</div>
          </motion.div>
        </div>

        {/* Decorative separator line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 h-1 origin-left bg-gradient-to-r from-[#f08a24] to-transparent rounded-full"
          style={{ maxWidth: '240px' }}
        />
      </div>
    </header>
  );
}
