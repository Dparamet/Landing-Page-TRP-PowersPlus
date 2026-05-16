import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

function source(path) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('company logo performance', () => {
  it('loads the above-the-fold logo eagerly for LCP', () => {
    const logo = source('src/components/CompanyLogo.tsx');
    const navbar = source('src/components/Navbar.tsx');

    assert.match(navbar, /<CompanyLogo[^>]+priority/);
    assert.match(logo, /loading=\{priority \? 'eager' : 'lazy'\}/);
    assert.match(logo, /fetchPriority=\{priority \? 'high' : 'auto'\}/);
    assert.match(logo, /width=\{208\}/);
    assert.match(logo, /height=\{64\}/);
  });
});
