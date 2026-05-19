import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { describe, it } from 'node:test';

const contactSource = readFileSync('src/components/Contact.tsx', 'utf8');
const contentSource = readFileSync('src/content/site.ts', 'utf8');
const sourceFiles = ['src/components/Contact.tsx', 'src/components/Hero.tsx'].map((file) => readFileSync(file, 'utf8'));
const appSources = ['src', 'tests']
  .flatMap((root) => collectFiles(root))
  .filter((file) => /\.(tsx?|mjs|js)$/.test(file))
  .map((file) => ({ file, source: readFileSync(file, 'utf8') }));

function collectFiles(root) {
  const entries = readdirSync(root, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const path = `${root}/${entry.name}`;

    if (entry.isDirectory()) {
      return collectFiles(path);
    }

    return statSync(path).isFile() ? [path] : [];
  });
}

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

  it('does not use raw SQL execution or string-built queries in application code', () => {
    for (const { file, source } of appSources.filter((item) => item.file.startsWith('src/'))) {
      assert.equal(/\.raw\s*\(|execute\s*\(|query\s*\(/.test(source), false, `${file} should not execute raw SQL`);
      assert.equal(/select\s+\*\s+from/i.test(source), false, `${file} should not build SQL text`);
    }
  });

  it('keeps local secrets and private key files ignored', () => {
    const gitignore = readFileSync('.gitignore', 'utf8');

    assert.match(gitignore, /^\.env\*/m);
    assert.match(gitignore, /^!\.env\.example$/m);
    assert.match(gitignore, /^\*\.pem$/m);
    assert.match(gitignore, /^\*\.key$/m);
  });
});
