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

  it('keeps admin content deletes on the soft-delete path', async () => {
    const adminFiles = (await readdir('src/components/admin')).filter((name) => name.endsWith('.tsx'));
    const contents = await Promise.all(adminFiles.map((name) => readFile(`src/components/admin/${name}`, 'utf8')));
    const hardDeleteUsage = contents.find((content) => content.includes('.delete('));
    const softDeleteMigration = await readFile('supabase/migrations/202605100010_soft_delete_content_tables.sql', 'utf8');

    assert.equal(hardDeleteUsage, undefined, 'admin components must use soft-delete RPCs instead of .delete()');
    assert.match(softDeleteMigration, /revoke delete on public\.faq_items from authenticated;/);
    assert.match(softDeleteMigration, /revoke delete on public\.process_steps from authenticated;/);
    assert.match(softDeleteMigration, /revoke delete on public\.site_texts from authenticated;/);
    assert.match(softDeleteMigration, /revoke delete on public\.portfolio_image_overrides from authenticated;/);

    const standardItemsMigration = await readFile('supabase/migrations/202605100012_standard_items.sql', 'utf8');
    assert.match(standardItemsMigration, /revoke delete on public\.standard_items from authenticated;/);
  });
});
