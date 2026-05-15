import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';

import { getSupabasePublicConfig, hasSupabasePublicConfig } from '../src/lib/supabase/config.ts';

describe('Supabase public config', () => {
  it('detects when public Supabase env vars are absent', () => {
    assert.equal(hasSupabasePublicConfig({}), false);
  });

  it('accepts a valid HTTPS Supabase config', () => {
    const config = getSupabasePublicConfig({
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key-for-tests',
    });

    assert.deepEqual(config, {
      url: 'https://example.supabase.co',
      anonKey: 'anon-key-for-tests',
    });
  });

  it('rejects non-HTTPS Supabase URLs', () => {
    assert.throws(
      () =>
        getSupabasePublicConfig({
          NEXT_PUBLIC_SUPABASE_URL: 'http://example.supabase.co',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key-for-tests',
        }),
      /valid HTTPS URL/,
    );
  });

  it('persists admin auth sessions across browser refreshes', async () => {
    const clientSource = await readFile('src/lib/supabase/client.ts', 'utf8');

    assert.match(clientSource, /persistSession:\s*true/);
    assert.match(clientSource, /autoRefreshToken:\s*true/);
  });
});
