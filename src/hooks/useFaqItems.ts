'use client';

import { useEffect, useMemo, useState } from 'react';

import en from '@/locales/en.json';
import th from '@/locales/th.json';
import { buildDefaultFaqItems, mapFaqRows, type FaqItem, type FaqRow } from '@/lib/faqs';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export function useFaqItems() {
  const fallbackFaqs = useMemo(() => buildDefaultFaqItems(th.faq.questions, en.faq.questions), []);
  const [faqs, setFaqs] = useState<FaqItem[]>(fallbackFaqs);

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const client: SupabaseClient<Database> = supabase;

    async function loadFaqs() {
      const { data, error } = await client.from('faq_items').select('*').order('sort_order', { ascending: true });

      if (!isMounted || error) {
        return;
      }

      setFaqs(mapFaqRows((data as FaqRow[] | null) ?? [], fallbackFaqs));
    }

    void loadFaqs();

    return () => {
      isMounted = false;
    };
  }, [fallbackFaqs]);

  return faqs;
}
