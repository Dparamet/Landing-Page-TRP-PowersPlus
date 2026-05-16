import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { mapProcessStepFormToInsert, validateProcessStepForm } from '../src/lib/admin/processSteps.ts';
import { mapSiteTextFormToUpsert, validateSiteTextForm } from '../src/lib/admin/siteTexts.ts';
import { buildDefaultProcessSteps, mapProcessStepRows } from '../src/lib/processSteps.ts';
import { mapSiteTextRows } from '../src/lib/siteTexts.ts';
import en from '../src/locales/en.json' with { type: 'json' };
import th from '../src/locales/th.json' with { type: 'json' };

describe('site texts and process content helpers', () => {
  it('maps site text rows into override lookup data', () => {
    const mapped = mapSiteTextRows([
      {
        key: 'hero.title',
        value: { th: 'ชื่อไทย', en: 'English title' },
        created_at: null,
        updated_at: null,
      },
    ]);

    assert.equal(mapped['hero.title'].th, 'ชื่อไทย');
    assert.equal(mapped['hero.title'].en, 'English title');
  });

  it('validates and maps editable site text values', () => {
    const valid = validateSiteTextForm({ key: 'hero.title', textTh: 'ชื่อไทย', textEn: '' });

    assert.equal(valid.ok, true);
    assert.equal(validateSiteTextForm({ key: 'bad key', textTh: 'ชื่อไทย', textEn: '' }).ok, false);
    assert.deepEqual(mapSiteTextFormToUpsert({ key: 'hero.title', textTh: 'ชื่อไทย', textEn: '' }).value, {
      th: 'ชื่อไทย',
      en: 'ชื่อไทย',
    });
  });

  it('builds process step fallback data and maps database rows', () => {
    const fallback = buildDefaultProcessSteps(th.process.steps, en.process.steps);
    const rows = [
      {
        id: '81111111-1111-4111-8111-111111111111',
        title: { th: 'ขั้นตอนใหม่', en: 'New step' },
        description: { th: 'รายละเอียด', en: 'Details' },
        sort_order: 20,
        published: true,
        deleted_at: null,
        purge_after: null,
        created_at: null,
        updated_at: null,
      },
      {
        id: '82222222-2222-4222-8222-222222222222',
        title: { th: 'ซ่อน', en: 'Hidden' },
        description: { th: 'ซ่อน', en: 'Hidden' },
        sort_order: 10,
        published: false,
        deleted_at: null,
        purge_after: null,
        created_at: null,
        updated_at: null,
      },
    ];

    const publicSteps = mapProcessStepRows(rows, fallback);
    const adminSteps = mapProcessStepRows(rows, fallback, true);

    assert.equal(fallback.length, th.process.steps.length);
    assert.equal(publicSteps.length, 1);
    assert.equal(publicSteps[0].title.th, 'ขั้นตอนใหม่');
    assert.equal(adminSteps[0].title.th, 'ซ่อน');
  });

  it('falls back when database rows contain no visible process steps', () => {
    const fallback = buildDefaultProcessSteps(th.process.steps, en.process.steps);
    const rows = [
      {
        id: '83333333-3333-4333-8333-333333333333',
        title: { th: 'ซ่อน', en: 'Hidden' },
        description: { th: 'ซ่อน', en: 'Hidden' },
        sort_order: 10,
        published: false,
        deleted_at: null,
        purge_after: null,
        created_at: null,
        updated_at: null,
      },
    ];

    const publicSteps = mapProcessStepRows(rows, fallback);

    assert.equal(publicSteps.length, fallback.length);
    assert.equal(publicSteps[0].title.th, fallback[0].title.th);
  });

  it('validates and maps editable process steps', () => {
    const form = {
      id: null,
      titleTh: 'สำรวจ',
      titleEn: '',
      descriptionTh: 'ตรวจข้อมูล',
      descriptionEn: '',
      sortOrder: 10,
      published: true,
    };

    assert.equal(validateProcessStepForm(form).ok, true);
    assert.equal(validateProcessStepForm({ ...form, titleTh: '' }).ok, false);
    assert.deepEqual(mapProcessStepFormToInsert(form).title, { th: 'สำรวจ', en: 'สำรวจ' });
  });
});
