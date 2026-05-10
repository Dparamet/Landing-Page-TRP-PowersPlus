import type { Database } from '@/lib/supabase/database.types';
import type { SiteText } from '@/lib/siteTexts';

export type SiteTextInsert = Database['public']['Tables']['site_texts']['Insert'];
export type SiteTextUpdate = Database['public']['Tables']['site_texts']['Update'];

export type SiteTextFormValues = {
  key: string;
  textTh: string;
  textEn: string;
};

export type SiteTextValidationResult =
  | { ok: true; value: SiteTextFormValues }
  | { ok: false; message: string };

export function createBlankSiteTextForm(): SiteTextFormValues {
  return {
    key: '',
    textTh: '',
    textEn: '',
  };
}

export function mapSiteTextToForm(item: SiteText): SiteTextFormValues {
  return {
    key: item.key,
    textTh: item.value.th,
    textEn: item.value.en,
  };
}

export function validateSiteTextForm(values: SiteTextFormValues): SiteTextValidationResult {
  const trimmed = {
    key: values.key.trim(),
    textTh: values.textTh.trim(),
    textEn: values.textEn.trim(),
  };

  if (!trimmed.key || !trimmed.textTh) {
    return { ok: false, message: 'กรุณากรอก key และข้อความภาษาไทย' };
  }

  if (!/^[a-zA-Z0-9_.-]+$/.test(trimmed.key)) {
    return { ok: false, message: 'key ใช้ได้เฉพาะตัวอักษร ตัวเลข จุด ขีดกลาง และ underscore' };
  }

  return { ok: true, value: trimmed };
}

export function mapSiteTextFormToUpsert(values: SiteTextFormValues): SiteTextInsert {
  return {
    key: values.key,
    value: {
      th: values.textTh,
      en: values.textEn || values.textTh,
    },
    updated_at: new Date().toISOString(),
  };
}
