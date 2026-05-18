import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

function source(path) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('admin layout chrome', () => {
  it('keeps public cookie and tracking overlays off the admin dashboard', () => {
    const clientLayout = source('src/app/ClientLayout.tsx');

    assert.match(clientLayout, /usePathname/);
    assert.match(clientLayout, /pathname\.startsWith\('\/admin'\)/);
    assert.match(clientLayout, /!isAdminRoute && <CookieConsentBanner \/>/);
    assert.match(clientLayout, /!isAdminRoute && <CookieConsentModal \/>/);
    assert.match(clientLayout, /!isAdminRoute \? <ScrollEffects \/> : null/);
    assert.match(clientLayout, /!isAdminRoute \? \(\s*<Suspense fallback=\{null\}>/);
  });

  it('keeps root metadata readable and relevant to TRP electrical contractor services', () => {
    const layout = source('src/app/layout.tsx');

    assert.match(layout, /รับเหมาติดตั้งระบบไฟฟ้าและโซลาร์เซลล์/);
    assert.match(layout, /ระบบไฟฟ้า โซลาร์เซลล์ ตู้ควบคุม/);
    assert.doesNotMatch(layout, /เธ/);
  });

  it('keeps contact admin preview refresh out of the initial load loop', () => {
    const contactManager = source('src/components/admin/ContactItemManager.tsx');
    const companySettings = source('src/components/admin/CompanySettingsForm.tsx');

    assert.match(contactManager, /const loadItems = useCallback\(async \(\) =>/);
    assert.match(contactManager, /}, \[\]\);/);
    assert.doesNotMatch(contactManager, /setMessage\(''\);\s*requestPreviewRefresh\(\);/);
    assert.doesNotMatch(companySettings, /setMessage\(''\);\s*requestPreviewRefresh\(\);/);
  });

  it('allows optional company social contact items to be deleted without database ids', () => {
    const contactManager = source('src/components/admin/ContactItemManager.tsx');

    assert.match(contactManager, /optionalCompanyContactTypes = new Set\(\['facebook', 'instagram', 'tiktok'\]\)/);
    assert.match(contactManager, /const canSoftDelete = Boolean\(values\.databaseId\) \|\| optionalCompanyContactTypes\.has\(values\.type\)/);
    assert.match(contactManager, /\.insert\(mapContactFormToInsert\(values\)\)\s*\.select\('id'\)\s*\.single\(\)/);
    assert.match(contactManager, /callItemRpc\('soft_delete_contact_item', 'ย้ายช่องทางติดต่อไปถังพักแล้ว', data\.id\)/);
    assert.match(contactManager, /syncCompanySettingsFromContactItem\(values, false\)/);
    assert.match(contactManager, /syncCompanySettingsFromContactItem\(values, true\)/);
  });

  it('uses move buttons instead of manual sort-order number fields across admin managers', () => {
    const sortControls = source('src/components/admin/SortOrderControls.tsx');
    const managers = [
      ['src/components/admin/ContactItemManager.tsx', /async function moveSelectedItem\(direction: -1 \| 1\)/],
      ['src/components/admin/FaqManager.tsx', /async function moveSelectedFaq\(direction: -1 \| 1\)/],
      ['src/components/admin/PortfolioPostManager.tsx', /async function moveSelectedPost\(direction: -1 \| 1\)/],
      ['src/components/admin/ProcessStepManager.tsx', /async function moveSelectedStep\(direction: -1 \| 1\)/],
      ['src/components/admin/ServiceManager.tsx', /async function moveSelectedService\(direction: -1 \| 1\)/],
      ['src/components/admin/StandardItemManager.tsx', /async function moveSelectedItem\(direction: -1 \| 1\)/],
    ];

    for (const [path, moveFunctionPattern] of managers) {
      const manager = source(path);

      assert.match(manager, /SortOrderControls/);
      assert.match(manager, moveFunctionPattern);
      assert.match(manager, /\(index \+ 1\) \* 10/);
      assert.doesNotMatch(manager, /type="number"[\s\S]{0,180}sortOrder/);
    }

    assert.match(sortControls, /ขยับขึ้น/);
    assert.match(sortControls, /ขยับลง/);
  });
});
