import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

function source(path) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('admin layout chrome', () => {
  it('keeps public cookie and tracking overlays off the admin dashboard', () => {
    const clientLayout = source('src/app/ClientLayout.tsx');

    assert.match(clientLayout, /usePathname/);
    assert.match(clientLayout, /pathname\.startsWith\('\/admin'\)/);
    assert.match(clientLayout, /!isAdminRoute && <CookieConsentBanner \/>/);
    assert.match(clientLayout, /!isAdminRoute && <CookieConsentModal \/>/);
    assert.match(clientLayout, /!isAdminRoute \? <ScrollEffects \/> : null/);
    assert.match(clientLayout, /!isAdminRoute \? \(\s*<Suspense fallback=\{null\}>/);
  });
});
