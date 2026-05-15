import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { serviceCategories } from '../src/content/site.ts';
import {
  applyServiceRows,
  mapServiceCategoryToUpsert,
  mapServiceFormToUpsert,
  mapServiceToForm,
  validateServiceForm,
} from '../src/lib/admin/services.ts';

describe('services admin helpers', () => {
  it('maps a service into editable form values', () => {
    const form = mapServiceToForm(serviceCategories[0]);

    assert.equal(form.id, 'residential');
    assert.equal(form.titleTh.length > 0, true);
  });

  it('validates required Thai MVP fields', () => {
    const form = mapServiceToForm(serviceCategories[0]);

    assert.equal(validateServiceForm(form).ok, true);
    assert.equal(validateServiceForm({ ...form, titleTh: '' }).ok, false);
  });

  it('maps form values to a Supabase update shape', () => {
    const update = mapServiceFormToUpsert(
      {
        ...mapServiceToForm(serviceCategories[0]),
        titleTh: 'แก้ไขบริการ',
        includes: [{ th: 'งานใหม่', en: 'New work' }],
        prepare: [{ th: 'เอกสารใหม่', en: 'New document' }],
      },
      serviceCategories[0],
    );

    assert.equal(update.id, 'residential');
    assert.deepEqual(update.title, { th: 'แก้ไขบริการ', en: serviceCategories[0].title.en });
    assert.deepEqual(update.includes, [{ th: 'งานใหม่', en: 'New work' }]);
    assert.deepEqual(update.prepare, [{ th: 'เอกสารใหม่', en: 'New document' }]);
  });

  it('does not send soft-delete columns when saving services', () => {
    const update = mapServiceFormToUpsert(mapServiceToForm(serviceCategories[0]), serviceCategories[0]);

    assert.equal('deleted_at' in update, false);
    assert.equal('purge_after' in update, false);
  });

  it('maps a service category into an upsert row for portfolio foreign keys', () => {
    const update = mapServiceCategoryToUpsert(serviceCategories[3], 40);

    assert.equal(update.id, 'solar');
    assert.equal(update.sort_order, 40);
    assert.deepEqual(update.short_title, serviceCategories[3].shortTitle);
  });

  it('applies database rows over static services and filters unpublished rows', () => {
    const services = applyServiceRows(serviceCategories, [
      {
        id: 'residential',
        title: { th: 'แก้ไขบริการ', en: 'Edited service' },
        short_title: serviceCategories[0].shortTitle,
        description: serviceCategories[0].description,
        best_for: serviceCategories[0].bestFor,
        includes: serviceCategories[0].includes,
        prepare: serviceCategories[0].prepare,
        line_message: serviceCategories[0].lineMessage,
        accent: 'blue',
        sort_order: 10,
        published: true,
        deleted_at: null,
        purge_after: null,
        created_at: null,
        updated_at: null,
      },
      {
        id: 'building',
        title: serviceCategories[1].title,
        short_title: serviceCategories[1].shortTitle,
        description: serviceCategories[1].description,
        best_for: serviceCategories[1].bestFor,
        includes: serviceCategories[1].includes,
        prepare: serviceCategories[1].prepare,
        line_message: serviceCategories[1].lineMessage,
        accent: 'blue',
        sort_order: 20,
        published: false,
        deleted_at: null,
        purge_after: null,
        created_at: null,
        updated_at: null,
      },
    ]);

    assert.equal(services[0].title.th, 'แก้ไขบริการ');
    assert.equal(services.some((service) => service.key === 'building'), false);
  });
});
