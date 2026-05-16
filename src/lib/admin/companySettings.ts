import type { Database } from '../supabase/database.types';

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
  ['facebookDisplay', 'ชื่อ Facebook'],
  ['facebookUrl', 'Facebook URL'],
  ['instagramDisplay', 'ชื่อ Instagram'],
  ['instagramUrl', 'Instagram URL'],
  ['tiktokDisplay', 'ชื่อ TikTok'],
  ['tiktokUrl', 'TikTok URL'],
  ['address', 'ที่อยู่'],
  ['googleMapsSearchUrl', 'Google Maps URL'],
  ['googleMapsEmbedUrl', 'Google Maps Embed URL'],
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

  if (
    !isHttpsUrl(trimmed.lineUrl) ||
    !isHttpsUrl(trimmed.facebookUrl) ||
    !isHttpsUrl(trimmed.instagramUrl) ||
    !isHttpsUrl(trimmed.tiktokUrl) ||
    !isHttpsUrl(trimmed.googleMapsSearchUrl)
  ) {
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
    facebookDisplay: row.facebook_display || defaultCompanySettings.facebookDisplay,
    facebookUrl: row.facebook_url || defaultCompanySettings.facebookUrl,
    instagramDisplay: row.instagram_display || defaultCompanySettings.instagramDisplay,
    instagramUrl: row.instagram_url || defaultCompanySettings.instagramUrl,
    tiktokDisplay: row.tiktok_display || defaultCompanySettings.tiktokDisplay,
    tiktokUrl: row.tiktok_url || defaultCompanySettings.tiktokUrl,
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
