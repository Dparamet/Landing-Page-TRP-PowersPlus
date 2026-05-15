import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildStandardItemUpsertRow } from '../src/lib/admin/standardItems.ts';

describe('standard item admin helpers', () => {
  it('builds an upsert payload for the legacy standard_items schema', () => {
    const row = buildStandardItemUpsertRow(
      {
        id: '2ea1ff1d-c198-4785-b9c2-dc066b033e1d',
        title: 'niiga',
        altText: '',
        imageUrl: 'https://example.com/solar.webp',
        assetAltText: 'tester',
        sortOrder: 10,
        published: true,
      },
      '2026-05-15T00:00:00.000Z',
    );

    assert.deepEqual(row, {
      id: '2ea1ff1d-c198-4785-b9c2-dc066b033e1d',
      title: 'niiga',
      image_url: 'https://example.com/solar.webp',
      image_alt: 'tester',
      sort_order: 10,
      published: true,
      deleted_at: null,
      purge_after: null,
      updated_at: '2026-05-15T00:00:00.000Z',
    });
    assert.equal(Object.hasOwn(row, 'alt_text'), false);
    assert.equal(Object.hasOwn(row, 'media_asset_id'), false);
    assert.equal(Object.hasOwn(row, 'hover_image_url'), false);
    assert.equal(Object.hasOwn(row, 'hover_media_asset_id'), false);
  });
});