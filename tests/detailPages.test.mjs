import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

function source(path) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('detail page reveal behavior', () => {
  it('marks shared detail pages so reveal effects do not wash out content', () => {
    const pageLayout = source('src/components/PageLayout.tsx');
    const header = source('src/components/DetailPageHeader.tsx');
    const css = source('src/app/globals.css');

    assert.match(pageLayout, /className=\{`detail-page min-h-screen \$\{className\}`\}/);
    assert.doesNotMatch(pageLayout, /motion\.main/);
    assert.doesNotMatch(pageLayout, /initial=\{\{ opacity/);
    assert.doesNotMatch(header, /motion\./);
    assert.doesNotMatch(header, /initial=\{\{ opacity/);
    assert.match(css, /\.detail-page :where\(\.section-reveal, \.reveal-item\)/);
    assert.match(css, /opacity: 1;/);
    assert.match(css, /transform: none;/);
  });
});
