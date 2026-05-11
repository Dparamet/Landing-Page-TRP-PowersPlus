import type { PortfolioProject, PortfolioStage } from '@/content/site';
import type { Database } from '@/lib/supabase/database.types';

export type PortfolioImageSlot = 'cover' | PortfolioStage;
export type PortfolioImageOverride = Database['public']['Tables']['portfolio_image_overrides']['Row'];

export function portfolioProjectKey(project: Pick<PortfolioProject, 'title'>): string {
  return project.title.en
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function applyPortfolioImageOverrides(
  projects: PortfolioProject[],
  overrides: PortfolioImageOverride[],
): PortfolioProject[] {
  const overrideMap = new Map<string, PortfolioImageOverride>();

  for (const override of overrides) {
    if (override.deleted_at) {
      continue;
    }

    overrideMap.set(`${override.project_key}:${override.image_slot}`, override);
  }

  return projects.map((project) => {
    const projectKey = portfolioProjectKey(project);
    const coverOverride = overrideMap.get(`${projectKey}:cover`);

    return {
      ...project,
      coverImage: coverOverride
        ? {
            ...project.coverImage,
            src: coverOverride.image_url,
            alt: {
              th: coverOverride.alt_th || project.coverImage.alt.th,
              en: coverOverride.alt_th || project.coverImage.alt.en,
            },
          }
        : project.coverImage,
      gallery: project.gallery.map((image) => {
        const override = overrideMap.get(`${projectKey}:${image.stage}`);

        if (!override) {
          return image;
        }

        return {
          ...image,
          src: override.image_url,
          alt: {
            th: override.alt_th || image.alt.th,
            en: override.alt_th || image.alt.en,
          },
        };
      }),
    };
  });
}
