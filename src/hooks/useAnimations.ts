/**
 * Custom animation hooks for smooth, modern animations
 * Using Motion library for optimized performance
 */

export const animationVariants = {
  // Page transitions
  pageEnter: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },

  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },

  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },

  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },

  // Slide animations
  slideInRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },

  slideInLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },

  // Hover effects
  hoverScale: {
    whileHover: { scale: 1.02, y: -2 },
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  },

  hoverLift: {
    whileHover: { y: -4, boxShadow: '0 12px 24px rgba(15, 23, 42, 0.15)' },
    whileTap: { y: -2 },
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },

  // Card animations
  cardHover: {
    whileHover: { 
      y: -8,
      boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)'
    },
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },

  // Button animations
  buttonHover: {
    whileHover: { scale: 1.03, y: -2 },
    whileTap: { scale: 0.98, y: 0 },
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  },

  // Modal animations
  modalEnter: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.92 },
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },

  modalBackdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },

  // Dropdown animations
  dropdownEnter: {
    initial: { opacity: 0, y: -8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  },

  // Stagger container for multiple items
  staggerContainer: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },

  // Floating animation
  floating: {
    animate: {
      y: [0, -6, 0],
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },

  // Pulse animation
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },

  // Smooth color transition
  colorTransition: {
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/**
 * Easing functions for animations
 */
export const easings = {
  smooth: [0.22, 1, 0.36, 1],
  snappy: [0.16, 1, 0.3, 1],
  gentle: [0.25, 0.46, 0.45, 0.94],
  bounce: [0.68, -0.55, 0.265, 1.55],
};

/**
 * Transition presets
 */
export const transitions = {
  fast: { duration: 0.2, ease: easings.snappy },
  normal: { duration: 0.3, ease: easings.snappy },
  slow: { duration: 0.5, ease: easings.smooth },
  verySlow: { duration: 0.8, ease: easings.smooth },
};

/**
 * Get stagger delay for index
 */
export const getStaggerDelay = (index: number, staggerAmount: number = 0.1) => {
  return index * staggerAmount;
};
