import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildDefaultContactItems,
  createBlankContactItemForm,
  mapContactFormToInsert,
  mapContactRows,
  validateContactItem,
} from '../src/lib/admin/contactItems.ts';
import { defaultCompanyProfile } from '../src/lib/companyProfile.ts';

describe('contact item CMS helpers', () => {
  it('builds fallback contact items from company profile', () => {
    const items = buildDefaultContactItems(defaultCompanyProfile);

    assert.equal(items.length >= 6, true);
    assert.equal(items.some((item) => item.type === 'line'), true);
    assert.equal(items.some((item) => item.href.startsWith('tel:')), true);
  });

  it('validates required contact item fields and safe hrefs', () => {
    const form = {
      ...createBlankContactItemForm(10),
      labelTh: 'LINE',
      valueTh: '@TRPPowersplus',
      href: 'https://line.me/ti/p/@TRPPowersplus',
    };

    assert.equal(validateContactItem(form).ok, true);
    assert.deepEqual(validateContactItem({ ...form, href: 'javascript:alert(1)' }), {
      ok: false,
      message: 'ลิงก์ต้องเป็น https://, tel:, หรือ mailto:',
    });
  });

  it('maps form values to Supabase insert rows', () => {
    const insert = mapContactFormToInsert({
      ...createBlankContactItemForm(10),
      type: 'email',
      icon: 'email',
      labelTh: 'อีเมล',
      labelEn: 'Email',
      valueTh: 'TRPPowersplus@gmail.com',
      valueEn: 'TRPPowersplus@gmail.com',
      href: 'mailto:TRPPowersplus@gmail.com',
    });

    assert.deepEqual(insert.label, { th: 'อีเมล', en: 'Email' });
    assert.equal(insert.href, 'mailto:TRPPowersplus@gmail.com');
  });

  it('adds custom database rows alongside fallback contact items', () => {
    const fallback = buildDefaultContactItems(defaultCompanyProfile);
    const rows = [
      {
        id: 'contact-id',
        type: 'custom',
        icon: 'custom',
        label: { th: 'ฝ่ายขาย', en: 'Sales' },
        value: { th: 'sales@example.com', en: 'sales@example.com' },
        href: 'mailto:sales@example.com',
        copy_value: 'sales@example.com',
        external: false,
        sort_order: 5,
        published: true,
        deleted_at: null,
        purge_after: null,
        created_at: null,
        updated_at: null,
      },
    ];

    const items = mapContactRows(rows, fallback);

    assert.equal(items.length, fallback.length + 1);
    assert.equal(items[0].label.th, 'ฝ่ายขาย');
    assert.equal(items.some((item) => item.type === 'phone'), true);
  });

  it('keeps fallback contact items when only some database rows exist', () => {
    const fallback = buildDefaultContactItems(defaultCompanyProfile);
    const rows = [
      {
        id: '11111111-1111-4111-8111-111111111111',
        type: 'line',
        icon: 'line',
        label: { th: 'LINE OA', en: 'LINE OA' },
        value: { th: '@TRPPowersplus', en: '@TRPPowersplus' },
        href: 'https://line.me/ti/p/@TRPPowersplus',
        copy_value: '@TRPPowersplus',
        external: true,
        sort_order: 30,
        published: true,
        deleted_at: null,
        purge_after: null,
        created_at: null,
        updated_at: null,
      },
    ];

    const items = mapContactRows(rows, fallback);

    assert.equal(items.some((item) => item.type === 'phone'), true);
    assert.equal(items.some((item) => item.type === 'email'), true);
    assert.equal(items.find((item) => item.type === 'line')?.label.th, 'LINE OA');
  });

  it('omits optional social fallback items when company profile leaves them blank', () => {
    const fallback = buildDefaultContactItems({
      ...defaultCompanyProfile,
      instagramDisplay: '',
      instagramUrl: '',
      tiktokDisplay: '',
      tiktokUrl: '',
    });

    assert.equal(fallback.some((item) => item.type === 'instagram'), false);
    assert.equal(fallback.some((item) => item.type === 'tiktok'), false);
    assert.equal(fallback.some((item) => item.type === 'phone'), true);
  });

  it('keeps deleted default contact rows hidden instead of restoring fallback values', () => {
    const fallback = buildDefaultContactItems(defaultCompanyProfile);
    const rows = [
      {
        id: '11111111-1111-4111-8111-111111111111',
        type: 'instagram',
        icon: 'instagram',
        label: { th: 'Instagram', en: 'Instagram' },
        value: { th: 'TRP Powers Plus', en: 'TRP Powers Plus' },
        href: 'https://instagram.com/TRPPowersplus',
        copy_value: 'https://instagram.com/TRPPowersplus',
        external: true,
        sort_order: 50,
        published: false,
        deleted_at: '2026-05-18T00:00:00.000Z',
        purge_after: null,
        created_at: null,
        updated_at: null,
      },
    ];

    const items = mapContactRows(rows, fallback);

    assert.equal(items.some((item) => item.type === 'instagram'), false);
  });

  it('does not use fallback string ids as database ids when editing default contact items', () => {
    const [company] = buildDefaultContactItems(defaultCompanyProfile);

    assert.equal(company.id, 'company');
    assert.equal(company.databaseId, '');
  });
});
