import type { Database, Json } from '../supabase/database.types';
import { fillEnglish } from './autoTranslate.js';

export type ServiceRow = Database['public']['Tables']['services']['Row'];
export type ServiceUpsert = Database['public']['Tables']['services']['Insert'];

export type LocalizedText = {
  th: string;
  en: string;
};

export type ServiceCategoryKey = string;

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
  deletedAt?: string | null;
  purgeAfter?: string | null;
};

export type ServiceFormValues = {
  id: ServiceCategoryKey;
  sortOrder: number;
  titleTh: string;
  titleEn: string;
  shortTitleTh: string;
  shortTitleEn: string;
  descriptionTh: string;
  descriptionEn: string;
  bestForTh: string;
  bestForEn: string;
  includes: LocalizedText[];
  prepare: LocalizedText[];
  lineMessageTh: string;
  lineMessageEn: string;
  accent: 'orange' | 'blue';
  published: boolean;
};

export type ServiceValidationResult =
  | { ok: true; value: ServiceFormValues }
  | { ok: false; message: string };

export function createBlankServiceForm(sortOrder: number): ServiceFormValues {
  return {
    id: '',
    sortOrder,
    titleTh: '',
    titleEn: '',
    shortTitleTh: '',
    shortTitleEn: '',
    descriptionTh: '',
    descriptionEn: '',
    bestForTh: '',
    bestForEn: '',
    includes: [{ th: '', en: '' }],
    prepare: [{ th: '', en: '' }],
    lineMessageTh: '',
    lineMessageEn: '',
    accent: 'blue',
    published: true,
  };
}

function localized(th: string, en: string): LocalizedText {
  return { th: th.trim(), en: fillEnglish(th, en) };
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
    sortOrder: row?.sort_order ?? 0,
    titleTh: title.th,
    titleEn: title.en,
    shortTitleTh: shortTitle.th,
    shortTitleEn: shortTitle.en,
    descriptionTh: description.th,
    descriptionEn: description.en,
    bestForTh: bestFor.th,
    bestForEn: bestFor.en,
    includes: row ? asLocalizedList(row.includes, service.includes) : service.includes,
    prepare: row ? asLocalizedList(row.prepare, service.prepare) : service.prepare,
    lineMessageTh: lineMessage.th,
    lineMessageEn: lineMessage.en,
    accent: row?.accent ?? service.accent,
    published: row?.published ?? true,
  };
}

export function validateServiceForm(values: ServiceFormValues): ServiceValidationResult {
  const trimmed: ServiceFormValues = {
    ...values,
    id: values.id.trim(),
    titleTh: values.titleTh.trim(),
    titleEn: values.titleEn.trim(),
    shortTitleTh: values.shortTitleTh.trim(),
    shortTitleEn: values.shortTitleEn.trim(),
    descriptionTh: values.descriptionTh.trim(),
    descriptionEn: values.descriptionEn.trim(),
    bestForTh: values.bestForTh.trim(),
    bestForEn: values.bestForEn.trim(),
    includes: trimLocalizedList(values.includes),
    prepare: trimLocalizedList(values.prepare),
    lineMessageTh: values.lineMessageTh.trim(),
    lineMessageEn: values.lineMessageEn.trim(),
  };

  if (!trimmed.id || !/^[a-zA-Z0-9_-]+$/.test(trimmed.id)) {
    return { ok: false, message: 'กรุณากรอก service id เป็นอังกฤษหรือตัวเลข เช่น solar-cleaning' };
  }

  if (!trimmed.titleTh || !trimmed.shortTitleTh || !trimmed.descriptionTh || !trimmed.lineMessageTh) {
    return { ok: false, message: 'กรุณากรอกชื่อบริการ ชื่อสั้น คำอธิบาย และข้อความ LINE ภาษาไทย' };
  }

  if (trimmed.includes.length === 0 || trimmed.prepare.length === 0) {
    return { ok: false, message: 'กรุณากรอกงานที่รับและข้อมูลที่ควรเตรียมอย่างน้อยอย่างละ 1 รายการ' };
  }

  if (!Number.isFinite(trimmed.sortOrder) || trimmed.sortOrder < 0) {
    return { ok: false, message: 'ลำดับต้องเป็นตัวเลข 0 ขึ้นไป' };
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
    includes: values.includes.length > 0 ? values.includes : fallback.includes,
    prepare: values.prepare.length > 0 ? values.prepare : fallback.prepare,
    line_message: localized(values.lineMessageTh, values.lineMessageEn),
    accent: values.accent,
    published: values.published,
    sort_order: values.sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export function mapServiceCategoryToUpsert(service: ServiceCategory, sortOrder = 0): ServiceUpsert {
  return mapServiceFormToUpsert({ ...mapServiceToForm(service), sortOrder }, service);
}

function trimLocalizedList(items: LocalizedText[]): LocalizedText[] {
  return items
    .map((item) => localized(item.th, item.en))
    .filter((item) => item.th || item.en);
}

export function applyServiceRows(baseServices: ServiceCategory[], rows: ServiceRow[]): ServiceCategory[] {
  const rowById = new Map(rows.map((row) => [row.id, row]));
  const baseIds = new Set(baseServices.map((service) => service.key));
  const customServices = rows
    .filter((row) => !baseIds.has(row.id))
    .map((row) => serviceFromRow(row));

  return [...baseServices, ...customServices]
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
        deletedAt: row.deleted_at,
        purgeAfter: row.purge_after,
      };
    })
    .filter((service) => {
      const row = rowById.get(service.key);
      return row ? row.published && !row.deleted_at : true;
    });
}

export function applyServiceRowsForAdmin(baseServices: ServiceCategory[], rows: ServiceRow[]): ServiceCategory[] {
  const rowById = new Map(rows.map((row) => [row.id, row]));
  const baseIds = new Set(baseServices.map((service) => service.key));
  const customServices = rows
    .filter((row) => !baseIds.has(row.id))
    .map((row) => serviceFromRow(row));

  return [...baseServices, ...customServices]
    .map((service) => {
      const row = rowById.get(service.key);

      if (!row) return service;

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
        deletedAt: row.deleted_at,
        purgeAfter: row.purge_after,
      };
    })
    .sort((a, b) => (rowById.get(a.key)?.sort_order ?? 0) - (rowById.get(b.key)?.sort_order ?? 0));
}

function serviceFromRow(row: ServiceRow): ServiceCategory {
  return {
    key: row.id,
    title: asLocalizedText(row.title, { th: row.id, en: row.id }),
    shortTitle: asLocalizedText(row.short_title, { th: row.id, en: row.id }),
    description: asLocalizedText(row.description, { th: '', en: '' }),
    bestFor: asLocalizedText(row.best_for, { th: '', en: '' }),
    includes: asLocalizedList(row.includes, []),
    prepare: asLocalizedList(row.prepare, []),
    lineMessage: asLocalizedText(row.line_message, { th: '', en: '' }),
    accent: row.accent,
    deletedAt: row.deleted_at,
    purgeAfter: row.purge_after,
  };
}
