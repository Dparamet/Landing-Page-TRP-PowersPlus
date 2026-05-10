export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

type SupabaseEnv = Record<string, string | undefined>;

const nextPublicConfig: SupabasePublicConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '',
};

function readConfig(env: SupabaseEnv): SupabasePublicConfig {
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '',
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '',
  };
}

export function hasSupabasePublicConfig(env?: SupabaseEnv): boolean {
  const config = env ? readConfig(env) : nextPublicConfig;

  return config.url.length > 0 && config.anonKey.length > 0;
}

export function getSupabasePublicConfig(env?: SupabaseEnv): SupabasePublicConfig {
  const config = env ? readConfig(env) : nextPublicConfig;

  if (!config.url || !config.anonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  try {
    const parsedUrl = new URL(config.url);

    if (parsedUrl.protocol !== 'https:') {
      throw new Error('Supabase URL must use HTTPS.');
    }
  } catch {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid HTTPS URL.');
  }

  return config;
}
