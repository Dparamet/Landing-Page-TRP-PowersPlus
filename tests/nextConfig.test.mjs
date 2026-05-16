import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

function source(path) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('next config', () => {
  it('keeps the Next.js dev indicator from dimming local pages', () => {
    const config = source('next.config.ts');
    const globalCss = source('src/app/globals.css');

    assert.match(config, /devIndicators:\s*false/);
    assert.match(globalCss, /nextjs-portal\s*\{/);
    assert.match(globalCss, /pointer-events:\s*none\s*!important/);
  });
});
