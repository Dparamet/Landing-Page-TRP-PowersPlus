'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { portfolioProjects, type PortfolioCategory, type PortfolioProject } from '@/content/site';
import { useLanguage } from '@/context/LanguageContext';

const categoryFilters: Array<{ key: 'all' | PortfolioCategory; label: { th: string; en: string } }> = [
  { key: 'all', label: { th: 'ทั้งหมด', en: 'All' } },
  { key: 'residential', label: { th: 'บ้านพักอาศัย', en: 'Residential' } },
  { key: 'factory', label: { th: 'โรงงาน', en: 'Factory' } },
  { key: 'business', label: { th: 'ธุรกิจ', en: 'Business' } },
  { key: 'agriculture', label: { th: 'เกษตร', en: 'Agriculture' } },
];

export default function Portfolio() {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'all' | PortfolioCategory>('all');
  const [selectedTitle, setSelectedTitle] = useState(portfolioProjects[0]?.title.en ?? '');

  const visibleProjects = useMemo(() => {
    return portfolioProjects.filter((project) => activeCategory === 'all' || project.categoryKey === activeCategory);
  }, [activeCategory]);

  const selectedProject = useMemo(() => {
    return visibleProjects.find((project) => project.title.en === selectedTitle) ?? visibleProjects[0] ?? portfolioProjects[0];
  }, [selectedTitle, visibleProjects]);

  const selectCategory = (category: 'all' | PortfolioCategory) => {
    setActiveCategory(category);
    const firstProject = portfolioProjects.find((project) => category === 'all' || project.categoryKey === category);
    setSelectedTitle(firstProject?.title.en ?? portfolioProjects[0]?.title.en ?? '');
  };

  return (
    <section id="portfolio" className="section-reveal overflow-hidden bg-[#f8fafc] py-20 text-[#182230]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <span className="inline-flex rounded-full border border-orange-100 bg-[#fff7ed] px-4 py-2 text-sm font-bold text-[#b85c00]">
              {t('portfolio.eyebrow')}
            </span>
            <h2 className="mt-5 max-w-2xl text-3xl font-black leading-tight text-[#12345f] md:text-5xl">
              {t('portfolio.title')}
            </h2>
          </div>
          <p className="max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">{t('portfolio.description')}</p>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2" aria-label={t('portfolio.filterLabel')}>
          {categoryFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => selectCategory(filter.key)}
              aria-pressed={activeCategory === filter.key}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:translate-y-0 ${
                activeCategory === filter.key
                  ? 'border-[#12345f] bg-[#12345f] text-white shadow-md shadow-slate-200'
                  : 'border-slate-200 bg-white text-[#12345f] hover:border-[#f08a24] hover:bg-[#fff7ed] hover:text-[#b85c00]'
              }`}
            >
              {filter.label[language]}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {visibleProjects.map((project) => (
              <PortfolioCard
                key={project.title.en}
                project={project}
                selected={selectedProject.title.en === project.title.en}
                onSelect={() => setSelectedTitle(project.title.en)}
              />
            ))}
          </div>

          <ProjectDetail project={selectedProject} />
        </div>
      </div>
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
  const { t, language } = useLanguage();
  const borderClass = selected ? 'border-[#f08a24] bg-white shadow-lg shadow-orange-100' : 'border-slate-200 bg-white';

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group overflow-hidden rounded-lg border text-left transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[#f08a24] hover:shadow-lg hover:shadow-slate-100 ${borderClass}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#12345f]">
        <Image
          src={project.coverImage.src}
          alt={project.coverImage.alt[language]}
          fill
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 100vw"
          className="object-contain p-8 opacity-85 transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12345f]/80 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-black text-[#12345f]">
          {project.category[language]}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-black leading-snug text-[#182230]">{project.title[language]}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{project.description[language]}</p>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Metric label={t('portfolio.size')} value={project.systemSize} />
          <Metric label={t('portfolio.production')} value={`${formatNumber(project.monthlyProductionKwh)} kWh`} />
        </dl>
      </div>
    </button>
  );
}

function ProjectDetail({ project }: { project: PortfolioProject }) {
  const { t, language } = useLanguage();

  return (
    <article className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-black text-[#b85c00]">{project.systemType[language]}</p>
            <h3 className="mt-2 text-2xl font-black leading-tight text-[#12345f] md:text-3xl">
              {project.title[language]}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
              {project.description[language]}
            </p>
          </div>
          <Link
            href="#contact"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#b85c00] px-5 py-3 text-sm font-black text-white shadow-md shadow-orange-100 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-[#8a4300] hover:shadow-lg active:translate-y-0"
          >
            {t('portfolio.consultSimilar')}
          </Link>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6">
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Metric label={t('portfolio.size')} value={project.systemSize} highlight />
          <Metric label={t('portfolio.production')} value={`${formatNumber(project.monthlyProductionKwh)} kWh`} />
          <Metric label={t('portfolio.savings')} value={`฿${formatNumber(project.monthlySavingsBaht)}`} highlight />
          <Metric label={t('portfolio.location')} value={project.province[language]} />
        </dl>

        <div className="grid gap-3 sm:grid-cols-3">
          {project.gallery.map((image) => (
            <figure key={image.stage} className="overflow-hidden rounded-lg border border-slate-200 bg-[#f8fafc]">
              <div className="relative aspect-[4/3]">
                <Image
                  src={image.src}
                  alt={image.alt[language]}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 100vw"
                  className="object-contain p-6"
                />
              </div>
              <figcaption className="border-t border-slate-200 bg-white px-3 py-2 text-sm font-bold text-[#12345f]">
                {image.label[language]}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${highlight ? 'border-orange-100 bg-[#fff7ed]' : 'border-slate-200 bg-[#f8fafc]'}`}>
      <dt className="text-xs font-bold text-slate-500">{label}</dt>
      <dd className={`mt-1 break-words text-base font-black ${highlight ? 'text-[#b85c00]' : 'text-[#182230]'}`}>
        {value}
      </dd>
    </div>
  );
}

function formatNumber(value: number) {
  if (value === 0) return '-';
  return new Intl.NumberFormat('th-TH', { maximumFractionDigits: 0 }).format(value);
}
