import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { mapCompanySettingsToProfile, mapSiteSettingsRowToProfile } from '../src/lib/companyProfile.ts';
import { defaultCompanySettings } from '../src/lib/admin/companySettings.ts';

describe('public company profile mapping', () => {
  it('maps saved company settings to the public company profile shape', () => {
    const profile = mapCompanySettingsToProfile({ ...defaultCompanySettings, name: 'TRP Powers Plus Test' });

    assert.equal(profile.name, 'TRP Powers Plus Test');
    assert.equal(profile.phoneHref, defaultCompanySettings.phoneHref);
  });

  it('falls back to default values for an empty database row', () => {
    const profile = mapSiteSettingsRowToProfile(null);

    assert.equal(profile.name, 'TRP Powers Plus');
  });
});
