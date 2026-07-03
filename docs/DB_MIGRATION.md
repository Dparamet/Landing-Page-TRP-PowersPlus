# ย้าย / สำรองฐานข้อมูล Supabase

คู่มือย้ายฐานข้อมูลจาก Supabase project หนึ่งไปอีกอัน(หรือสำรองข้อมูล) สำหรับผู้พัฒนา

สคริปต์: [`scripts/migrate-supabase.ps1`](../scripts/migrate-supabase.ps1)

## แนวคิดหลัก

ฐานข้อมูลแยกเป็น 2 ส่วน จัดการคนละทาง:

| ส่วน | Source of truth | วิธีย้าย |
| --- | --- | --- |
| **โครงสร้าง** (ตาราง, ฟังก์ชัน, RLS, grants) | `supabase/migrations/` | รัน migration เรียงลำดับบน project ปลายทาง |
| **ข้อมูล** (rows) | ฐานข้อมูลจริง | `pg_dump` ด้วยสคริปต์นี้ |

> โครงสร้างมาจาก migrations เสมอ — **อย่าใช้ dump มาสร้าง schema เป็นหลัก** ในระยะยาว เพราะ migrations คือประวัติที่ review ได้และ scale ตามทีมได้

## สิ่งที่ต้องมี

- PostgreSQL client tools (`pg_dump`, `psql`) บน PATH — มากับ [PostgreSQL](https://www.postgresql.org/download/) หรือ Supabase CLI
- Connection string ของแต่ละ project: Supabase Dashboard → **Project Settings → Database → Connection string → URI** เลือก **Session pooler** (พอร์ต `5432`)

## วิธีใช้

ตรวจ logic ของสคริปต์ก่อน (ไม่แตะ DB):

```powershell
./scripts/migrate-supabase.ps1 -SelfTest
```

**สำรองอย่างเดียว** → ได้ไฟล์ใน `backups/`:

```powershell
./scripts/migrate-supabase.ps1 -SourceUrl "postgresql://...เก่า..."
```

**สำรอง + restore เข้า project ใหม่ (ทั้งก้อน):**

```powershell
./scripts/migrate-supabase.ps1 -SourceUrl "postgresql://...เก่า..." -TargetUrl "postgresql://...ใหม่..."
```

**แนะนำสำหรับ production (สะอาดสุด)** — รัน migrations บนปลายทางก่อน แล้วค่อยยิงเฉพาะข้อมูล:

```powershell
# 1. บน project ใหม่: รันทุกไฟล์ใน supabase/migrations/ เรียงลำดับใน SQL Editor
# 2. ย้ายเฉพาะข้อมูล
./scripts/migrate-supabase.ps1 -SourceUrl "...เก่า..." -TargetUrl "...ใหม่..." -Mode data
```

## ⚠️ กับดัก: admin login (`admin_profiles` → `auth.users`)

`admin_profiles.user_id` อ้างอิง `auth.users(id)` ซึ่งอยู่ใน schema `auth` ที่ Supabase จัดการเอง **ไม่ได้ถูก dump มาด้วย** สคริปต์จึง **ข้ามข้อมูล `admin_profiles` เป็นค่าเริ่มต้น**

หลัง restore ให้สร้าง admin ใหม่:

1. Project ใหม่ → Authentication → สร้าง user (อีเมล/รหัสเดิมได้) → copy `User UID`
2. รันใน SQL Editor:

```sql
insert into public.admin_profiles (user_id, role)
values ('<UID-ใหม่>', 'owner');
```

(ตารางเนื้อหาอื่นทั้งหมดอ้างอิงกันเองใน `public` — ย้ายตรงๆ ได้)

## หมายเหตุเรื่อง scale

- **ฐานข้อมูลใหญ่:** ใช้ `-Mode data` คู่กับ migrations แทนการ dump ทั้งก้อน จะ restore เร็วและคุมลำดับ FK ได้ดีกว่า สำหรับข้อมูลระดับหลาย GB พิจารณา pg_dump directory format (`-Fd --jobs=N`) เพื่อ dump/restore ขนาน (ปรับสคริปต์เพิ่มได้)
- **Connection:** ใช้ Session pooler (5432) สำหรับ `pg_dump`/`psql` ส่วน Transaction pooler (6543) ไว้ให้แอป runtime
- **Timeout:** งาน dump/restore นานๆ ให้รันจากเครื่อง dev ไม่ใช่ serverless (ไม่มีลิมิตเวลา)
- **schema เปลี่ยนต่อไป:** เพิ่ม migration ไฟล์ใหม่เสมอ (timestamp ใหม่) ห้ามแก้ไฟล์เก่า — ดู `supabase/migrations/README.md`

## ความปลอดภัย

- ไฟล์ใน `backups/` มีข้อมูลจริง **ถูก gitignore ไว้แล้ว** อย่า commit และอย่าแชร์ทางสาธารณะ
- Connection string มีรหัสผ่านฐานข้อมูล — อย่าวางลง commit, chat, หรือ log แนะนำส่งผ่าน environment variable หรือ secret manager
- ลบไฟล์ backup ทิ้งเมื่อใช้เสร็จ
