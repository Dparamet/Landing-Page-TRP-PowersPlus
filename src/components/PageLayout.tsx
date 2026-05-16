'use client';

import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Enhanced page layout with automatic smooth transitions
 * Wraps entire detail pages for consistent animation behavior
 */
export default function PageLayout({ 
  children, 
  className = '' 
}: PageLayoutProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={`min-h-screen ${className}`}
    >
      {children}
    </motion.main>
  );
}
