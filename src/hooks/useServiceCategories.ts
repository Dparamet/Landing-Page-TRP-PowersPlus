'use client';

import { useEffect, useState } from 'react';

import { serviceCategories as staticServiceCategories } from '@/content/site';
import { applyServiceRows, type ServiceCategory, type ServiceRow } from '@/lib/admin/services';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export function useServiceCategories() {
  const [services, setServices] = useState<ServiceCategory[]>(staticServiceCategories);

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const client: SupabaseClient<Database> = supabase;

    async function loadServices() {
      const { data, error } = await client.from('services').select('*').order('sort_order', { ascending: true });

      if (!isMounted || error) {
        return;
      }

      setServices(applyServiceRows(staticServiceCategories, (data as ServiceRow[] | null) ?? []));
    }

    void loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  return services;
}
