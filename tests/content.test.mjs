import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { companyProfile, portfolioProjects } from '../src/content/site.ts';

function publicFilePath(publicUrl) {
  return join(process.cwd(), 'public', publicUrl.replace(/^\//, ''));
}

describe('editable site content', () => {
  it('keeps contact links usable', () => {
    assert.match(companyProfile.phoneHref, /^\+\d+$/);
    assert.match(companyProfile.email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    assert.match(companyProfile.lineUrl, /^https:\/\//);
    assert.match(companyProfile.facebookUrl, /^https:\/\/facebook\.com\//);
    assert.match(companyProfile.googleMapsEmbedUrl, /^https:\/\/www\.google\.com\/maps\/embed/);
  });

  it('keeps Facebook as an external profile link only', () => {
    assert.equal(companyProfile.facebookUrl.includes('facebook.com/plugins'), false);
    assert.equal(companyProfile.facebookUrl.includes('fburl.com'), false);
  });

  it('points every portfolio item to an existing public image', () => {
    for (const project of portfolioProjects) {
      const images = [project.coverImage, ...project.gallery];

      for (const image of images) {
        assert.ok(image.src.startsWith('/images/'), `${project.title.en} image must be inside public/images`);
        assert.ok(existsSync(publicFilePath(image.src)), `${project.title.en} image file is missing`);
        assert.ok(image.alt.th.length > 0, `${project.title.en} needs Thai alt text`);
        assert.ok(image.alt.en.length > 0, `${project.title.en} needs English alt text`);
      }
    }
  });

  it('keeps portfolio projects useful for customer decisions', () => {
    for (const project of portfolioProjects) {
      assert.ok(['orange', 'blue'].includes(project.accent), `${project.title.en} has unsupported accent`);
      assert.ok(['residential', 'factory', 'business', 'agriculture'].includes(project.categoryKey));
      assert.ok(project.systemSize.length > 0, `${project.title.en} needs a system size`);
      assert.ok(project.systemType.th.length > 0, `${project.title.en} needs Thai system type`);
      assert.ok(project.systemType.en.length > 0, `${project.title.en} needs English system type`);
      assert.equal(project.gallery.length >= 3, true, `${project.title.en} needs before/during/after images`);
      assert.equal(new Set(project.gallery.map((image) => image.stage)).size, project.gallery.length);
      assert.ok(Number.isFinite(project.monthlyProductionKwh), `${project.title.en} needs monthly production`);
      assert.ok(Number.isFinite(project.monthlySavingsBaht), `${project.title.en} needs monthly savings`);
    }
  });
});
