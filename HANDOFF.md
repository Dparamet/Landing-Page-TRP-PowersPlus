# Handoff — Cleanup ฐานข้อมูลซ้ำซ้อน (2026-07-04)

สรุปการล้าง dead/duplicate database objects โดยไม่กระทบระบบเดิม

## ลบอะไร เพราะอะไร

| รายการ | เหตุผล | Commit |
| --- | --- | --- |
| `supabase/fix-admin-policies.sql` | ซ้ำ 100% กับ `migrations/202605100002_fix_admin_policies.sql` (`diff` ว่าง) ไม่ถูกอ้างจากที่ไหน | ลบไฟล์ |
| ฟังก์ชัน `is_admin_user(uuid)` | ทำงานเหมือน `is_admin(uuid)` เป๊ะ ใช้แค่ใน RLS ของ `web_events` | `202607040001_drop_is_admin_user.sql` |
| ฟังก์ชัน `soft_delete_site_text` / `hard_delete_site_text` / `restore_site_text` | ไม่เคยถูกเรียกจาก frontend เลย (SiteTextManager ใช้ `.upsert()` ตรง ไม่มี UI ลบ) | `202607040002_drop_site_text_delete_rpc.sql` |
| `supabase/schema.sql` | snapshot เก่า สร้าง `is_admin()` แบบไม่มี arg + `is_admin_user` ที่ migration ตั้งใจ drop ไปแล้ว การรันซ้ำบน DB จริงทำให้ฟังก์ชันซ้ำ → error `is_admin() is not unique` เป็น footgun ไม่มีใครอ้างถึง | ลบไฟล์ |

## ⚠️ ถ้าเคยเผลอรัน schema.sql บน DB จริง

จะเจอ error `function public.is_admin() is not unique` เพราะมี `is_admin()` (ไม่มี arg) ซ้ำกับ `is_admin(uuid)` แก้ด้วยการรันใน Supabase SQL Editor:

```sql
drop function if exists public.is_admin();
```

ตรวจว่าเหลือตัวเดียว (`is_admin | p_user_id uuid`):

```sql
select proname, pg_get_function_identity_arguments(oid) as args
from pg_proc where proname in ('is_admin', 'is_admin_user');
```

## ไฟล์โค้ดที่แก้

- `src/lib/supabase/database.types.ts` — ลบ type entry ของ 3 RPC ที่ drop ไป
- `supabase/migrations/README.md` — เพิ่มรายการ migration 24, 25
- `README.md` — เพิ่ม section ฐานข้อมูล Supabase (env, ตาราง, RLS, migrations) + supabase/ ใน project tree

## ⚠️ ต้องทำเองก่อนถือว่าเสร็จ

migration 2 ไฟล์ **ยังไม่ได้รันบน Supabase** (rule: ห้าม apply ไป production ให้เอง) ให้เปิด Supabase SQL Editor แล้วรันตามลำดับ:

1. `supabase/migrations/202607040001_drop_is_admin_user.sql`
2. `supabase/migrations/202607040002_drop_site_text_delete_rpc.sql`

## Verify (ก่อน/หลัง เท่ากัน = ไม่พัง)

| | ก่อน | หลัง |
| --- | --- | --- |
| `npm test` | 133 pass / 0 fail | 133 pass / 0 fail |
| `npm run lint` | No issues | No issues |
| `npm run build` | ✓ compiled | ✓ compiled (TypeScript ผ่าน) |
| ไฟล์ .sql (root) | 2 | 1 |
| migrations | 25 | 27 (+2 drop migrations) |
| SQL functions ซ้ำซ้อน | `is_admin_user` + 3 site_text RPC | ลบทิ้งหมด |

## Rollback

ทุกอย่างอยู่ใน git (branch `template` เก็บ state ก่อนแก้ไว้ทั้งหมด) — `git revert <commit>` หรือ `git checkout template -- <file>` ได้
ฝั่ง DB: migration เป็น `drop function if exists` ถ้าต้องคืน ให้รัน `create function` เดิมจาก migration ต้นทาง (`202605130001`, `202605150006`)

## SQL Injection audit (/admin)

ตรวจแล้ว **ไม่พบช่องโหว่** — DB access ทั้งหมดผ่าน Supabase client (parameterized), ไม่มี raw SQL / `.or()` / `.filter()` ที่รับ user input, `/admin` ไม่ป้อน URL param เข้า query, สิทธิ์จริงคุมด้วย RLS ที่ Postgres
