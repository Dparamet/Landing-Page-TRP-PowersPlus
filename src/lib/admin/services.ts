import type { Database, Json } from '../supabase/database.types';

export type ServiceRow = Database['public']['Tables']['services']['Row'];
export type ServiceUpsert = Database['public']['Tables']['services']['Insert'];

export type LocalizedText = {
  th: string;
  en: string;
};

export type ServiceCategoryKey =
  | 'residential'
  | 'building'
  | 'factory'
  | 'solar'
  | 'maintenance'
  | 'controlPanel';

export type ServiceCategory = {
  key: ServiceCategoryKey;
  title: LocalizedText;
  shortTitle: LocalizedText;
  description: LocalizedText;
  bestFor: LocalizedText;
  includes: LocalizedText[];
  prepare: LocalizedText[];
  lineMessage: LocalizedText;
  accent: 'orange' | 'blue';
};

export type ServiceFormValues = {
  id: ServiceCategoryKey;
  titleTh: string;
  titleEn: string;
  shortTitleTh: string;
  shortTitleEn: string;
  descriptionTh: string;
  descriptionEn: string;
  bestForTh: string;
  bestForEn: string;
  lineMessageTh: string;
  lineMessageEn: string;
  accent: 'orange' | 'blue';
  published: boolean;
};

export type ServiceValidationResult =
  | { ok: true; value: ServiceFormValues }
  | { ok: false; message: string };

function localized(th: string, en: string): LocalizedText {
  return { th: th.trim(), en: en.trim() || th.trim() };
}

function asLocalizedText(value: Json, fallback: LocalizedText): LocalizedText {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return fallback;
  }

  return {
    th: typeof value.th === 'string' ? value.th : fallback.th,
    en: typeof value.en === 'string' ? value.en : fallback.en,
  };
}

function asLocalizedList(value: Json, fallback: LocalizedText[]): LocalizedText[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const list = value
    .map((item, index) => asLocalizedText(item, fallback[index] ?? { th: '', en: '' }))
    .filter((item) => item.th || item.en);

  return list.length > 0 ? list : fallback;
}

export function mapServiceToForm(service: ServiceCategory, row?: ServiceRow | null): ServiceFormValues {
  const title = row ? asLocalizedText(row.title, service.title) : service.title;
  const shortTitle = row ? asLocalizedText(row.short_title, service.shortTitle) : service.shortTitle;
  const description = row ? asLocalizedText(row.description, service.description) : service.description;
  const bestFor = row ? asLocalizedText(row.best_for, service.bestFor) : service.bestFor;
  const lineMessage = row ? asLocalizedText(row.line_message, service.lineMessage) : service.lineMessage;

  return {
    id: service.key,
    titleTh: title.th,
    titleEn: title.en,
    shortTitleTh: shortTitle.th,
    shortTitleEn: shortTitle.en,
    descriptionTh: description.th,
    descriptionEn: description.en,
    bestForTh: bestFor.th,
    bestForEn: bestFor.en,
    lineMessageTh: lineMessage.th,
    lineMessageEn: lineMessage.en,
    accent: row?.accent ?? service.accent,
    published: row?.published ?? true,
  };
}

export function validateServiceForm(values: ServiceFormValues): ServiceValidationResult {
  const trimmed: ServiceFormValues = {
    ...values,
    titleTh: values.titleTh.trim(),
    titleEn: values.titleEn.trim(),
    shortTitleTh: values.shortTitleTh.trim(),
    shortTitleEn: values.shortTitleEn.trim(),
    descriptionTh: values.descriptionTh.trim(),
    descriptionEn: values.descriptionEn.trim(),
    bestForTh: values.bestForTh.trim(),
    bestForEn: values.bestForEn.trim(),
    lineMessageTh: values.lineMessageTh.trim(),
    lineMessageEn: values.lineMessageEn.trim(),
  };

  if (!trimmed.titleTh || !trimmed.shortTitleTh || !trimmed.descriptionTh || !trimmed.lineMessageTh) {
    return { ok: false, message: 'กรุณากรอกชื่อบริการ ชื่อสั้น คำอธิบาย และข้อความ LINE ภาษาไทย' };
  }

  return { ok: true, value: trimmed };
}

export function mapServiceFormToUpsert(values: ServiceFormValues, fallback: ServiceCategory): ServiceUpsert {
  return {
    id: values.id,
    title: localized(values.titleTh, values.titleEn),
    short_title: localized(values.shortTitleTh, values.shortTitleEn),
    description: localized(values.descriptionTh, values.descriptionEn),
    best_for: localized(values.bestForTh, values.bestForEn),
    includes: fallback.includes,
    prepare: fallback.prepare,
    line_message: localized(values.lineMessageTh, values.lineMessageEn),
    accent: values.accent,
    published: values.published,
    updated_at: new Date().toISOString(),
  };
}

export function applyServiceRows(baseServices: ServiceCategory[], rows: ServiceRow[]): ServiceCategory[] {
  const rowById = new Map(rows.map((row) => [row.id, row]));

  return baseServices
    .map((service) => {
      const row = rowById.get(service.key);

      if (!row) {
        return service;
      }

      return {
        ...service,
        title: asLocalizedText(row.title, service.title),
        shortTitle: asLocalizedText(row.short_title, service.shortTitle),
        description: asLocalizedText(row.description, service.description),
        bestFor: asLocalizedText(row.best_for, service.bestFor),
        includes: asLocalizedList(row.includes, service.includes),
        prepare: asLocalizedList(row.prepare, service.prepare),
        lineMessage: asLocalizedText(row.line_message, service.lineMessage),
        accent: row.accent,
      };
    })
    .filter((service) => rowById.get(service.key)?.published ?? true);
}
