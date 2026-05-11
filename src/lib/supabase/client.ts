import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { getSupabasePublicConfig, hasSupabasePublicConfig, type SupabasePublicConfig } from './config';
import type { Database } from './database.types';

let browserClient: SupabaseClient<Database> | null = null;

export function createSupabaseClient(config: SupabasePublicConfig = getSupabasePublicConfig()): SupabaseClient<Database> {
  return createClient<Database>(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: false,
    },
  });
}

export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  if (!hasSupabasePublicConfig()) {
    return null;
  }

  browserClient ??= createSupabaseClient();
  return browserClient;
}
