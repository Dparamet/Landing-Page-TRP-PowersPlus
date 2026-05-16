import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildStandardItemUpsertRow, deriveStandardItemIdentity } from '../src/lib/admin/standardItems.ts';

describe('standard item admin helpers', () => {
  it('builds an upsert payload with slug ids and hover images', () => {
    const row = buildStandardItemUpsertRow(
      {
        id: 'solar-install',
        title: 'Solar install',
        altText: '',
        imageUrl: 'https://example.com/solar.webp',
        hoverImageUrl: 'https://example.com/solar-hover.webp',
        assetAltText: 'tester',
        sortOrder: 10,
        published: true,
      },
      '2026-05-15T00:00:00.000Z',
    );

    assert.deepEqual(row, {
      id: 'solar-install',
      title: 'Solar install',
      image_url: 'https://example.com/solar.webp',
      image_alt: 'tester',
      hover_image_url: 'https://example.com/solar-hover.webp',
      sort_order: 10,
      published: true,
      deleted_at: null,
      purge_after: null,
      updated_at: '2026-05-15T00:00:00.000Z',
    });
    assert.equal(Object.hasOwn(row, 'alt_text'), false);
    assert.equal(Object.hasOwn(row, 'media_asset_id'), false);
    assert.equal(Object.hasOwn(row, 'hover_media_asset_id'), false);
  });

  it('omits hover image columns when no hover image is selected', () => {
    const row = buildStandardItemUpsertRow(
      {
        id: 'solar-install',
        title: 'Solar install',
        imageUrl: 'https://example.com/solar.webp',
        assetAltText: 'tester',
      },
      '2026-05-15T00:00:00.000Z',
    );

    assert.equal(Object.hasOwn(row, 'hover_image_url'), false);
  });

  it('derives hidden id and title from selected image metadata', () => {
    assert.deepEqual(
      deriveStandardItemIdentity({
        id: '',
        title: '',
        altText: '',
        assetLabel: 'Solar Install 2026.webp',
        fallbackSuffix: 'abc123',
      }),
      {
        id: 'solar-install-2026-webp',
        title: 'Solar Install 2026.webp',
      },
    );
  });
});
