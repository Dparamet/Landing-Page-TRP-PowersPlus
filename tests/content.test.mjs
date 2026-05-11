import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { companyProfile, portfolioProjects, serviceCategories } from '../src/content/site.ts';

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

  it('keeps service categories complete for lead qualification', () => {
    const expectedKeys = ['residential', 'building', 'factory', 'solar', 'maintenance', 'controlPanel'];

    assert.deepEqual(
      serviceCategories.map((service) => service.key),
      expectedKeys,
    );

    for (const service of serviceCategories) {
      assert.ok(service.title.th.length > 0, `${service.key} needs a Thai title`);
      assert.ok(service.title.en.length > 0, `${service.key} needs an English title`);
      assert.ok(service.description.th.length > 0, `${service.key} needs Thai description`);
      assert.ok(service.bestFor.th.length > 0, `${service.key} needs best-for guidance`);
      assert.ok(service.includes.length >= 3, `${service.key} needs included work items`);
      assert.ok(service.prepare.length >= 3, `${service.key} needs preparation guidance`);
      assert.ok(service.lineMessage.th.length > 0, `${service.key} needs a Thai LINE message`);
      assert.ok(['orange', 'blue'].includes(service.accent), `${service.key} has unsupported accent`);
    }
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
    const serviceKeys = new Set(serviceCategories.map((service) => service.key));

    for (const project of portfolioProjects) {
      assert.ok(['orange', 'blue'].includes(project.accent), `${project.title.en} has unsupported accent`);
      assert.ok(serviceKeys.has(project.categoryKey), `${project.title.en} uses an unknown category`);
      assert.ok(project.systemType.th.length > 0, `${project.title.en} needs Thai system type`);
      assert.ok(project.systemType.en.length > 0, `${project.title.en} needs English system type`);
      assert.ok(project.metrics.length >= 4, `${project.title.en} needs decision metrics`);
      assert.ok(project.metrics.some((metric) => metric.highlight), `${project.title.en} needs a highlighted metric`);
      for (const metric of project.metrics) {
        assert.ok(metric.label.th.length > 0, `${project.title.en} has a metric missing Thai label`);
        assert.ok(metric.label.en.length > 0, `${project.title.en} has a metric missing English label`);
        assert.ok(metric.value.th.length > 0, `${project.title.en} has a metric missing Thai value`);
        assert.ok(metric.value.en.length > 0, `${project.title.en} has a metric missing English value`);
      }
      assert.equal(project.gallery.length >= 3, true, `${project.title.en} needs before/during/after images`);
      assert.equal(new Set(project.gallery.map((image) => image.stage)).size, project.gallery.length);
    }
  });
});
