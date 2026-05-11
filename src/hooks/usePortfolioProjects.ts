'use client';

import { useEffect, useState } from 'react';

import { portfolioProjects as staticPortfolioProjects, type PortfolioProject } from '@/content/site';
import { mapPortfolioProjectRowToProject, type PortfolioProjectRow } from '@/lib/admin/portfolioPosts';
import { applyPortfolioImageOverrides, type PortfolioImageOverride } from '@/lib/portfolioImages';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export function usePortfolioProjects() {
  const [projects, setProjects] = useState<PortfolioProject[]>(staticPortfolioProjects);

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const client: SupabaseClient<Database> = supabase;

    async function loadPortfolioData() {
      const [{ data: overrideRows, error: overrideError }, { data: projectRows, error: projectError }] = await Promise.all([
        client.from('portfolio_image_overrides').select('*'),
        client
          .from('portfolio_projects')
          .select('*')
          .eq('published', true)
          .is('deleted_at', null)
          .order('sort_order', { ascending: true }),
      ]);

      if (!isMounted || overrideError || projectError) {
        return;
      }

      const databaseProjects = ((projectRows as PortfolioProjectRow[] | null) ?? []).map(mapPortfolioProjectRowToProject);
      const mergedProjects = [...staticPortfolioProjects, ...databaseProjects];

      setProjects(applyPortfolioImageOverrides(mergedProjects, (overrideRows as PortfolioImageOverride[] | null) ?? []));
    }

    void loadPortfolioData();

    return () => {
      isMounted = false;
    };
  }, []);

  return projects;
}
