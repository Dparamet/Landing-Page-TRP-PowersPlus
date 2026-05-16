'use client';

import { useEffect, useState } from 'react';

import { fallbackStandardItems, mapStandardItemRows, type StandardItem, type StandardItemRow } from '@/lib/standards';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export function useStandardItems() {
  const [items, setItems] = useState<StandardItem[]>(fallbackStandardItems);

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const client: SupabaseClient<Database> = supabase;

    async function loadItems() {
      const { data, error } = await client.from('standard_items').select('*').order('sort_order', { ascending: true });

      if (!isMounted || error) {
        return;
      }

      setItems(mapStandardItemRows((data as StandardItemRow[] | null) ?? []));
    }

    void loadItems();

    return () => {
      isMounted = false;
    };
  }, []);

  return items;
}
