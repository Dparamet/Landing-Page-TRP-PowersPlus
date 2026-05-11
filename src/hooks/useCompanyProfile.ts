'use client';

import { useEffect, useState } from 'react';

import { defaultCompanyProfile, mapSiteSettingsRowToProfile, type CompanyProfileView } from '@/lib/companyProfile';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'];

export function useCompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfileView>(defaultCompanyProfile);

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const client: SupabaseClient<Database> = supabase;

    async function loadProfile() {
      const { data, error } = await client.from('site_settings').select('*').eq('id', true).maybeSingle();

      if (!isMounted || error) {
        return;
      }

      setProfile(mapSiteSettingsRowToProfile(data as SiteSettingsRow | null));
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  return profile;
}
