import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  applyPortfolioServiceLabels,
  defaultPortfolioPostFormValues,
  mapPortfolioPostFormToInsert,
  mapPortfolioPostFormToUpdate,
  mapPortfolioProjectRowToForm,
  mapPortfolioProjectRowToProject,
  mapPortfolioProjectViewToForm,
  validatePortfolioPost,
} from '../src/lib/admin/portfolioPosts.ts';

const validPost = {
  ...defaultPortfolioPostFormValues,
  titleTh: 'งานทดสอบ',
  titleEn: 'Test Project',
  descriptionTh: 'รายละเอียดงาน',
  descriptionEn: 'Project detail',
  systemTypeTh: 'ระบบโซลาร์',
  systemTypeEn: 'Solar system',
  locationTh: 'กรุงเทพฯ',
  locationEn: 'Bangkok',
  metricValueTh: '10 kWp',
  metricValueEn: '10 kWp',
};

describe('portfolio posts admin helpers', () => {
  it('validates required portfolio fields', () => {
    assert.equal(validatePortfolioPost(validPost).ok, true);
    assert.equal(validatePortfolioPost({ ...validPost, titleTh: '' }).ok, false);
  });

  it('maps a form into a Supabase insert row', () => {
    const insert = mapPortfolioPostFormToInsert({ ...validPost, sortOrder: 25 });

    assert.equal(insert.slug, 'test-project');
    assert.equal(insert.category_key, 'solar');
    assert.equal(Array.isArray(insert.metrics), true);
    assert.equal(insert.sort_order, 25);
  });

  it('keeps zero sort order inside PostgreSQL integer range', () => {
    const insert = mapPortfolioPostFormToInsert({ ...validPost, sortOrder: 0 });

    assert.equal(insert.sort_order, 0);
  });

  it('rejects sort order values outside PostgreSQL integer range', () => {
    const validation = validatePortfolioPost({ ...validPost, sortOrder: Date.now() });

    assert.equal(validation.ok, false);
    assert.equal(validation.message, 'ลำดับต้องเป็นเลขจำนวนเต็ม 0 ถึง 2147483647');
  });

  it('keeps an existing slug when saving a static portfolio project as editable database content', () => {
    const form = mapPortfolioProjectViewToForm({
      title: { th: 'งานเดิม', en: 'Existing Project' },
      categoryKey: 'solar',
      category: { th: 'โซลาร์', en: 'Solar' },
      description: { th: 'รายละเอียดเดิม', en: 'Existing detail' },
      systemType: { th: 'ระบบเดิม', en: 'Existing system' },
      metrics: [{ label: { th: 'ขนาด', en: 'Size' }, value: { th: '5 kWp', en: '5 kWp' }, highlight: true }],
      location: { th: 'กรุงเทพฯ', en: 'Bangkok' },
      province: { th: 'กรุงเทพฯ', en: 'Bangkok' },
      accent: 'orange',
      coverImage: { src: '/images/LogoTRP.webp', alt: { th: 'รูป', en: 'Image' } },
      gallery: [],
    });
    const insert = mapPortfolioPostFormToInsert({ ...form, titleTh: 'งานเดิมที่แก้แล้ว' });

    assert.equal(form.id, '');
    assert.equal(form.slug, 'existing-project');
    assert.equal(insert.slug, 'existing-project');
    assert.deepEqual(insert.title, { th: 'งานเดิมที่แก้แล้ว', en: 'Existing Project' });
  });

  it('maps an existing database row back into an editable form', () => {
    const insert = mapPortfolioPostFormToInsert({ ...validPost, sortOrder: 30 });
    const row = {
      id: 'project-id',
      created_at: null,
      updated_at: null,
      deleted_at: null,
      purge_after: null,
      cover_image_id: null,
      ...insert,
      gallery: [],
      published: true,
    };
    const form = mapPortfolioProjectRowToForm(row);
    const update = mapPortfolioPostFormToUpdate({ ...form, titleTh: 'แก้ไขงาน' });

    assert.equal(form.id, 'project-id');
    assert.equal(form.sortOrder, 30);
    assert.deepEqual(update.title, { th: 'แก้ไขงาน', en: 'Test Project' });
  });

  it('maps a database row into the public portfolio shape', () => {
    const insert = mapPortfolioPostFormToInsert(validPost);
    const project = mapPortfolioProjectRowToProject({
      id: 'project-id',
      created_at: null,
      updated_at: null,
      deleted_at: null,
      purge_after: null,
      cover_image_id: null,
      sort_order: 1,
      ...insert,
      gallery: [],
      published: true,
    });

    assert.equal(project.title.th, 'งานทดสอบ');
    assert.equal(project.gallery.length, 3);
  });
  it('uses dynamic service labels for custom portfolio categories', () => {
    const insert = mapPortfolioPostFormToInsert({ ...validPost, categoryKey: 'ev-charger' });
    const project = mapPortfolioProjectRowToProject({
      id: 'project-id',
      created_at: null,
      updated_at: null,
      deleted_at: null,
      purge_after: null,
      cover_image_id: null,
      sort_order: 1,
      ...insert,
      gallery: [],
      published: true,
    });

    const [labeledProject] = applyPortfolioServiceLabels([project], [
      { key: 'ev-charger', shortTitle: { th: 'EV Charger', en: 'EV Charger' } },
    ]);

    assert.equal(labeledProject.category.th, 'EV Charger');
    assert.equal(labeledProject.category.en, 'EV Charger');
  });
});
