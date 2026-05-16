'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

import { useLanguage } from '@/context/LanguageContext';
import { useStandardItems } from '@/hooks/useStandardItems';

const sectionCopy = {
  th: {
    title: 'มาตรฐานและเทคโนโลยี',
    description:
      'เป็นผู้นำในการผลิตและจำหน่ายสินค้านวัตกรรม เพื่องานก่อสร้าง ซ่อมแซม และตกแต่งด้วยมาตรฐานอเมริกา และมาตรฐานสากลนำมาซึ่งความพึงพอใจของผู้บริโภค',
    previous: 'เลื่อนรูปไปทางซ้าย',
    next: 'เลื่อนรูปไปทางขวา',
  },
  en: {
    title: 'Standards and Technology',
    description:
      'We bring proven standards and modern construction technology into installation, repair, and finishing work for consistent quality and customer confidence.',
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
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const carouselItems = Array.from({ length: repeatCount }, () => items).flat();

  function moveTrack(delta: number) {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const segmentWidth = track.scrollWidth / repeatCount;
    const centerIndex = Math.floor(repeatCount / 2);
    const min = segmentWidth * (centerIndex - 1);
    const max = segmentWidth * (centerIndex + 1);

    offsetRef.current += delta;

    if (offsetRef.current < min) {
      offsetRef.current += segmentWidth;
    } else if (offsetRef.current > max) {
      offsetRef.current -= segmentWidth;
    }

    track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
  }

  useEffect(() => {
    const track = trackRef.current;

    if (!track || items.length === 0) {
      return;
    }

    const segmentWidth = track.scrollWidth / repeatCount;
    offsetRef.current = segmentWidth * Math.floor(repeatCount / 2);
    track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
  }, [items.length]);

  useEffect(() => {
    function tick() {
      const hovered = carouselRef.current?.matches(':hover') ?? false;
      const focused = carouselRef.current?.contains(document.activeElement) ?? false;

      if (!pausedRef.current && !hovered && !focused) {
        moveTrack(0.45);
      }

      animationRef.current = window.requestAnimationFrame(tick);
    }

    animationRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      const track = trackRef.current;

      if (!track) {
        return;
      }

      const segmentWidth = track.scrollWidth / repeatCount;
      offsetRef.current = segmentWidth * Math.floor(repeatCount / 2);
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function scrollByAmount(direction: -1 | 1) {
    moveTrack(direction * 420);
  }

  return (
    <section id="standards" className="section-reveal relative overflow-hidden bg-[#f7fafc] pt-14 pb-10 text-[#182230] md:pt-16">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[64%] opacity-[0.08]" aria-hidden="true">
        <div className="h-full w-full bg-[linear-gradient(135deg,transparent_0_16%,#0f2a5f_16.2%_16.6%,transparent_16.8%_41%,#0f2a5f_41.2%_41.6%,transparent_41.8%),linear-gradient(25deg,transparent_0_31%,#0f2a5f_31.2%_31.6%,transparent_31.8%_63%,#0f2a5f_63.2%_63.6%,transparent_63.8%)]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(15,42,95,0.12),rgba(255,255,255,0.76),rgba(240,138,36,0.18))]" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl">{copy.title}</h2>
          <p className="mt-4 text-sm font-semibold leading-7 text-slate-700 sm:text-base md:text-lg md:leading-8">{copy.description}</p>
      </div>

      <div
        ref={carouselRef}
        className="group relative mt-7 w-screen overflow-x-hidden overflow-y-visible py-14 md:mt-8 md:py-16"
        onPointerEnter={() => {
          pausedRef.current = true;
        }}
        onPointerLeave={() => {
          pausedRef.current = false;
        }}
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
        onFocus={() => {
          pausedRef.current = true;
        }}
        onBlur={() => {
          pausedRef.current = false;
        }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#f7fafc] via-[#f7fafc]/88 to-transparent md:w-36" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#fff7ed] via-[#f7fafc]/88 to-transparent md:w-36" />

        <button
          type="button"
          onClick={() => {
            pausedRef.current = true;
            scrollByAmount(-1);
          }}
          className="absolute left-5 top-1/2 z-20 flex h-20 w-10 -translate-y-1/2 items-center justify-center bg-transparent text-6xl font-light leading-none text-[#0f2a5f] transition hover:text-[#f08a24] focus:outline-none focus:ring-2 focus:ring-[#0f2a5f]/30 md:left-14"
          aria-label={copy.previous}
        >
          ‹
        </button>

        <div className="overflow-visible px-28 py-8 md:px-44">
          <div ref={trackRef} className="flex w-max items-center gap-14 will-change-transform md:gap-24 lg:gap-32">
          {carouselItems.map((item, index) => {
            const step = index % 3;
            const zigzagClass = step === 0 ? '-translate-y-8' : step === 1 ? 'translate-y-0' : 'translate-y-8';
            return (
              <article
                key={`${item.id}-${index}`}
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

        <button
          type="button"
          onClick={() => {
            pausedRef.current = true;
            scrollByAmount(1);
          }}
          className="absolute right-5 top-1/2 z-20 flex h-20 w-10 -translate-y-1/2 items-center justify-center bg-transparent text-6xl font-light leading-none text-[#0f2a5f] transition hover:text-[#f08a24] focus:outline-none focus:ring-2 focus:ring-[#0f2a5f]/30 md:right-14"
          aria-label={copy.next}
        >
          ›
        </button>
      </div>
    </section>
  );
}
