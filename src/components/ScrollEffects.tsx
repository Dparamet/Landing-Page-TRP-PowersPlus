'use client';

import { useEffect } from 'react';

const REVEAL_SELECTOR = '.section-reveal, .reveal-item';
const CLASS_VISIBLE = 'is-visible';
const CLASS_FROM_TOP = 'reveal-from-top';
const CLASS_FROM_BOTTOM = 'reveal-from-bottom';

type ScrollDirection = 'up' | 'down';

function applyDirection(element: Element, direction: ScrollDirection) {
  // Only update if direction changed
  const hasFromTop = element.classList.contains(CLASS_FROM_TOP);
  const hasFromBottom = element.classList.contains(CLASS_FROM_BOTTOM);
  
  if (direction === 'up' && !hasFromTop) {
    element.classList.remove(CLASS_FROM_BOTTOM);
    element.classList.add(CLASS_FROM_TOP);
  } else if (direction === 'down' && !hasFromBottom) {
    element.classList.remove(CLASS_FROM_TOP);
    element.classList.add(CLASS_FROM_BOTTOM);
  }
}

export default function ScrollEffects() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let lastScrollY = window.scrollY;
    let scrollDirection: ScrollDirection = 'down';
    let rafId: number | null = null;

    // Debounced scroll direction update using RAF
    const updateScrollDirection = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const nextScrollY = window.scrollY;
        
        // Only update if scroll distance is significant
        if (Math.abs(nextScrollY - lastScrollY) > 8) {
          const newDirection = nextScrollY < lastScrollY ? 'up' : 'down';
          
          if (newDirection !== scrollDirection) {
            scrollDirection = newDirection;
            // Update all currently observed elements
            const revealElements = document.querySelectorAll(REVEAL_SELECTOR);
            revealElements.forEach(element => {
              applyDirection(element, scrollDirection);
            });
          }
          
          lastScrollY = nextScrollY;
        }
        rafId = null;
      });
    };

    let observer: IntersectionObserver | null = null;

    const revealElement = (element: Element) => {
      element.classList.add(CLASS_VISIBLE);
      element.querySelectorAll(REVEAL_SELECTOR).forEach((child) => {
        child.classList.add(CLASS_VISIBLE);
        observer?.unobserve(child);
      });
      observer?.unobserve(element);
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Apply direction and visibility in one operation
          applyDirection(entry.target, scrollDirection);
          if (entry.isIntersecting) {
            revealElement(entry.target);
          }
        });
      },
      {
        threshold: 0.08, // Increased from 0.01 to reduce firing frequency
        rootMargin: '0px 0px -10% 0px', // Simplified, only watch bottom edge
      }
    );

    const observedElements = new Set<Element>();

    const observeRevealElements = () => {
      const revealElements = document.querySelectorAll(REVEAL_SELECTOR);

      revealElements.forEach((element) => {
        if (element.classList.contains(CLASS_VISIBLE)) {
          return;
        }

        if (element.classList.contains('reveal-item') && element.closest(`.section-reveal.${CLASS_VISIBLE}`)) {
          revealElement(element);
          observedElements.add(element);
          return;
        }

        if (!observedElements.has(element)) {
          applyDirection(element, scrollDirection);
          observer.observe(element);
          observedElements.add(element);
        }
      });
    };

    observeRevealElements();

    const mutationObserver = new MutationObserver(() => {
      observeRevealElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
    
    // Keep dynamic CMS content visible after React swaps fallback rows for database rows.
    window.addEventListener('scroll', updateScrollDirection, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      mutationObserver.disconnect();
      observer?.disconnect();
    };
  }, []);

  return null;
}
