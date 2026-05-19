import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

function source(path) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('next config', () => {
  it('keeps the Next.js dev indicator from dimming local pages', () => {
    const config = source('next.config.js');
    const globalCss = source('src/app/globals.css');

    assert.match(config, /devIndicators:\s*false/);
    assert.match(config, /export default nextConfig/);
    assert.doesNotMatch(config, /module\.exports/);
    assert.match(globalCss, /nextjs-portal\s*\{/);
    assert.match(globalCss, /pointer-events:\s*none\s*!important/);
  });

  it('defines baseline browser security headers for static deployments', () => {
    const vercelConfig = source('vercel.json');
    const staticHeaders = source('public/_headers');

    for (const header of [
      'Content-Security-Policy',
      'Strict-Transport-Security',
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Referrer-Policy',
      'Permissions-Policy',
      'Cross-Origin-Opener-Policy',
    ]) {
      assert.match(vercelConfig, new RegExp(header));
      assert.match(staticHeaders, new RegExp(header));
    }
  });
});
