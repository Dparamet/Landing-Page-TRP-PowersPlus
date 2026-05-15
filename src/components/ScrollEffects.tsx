'use client';

import { useEffect } from 'react';

const REVEAL_SELECTOR = '.section-reveal, .reveal-item';
const CLASS_VISIBLE = 'is-visible';
const CLASS_FROM_TOP = 'reveal-from-top';
const CLASS_FROM_BOTTOM = 'reveal-from-bottom';

type ScrollDirection = 'up' | 'down';

function applyDirection(element: Element, direction: ScrollDirection) {
  element.classList.remove(CLASS_FROM_TOP, CLASS_FROM_BOTTOM);
  element.classList.add(direction === 'up' ? CLASS_FROM_TOP : CLASS_FROM_BOTTOM);
}

export default function ScrollEffects() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let lastScrollY = window.scrollY;
    let scrollDirection: ScrollDirection = 'down';

    const updateScrollDirection = () => {
      const nextScrollY = window.scrollY;
      if (Math.abs(nextScrollY - lastScrollY) < 4) {
        return;
      }

      scrollDirection = nextScrollY < lastScrollY ? 'up' : 'down';
      lastScrollY = nextScrollY;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const direction = scrollDirection;

          applyDirection(entry.target, direction);
          entry.target.classList.toggle(CLASS_VISIBLE, entry.isIntersecting);
        });
      },
      {
        threshold: 0.01,
        rootMargin: '-4% 0px -6% 0px',
      }
    );

    const observedElements = new Set<Element>();

    const observeRevealElements = () => {
      const revealElements = document.querySelectorAll(REVEAL_SELECTOR);

      revealElements.forEach((element) => {
        if (observedElements.has(element)) {
          return;
        }

        applyDirection(element, scrollDirection);
        observer.observe(element);
        observedElements.add(element);
      });
    };

    const mutationObserver = new MutationObserver(() => {
      observeRevealElements();
    });

    observeRevealElements();
    window.addEventListener('scroll', updateScrollDirection, { passive: true });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}