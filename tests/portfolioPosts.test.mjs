import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  defaultPortfolioPostFormValues,
  mapPortfolioPostFormToInsert,
  mapPortfolioProjectRowToProject,
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
    const insert = mapPortfolioPostFormToInsert(validPost);

    assert.equal(insert.slug, 'test-project');
    assert.equal(insert.category_key, 'solar');
    assert.equal(Array.isArray(insert.metrics), true);
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
});
