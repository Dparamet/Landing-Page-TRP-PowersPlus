# Database Migrations

Run these files in order when creating or updating a Supabase database.

1. `202605100001_init_cms.sql`
2. `202605100002_fix_admin_policies.sql`
3. `202605100003_seed_initial_content.sql`

Rules:

- Add a new timestamped migration for every database structure or seed change.
- Do not edit an old migration after it has been applied to a shared database.
- Commit migrations with the application code that depends on them.
- Keep `.env.local`, service role keys, and real secrets out of git.
