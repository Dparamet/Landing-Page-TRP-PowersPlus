'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import type { PortfolioProject } from '@/content/site';
import { useLanguage } from '@/context/LanguageContext';
import { useCompanyProfile } from '@/hooks/useCompanyProfile';
import { usePortfolioProjects } from '@/hooks/usePortfolioProjects';
import { useServiceCategories } from '@/hooks/useServiceCategories';
import { applyPortfolioServiceLabels } from '@/lib/admin/portfolioPosts';

type PortfolioFilter = 'all' | string;
type LightboxImage = {
  src: string;
  alt: string;
  label: string;
};

export default function Portfolio() {
  const { t, language } = useLanguage();
  const serviceCategories = useServiceCategories();
  const portfolioProjects = usePortfolioProjects();
  const labeledProjects = useMemo(
    () => applyPortfolioServiceLabels(portfolioProjects, serviceCategories),
    [portfolioProjects, serviceCategories],
  );
  const categoryFilters: Array<{ key: PortfolioFilter; label: { th: string; en: string } }> = useMemo(
    () => [
      { key: 'all', label: { th: 'ทั้งหมด', en: 'All' } },
      ...serviceCategories.map((service) => ({ key: service.key, label: service.shortTitle })),
    ],
    [serviceCategories],
  );
  const [activeCategory, setActiveCategory] = useState<PortfolioFilter>('all');
  const [selectedTitle, setSelectedTitle] = useState(portfolioProjects[0]?.title.en ?? '');
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  const visibleProjects = useMemo(() => {
    return labeledProjects.filter((project) => activeCategory === 'all' || project.categoryKey === activeCategory);
  }, [activeCategory, labeledProjects]);

  const selectedProject = useMemo(() => {
    return visibleProjects.find((project) => project.title.en === selectedTitle) ?? visibleProjects[0] ?? labeledProjects[0];
  }, [labeledProjects, selectedTitle, visibleProjects]);

  const selectCategory = (category: PortfolioFilter) => {
    setActiveCategory(category);
    const firstProject = labeledProjects.find((project) => category === 'all' || project.categoryKey === category);
    setSelectedTitle(firstProject?.title.en ?? labeledProjects[0]?.title.en ?? '');
  };

  return (
    <section id="portfolio" className="section-reveal overflow-hidden bg-transparent py-16 text-[#182230] md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="reveal-item">
            <span className="inline-flex rounded-full border border-[#f08a24] bg-[#fff7ed] px-4 py-2 text-sm font-bold text-[#d66d0c] transition-all duration-300 hover:scale-105">
              {t('portfolio.eyebrow')}
            </span>
            <h2 className="mt-5 max-w-2xl text-3xl font-black leading-tight text-current sm:text-4xl md:text-5xl">
              {t('portfolio.title')}
            </h2>
          </div>
          <p className="reveal-item max-w-3xl text-sm font-semibold leading-7 text-current opacity-90 sm:text-base md:text-lg">{t('portfolio.description')}</p>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2" aria-label={t('portfolio.filterLabel')}>
          {categoryFilters.map((filter, index) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => selectCategory(filter.key)}
              aria-pressed={activeCategory === filter.key}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300 ease-out ${
                activeCategory === filter.key
                  ? 'border-[#0f2a5f] bg-[#0f2a5f] text-white shadow-md shadow-blue-200 -translate-y-0.5'
                  : 'border-[#f08a24] bg-white text-[#0f2a5f] hover:border-[#d66d0c] hover:bg-[#fff7ed] hover:text-[#d66d0c] hover:-translate-y-0.5'
              }`}
              style={{ 
                transitionDelay: activeCategory === filter.key ? '0ms' : `${index * 20}ms`
              }}
            >
              {filter.label[language]}
            </button>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
          <div className="grid auto-rows-fr gap-4 sm:grid-cols-2">
            {visibleProjects.map((project) => (
              <PortfolioCard
                key={project.title.en}
                project={project}
                selected={selectedProject.title.en === project.title.en}
                onSelect={() => setSelectedTitle(project.title.en)}
              />
            ))}
          </div>

          <ProjectDetail project={selectedProject} serviceCategories={serviceCategories} onOpenImage={setLightboxImage} />
        </div>
      </div>
      {lightboxImage ? <PortfolioLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} /> : null}
    </section>
  );
}

function PortfolioCard({
  project,
  selected,
  onSelect,
}: {
  project: PortfolioProject;
  selected: boolean;
  onSelect: () => void;
}) {
  const { language } = useLanguage();
  const borderClass = selected ? 'border-[#f08a24] bg-white shadow-lg shadow-orange-200' : 'border-[#f08a24] bg-white';

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group glass-card flex h-full flex-col overflow-hidden rounded-lg border text-left transition-all duration-300 ease-out hover:border-[#f08a24] hover:shadow-lg hover:-translate-y-1 ${borderClass}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={project.coverImage.src}
          alt={project.coverImage.alt[language]}
          fill
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f2a5f]/80 via-transparent to-transparent transition-opacity duration-300" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-black text-[#0f2a5f] transition-all duration-300 group-hover:scale-110">
          {project.category[language]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 transition-all duration-300">
        <h3 className="text-lg font-black leading-snug text-[#182230] transition-colors duration-300">{project.title[language]}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 transition-colors duration-300">{project.description[language]}</p>

        <dl className="mt-auto grid grid-cols-2 gap-3 pt-4 text-sm transition-all duration-300">
          {project.metrics.slice(0, 2).map((metric) => (
            <Metric key={metric.label.en} label={metric.label[language]} value={metric.value[language]} highlight={metric.highlight} />
          ))}
        </dl>
      </div>
    </button>
  );
}

function ProjectDetail({
  project,
  serviceCategories,
  onOpenImage,
}: {
  project: PortfolioProject;
  serviceCategories: Array<{ key: string; lineMessage: { th: string; en: string } }>;
  onOpenImage: (image: LightboxImage) => void;
}) {
  const { t, language } = useLanguage();
  const companyProfile = useCompanyProfile();
  const relatedService = serviceCategories.find((service) => service.key === project.categoryKey);
  const lineMessage = relatedService?.lineMessage[language] ?? t('hero.cta');

  return (
    <article className="self-start rounded-lg border border-[#f08a24] bg-white shadow-sm">
      <div className="border-b border-[#f08a24] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-black text-[#f08a24]">{project.systemType[language]}</p>
            <h3 className="mt-2 text-2xl font-black leading-tight text-[#0f2a5f] md:text-3xl">
              {project.title[language]}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
              {project.description[language]}
            </p>
          </div>
          <a
            href={companyProfile.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#f08a24] px-5 py-3 text-sm font-black text-white shadow-sm transition-colors duration-200 hover:bg-[#d66d0c]"
          >
            {t('portfolio.consultSimilar')}
          </a>
        </div>
        <p className="mt-4 rounded-lg bg-[#fff7ed] px-3 py-2 text-sm font-semibold text-[#d66d0c]">
          {t('portfolio.linePrompt')} {lineMessage}
        </p>
      </div>

      <div className="grid gap-5 p-5 sm:p-6">
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {project.metrics.map((metric) => (
            <Metric key={metric.label.en} label={metric.label[language]} value={metric.value[language]} highlight={metric.highlight} />
          ))}
          <Metric label={t('portfolio.location')} value={project.province[language]} />
        </dl>

        <div className="grid gap-3 sm:grid-cols-3">
          {project.gallery.map((image) => (
            <figure key={image.stage} className="glass-card overflow-hidden rounded-lg border border-[#f08a24] bg-white">
              <button
                type="button"
                onClick={() => onOpenImage({ src: image.src, alt: image.alt[language], label: image.label[language] })}
                className="group/image block w-full text-left focus:outline-none focus:ring-2 focus:ring-[#f08a24]/40"
                aria-label={`ดูรูป ${image.label[language]}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <Image
                  src={image.src}
                  alt={image.alt[language]}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 100vw"
                  className="object-cover"
                />
                </div>
              </button>
              <figcaption className="border-t border-[#f08a24] bg-white px-3 py-2 text-sm font-bold text-[#0f2a5f]">
                {image.label[language]}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </article>
  );
}

function PortfolioLightbox({ image, onClose }: { image: LightboxImage; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/82 p-4" role="dialog" aria-modal="true" aria-label={image.label}>
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="ปิดรูปภาพ" />
      <div className="glass-float relative w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-[#f08a24] px-4 py-3">
          <h3 className="text-sm font-black text-[#0f2a5f]">{image.label}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-bold text-[#0f2a5f] transition hover:border-[#f08a24] hover:text-[#d66d0c]"
          >
            ปิด
          </button>
        </div>
        <div className="relative h-[70vh] min-h-72 bg-slate-100 sm:min-h-80">
          <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-contain" />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${highlight ? 'border-[#f08a24] bg-[#fff7ed]' : 'border-[#f08a24] bg-[#f8fafc]'}`}>
      <dt className="text-xs font-bold text-slate-500">{label}</dt>
      <dd className={`mt-1 break-words text-base font-black ${highlight ? 'text-[#f08a24]' : 'text-[#182230]'}`}>
        {value}
      </dd>
    </div>
  );
}
