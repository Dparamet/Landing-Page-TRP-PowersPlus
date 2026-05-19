import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildMediaStoragePath,
  formatBytes,
  scaleImageSize,
  slugifyFileName,
  validateMediaFile,
} from '../src/lib/admin/mediaUpload.ts';

describe('admin media upload helpers', () => {
  it('accepts supported image types under the source size limit', () => {
    assert.deepEqual(validateMediaFile({ type: 'image/jpeg', size: 1024 }), { ok: true });
    assert.deepEqual(validateMediaFile({ type: 'image/png', size: 1024 }), { ok: true });
    assert.deepEqual(validateMediaFile({ type: 'image/webp', size: 1024 }), { ok: true });
  });

  it('rejects unsupported image types', () => {
    assert.deepEqual(validateMediaFile({ type: 'image/gif', size: 1024 }), {
      ok: false,
      message: 'รองรับเฉพาะไฟล์ JPG, PNG หรือ WebP',
    });
  });

  it('creates safe webp storage paths', () => {
    assert.equal(slugifyFileName('Factory Solar 01.JPG'), 'factory-solar-01');
    assert.equal(
      buildMediaStoragePath('Factory Solar 01.JPG', new Date('2026-05-10T08:00:00.000Z')),
      'uploads/2026-05-10/1778400000000-factory-solar-01.webp',
    );
  });

  it('scales large images without upscaling small images', () => {
    assert.deepEqual(scaleImageSize(4000, 2000, 2000), { width: 2000, height: 1000 });
    assert.deepEqual(scaleImageSize(1200, 800, 2000), { width: 1200, height: 800 });
  });

  it('formats byte sizes for upload summaries', () => {
    assert.equal(formatBytes(900), '900 B');
    assert.equal(formatBytes(1536), '1.5 KB');
    assert.equal(formatBytes(2 * 1024 * 1024), '2.00 MB');
  });
});
