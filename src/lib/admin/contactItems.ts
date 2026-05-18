import type { CompanyProfileView } from '../companyProfile';
import type { Database, Json } from '../supabase/database.types';
import { fillEnglish } from './autoTranslate.js';

export type LocalizedText = {
  th: string;
  en: string;
};

export type ContactItemRow = Database['public']['Tables']['contact_items']['Row'];
export type ContactItemInsert = Database['public']['Tables']['contact_items']['Insert'];
export type ContactItemUpdate = Database['public']['Tables']['contact_items']['Update'];

export type ContactItemView = {
  id: string;
  databaseId: string;
  type: string;
  icon: string;
  label: LocalizedText;
  value: LocalizedText;
  href: string;
  copyValue: string;
  external: boolean;
  sortOrder: number;
  published: boolean;
  deletedAt?: string | null;
  purgeAfter?: string | null;
};

export type ContactItemFormValues = {
  id: string;
  databaseId: string;
  type: string;
  icon: string;
  labelTh: string;
  labelEn: string;
  valueTh: string;
  valueEn: string;
  href: string;
  copyValue: string;
  external: boolean;
  sortOrder: number;
  published: boolean;
};

export type ContactItemValidationResult =
  | { ok: true; value: ContactItemFormValues }
  | { ok: false; message: string };

export type DefaultContactType = 'company' | 'phone' | 'line' | 'facebook' | 'instagram' | 'tiktok' | 'email' | 'address';

export const defaultContactTypes: DefaultContactType[] = ['company', 'phone', 'line', 'facebook', 'instagram', 'tiktok', 'email', 'address'];

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

export function buildDefaultContactItems(profile: CompanyProfileView): ContactItemView[] {
  const items: ContactItemView[] = [
    {
      id: 'company',
      databaseId: '',
      type: 'company',
      icon: 'company',
      label: { th: 'ชื่อบริษัท', en: 'Company' },
      value: { th: profile.name, en: profile.name },
      href: '',
      copyValue: profile.name,
      external: false,
      sortOrder: 10,
      published: true,
    },
    {
      id: 'phone',
      databaseId: '',
      type: 'phone',
      icon: 'phone',
      label: { th: 'เบอร์โทรศัพท์', en: 'Phone' },
      value: { th: profile.phoneDisplay, en: profile.phoneDisplay },
      href: `tel:${profile.phoneHref}`,
      copyValue: profile.phoneHref,
      external: false,
      sortOrder: 20,
      published: true,
    },
    {
      id: 'line',
      databaseId: '',
      type: 'line',
      icon: 'line',
      label: { th: 'Line', en: 'Line' },
      value: { th: profile.lineId, en: profile.lineId },
      href: profile.lineUrl,
      copyValue: profile.lineId,
      external: true,
      sortOrder: 30,
      published: true,
    },
  ];

  if (profile.facebookDisplay && profile.facebookUrl) {
    items.push({
      id: 'facebook',
      databaseId: '',
      type: 'facebook',
      icon: 'facebook',
      label: { th: 'Facebook', en: 'Facebook' },
      value: { th: profile.facebookDisplay, en: profile.facebookDisplay },
      href: profile.facebookUrl,
      copyValue: profile.facebookUrl,
      external: true,
      sortOrder: 40,
      published: true,
    });
  }

  if (profile.instagramDisplay && profile.instagramUrl) {
    items.push({
      id: 'instagram',
      databaseId: '',
      type: 'instagram',
      icon: 'instagram',
      label: { th: 'Instagram', en: 'Instagram' },
      value: { th: profile.instagramDisplay, en: profile.instagramDisplay },
      href: profile.instagramUrl,
      copyValue: profile.instagramUrl,
      external: true,
      sortOrder: 50,
      published: true,
    });
  }

  if (profile.tiktokDisplay && profile.tiktokUrl) {
    items.push({
      id: 'tiktok',
      databaseId: '',
      type: 'tiktok',
      icon: 'tiktok',
      label: { th: 'TikTok', en: 'TikTok' },
      value: { th: profile.tiktokDisplay, en: profile.tiktokDisplay },
      href: profile.tiktokUrl,
      copyValue: profile.tiktokUrl,
      external: true,
      sortOrder: 60,
      published: true,
    });
  }

  items.push(
    {
      id: 'email',
      databaseId: '',
      type: 'email',
      icon: 'email',
      label: { th: 'อีเมล', en: 'Email' },
      value: { th: profile.email, en: profile.email },
      href: `mailto:${profile.email}`,
      copyValue: profile.email,
      external: false,
      sortOrder: 70,
      published: true,
    },
    {
      id: 'address',
      databaseId: '',
      type: 'address',
      icon: 'address',
      label: { th: 'ที่อยู่', en: 'Address' },
      value: { th: profile.address, en: profile.address },
      href: profile.googleMapsSearchUrl,
      copyValue: profile.address,
      external: true,
      sortOrder: 80,
      published: true,
    },
  );

  return items;
}

export function isDefaultContactType(type: string): type is DefaultContactType {
  return defaultContactTypes.includes(type as DefaultContactType);
}

export function mapContactRows(rows: ContactItemRow[], fallbackItems: ContactItemView[], includeDeleted = false): ContactItemView[] {
  const mappedRows = rows.map((row) => ({
    id: row.id,
    databaseId: row.id,
    type: row.type,
    icon: row.icon,
    label: asLocalizedText(row.label, { th: row.type, en: row.type }),
    value: asLocalizedText(row.value, { th: '', en: '' }),
    href: row.href ?? '',
    copyValue: row.copy_value ?? '',
    external: row.external,
    sortOrder: row.sort_order,
    published: row.published,
    deletedAt: row.deleted_at,
    purgeAfter: row.purge_after,
  }));

  const rowByDefaultType = new Map(mappedRows.map((row) => [row.type, row]));
  const fallbackTypes = new Set(fallbackItems.map((item) => item.type));
  const customRows = mappedRows.filter((row) => !fallbackTypes.has(row.type));
  const source = [
    ...fallbackItems.map((item) => rowByDefaultType.get(item.type) ?? item),
    ...customRows,
  ];

  return source
    .filter((item) => includeDeleted || (item.published && !item.deletedAt))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function createBlankContactItemForm(sortOrder: number): ContactItemFormValues {
  return {
    id: '',
    databaseId: '',
    type: 'custom',
    icon: 'custom',
    labelTh: '',
    labelEn: '',
    valueTh: '',
    valueEn: '',
    href: '',
    copyValue: '',
    external: false,
    sortOrder,
    published: true,
  };
}

export function mapContactItemToForm(item: ContactItemView): ContactItemFormValues {
  return {
    id: item.id,
    databaseId: item.databaseId,
    type: item.type,
    icon: item.icon,
    labelTh: item.label.th,
    labelEn: item.label.en,
    valueTh: item.value.th,
    valueEn: item.value.en,
    href: item.href,
    copyValue: item.copyValue,
    external: item.external,
    sortOrder: item.sortOrder,
    published: item.published,
  };
}

export function validateContactItem(values: ContactItemFormValues): ContactItemValidationResult {
  const trimmed: ContactItemFormValues = {
    ...values,
    type: values.type.trim() || 'custom',
    icon: values.icon.trim() || 'custom',
    labelTh: values.labelTh.trim(),
    labelEn: values.labelEn.trim(),
    valueTh: values.valueTh.trim(),
    valueEn: values.valueEn.trim(),
    href: values.href.trim(),
    copyValue: values.copyValue.trim(),
  };

  if (!trimmed.labelTh || !trimmed.valueTh) {
    return { ok: false, message: 'กรุณากรอกป้ายกำกับและค่าที่แสดงภาษาไทย' };
  }

  if (!Number.isFinite(trimmed.sortOrder) || trimmed.sortOrder < 0) {
    return { ok: false, message: 'ลำดับต้องเป็นตัวเลข 0 ขึ้นไป' };
  }

  if (trimmed.href && !isAllowedHref(trimmed.href)) {
    return { ok: false, message: 'ลิงก์ต้องเป็น https://, tel:, หรือ mailto:' };
  }

  return { ok: true, value: trimmed };
}

export function mapContactFormToInsert(values: ContactItemFormValues): ContactItemInsert {
  return {
    type: values.type,
    icon: values.icon,
    label: localized(values.labelTh, values.labelEn),
    value: localized(values.valueTh, values.valueEn),
    href: values.href || null,
    copy_value: values.copyValue || values.valueTh,
    external: values.external,
    sort_order: values.sortOrder,
    published: values.published,
    updated_at: new Date().toISOString(),
  };
}

export function mapContactFormToUpdate(values: ContactItemFormValues): ContactItemUpdate {
  return mapContactFormToInsert(values);
}

function isAllowedHref(value: string): boolean {
  if (value.startsWith('tel:') || value.startsWith('mailto:')) {
    return true;
  }

  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}
