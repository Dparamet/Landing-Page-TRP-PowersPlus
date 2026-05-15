'use client';

import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { animationVariants } from '@/hooks/useAnimations';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Smooth page transition wrapper
 * Wraps page content for enter/exit animations
 */
export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      initial={animationVariants.pageEnter.initial}
      animate={animationVariants.pageEnter.animate}
      transition={animationVariants.pageEnter.transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Smooth fade-in section with optional delay
 */
export function AnimatedSection({ 
  children, 
  className = '',
  delay = 0 
}: AnimatedSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1],
        delay 
      }}
      viewport={{ once: true, margin: '-100px' }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
}

/**
 * Container for staggered animations of multiple items
 */
export function AnimatedContainer({
  children,
  className = '',
  stagger = false,
  delay = 0,
}: AnimatedContainerProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ 
        staggerChildren: stagger ? 0.1 : 0,
        delayChildren: delay,
      }}
      viewport={{ once: true, margin: '-100px' }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedItemProps {
  children: ReactNode;
  className?: string;
}

/**
 * Individual item in a staggered container
 */
export function AnimatedItem({ children, className = '' }: AnimatedItemProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      viewport={{ once: true, margin: '-50px' }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedHoverProps {
  children: ReactNode;
  className?: string;
}

/**
 * Add smooth hover animations to any element
 */
export function AnimatedHover({ children, className = '' }: AnimatedHoverProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
