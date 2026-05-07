'use client';

import { useMemo, useState } from 'react';
import { portfolioProjects } from '@/data/siteContent';
import { useLanguage } from '@/context/LanguageContext';

export default function Portfolio() {
  const { t, language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'previous'>('next');

  const visibleProjects = useMemo(() => {
    return [-1, 0, 1].map((offset) => {
      const index = (activeIndex + offset + portfolioProjects.length) % portfolioProjects.length;
      return { project: portfolioProjects[index], index, offset };
    });
  }, [activeIndex]);

  const goToSlide = (nextIndex: number) => {
    const normalizedIndex = (nextIndex + portfolioProjects.length) % portfolioProjects.length;
    const forwardDistance = (normalizedIndex - activeIndex + portfolioProjects.length) % portfolioProjects.length;
    const backwardDistance = (activeIndex - normalizedIndex + portfolioProjects.length) % portfolioProjects.length;

    if (normalizedIndex === activeIndex) return;

    setSlideDirection(forwardDistance <= backwardDistance ? 'next' : 'previous');
    setActiveIndex(normalizedIndex);
  };

  return (
    <section id="portfolio" className="section-reveal overflow-hidden bg-[#f8fafc] py-20 text-[#182230]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#12345f] shadow-sm">
            {t('portfolio.eyebrow')}
          </span>
          <h2 className="mt-5 text-3xl font-black md:text-5xl">
            {t('portfolio.title')} <span className="text-[#f08a24]">TRP</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600 md:text-lg">{t('portfolio.description')}</p>
        </div>

        <div className="relative">
          <div
            key={activeIndex}
            className={`portfolio-slide portfolio-slide-${slideDirection} grid grid-cols-[minmax(260px,0.74fr)_minmax(280px,1.6fr)_minmax(260px,0.74fr)] items-stretch gap-5 max-lg:grid-cols-1`}
          >
            {visibleProjects.map(({ project, index, offset }) => {
              const isActive = offset === 0;
              const accentClass = project.accent === 'orange' ? 'from-[#f97316]' : 'from-[#2563eb]';

              return (
                <article
                  key={`${project.title.en}-${activeIndex}-${offset}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`group relative min-h-[360px] overflow-hidden rounded-lg border transition duration-500 ${
                    isActive
                      ? 'scale-100 border-white shadow-2xl shadow-orange-100'
                      : 'scale-[0.94] border-white/80 opacity-75 max-lg:hidden'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${accentClass} via-[#1e4f8f] to-[#12345f]`} />
                  <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(90deg,rgba(255,255,255,.25)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px)] [background-size:48px_48px]" />
                  <div className="absolute inset-x-0 top-0 h-24 bg-white/10 blur-3xl transition duration-500 group-hover:translate-y-4" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="relative flex h-full min-h-[360px] flex-col justify-end p-6 md:p-8">
                    <span className="mb-4 w-fit rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur">
                      {project.category[language]}
                    </span>
                    <h3 className={`${isActive ? 'text-3xl md:text-4xl' : 'text-2xl'} font-black text-white`}>
                      {project.title[language]}
                    </h3>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-blue-50 md:text-base">
                      {project.description[language]}
                    </p>

                    <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg bg-white/12 p-3 backdrop-blur">
                        <dt className="text-blue-100">{t('portfolio.size')}</dt>
                        <dd className="mt-1 font-bold text-[#ffd98a]">{project.size}</dd>
                      </div>
                      <div className="rounded-lg bg-white/12 p-3 backdrop-blur">
                        <dt className="text-blue-100">{t('portfolio.location')}</dt>
                        <dd className="mt-1 font-bold text-[#ffd98a]">{project.location[language]}</dd>
                      </div>
                    </dl>

                    <button
                      type="button"
                      onClick={() => goToSlide(index)}
                      className="mt-6 w-fit rounded-lg border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-[#ffd98a] hover:bg-white hover:text-[#12345f]"
                    >
                      {t('portfolio.viewMore')}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => goToSlide(activeIndex - 1)}
              aria-label={t('portfolio.previous')}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl font-bold text-[#12345f] shadow-sm transition hover:-translate-x-0.5 hover:border-[#f08a24] hover:bg-[#fff7ed]"
            >
              ‹
            </button>
            <div className="rounded-full border border-slate-200 bg-white px-5 py-3 font-bold text-[#182230] shadow-sm">
              {activeIndex + 1} / {portfolioProjects.length}
            </div>
            <button
              type="button"
              onClick={() => goToSlide(activeIndex + 1)}
              aria-label={t('portfolio.next')}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl font-bold text-[#12345f] shadow-sm transition hover:translate-x-0.5 hover:border-[#f08a24] hover:bg-[#fff7ed]"
            >
              ›
            </button>
          </div>

          <div className="mt-5 flex justify-center gap-2">
            {portfolioProjects.map((project, index) => (
              <button
                key={project.title.en}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`${t('portfolio.slide')} ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? 'w-8 bg-[#f08a24]' : 'w-2.5 bg-slate-300 hover:bg-[#12345f]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
