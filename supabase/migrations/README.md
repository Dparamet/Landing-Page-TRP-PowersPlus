# Database Migrations

Run these files in order when creating or updating a Supabase database.

1. `202605100001_init_cms.sql`
2. `202605100002_fix_admin_policies.sql`
3. `202605100003_seed_initial_content.sql`
4. `202605100004_media_storage_bucket.sql`
5. `202605100005_portfolio_image_overrides.sql`
6. `202605100006_portfolio_posts_soft_delete.sql`
7. `202605100007_faq_items.sql`
8. `202605100008_database_hardening.sql`
9. `202605100009_site_texts_and_process_steps.sql`
10. `202605100010_soft_delete_content_tables.sql`
11. `202605100011_contact_items.sql`
12. `202605100012_standard_items.sql`
13. `202605100013_standard_hover_images.sql`
12. `202605130001_web_events.sql`
13. `202605150001_landing_hero_background_image.sql`
14. `202605150002_explicit_admin_and_media_hard_delete.sql`
15. `202605150003_harden_media_and_hero_delete.sql`
16. `202605150004_set_portfolio_image_override_rpc.sql`
17. `202605150005_repair_admin_rpc_permissions.sql`
18. `202605150006_social_links_and_admin_policy_repair.sql`
19. `202605150007_drop_legacy_is_admin_noarg.sql`
20. `202605150008_media_delete_storage_api.sql`

Rules:

- Add a new timestamped migration for every database structure or seed change.
- Do not edit an old migration after it has been applied to a shared database.
- Commit migrations with the application code that depends on them.
- Keep `.env.local`, service role keys, and real secrets out of git.
- In Supabase SQL Editor, open each `.sql` file and paste the SQL contents. Do not paste only the file path.
