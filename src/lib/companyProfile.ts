import type { CompanySettingsFormValues, SiteSettingsRow } from './admin/companySettings';

export type CompanyProfileView = CompanySettingsFormValues;

export const defaultCompanyProfile: CompanyProfileView = {
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
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.451493193648!2d100.53169!3d13.7563!2m3!1f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d6b7a63b63%3A0x1234567890!2s123%20Solar%20Street%20Green%20Energy%20District%20Bangkok!5e0!3m2!1sen!2sth!4v1234567890123',
};

export function mapCompanySettingsToProfile(settings: CompanySettingsFormValues): CompanyProfileView {
  return {
    name: settings.name,
    phoneDisplay: settings.phoneDisplay,
    phoneHref: settings.phoneHref,
    email: settings.email,
    lineId: settings.lineId,
    lineUrl: settings.lineUrl,
    facebookDisplay: settings.facebookDisplay,
    facebookUrl: settings.facebookUrl,
    instagramDisplay: settings.instagramDisplay,
    instagramUrl: settings.instagramUrl,
    tiktokDisplay: settings.tiktokDisplay,
    tiktokUrl: settings.tiktokUrl,
    address: settings.address,
    googleMapsSearchUrl: settings.googleMapsSearchUrl,
    googleMapsEmbedUrl: settings.googleMapsEmbedUrl,
  };
}

export function mapSiteSettingsRowToProfile(row: SiteSettingsRow | null): CompanyProfileView {
  if (!row) {
    return defaultCompanyProfile;
  }

  return {
    name: row.name || defaultCompanyProfile.name,
    phoneDisplay: row.phone_display || defaultCompanyProfile.phoneDisplay,
    phoneHref: row.phone_href || defaultCompanyProfile.phoneHref,
    email: row.email || defaultCompanyProfile.email,
    lineId: row.line_id || defaultCompanyProfile.lineId,
    lineUrl: row.line_url || defaultCompanyProfile.lineUrl,
    facebookDisplay: row.facebook_display || defaultCompanyProfile.facebookDisplay,
    facebookUrl: row.facebook_url || defaultCompanyProfile.facebookUrl,
    instagramDisplay: row.instagram_display || defaultCompanyProfile.instagramDisplay,
    instagramUrl: row.instagram_url || defaultCompanyProfile.instagramUrl,
    tiktokDisplay: row.tiktok_display || defaultCompanyProfile.tiktokDisplay,
    tiktokUrl: row.tiktok_url || defaultCompanyProfile.tiktokUrl,
    address: row.address || defaultCompanyProfile.address,
    googleMapsSearchUrl: row.google_maps_search_url || defaultCompanyProfile.googleMapsSearchUrl,
    googleMapsEmbedUrl: row.google_maps_embed_url || defaultCompanyProfile.googleMapsEmbedUrl,
  };
}
