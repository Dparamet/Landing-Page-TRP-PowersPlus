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

  it('hardens media hard delete with storage cleanup and explicit admin failure', async () => {
    const migration = await readFile('supabase/migrations/202605150003_harden_media_and_hero_delete.sql', 'utf8');

    assert.match(migration, /raise exception 'admin permission required';/);
    assert.match(migration, /delete from storage\.objects/);
    assert.match(migration, /delete from public\.media_assets/);
    assert.match(migration, /notify pgrst, 'reload schema';/);
  });

  it('routes portfolio image saving through an explicit admin RPC', async () => {
    const migration = await readFile('supabase/migrations/202605150004_set_portfolio_image_override_rpc.sql', 'utf8');

    assert.match(migration, /create or replace function public\.set_portfolio_image_override/);
    assert.match(migration, /public\.is_admin\(auth\.uid\(\)\)/);
    assert.match(migration, /insert into public\.portfolio_image_overrides/);
    assert.match(migration, /on conflict \(project_key, image_slot\) do update/);
  });

  it('repairs explicit admin RPC permissions for already-updated databases', async () => {
    const migration = await readFile('supabase/migrations/202605150005_repair_admin_rpc_permissions.sql', 'utf8');

    assert.match(migration, /create or replace function public\.is_admin\(p_user_id uuid default auth\.uid\(\)\)/);
    assert.match(migration, /grant execute on function public\.is_admin\(uuid\) to anon, authenticated;/);
    assert.match(migration, /create or replace function public\.hard_delete_media_asset/);
    assert.match(migration, /create or replace function public\.set_portfolio_image_override/);
    assert.match(migration, /notify pgrst, 'reload schema';/);
  });

  it('repairs legacy admin policies and adds social company links', async () => {
    const migration = await readFile('supabase/migrations/202605150006_social_links_and_admin_policy_repair.sql', 'utf8');

    assert.match(migration, /add column if not exists instagram_display/);
    assert.match(migration, /add column if not exists tiktok_url/);
    assert.match(migration, /create or replace function public\.soft_delete_faq_item/);
    assert.match(migration, /public\.is_admin\(auth\.uid\(\)\)/);
    assert.doesNotMatch(migration, /public\.is_admin\(\)/);
    assert.match(migration, /notify pgrst, 'reload schema';/);
  });

  it('drops the legacy no-arg admin helper after rewriting admin dependencies', async () => {
    const migration = await readFile('supabase/migrations/202605150007_drop_legacy_is_admin_noarg.sql', 'utf8');

    assert.match(migration, /on storage\.objects for insert/);
    assert.match(migration, /create or replace function public\.soft_delete_faq_item/);
    assert.match(migration, /create or replace function public\.soft_delete_process_step/);
    assert.match(migration, /create or replace function public\.soft_delete_service/);
    assert.match(migration, /public\.is_admin\(auth\.uid\(\)\)/);
    assert.match(migration, /drop function if exists public\.is_admin\(\);/);
    assert.doesNotMatch(migration.replace(/drop function if exists public\.is_admin\(\);/, ''), /public\.is_admin\(\)/);
  });

  it('keeps media hard delete away from direct storage table deletion', async () => {
    const migration = await readFile('supabase/migrations/202605150008_media_delete_storage_api.sql', 'utf8');

    assert.match(migration, /create or replace function public\.hard_delete_media_asset/);
    assert.match(migration, /delete from public\.media_assets/);
    assert.doesNotMatch(migration, /delete from storage\.objects/);
    assert.match(migration, /notify pgrst, 'reload schema';/);
  });
});
