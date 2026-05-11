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

Rules:

- Add a new timestamped migration for every database structure or seed change.
- Do not edit an old migration after it has been applied to a shared database.
- Commit migrations with the application code that depends on them.
- Keep `.env.local`, service role keys, and real secrets out of git.
- In Supabase SQL Editor, open each `.sql` file and paste the SQL contents. Do not paste only the file path.
