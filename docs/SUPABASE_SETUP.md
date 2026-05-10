# Supabase Setup

This project is ready to connect to Supabase for editable site content, admin access, and uploaded portfolio images.

## 1. Create the Supabase project

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.

## 2. Add the first admin

1. Create the owner account in Supabase Auth.
2. Copy that user's UUID from the Auth users table.
3. Run:

```sql
insert into public.admin_profiles (user_id, role)
values ('YOUR_AUTH_USER_ID', 'owner');
```

## 3. Configure local env

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Never commit `.env.local` or any service role key.

## 4. Image storage

Create a public Supabase Storage bucket named `site-media`.

Allowed image MIME types in the database are:

- `image/jpeg`
- `image/png`
- `image/webp`

Admin upload UI should still validate file type and file size before upload.
