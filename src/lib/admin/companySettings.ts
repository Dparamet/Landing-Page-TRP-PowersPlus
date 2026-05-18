import type { Database } from '../supabase/database.types';
import type { ContactItemFormValues, ContactItemView, DefaultContactType } from './contactItems';

export type CompanySettingsFormValues = {
  logoUrl: string;
  name: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  lineId: string;
  lineUrl: string;
  facebookDisplay: string;
  facebookUrl: string;
  instagramDisplay: string;
  instagramUrl: string;
  tiktokDisplay: string;
  tiktokUrl: string;
  address: string;
  googleMapsSearchUrl: string;
  googleMapsEmbedUrl: string;
};

export type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'];
export type SiteSettingsUpsert = Database['public']['Tables']['site_settings']['Insert'];

export type CompanySettingsValidationResult =
  | { ok: true; value: CompanySettingsFormValues }
  | { ok: false; message: string };

export const LOCAL_LOGO_URL_STORAGE_KEY = 'trp-local-logo-url';
export const LOGO_URL_COLUMN_MIGRATION = '202605160001_site_logo_setting.sql';
export const SOCIAL_COLUMNS_MIGRATION = '202605150006_social_links_and_admin_policy_repair.sql';

const optionalSiteSettingsColumns = [
  'logo_url',
  'instagram_display',
  'instagram_url',
  'tiktok_display',
  'tiktok_url',
] as const;

export type OptionalSiteSettingsColumn = (typeof optionalSiteSettingsColumns)[number];

export const defaultCompanySettings: CompanySettingsFormValues = {
  logoUrl: '/images/LogoTRP.webp',
  name: 'TRP Powers Plus',
  phoneDisplay: '+66 (0) 12-345-6789',
  phoneHref: '+66012345678',
  email: 'TRPPowersplus@gmail.com',
  lineId: '@TRPPowersplus',
  lineUrl: 'https://line.me/ti/p/@TRPPowersplus',
  facebookDisplay: 'TRP Powers Plus',
  facebookUrl: 'https://facebook.com/TRPPowersplus',
  instagramDisplay: 'TRP Powers Plus',
  instagramUrl: 'https://instagram.com/TRPPowersplus',
  tiktokDisplay: 'TRP Powers Plus',
  tiktokUrl: 'https://www.tiktok.com/@TRPPowersplus',
  address: '123 Solar Street, Green Energy District Bangkok 10500, Thailand',
  googleMapsSearchUrl: 'https://maps.google.com/?q=123+Solar+Street,+Green+Energy+District,+Bangkok+10500,+Thailand',
  googleMapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.451493193648!2d100.53169!3d13.7563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d6b7a63b63%3A0x1234567890!2s123%20Solar%20Street%20Green%20Energy%20District%20Bangkok!5e0!3m2!1sen!2sth!4v1234567890123',
};

const requiredFields: Array<[keyof CompanySettingsFormValues, string]> = [
  ['logoUrl', 'Logo URL'],
  ['name', 'ชื่อบริษัท'],
  ['phoneDisplay', 'เบอร์โทรที่แสดง'],
  ['phoneHref', 'เบอร์โทรสำหรับกดโทร'],
  ['email', 'อีเมล'],
  ['lineId', 'LINE ID'],
  ['lineUrl', 'LINE URL'],
  ['address', 'ที่อยู่'],
  ['googleMapsSearchUrl', 'Google Maps URL'],
  ['googleMapsEmbedUrl', 'Google Maps Embed URL'],
];

const optionalSocialFieldPairs: Array<[keyof CompanySettingsFormValues, keyof CompanySettingsFormValues, string]> = [
  ['facebookDisplay', 'facebookUrl', 'Facebook'],
  ['instagramDisplay', 'instagramUrl', 'Instagram'],
  ['tiktokDisplay', 'tiktokUrl', 'TikTok'],
];

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export function isSafeLogoUrl(value: string): boolean {
  const trimmed = value.trim();

  if (trimmed.startsWith('/')) {
    return !trimmed.startsWith('//') && !trimmed.includes('\\');
  }

  return isHttpsUrl(trimmed);
}

export function isMissingLogoUrlColumnError(error: { message?: string }) {
  return Boolean(error.message?.includes("'logo_url' column") || error.message?.includes('logo_url'));
}

export function getMissingOptionalSiteSettingsColumn(error: { message?: string }): OptionalSiteSettingsColumn | null {
  const message = error.message ?? '';
  return optionalSiteSettingsColumns.find((column) => message.includes(`'${column}' column`) || message.includes(column)) ?? null;
}

export function stripOptionalSiteSettingsColumn<T extends Partial<Record<OptionalSiteSettingsColumn, unknown>>>(
  row: T,
  column: OptionalSiteSettingsColumn,
) {
  const nextRow = { ...row };
  delete nextRow[column];
  return nextRow;
}

function trimCompanySettings(values: CompanySettingsFormValues): CompanySettingsFormValues {
  return {
    logoUrl: values.logoUrl.trim(),
    name: values.name.trim(),
    phoneDisplay: values.phoneDisplay.trim(),
    phoneHref: values.phoneHref.trim(),
    email: values.email.trim(),
    lineId: values.lineId.trim(),
    lineUrl: values.lineUrl.trim(),
    facebookDisplay: values.facebookDisplay.trim(),
    facebookUrl: values.facebookUrl.trim(),
    instagramDisplay: values.instagramDisplay.trim(),
    instagramUrl: values.instagramUrl.trim(),
    tiktokDisplay: values.tiktokDisplay.trim(),
    tiktokUrl: values.tiktokUrl.trim(),
    address: values.address.trim(),
    googleMapsSearchUrl: values.googleMapsSearchUrl.trim(),
    googleMapsEmbedUrl: values.googleMapsEmbedUrl.trim(),
  };
}

export function validateCompanySettings(values: CompanySettingsFormValues): CompanySettingsValidationResult {
  const trimmed = trimCompanySettings(values);

  for (const [field, label] of requiredFields) {
    if (!trimmed[field]) {
      return { ok: false, message: `กรุณากรอก${label}` };
    }
  }

  if (!/^\+\d+$/.test(trimmed.phoneHref)) {
    return { ok: false, message: 'เบอร์โทรสำหรับกดโทรต้องขึ้นต้นด้วย + และตามด้วยตัวเลขเท่านั้น' };
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed.email)) {
    return { ok: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' };
  }

  for (const [displayField, urlField, label] of optionalSocialFieldPairs) {
    if (Boolean(trimmed[displayField]) !== Boolean(trimmed[urlField])) {
      return { ok: false, message: `กรุณากรอกชื่อและ URL ของ ${label} ให้ครบ หรือเว้นว่างทั้งคู่` };
    }
  }

  const externalUrls = [
    trimmed.lineUrl,
    trimmed.facebookUrl,
    trimmed.instagramUrl,
    trimmed.tiktokUrl,
    trimmed.googleMapsSearchUrl,
  ].filter(Boolean);

  if (externalUrls.some((url) => !isHttpsUrl(url))) {
    return { ok: false, message: 'URL ภายนอกต้องเป็น https:// เท่านั้น' };
  }

  if (!trimmed.googleMapsEmbedUrl.startsWith('https://www.google.com/maps/embed')) {
    return { ok: false, message: 'Google Maps Embed URL ต้องขึ้นต้นด้วย https://www.google.com/maps/embed' };
  }

  if (!isSafeLogoUrl(trimmed.logoUrl)) {
    return { ok: false, message: 'Logo URL ต้องเป็น https:// หรือ path ที่ขึ้นต้นด้วย / เท่านั้น' };
  }

  return { ok: true, value: trimmed };
}

export function mapSiteSettingsRowToForm(row: SiteSettingsRow | null): CompanySettingsFormValues {
  if (!row) {
    return defaultCompanySettings;
  }

  return {
    logoUrl: row.logo_url || defaultCompanySettings.logoUrl,
    name: row.name || defaultCompanySettings.name,
    phoneDisplay: row.phone_display || defaultCompanySettings.phoneDisplay,
    phoneHref: row.phone_href || defaultCompanySettings.phoneHref,
    email: row.email || defaultCompanySettings.email,
    lineId: row.line_id || defaultCompanySettings.lineId,
    lineUrl: row.line_url || defaultCompanySettings.lineUrl,
    facebookDisplay: row.facebook_display ?? defaultCompanySettings.facebookDisplay,
    facebookUrl: row.facebook_url ?? defaultCompanySettings.facebookUrl,
    instagramDisplay: row.instagram_display ?? defaultCompanySettings.instagramDisplay,
    instagramUrl: row.instagram_url ?? defaultCompanySettings.instagramUrl,
    tiktokDisplay: row.tiktok_display ?? defaultCompanySettings.tiktokDisplay,
    tiktokUrl: row.tiktok_url ?? defaultCompanySettings.tiktokUrl,
    address: row.address || defaultCompanySettings.address,
    googleMapsSearchUrl: row.google_maps_search_url || defaultCompanySettings.googleMapsSearchUrl,
    googleMapsEmbedUrl: row.google_maps_embed_url || defaultCompanySettings.googleMapsEmbedUrl,
  };
}

export function mapCompanySettingsFormToUpsert(values: CompanySettingsFormValues): SiteSettingsUpsert {
  return {
    id: true,
    logo_url: values.logoUrl,
    name: values.name,
    phone_display: values.phoneDisplay,
    phone_href: values.phoneHref,
    email: values.email,
    line_id: values.lineId,
    line_url: values.lineUrl,
    facebook_display: values.facebookDisplay,
    facebook_url: values.facebookUrl,
    instagram_display: values.instagramDisplay,
    instagram_url: values.instagramUrl,
    tiktok_display: values.tiktokDisplay,
    tiktok_url: values.tiktokUrl,
    address: values.address,
    google_maps_search_url: values.googleMapsSearchUrl,
    google_maps_embed_url: values.googleMapsEmbedUrl,
    updated_at: new Date().toISOString(),
  };
}

export function applyContactItemsToCompanySettings(
  settings: CompanySettingsFormValues,
  contactItems: ContactItemView[],
): CompanySettingsFormValues {
  return contactItems.reduce((nextSettings, item) => applyContactItemToCompanySettings(nextSettings, item), settings);
}

export function applyContactItemToCompanySettings(
  settings: CompanySettingsFormValues,
  item: Pick<ContactItemView, 'type' | 'value' | 'href' | 'copyValue' | 'published' | 'deletedAt'>,
): CompanySettingsFormValues {
  const nextSettings = { ...settings };
  const isVisible = item.published && !item.deletedAt;
  const value = isVisible ? item.value.th : '';
  const href = isVisible ? item.href : '';
  const copyValue = isVisible ? item.copyValue : '';

  switch (item.type as DefaultContactType) {
    case 'company':
      nextSettings.name = value || nextSettings.name;
      break;
    case 'phone':
      nextSettings.phoneDisplay = value;
      nextSettings.phoneHref = copyValue.replace(/^tel:/, '') || href.replace(/^tel:/, '');
      break;
    case 'line':
      nextSettings.lineId = value;
      nextSettings.lineUrl = href;
      break;
    case 'facebook':
      nextSettings.facebookDisplay = value;
      nextSettings.facebookUrl = href;
      break;
    case 'instagram':
      nextSettings.instagramDisplay = value;
      nextSettings.instagramUrl = href;
      break;
    case 'tiktok':
      nextSettings.tiktokDisplay = value;
      nextSettings.tiktokUrl = href;
      break;
    case 'email':
      nextSettings.email = copyValue || value.replace(/^mailto:/, '');
      break;
    case 'address':
      nextSettings.address = value;
      nextSettings.googleMapsSearchUrl = href;
      break;
    default:
      break;
  }

  return nextSettings;
}

export function mapCompanySettingsToDefaultContactForms(settings: CompanySettingsFormValues): ContactItemFormValues[] {
  return [
    {
      id: 'company',
      databaseId: '',
      type: 'company',
      icon: 'company',
      labelTh: 'ชื่อบริษัท',
      labelEn: 'Company',
      valueTh: settings.name,
      valueEn: settings.name,
      href: '',
      copyValue: settings.name,
      external: false,
      sortOrder: 10,
      published: true,
    },
    {
      id: 'phone',
      databaseId: '',
      type: 'phone',
      icon: 'phone',
      labelTh: 'เบอร์โทรศัพท์',
      labelEn: 'Phone',
      valueTh: settings.phoneDisplay,
      valueEn: settings.phoneDisplay,
      href: `tel:${settings.phoneHref}`,
      copyValue: settings.phoneHref,
      external: false,
      sortOrder: 20,
      published: true,
    },
    {
      id: 'line',
      databaseId: '',
      type: 'line',
      icon: 'line',
      labelTh: 'Line',
      labelEn: 'Line',
      valueTh: settings.lineId,
      valueEn: settings.lineId,
      href: settings.lineUrl,
      copyValue: settings.lineId,
      external: true,
      sortOrder: 30,
      published: true,
    },
    ...mapOptionalSocialContactForms(settings),
    {
      id: 'email',
      databaseId: '',
      type: 'email',
      icon: 'email',
      labelTh: 'อีเมล',
      labelEn: 'Email',
      valueTh: settings.email,
      valueEn: settings.email,
      href: `mailto:${settings.email}`,
      copyValue: settings.email,
      external: false,
      sortOrder: 70,
      published: true,
    },
    {
      id: 'address',
      databaseId: '',
      type: 'address',
      icon: 'address',
      labelTh: 'ที่อยู่',
      labelEn: 'Address',
      valueTh: settings.address,
      valueEn: settings.address,
      href: settings.googleMapsSearchUrl,
      copyValue: settings.address,
      external: true,
      sortOrder: 80,
      published: true,
    },
  ];
}

export function mapDefaultContactFormToSettingsPatch(
  form: ContactItemFormValues,
  visible = form.published,
): Partial<SiteSettingsUpsert> | null {
  const value = visible ? form.valueTh : '';
  const href = visible ? form.href : '';
  const copyValue = visible ? form.copyValue : '';

  switch (form.type as DefaultContactType) {
    case 'company':
      return value ? { name: value } : null;
    case 'phone':
      return { phone_display: value, phone_href: copyValue || href.replace(/^tel:/, '') };
    case 'line':
      return { line_id: value, line_url: href };
    case 'facebook':
      return { facebook_display: value, facebook_url: href };
    case 'instagram':
      return { instagram_display: value, instagram_url: href };
    case 'tiktok':
      return { tiktok_display: value, tiktok_url: href };
    case 'email':
      return { email: copyValue || value.replace(/^mailto:/, '') };
    case 'address':
      return { address: value, google_maps_search_url: href };
    default:
      return null;
  }
}

function mapOptionalSocialContactForms(settings: CompanySettingsFormValues): ContactItemFormValues[] {
  const socials: Array<{
    type: 'facebook' | 'instagram' | 'tiktok';
    label: string;
    display: string;
    url: string;
    sortOrder: number;
  }> = [
    { type: 'facebook', label: 'Facebook', display: settings.facebookDisplay, url: settings.facebookUrl, sortOrder: 40 },
    { type: 'instagram', label: 'Instagram', display: settings.instagramDisplay, url: settings.instagramUrl, sortOrder: 50 },
    { type: 'tiktok', label: 'TikTok', display: settings.tiktokDisplay, url: settings.tiktokUrl, sortOrder: 60 },
  ];

  return socials
    .filter((social) => social.display && social.url)
    .map((social) => ({
      id: social.type,
      databaseId: '',
      type: social.type,
      icon: social.type,
      labelTh: social.label,
      labelEn: social.label,
      valueTh: social.display,
      valueEn: social.display,
      href: social.url,
      copyValue: social.url,
      external: true,
      sortOrder: social.sortOrder,
      published: true,
    }));
}
