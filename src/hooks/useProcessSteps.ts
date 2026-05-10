'use client';

import { useEffect, useMemo, useState } from 'react';

import en from '@/locales/en.json';
import th from '@/locales/th.json';
import { buildDefaultProcessSteps, mapProcessStepRows, type ProcessStep, type ProcessStepRow } from '@/lib/processSteps';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export function useProcessSteps() {
  const fallbackSteps = useMemo(() => buildDefaultProcessSteps(th.process.steps, en.process.steps), []);
  const [steps, setSteps] = useState<ProcessStep[]>(fallbackSteps);

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const client: SupabaseClient<Database> = supabase;

    async function loadSteps() {
      const { data, error } = await client.from('process_steps').select('*').order('sort_order', { ascending: true });

      if (!isMounted || error) {
        return;
      }

      setSteps(mapProcessStepRows((data as ProcessStepRow[] | null) ?? [], fallbackSteps));
    }

    void loadSteps();

    return () => {
      isMounted = false;
    };
  }, [fallbackSteps]);

  return steps;
}
