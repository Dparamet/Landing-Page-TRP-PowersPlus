'use client';

import { useEffect, useMemo, useState } from 'react';

import { buildDefaultContactItems, mapContactRows, type ContactItemRow, type ContactItemView } from '@/lib/admin/contactItems';
import type { CompanyProfileView } from '@/lib/companyProfile';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export function useContactItems(profile: CompanyProfileView) {
  const fallbackItems = useMemo(() => buildDefaultContactItems(profile), [profile]);
  const [databaseItems, setDatabaseItems] = useState<ContactItemView[] | null>(null);

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const client: SupabaseClient<Database> = supabase;

    async function loadContactItems() {
      const { data, error } = await client.from('contact_items').select('*').order('sort_order', { ascending: true });

      if (!isMounted || error) {
        return;
      }

      setDatabaseItems(mapContactRows((data as ContactItemRow[] | null) ?? [], fallbackItems));
    }

    void loadContactItems();

    return () => {
      isMounted = false;
    };
  }, [fallbackItems]);

  return databaseItems ?? fallbackItems;
}
