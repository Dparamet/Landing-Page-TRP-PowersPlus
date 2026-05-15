import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  defaultCompanySettings,
  mapCompanySettingsFormToUpsert,
  mapSiteSettingsRowToForm,
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
  });

  it('maps form values to the Supabase upsert shape', () => {
    const upsert = mapCompanySettingsFormToUpsert(defaultCompanySettings);

    assert.equal(upsert.id, true);
    assert.equal(upsert.phone_display, defaultCompanySettings.phoneDisplay);
    assert.equal(upsert.instagram_url, defaultCompanySettings.instagramUrl);
    assert.equal(upsert.tiktok_url, defaultCompanySettings.tiktokUrl);
    assert.equal(upsert.google_maps_embed_url, defaultCompanySettings.googleMapsEmbedUrl);
    assert.match(upsert.updated_at, /^\d{4}-\d{2}-\d{2}T/);
  });

});
