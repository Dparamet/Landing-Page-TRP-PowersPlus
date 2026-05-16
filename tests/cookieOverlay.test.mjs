import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

function source(path) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('cookie overlays', () => {
  it('does not let hidden overlay surfaces block page scroll or clicks', () => {
    const modal = source('src/components/CookieConsentModal.tsx');
    const banner = source('src/components/CookieConsentBanner.tsx');

    assert.match(modal, /pointer-events-none fixed inset-0/);
    assert.match(modal, /pointer-events-auto w-full max-w-xl/);
    assert.doesNotMatch(modal, /bg-slate-950\/35/);

    assert.match(banner, /pointer-events-none fixed inset-x-0 bottom-0/);
    assert.match(banner, /pointer-events-auto mx-auto max-w-3xl/);
  });
});
