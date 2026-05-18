import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  defaultCompanySettings,
  getMissingOptionalSiteSettingsColumn,
  isMissingLogoUrlColumnError,
  mapCompanySettingsFormToUpsert,
  mapCompanySettingsToDefaultContactForms,
  mapDefaultContactFormToSettingsPatch,
  mapSiteSettingsRowToForm,
  stripOptionalSiteSettingsColumn,
  validateCompanySettings,
} from '../src/lib/admin/companySettings.ts';

describe('company settings admin data', () => {
  it('validates the default company settings', () => {
    assert.equal(validateCompanySettings(defaultCompanySettings).ok, true);
  });

  it('rejects unsafe external URLs', () => {
    assert.deepEqual(validateCompanySettings({ ...defaultCompanySettings, facebookUrl: 'http://facebook.com/TRP' }), {
      ok: false,
      message: 'URL ภายนอกต้องเป็น https:// เท่านั้น',
    });
  });

  it('allows optional social channels to be blank', () => {
    const result = validateCompanySettings({
      ...defaultCompanySettings,
      instagramDisplay: '',
      instagramUrl: '',
      tiktokDisplay: '',
      tiktokUrl: '',
    });

    assert.equal(result.ok, true);
  });

  it('rejects partially filled optional social channels', () => {
    assert.deepEqual(validateCompanySettings({ ...defaultCompanySettings, instagramUrl: '' }), {
      ok: false,
      message: 'กรุณากรอกชื่อและ URL ของ Instagram ให้ครบ หรือเว้นว่างทั้งคู่',
    });
  });

  it('accepts a hosted logo URL for the admin logo setting', () => {
    const result = validateCompanySettings({ ...defaultCompanySettings, logoUrl: 'https://cdn.example.com/logo.webp' });

    assert.equal(result.ok, true);
    assert.equal(result.ok ? result.value.logoUrl : '', 'https://cdn.example.com/logo.webp');
  });

  it('rejects unsafe logo URLs', () => {
    assert.deepEqual(validateCompanySettings({ ...defaultCompanySettings, logoUrl: 'javascript:alert(1)' }), {
      ok: false,
      message: 'Logo URL ต้องเป็น https:// หรือ path ที่ขึ้นต้นด้วย / เท่านั้น',
    });
  });

  it('detects missing logo_url schema cache errors', () => {
    assert.equal(
      isMissingLogoUrlColumnError({
        message: "Could not find the 'logo_url' column of 'site_settings' in the schema cache",
      }),
      true,
    );
  });

  it('detects missing optional site settings columns', () => {
    assert.equal(
      getMissingOptionalSiteSettingsColumn({
        message: "Could not find the 'instagram_display' column of 'site_settings' in the schema cache",
      }),
      'instagram_display',
    );
  });

  it('strips missing optional site settings columns for legacy databases', () => {
    const row = stripOptionalSiteSettingsColumn(mapCompanySettingsFormToUpsert(defaultCompanySettings), 'instagram_display');

    assert.equal(Object.hasOwn(row, 'instagram_display'), false);
    assert.equal(row.instagram_url, defaultCompanySettings.instagramUrl);
  });

  it('rejects phone href values that are not tel-safe international numbers', () => {
    assert.deepEqual(validateCompanySettings({ ...defaultCompanySettings, phoneHref: '012-345-6789' }), {
      ok: false,
      message: 'เบอร์โทรสำหรับกดโทรต้องขึ้นต้นด้วย + และตามด้วยตัวเลขเท่านั้น',
    });
  });

  it('uses existing static content as fallback when the database row is empty', () => {
    const form = mapSiteSettingsRowToForm({
      id: true,
      name: 'TRP Powers Plus',
      phone_display: '',
      phone_href: '',
      email: '',
      line_id: '',
      line_url: '',
      facebook_display: '',
      facebook_url: '',
      instagram_display: '',
      instagram_url: '',
      tiktok_display: '',
      tiktok_url: '',
      address: '',
      google_maps_search_url: '',
      google_maps_embed_url: '',
      created_at: null,
      updated_at: null,
    });

    assert.equal(form.phoneDisplay, defaultCompanySettings.phoneDisplay);
    assert.equal(form.email, defaultCompanySettings.email);
    assert.equal(form.logoUrl, defaultCompanySettings.logoUrl);
  });

  it('preserves intentionally blank optional social values from database rows', () => {
    const form = mapSiteSettingsRowToForm({
      id: true,
      name: 'TRP Powers Plus',
      phone_display: '',
      phone_href: '',
      email: '',
      line_id: '',
      line_url: '',
      facebook_display: '',
      facebook_url: '',
      instagram_display: '',
      instagram_url: '',
      tiktok_display: '',
      tiktok_url: '',
      address: '',
      google_maps_search_url: '',
      google_maps_embed_url: '',
      created_at: null,
      updated_at: null,
    });

    assert.equal(form.instagramDisplay, '');
    assert.equal(form.instagramUrl, '');
    assert.equal(form.phoneDisplay, defaultCompanySettings.phoneDisplay);
  });

  it('maps form values to the Supabase upsert shape', () => {
    const upsert = mapCompanySettingsFormToUpsert(defaultCompanySettings);

    assert.equal(upsert.id, true);
    assert.equal(upsert.phone_display, defaultCompanySettings.phoneDisplay);
    assert.equal(upsert.instagram_url, defaultCompanySettings.instagramUrl);
    assert.equal(upsert.tiktok_url, defaultCompanySettings.tiktokUrl);
    assert.equal(upsert.google_maps_embed_url, defaultCompanySettings.googleMapsEmbedUrl);
    assert.equal(upsert.logo_url, defaultCompanySettings.logoUrl);
    assert.match(upsert.updated_at, /^\d{4}-\d{2}-\d{2}T/);
  });

  it('maps company settings into synced default contact forms', () => {
    const forms = mapCompanySettingsToDefaultContactForms({
      ...defaultCompanySettings,
      instagramDisplay: '',
      instagramUrl: '',
    });

    assert.equal(forms.some((form) => form.type === 'phone' && form.href.startsWith('tel:')), true);
    assert.equal(forms.some((form) => form.type === 'instagram'), false);
  });

  it('maps default contact edits back into site_settings patches', () => {
    const patch = mapDefaultContactFormToSettingsPatch({
      id: 'instagram',
      databaseId: '11111111-1111-4111-8111-111111111111',
      type: 'instagram',
      icon: 'instagram',
      labelTh: 'Instagram',
      labelEn: 'Instagram',
      valueTh: 'TRP Powers Plus',
      valueEn: 'TRP Powers Plus',
      href: 'https://instagram.com/TRPPowersplus',
      copyValue: 'https://instagram.com/TRPPowersplus',
      external: true,
      sortOrder: 50,
      published: true,
    });

    assert.deepEqual(patch, {
      instagram_display: 'TRP Powers Plus',
      instagram_url: 'https://instagram.com/TRPPowersplus',
    });
  });

  it('maps default contact deletion into blank site_settings social fields', () => {
    const patch = mapDefaultContactFormToSettingsPatch(
      {
        id: 'tiktok',
        databaseId: '',
        type: 'tiktok',
        icon: 'tiktok',
        labelTh: 'TikTok',
        labelEn: 'TikTok',
        valueTh: 'TRP Powers Plus',
        valueEn: 'TRP Powers Plus',
        href: 'https://www.tiktok.com/@TRPPowersplus',
        copyValue: 'https://www.tiktok.com/@TRPPowersplus',
        external: true,
        sortOrder: 60,
        published: true,
      },
      false,
    );

    assert.deepEqual(patch, {
      tiktok_display: '',
      tiktok_url: '',
    });
  });

});
