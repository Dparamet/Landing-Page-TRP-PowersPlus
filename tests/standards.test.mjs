import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { fallbackStandardItems, mapStandardItemRows } from '../src/lib/standards.ts';

describe('standard items', () => {
  it('uses fallback standards when no database rows exist', () => {
    assert.equal(mapStandardItemRows([]).length, fallbackStandardItems.length);
  });

  it('maps, filters, and sorts public standard rows', () => {
    const rows = [
      {
        id: 'iso-14001',
        title: 'ISO 14001',
        image_url: 'https://example.com/iso.webp',
        alt_text: '',
        media_asset_id: null,
        sort_order: 20,
        published: true,
        created_at: null,
        updated_at: null,
        deleted_at: null,
        purge_after: null,
      },
      {
        id: 'hidden',
        title: 'Hidden',
        image_url: null,
        alt_text: 'Hidden item',
        media_asset_id: null,
        sort_order: 10,
        published: false,
        created_at: null,
        updated_at: null,
        deleted_at: null,
        purge_after: null,
      },
    ];

    const publicItems = mapStandardItemRows(rows);
    const adminItems = mapStandardItemRows(rows, fallbackStandardItems, true);

    assert.equal(publicItems.length, 1);
    assert.equal(publicItems[0].altText, 'ISO 14001');
    assert.equal(adminItems[0].id, 'hidden');
  });

  it('maps legacy standard rows that use image_alt', () => {
    const rows = [
      {
        id: '2ea1ff1d-c198-4785-b9c2-dc066b033e1d',
        title: 'niiga',
        description: '',
        image_url: 'https://example.com/solar.webp',
        image_alt: 'tester',
        sort_order: 10,
        published: true,
        created_at: null,
        updated_at: null,
        deleted_at: null,
        purge_after: null,
      },
    ];

    const publicItems = mapStandardItemRows(rows);

    assert.equal(publicItems[0].altText, 'tester');
    assert.equal(publicItems[0].imageUrl, 'https://example.com/solar.webp');
  });
});
