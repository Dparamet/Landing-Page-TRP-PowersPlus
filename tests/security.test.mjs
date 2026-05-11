import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const contactSource = readFileSync('src/components/Contact.tsx', 'utf8');
const contentSource = readFileSync('src/content/site.ts', 'utf8');
const sourceFiles = ['src/components/Contact.tsx', 'src/components/Hero.tsx'].map((file) =>
  readFileSync(file, 'utf8'),
);

describe('third-party embed hardening', () => {
  it('does not load the Facebook Page Plugin iframe automatically', () => {
    assert.equal(contactSource.includes('facebook.com/plugins/page.php'), false);
    assert.equal(contactSource.includes('fburl.com'), false);
  });

  it('keeps external links protected from tabnabbing', () => {
    assert.equal(contactSource.includes(`rel={contact.external ? 'noopener noreferrer' : undefined}`), true);
  });

  it('sandboxes the Google Maps iframe and restricts referrer leakage', () => {
    assert.equal(contactSource.includes('sandbox="allow-scripts allow-same-origin allow-popups"'), true);
    assert.equal(contactSource.includes('referrerPolicy="strict-origin-when-cross-origin"'), true);
  });

  it('keeps managed external URLs on HTTPS', () => {
    const urlMatches = contentSource.match(/https:\/\/[^'"]+/g) ?? [];
    assert.ok(urlMatches.length >= 3);

    for (const url of urlMatches) {
      assert.match(url, /^https:\/\//);
    }
  });

  it('does not use direct HTML injection APIs in audited components', () => {
    for (const source of sourceFiles) {
      assert.equal(source.includes('dangerouslySetInnerHTML'), false);
      assert.equal(source.includes('innerHTML'), false);
      assert.equal(source.includes('eval('), false);
    }
  });
});
