'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useLanguage } from '@/context/LanguageContext';
import { useStandardItems } from '@/hooks/useStandardItems';

const sectionCopy = {
  th: {
    title: 'พาร์ทเนอร์และลูกค้าที่ไว้วางใจ',
    description:
      'รวมพาร์ทเนอร์และลูกค้าที่เคยเลือกใช้บริการของเรา ตั้งแต่งานบ้านพักอาศัย อาคารพาณิชย์ ไปจนถึงโครงการธุรกิจที่ต้องการระบบไฟฟ้าและพลังงานแสงอาทิตย์ที่ตรวจสอบได้',
    previous: 'เลื่อนรูปไปทางซ้าย',
    next: 'เลื่อนรูปไปทางขวา',
  },
  en: {
    title: 'Trusted Partners and Clients',
    description:
      'A selection of partners and clients who have trusted our electrical and solar services across homes, commercial buildings, and business projects that need accountable delivery.',
    previous: 'Scroll images left',
    next: 'Scroll images right',
  },
};

const repeatCount = 7;

export default function StandardsTechnology() {
  const { language } = useLanguage();
  const items = useStandardItems();
  const copy = sectionCopy[language];
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrollTweenRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false);
  const isTweeningRef = useRef(false);
  const isVisibleRef = useRef(false);
  const offsetRef = useRef(0);
  const carouselItems = useMemo(() => Array.from({ length: repeatCount }, () => items).flat(), [items]);

  const getSegmentWidth = useCallback((track: HTMLDivElement) => {
    return track.scrollWidth / repeatCount;
  }, []);

  const normalizeOffset = useCallback((offset: number, segmentWidth: number) => {
    const centerIndex = Math.floor(repeatCount / 2);
    const min = segmentWidth * (centerIndex - 1);
    const max = segmentWidth * (centerIndex + 1);
    let nextOffset = offset;

    while (nextOffset < min) {
      nextOffset += segmentWidth;
    }

    while (nextOffset > max) {
      nextOffset -= segmentWidth;
    }

    return nextOffset;
  }, []);

  const moveTrack = useCallback((delta: number) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    offsetRef.current = normalizeOffset(offsetRef.current + delta, getSegmentWidth(track));

    track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
  }, [getSegmentWidth, normalizeOffset]);

  useEffect(() => {
    const track = trackRef.current;

    if (!track || items.length === 0) {
      return;
    }

    const segmentWidth = getSegmentWidth(track);
    offsetRef.current = segmentWidth * Math.floor(repeatCount / 2);
    track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
  }, [getSegmentWidth, items.length]);

  useEffect(() => {
    if (items.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    function tick() {
      if (!isVisibleRef.current) {
        animationRef.current = null;
        return;
      }

      if (isVisibleRef.current && !isHoveringRef.current && !isTweeningRef.current && !document.hidden) {
        moveTrack(0.24);
      }

      animationRef.current = window.requestAnimationFrame(tick);
    }

    const carousel = carouselRef.current;
    const observer = carousel
      ? new IntersectionObserver(
          ([entry]) => {
            isVisibleRef.current = Boolean(entry?.isIntersecting);

            if (isVisibleRef.current && animationRef.current === null) {
              animationRef.current = window.requestAnimationFrame(tick);
            } else if (!isVisibleRef.current && animationRef.current !== null) {
              window.cancelAnimationFrame(animationRef.current);
              animationRef.current = null;
            }
          },
          { rootMargin: '160px 0px' },
        )
      : null;

    if (carousel && observer) {
      observer.observe(carousel);
    } else {
      isVisibleRef.current = true;
      animationRef.current = window.requestAnimationFrame(tick);
    }

    return () => {
      observer?.disconnect();
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (scrollTweenRef.current !== null) {
        window.cancelAnimationFrame(scrollTweenRef.current);
        scrollTweenRef.current = null;
      }
    };
  }, [items.length, moveTrack]);

  useEffect(() => {
    function handleResize() {
      const track = trackRef.current;

      if (!track) {
        return;
      }

      const segmentWidth = getSegmentWidth(track);
      offsetRef.current = segmentWidth * Math.floor(repeatCount / 2);
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getSegmentWidth]);

  function scrollByAmount(direction: -1 | 1) {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    if (scrollTweenRef.current !== null) {
      window.cancelAnimationFrame(scrollTweenRef.current);
    }

    const activeTrack = track;
    const duration = 700;
    const startOffset = offsetRef.current;
    const targetOffset = startOffset + direction * 420;
    const startTime = window.performance.now();

    isTweeningRef.current = true;

    function easeOutCubic(value: number) {
      return 1 - Math.pow(1 - value, 3);
    }

    function animate(now: number) {
      const elapsed = Math.min(1, (now - startTime) / duration);
      const progress = easeOutCubic(elapsed);
      const nextOffset = normalizeOffset(startOffset + (targetOffset - startOffset) * progress, getSegmentWidth(activeTrack));

      activeTrack.style.transform = `translate3d(${-nextOffset}px, 0, 0)`;

      if (elapsed < 1) {
        offsetRef.current = nextOffset;
        scrollTweenRef.current = window.requestAnimationFrame(animate);
        return;
      }

      offsetRef.current = nextOffset;
      isTweeningRef.current = false;
      scrollTweenRef.current = null;
    }

    scrollTweenRef.current = window.requestAnimationFrame(animate);
  }

  return (
    <section id="standards" className="section-reveal relative overflow-hidden bg-[#f7fafc] pt-14 pb-10 text-[#182230] md:pt-16">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[64%] opacity-[0.08]" aria-hidden="true">
        <div className="h-full w-full bg-[linear-gradient(135deg,transparent_0_16%,#0f2a5f_16.2%_16.6%,transparent_16.8%_41%,#0f2a5f_41.2%_41.6%,transparent_41.8%),linear-gradient(25deg,transparent_0_31%,#0f2a5f_31.2%_31.6%,transparent_31.8%_63%,#0f2a5f_63.2%_63.6%,transparent_63.8%)]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(15,42,95,0.12),rgba(255,255,255,0.76),rgba(240,138,36,0.18))]" />

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-[#f7fafc]/60 via-[#f7fafc]/25 to-transparent md:w-36" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-[#fff7ed]/55 via-[#f7fafc]/25 to-transparent md:w-36" aria-hidden="true" />

      <button
        type="button"
        onClick={() => {
          scrollByAmount(-1);
        }}
        className="absolute inset-y-0 left-0 z-20 flex h-full w-16 items-stretch justify-start rounded-r-4xl border-r border-white/40 bg-white/20 bg-linear-to-r from-white/35 via-white/12 to-transparent pl-3 shadow-[0_0_20px_rgba(15,42,95,0.06)] backdrop-blur-lg transition duration-300 hover:bg-white/28 hover:pl-4 md:w-20 md:pl-4 md:hover:pl-5"
        aria-label={copy.previous}
      >
        <span className="flex h-full items-center text-4xl font-black leading-none text-[#0f2a5f] transition duration-300 hover:text-[#f08a24] md:text-5xl">
          ‹
        </span>
      </button>

      <button
        type="button"
        onClick={() => {
          scrollByAmount(1);
        }}
        className="absolute inset-y-0 right-0 z-20 flex h-full w-16 items-stretch justify-end rounded-l-4xl border-l border-white/40 bg-white/20 bg-linear-to-l from-white/35 via-white/12 to-transparent pr-3 shadow-[0_0_20px_rgba(15,42,95,0.06)] backdrop-blur-lg transition duration-300 hover:bg-white/28 hover:pr-4 md:w-20 md:pr-4 md:hover:pr-5"
        aria-label={copy.next}
      >
        <span className="flex h-full items-center text-4xl font-black leading-none text-[#0f2a5f] transition duration-300 hover:text-[#f08a24] md:text-5xl">
          ›
        </span>
      </button>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl">{copy.title}</h2>
          <p className="mt-4 text-sm font-semibold leading-7 text-slate-700 sm:text-base md:text-lg md:leading-8">{copy.description}</p>
      </div>

      <div
        ref={carouselRef}
        onPointerEnter={() => {
          isHoveringRef.current = true;
        }}
        onPointerLeave={() => {
          isHoveringRef.current = false;
        }}
        className="group relative mt-7 w-screen overflow-x-hidden overflow-y-visible py-14 md:mt-8 md:py-16"
      >
        <div className="overflow-visible pl-36 pr-20 py-8 md:pl-56 md:pr-24 lg:pl-72 lg:pr-28">
          <div ref={trackRef} className="flex w-max items-center gap-14 will-change-transform md:gap-24 lg:gap-32">
          {carouselItems.map((item, index) => {
            const sourceIndex = items.length > 0 ? index % items.length : 0;
            const step = sourceIndex % 3;
            const zigzagClass = step === 0 ? '-translate-y-8' : step === 1 ? 'translate-y-0' : 'translate-y-8';
            return (
              <article
                key={`${item.id}-${index}`}
                data-standard-card="true"
                className={`group/card relative flex h-44 w-44 shrink-0 ${zigzagClass} items-center justify-center overflow-hidden rounded-lg border border-[#0f2a5f]/16 bg-white p-7 shadow-[0_14px_34px_rgba(15,42,95,0.14)] transition duration-300 hover:z-10 hover:scale-[1.04] hover:border-[#f08a24]/75 hover:shadow-[0_24px_54px_rgba(15,42,95,0.22)] sm:h-52 sm:w-52 md:h-56 md:w-56`}
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#0f2a5f,#f08a24)] opacity-75 transition duration-300 group-hover/card:h-2 group-hover/card:opacity-100" />
                <span className="pointer-events-none absolute inset-0 rounded-lg bg-[#0f2a5f]/0 backdrop-blur-0 ring-0 ring-inset ring-[#0f2a5f]/25 transition duration-300 group-hover/card:bg-[#0f2a5f]/5 group-hover/card:backdrop-blur-[1px] group-hover/card:ring-[6px]" />
                {item.imageUrl ? (
                  <div className={`relative h-full w-full transition duration-300 ${item.hoverImageUrl ? 'group-hover/card:opacity-0' : 'group-hover/card:scale-110'}`}>
                    <Image src={item.imageUrl} alt={item.altText} fill sizes="224px" className="object-contain transition duration-300 group-hover/card:scale-110" unoptimized />
                  </div>
                ) : (
                  <span className={`text-center text-4xl font-black text-[#182230] transition duration-300 sm:text-5xl ${item.hoverImageUrl ? 'group-hover/card:opacity-0' : 'group-hover/card:scale-110'}`}>
                    {item.title}
                  </span>
                )}

                {item.hoverImageUrl ? (
                  <div className="absolute inset-4 flex items-center justify-center opacity-0 transition duration-300 group-hover/card:scale-110 group-hover/card:opacity-100">
                    <div className="relative h-full w-full">
                      <Image src={item.hoverImageUrl} alt={item.altText} fill sizes="224px" className="object-contain" unoptimized />
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
          </div>
        </div>

      </div>
    </section>
  );
}
