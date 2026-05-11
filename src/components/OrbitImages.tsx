'use client';

import Image from 'next/image';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { portfolioProjects } from '@/data/siteContent';
import { useLanguage } from '@/context/LanguageContext';
import type { PortfolioProject } from '@/data/siteContent';

type OrbitImagesProps = {
  orbitProgress: MotionValue<number>;
  galleryProgress: MotionValue<number>;
};

export default function OrbitImages({ orbitProgress, galleryProgress }: OrbitImagesProps) {
  const { language } = useLanguage();
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [canAnimate, setCanAnimate] = useState(false);
  const autoProgress = useMotionValue(0);
  const mixedProgress = useMotionValue(0);

  useEffect(() => {
    const syncViewport = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const width = window.innerWidth;

      setViewportWidth(width);
      setCanAnimate(width >= 768 && !prefersReducedMotion && document.visibilityState === 'visible');
    };

    syncViewport();
    window.addEventListener('resize', syncViewport);
    document.addEventListener('visibilitychange', syncViewport);
    return () => {
      window.removeEventListener('resize', syncViewport);
      document.removeEventListener('visibilitychange', syncViewport);
    };
  }, []);

  useAnimationFrame((_, delta) => {
    if (!canAnimate) {
      return;
    }

    const gallery = galleryProgress.get();
    const autoplay = autoProgress.get() + delta * 0.000035;
    autoProgress.set(autoplay);
    mixedProgress.set(autoplay * (1 - gallery) + orbitProgress.get() * gallery);
  });

  const radius = useMemo(() => {
    const radiusX = Math.min(Math.max(viewportWidth * 0.34, 148), 520);
    const radiusY = Math.min(Math.max(viewportWidth * 0.16, 76), 228);
    return { radiusX, radiusY };
  }, [viewportWidth]);

  const radiusX = useSpring(
    useTransform(galleryProgress, [0, 1], [radius.radiusX * 0.42, radius.radiusX]),
    { stiffness: 100, damping: 30 },
  );
  const radiusY = useSpring(
    useTransform(galleryProgress, [0, 1], [radius.radiusY * 0.38, radius.radiusY]),
    { stiffness: 100, damping: 30 },
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div className="relative h-[min(64vw,520px)] w-full max-w-6xl">
        {portfolioProjects.map((project, index) => (
          <OrbitItem
            key={project.title.en}
            project={project}
            language={language}
            phase={index / portfolioProjects.length}
            mixedProgress={mixedProgress}
            radiusX={radiusX}
            radiusY={radiusY}
          />
        ))}
      </div>
    </div>
  );
}

function OrbitItem({
  project,
  language,
  phase,
  mixedProgress,
  radiusX,
  radiusY,
}: {
  project: PortfolioProject;
  language: 'th' | 'en';
  phase: number;
  mixedProgress: MotionValue<number>;
  radiusX: MotionValue<number>;
  radiusY: MotionValue<number>;
}) {
  const x = useTransform([mixedProgress, radiusX], ([progress, rx]) => {
    return Math.cos((Number(progress) + phase) * Math.PI * 2) * Number(rx);
  });
  const y = useTransform([mixedProgress, radiusY], ([progress, ry]) => {
    return Math.sin((Number(progress) + phase) * Math.PI * 2) * Number(ry);
  });
  const focusStrength = useTransform(mixedProgress, (progress) => {
    const angle = ((progress + phase) % 1) * Math.PI * 2;
    return (Math.sin(angle) + 1) / 2;
  });
  const scale = useTransform(focusStrength, [0, 1], [0.76, 1.2]);
  const opacity = useTransform(focusStrength, [0, 0.28, 1], [0.34, 0.7, 1]);
  const zIndex = useTransform(focusStrength, (focus) => Math.round(20 + focus * 30));

  return (
    <motion.article
      className="absolute left-1/2 top-1/2 w-[clamp(132px,17vw,220px)] rounded-lg border border-white/25 bg-white/16 p-3 text-white shadow-2xl shadow-slate-950/25 backdrop-blur md:will-change-transform"
      style={{ x, y, scale, opacity, zIndex, translateX: '-50%', translateY: '-50%' }}
    >
      <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-md border border-white/20 bg-[#12345f]/60">
        <Image
          src={project.coverImage.src}
          alt={project.coverImage.alt[language]}
          fill
          sizes="220px"
          className="object-contain p-5"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#f08a24]/20 via-transparent to-[#1e4f8f]/30" />
      </div>
      <p className="text-xl font-black leading-none text-[#fff7ed]">{project.metrics[0]?.value[language]}</p>
      <h3 className="mt-1 text-sm font-extrabold leading-tight">{project.title[language]}</h3>
      <p className="mt-1 text-xs font-semibold text-white/72">{project.category[language]}</p>
    </motion.article>
  );
}
