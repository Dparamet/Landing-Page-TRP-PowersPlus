import type { Database, Json } from './supabase/database.types';

export type SiteTextRow = Database['public']['Tables']['site_texts']['Row'];

export type LocalizedText = {
  th: string;
  en: string;
};

export type SiteText = {
  key: string;
  value: LocalizedText;
};

export function asLocalizedText(value: Json, fallback: LocalizedText): LocalizedText {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return fallback;
  }

  return {
    th: typeof value.th === 'string' ? value.th : fallback.th,
    en: typeof value.en === 'string' ? value.en : fallback.en,
  };
}

export function mapSiteTextRows(rows: SiteTextRow[]): Record<string, LocalizedText> {
  return Object.fromEntries(
    rows.map((row) => [
      row.key,
      asLocalizedText(row.value, {
        th: '',
        en: '',
      }),
    ]),
  );
}
