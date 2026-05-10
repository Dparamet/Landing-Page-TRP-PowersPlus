import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { portfolioProjects } from '../src/content/site.ts';
import { applyPortfolioImageOverrides, portfolioProjectKey } from '../src/lib/portfolioImages.ts';

describe('portfolio image overrides', () => {
  it('creates stable project keys from English titles', () => {
    assert.equal(portfolioProjectKey(portfolioProjects[0]), 'manufacturing-facility-solar-installation');
  });

  it('overrides cover and staged gallery images without changing project content', () => {
    const projectKey = portfolioProjectKey(portfolioProjects[0]);
    const [project] = applyPortfolioImageOverrides(portfolioProjects.slice(0, 1), [
      {
        project_key: projectKey,
        image_slot: 'cover',
        image_url: 'https://example.com/cover.webp',
        alt_th: 'รูปหน้าปกใหม่',
        media_asset_id: null,
        created_at: null,
        updated_at: null,
      },
      {
        project_key: projectKey,
        image_slot: 'before',
        image_url: 'https://example.com/before.webp',
        alt_th: 'รูปก่อนติดตั้งใหม่',
        media_asset_id: null,
        created_at: null,
        updated_at: null,
      },
    ]);

    assert.equal(project.coverImage.src, 'https://example.com/cover.webp');
    assert.equal(project.gallery.find((image) => image.stage === 'before')?.src, 'https://example.com/before.webp');
    assert.equal(project.title.en, portfolioProjects[0].title.en);
  });
});
