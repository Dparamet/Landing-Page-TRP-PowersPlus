import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { describe, it } from 'node:test';

describe('database migrations', () => {
  it('documents every SQL migration in run order', async () => {
    const migrationNames = (await readdir('supabase/migrations'))
      .filter((name) => name.endsWith('.sql'))
      .sort();
    const readme = await readFile('supabase/migrations/README.md', 'utf8');

    for (const migrationName of migrationNames) {
      assert.equal(readme.includes(migrationName), true, `${migrationName} is missing from migrations README`);
    }
  });
});
