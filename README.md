<div align="center">

# ⚡ TRP Powers Plus Web

**เว็บไซต์ Landing Page บริษัท TRP Powers Plus** — งานระบบไฟฟ้า · โซลาร์เซลล์ · ประเมินเบื้องต้นออนไลน์

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

**🌐 ภาษา:** **ไทย** · [English](README.en.md)

</div>

> โปรเจกต์นี้ออกแบบมาให้ **ส่งมอบต่อได้ง่าย** — ข้อมูลธุรกิจ/ผลงานรวมไว้ที่ content กลาง, ข้อความไทย/อังกฤษแยกเป็น locale files, มีคู่มือสำหรับผู้ดูแลที่ไม่ใช่นักพัฒนา และมีฐานข้อมูล Supabase สำหรับหน้า admin

---

## 📑 สารบัญ

| หมวด | ไปที่ |
| --- | --- |
| 🚀 เริ่มต้นตั้งแต่ clone | [เริ่มใช้งาน (ทีละขั้น)](#-เริ่มใช้งาน-ทีละขั้น) |
| 🔑 ตั้งค่า `.env.local` | [เชื่อมต่อ Supabase](#-เชื่อมต่อ-supabase-envlocal) |
| 🗄️ ฐานข้อมูล & migrations | [ฐานข้อมูล Supabase](#️-ฐานข้อมูล-supabase) |
| 🧪 local database (ไม่แตะ prod) | [รัน Supabase แบบ local](#-รัน-supabase-แบบ-local-ไม่แตะ-production) |
| 📂 อะไรกัน / อะไรสร้างเอง | [ไฟล์ที่ต้องสร้างเอง](#-ไฟล์ที่ต้องสร้างเอง-ห้าม-commit) |
| 🛠️ คำสั่ง & โครงสร้าง | [คำสั่งหลัก](#️-คำสั่งหลัก) |
| ✏️ แก้เนื้อหา | [แก้ข้อความและข้อมูล](#️-แก้ข้อความและข้อมูล) |

---

## 🚀 เริ่มใช้งาน (ทีละขั้น)

> 💡 ถ้าคุณเพิ่งรับโปรเจกต์มา ทำตาม 5 ขั้นนี้เรียงลงมาได้เลย

### 1️⃣ ติดตั้งเครื่องมือที่ต้องมีก่อน

| เครื่องมือ | เวอร์ชัน | โหลดที่ |
| --- | --- | --- |
| **Node.js** | 20 ขึ้นไป (แนะนำ 22) | https://nodejs.org |
| **Git** | ล่าสุด | https://git-scm.com |
| **VS Code** (หรือ editor อื่น) | ล่าสุด | https://code.visualstudio.com |

ตรวจว่าติดตั้งครบ:

```bash
node --version   # ควรได้ v20 ขึ้นไป
npm --version
git --version
```

### 2️⃣ Clone โปรเจกต์

```bash
git clone https://github.com/Dparamet/Landing-Page-TRP-PowersPlus.git
cd Landing-Page-TRP-PowersPlus/trp-powers-plus-web
```

### 3️⃣ ติดตั้ง dependencies

```bash
npm install
```

### 4️⃣ ตั้งค่า `.env.local` (สำคัญ — ไม่มีจะรันไม่ขึ้น)

ไฟล์นี้ **ไม่ได้อยู่ใน repo** (เก็บ secret) ต้องสร้างเองจาก template:

```bash
cp .env.example .env.local          # macOS / Linux
Copy-Item .env.example .env.local   # Windows PowerShell
```

แล้วเปิด `.env.local` เติมค่าจริงจาก Supabase → วิธีหาค่าดูที่ [เชื่อมต่อ Supabase](#-เชื่อมต่อ-supabase-envlocal)

### 5️⃣ เปิดโหมดพัฒนา

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ **http://localhost:3000**

<details>
<summary>⚠️ port 3000 ถูกใช้อยู่?</summary>

```bash
npm run dev -- -p 3001
```
แล้วเปิด http://localhost:3001
</details>

---

## 🔑 เชื่อมต่อ Supabase (.env.local)

เว็บเก็บข้อมูลที่แก้ผ่านหน้า admin ไว้ใน Supabase จึงต้องมีค่า 2 ตัวใน `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
```

### 📍 หาค่าจากไหน

1. เข้า [Supabase Dashboard](https://supabase.com/dashboard) → เลือก project
2. เมนู **Project Settings → API**
3. คัดลอกค่า:
   - **Project URL** → ใส่ที่ `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys → `anon` `public`** → ใส่ที่ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> ✅ anon key เป็น key ฝั่ง **public** ปลอดภัยที่จะอยู่ในเว็บ เพราะสิทธิ์อ่าน/เขียนจริงคุมด้วย **RLS** ที่ตัวฐานข้อมูล
>
> 🚫 **ห้ามนำ `service_role` key มาใส่** ในไฟล์นี้เด็ดขาด — มันข้าม RLS ได้ทั้งหมด

---

## 📂 ไฟล์ที่ต้องสร้างเอง (ห้าม commit)

ไฟล์กลุ่มนี้ **ไม่อยู่ใน repo** (ถูก `.gitignore`) — dev แต่ละคนสร้าง/ดึงเอง:

| ไฟล์/โฟลเดอร์ | เป็นอะไร | ได้มายังไง | commit ได้ไหม |
| --- | --- | --- | --- |
| `.env.local` | ค่า Supabase ของคุณ | ก็อปจาก `.env.example` แล้วเติมเอง | ❌ ห้าม |
| `.env.example` | template ให้คนอื่นก็อป | มากับ repo อยู่แล้ว | ✅ commit |
| `node_modules/` | dependencies | `npm install` | ❌ ห้าม |
| `.next/`, `out/` | ไฟล์ build | `npm run build` | ❌ ห้าม |
| `backups/` | dump ข้อมูลจริง | `scripts/migrate-supabase.ps1` | ❌ ห้าม |
| `supabase/config.toml` | ตั้งค่า Supabase CLI local | `supabase init` | ✅ commit ได้ |

> 🔒 กติกา: **commit เฉพาะ template (`.env.example`) ห้าม commit ไฟล์ที่มี secret จริง** — `.gitignore` กัน `.env*`, `*.pem`, `*.key`, `/backups/` ไว้ให้แล้ว

---

## 🗄️ ฐานข้อมูล Supabase

### 📋 ตารางในฐานข้อมูล

| ตาราง | เก็บอะไร |
| --- | --- |
| `admin_profiles` | รายชื่อบัญชีที่มีสิทธิ์เข้าหน้า admin |
| `services` | รายการบริการ |
| `standard_items` | รายการมาตรฐาน/สินค้าแบบรายการ |
| `portfolio_projects` | ผลงาน |
| `portfolio_image_overrides` | การแทนที่รูปในผลงาน |
| `media_assets` | ไฟล์รูปที่อัปโหลดผ่าน admin |
| `faq_items` | คำถามที่พบบ่อย |
| `process_steps` | ขั้นตอนการทำงาน |
| `contact_items` | ช่องทางติดต่อ |
| `site_texts` | ข้อความต่างๆ ในเว็บ |
| `site_settings` | ตั้งค่าเว็บ เช่น โลโก้ |
| `web_events` | สถิติการเข้าชม (สำหรับ dashboard) |

### 🛡️ สิทธิ์การเข้าถึง (RLS)

ทุกตารางเปิด **Row Level Security** ไว้ — ผู้เข้าชมทั่วไปอ่านได้เฉพาะข้อมูลที่เผยแพร่ ส่วนการแก้ไข/ลบทำได้เฉพาะบัญชีในตาราง `admin_profiles` โดยเช็คผ่านฟังก์ชัน `is_admin(auth.uid())` ที่ฝั่งฐานข้อมูล → **ต่อให้เปิดหน้า `/admin` ได้ ก็แก้ข้อมูลไม่ได้ถ้าไม่มีสิทธิ์**

### 🔄 ระบบ migrations ทำงานยังไง

ฐานข้อมูลไม่ได้ถูกเซฟเป็น snapshot ก้อนเดียว แต่อธิบายเป็น **ลำดับคำสั่งแก้ทีละสเต็ป** — แต่ละไฟล์ SQL ใน `supabase/migrations/` = 1 การเปลี่ยนแปลง รันเรียงตามชื่อ (timestamp) ตั้งแต่ไฟล์แรกถึงล่าสุด → ได้ DB สถานะปัจจุบัน

```text
202605100001_init_cms.sql            ← สร้างตารางแรก
202605100003_seed_initial_content    ← ใส่ข้อมูลตัวอย่าง (seed)
        ⋮
202607040002_drop_site_text...       ← ล่าสุด
```

**กฎเหล็ก 3 ข้อ:**

1. 🚫 **ห้ามแก้ไฟล์เก่าที่รันไปแล้ว** — prod รันไปแล้ว แก้ย้อนหลัง = repo กับ prod ไม่ตรงกัน อยากเปลี่ยนให้สร้างไฟล์ใหม่
2. 🕒 **ไฟล์ใหม่ต้อง timestamp ใหม่กว่าเสมอ** (`YYYYMMDDNNNN_ชื่อ.sql`) เพื่อรันต่อท้าย
3. ♻️ **เขียนแบบรันซ้ำได้** (`create ... if not exists`, `drop ... if exists`)

รายการ migration ทั้งหมด + ลำดับ: [`supabase/migrations/README.md`](supabase/migrations/README.md)

**อัปเดต DB บน production:** เปิด Supabase SQL Editor → เปิดไฟล์ `.sql` ตัวใหม่ทีละไฟล์ตามลำดับ → คัดลอกเนื้อหาไปวางแล้วกด Run (วางเนื้อหาไฟล์ ไม่ใช่ path)

### 🚚 ย้าย/สำรองฐานข้อมูลไป project อื่น

ดูสคริปต์และวิธีที่ [`docs/DB_MIGRATION.md`](docs/DB_MIGRATION.md) (ใช้ `scripts/migrate-supabase.ps1`)

---

## 🧪 รัน Supabase แบบ local (ไม่แตะ production)

อยากพัฒนาโดยไม่ยิงเข้าฐานข้อมูลจริง? ยก Supabase ขึ้นบนเครื่องตัวเองผ่าน **Docker**

> ✅ **ใช้ migrations สร้าง DB local — ไม่ต้อง export จาก prod** เพราะ repo มี seed อยู่ใน migration แล้ว (`202605100003_seed_initial_content.sql`) รันแล้วได้ทั้งโครงสร้าง + ข้อมูลตัวอย่างครบ

### สิ่งที่ต้องมี

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (เปิดค้างไว้)
- [Supabase CLI](https://supabase.com/docs/guides/cli) — ติดตั้ง: `scoop install supabase` หรือ `choco install supabase`

### ขั้นตอน

```bash
supabase init          # ครั้งแรกเท่านั้น — สร้าง supabase/config.toml
supabase start         # ยก Postgres + Auth + API ผ่าน Docker (ครั้งแรกโหลดนาน)
supabase db reset      # รันทุก migration เรียงลำดับ + seed อัตโนมัติ
```

`supabase start` เสร็จจะพ่นค่าออกมา → เอาไปใส่ `.env.local` (ทับ prod ชั่วคราวตอน dev):

```text
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key ที่ CLI พ่นมา>
```

| คำสั่ง | ทำอะไร |
| --- | --- |
| `supabase start` | เปิด stack local |
| `supabase stop` | ปิด (ตอนเลิกงาน) |
| `supabase db reset` | ล้าง + รัน migrations ใหม่หมด (ปลอดภัย เพราะเป็น DB ตัวเอง) |
| Studio local | http://127.0.0.1:54323 |

> ⚠️ **หมายเหตุ:** local Supabase ใช้ `http://` ส่วนโค้ดปัจจุบันบังคับ `https://` (`src/lib/supabase/config.ts`) หากรัน local แล้วเจอ error `Supabase URL must use HTTPS` ต้องปรับให้ยอม `http://127.0.0.1` เฉพาะตอน dev

<details>
<summary>❓ ทำไม Supabase local รันไม่ขึ้น — เช็คลิสต์</summary>

| เคส | อาการ | แก้ |
| --- | --- | --- |
| ไม่เคย `supabase init` | ไม่มี `config.toml` | `supabase init` |
| Docker ไม่เปิด | `supabase start` fail | เปิด Docker Desktop |
| `.env.local` ยังชี้ prod | dev แต่ยิงเข้า prod | สลับ URL/anon เป็นค่า local |
| ลืม `supabase db reset` | ตารางว่าง query error | `supabase db reset` |
| port ชน (54321–54324) | start fail | ปิดตัวกิน port หรือแก้ `config.toml` |
| HTTPS check ในโค้ด | throw `must use HTTPS` | ปรับ `config.ts` ให้ยอม localhost |
| ไม่ restart Next | Next cache env เก่า | kill `npm run dev` แล้วรันใหม่ |

</details>

---

## 🛠️ คำสั่งหลัก

| คำสั่ง | ใช้ทำอะไร |
| --- | --- |
| `npm install` | ติดตั้ง dependencies |
| `npm run dev` | เปิดเว็บโหมดพัฒนา |
| `npm test` | ตรวจสูตรคำนวณ, โครงสร้างภาษา, path รูปภาพ |
| `npm run lint` | ตรวจคุณภาพโค้ด |
| `npm run build` | build static site ไป `out/` |
| `npm run start` | Next server mode (โปรเจกต์นี้เน้น static export) |
| `npm audit --audit-level=high` | ตรวจ vulnerability ระดับ high/critical |

---

## 📁 โครงสร้างโปรเจกต์

```text
trp-powers-plus-web/
├── docs/
│   ├── CONTENT_GUIDE.md   คู่มือแก้ข้อความและรูปภาพ
│   ├── HANDOFF_SPEC.md    แนวทางการส่งมอบและโครงสร้างเนื้อหา
│   └── DB_MIGRATION.md    วิธีย้าย/สำรองฐานข้อมูล
├── public/images/         โลโก้และรูปผลงาน
├── scripts/
│   └── migrate-supabase.ps1   สคริปต์ dump/restore ฐานข้อมูล
├── src/
│   ├── app/               หน้าเว็บ, layout, globals.css
│   ├── components/        ส่วนประกอบ UI หลัก
│   ├── content/           ข้อมูลบริษัท บริการ และผลงาน
│   ├── context/           providers ภาษาและ cookie consent
│   ├── lib/               logic ใช้ซ้ำ + supabase client
│   └── locales/           ข้อความไทย/อังกฤษ
├── supabase/
│   └── migrations/        ไฟล์ SQL อัปเดตฐานข้อมูล (มี README ในโฟลเดอร์)
├── tests/                 test files
├── .env.example           template ค่า environment (ก็อปเป็น .env.local)
├── next.config.js         static export และ image settings
└── README.md              คู่มือหลัก
```

---

## ✏️ แก้ข้อความและข้อมูล

เริ่มจาก [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md) ไฟล์สำคัญ:

| สิ่งที่ต้องแก้ | ไฟล์หรือโฟลเดอร์ |
| --- | --- |
| ข้อความภาษาไทย | `src/locales/th.json` |
| ข้อความภาษาอังกฤษ | `src/locales/en.json` |
| เบอร์โทร อีเมล Line Facebook แผนที่ | `src/content/site.ts` |
| รายการบริการ / ผลงาน | `src/content/site.ts` |
| รูปผลงาน | `public/images/portfolio/` |
| โลโก้ | `public/images/LogoTRP.webp` |

หลังแก้ content ให้รัน `npm test` แล้ว `npm run build`

<details>
<summary>➕ เพิ่มรูปผลงาน</summary>

1. วางรูปใน `public/images/portfolio/`
2. ตั้งชื่อไฟล์ภาษาอังกฤษ ไม่มีเว้นวรรค เช่น `factory-solar.webp`
3. เปิด `src/content/site.ts` หา project ที่ต้องการ
4. เปลี่ยน `coverImage.src` หรือรูปใน `gallery` ให้ชี้ path ใหม่

```ts
coverImage: {
  src: '/images/portfolio/factory-solar.webp',
  alt: {
    th: 'งานติดตั้งโซลาร์เซลล์โรงงาน',
    en: 'Factory solar installation project',
  },
},
```

ถ้าพิมพ์ชื่อไฟล์ผิด `npm test` จะรายงาน image file is missing
</details>

<details>
<summary>➕ เพิ่มผลงานใหม่ / แก้บริการ</summary>

เปิด `src/content/site.ts` เพิ่ม object ใน `portfolioProjects` หรือแก้ `serviceCategories`

**ผลงาน** ควรกรอก: `title`, `categoryKey` (ตรงกับ `serviceCategories.key`), `category`, `description`, `systemType`, `metrics`, `location`, `province`, `accent` (`orange`/`blue`), `coverImage`, `gallery`

**บริการ** ควรกรอก: `key`, `title`+`shortTitle`, `description`, `bestFor`, `includes` (≥3), `prepare` (≥3), `lineMessage`, `accent` (`orange`/`blue`)
</details>

---

## ☀️ Solar Calculator

| ส่วน | ไฟล์ |
| --- | --- |
| UI | `src/components/SolarCalculator.tsx` |
| สูตรคำนวณ | `src/lib/solarEstimator.ts` |
| Test | `tests/solarEstimator.test.mjs` |

หลักการคำนวณ: ค่าไฟขั้นบันได · Ft `0.1623 บาท/หน่วย` · VAT 7% · ผลิตไฟเฉลี่ย `105/120/135 kWh ต่อ kWp ต่อเดือน` · ปัดขนาดเป็นขั้น `0.5 kWp` · แยก On-grid / Hybrid

> ถ้าเปลี่ยนค่าไฟหรือสูตร ให้แก้ test ใน `tests/solarEstimator.test.mjs` ให้ตรงกับพฤติกรรมใหม่ แล้วรัน `npm test`

---

## ✅ ตรวจงานก่อนส่งมอบ

```bash
npm test
npm run lint
npm run build
npm audit --audit-level=high
```

ผลที่ควรได้: `npm test` ผ่านหมด · `npm run lint` ไม่มี error · `npm run build` สร้าง `out/` สำเร็จ · `npm audit` ไม่มี high/critical

> 📝 audit ล่าสุด: `npm audit fix` แก้ transitive dependency ที่แก้ได้แล้ว เหลือ `postcss <8.5.10` ระดับ `moderate` ผ่าน `next` — **อย่าใช้ `npm audit fix --force`** เพราะจะ downgrade เป็น `next@9.3.3` (breaking) ให้รอ Next.js patch

---

## 🔐 Security guard

- Admin login มี client-side rate limit: ล็อกหลังผิด 5 ครั้งใน 15 นาที, reset เมื่อ login สำเร็จ
- Supabase access ใช้ client SDK query builder/RPC แทน raw SQL string
- Test scan กัน `dangerouslySetInnerHTML`, `innerHTML`, `eval(`, raw SQL ใน `src/`
- `.gitignore` กัน `.env*`, `*.pem`, `*.key`, `/backups/` และอนุญาตเฉพาะ `.env.example`
- Security headers ใน `vercel.json` + `public/_headers`: CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`

> ⚠️ โปรเจกต์ใช้ `output: 'export'` ไม่มี server runtime ของ Next — server-side rate limit/middleware headers ต้องให้ hosting นำ `vercel.json`/`public/_headers` ไปใช้ และควรคุม brute force เพิ่มที่ Supabase/Auth ถ้าเปิด production

---

## ⚡ Performance guard

- หน้า admin ใช้ dynamic import แยก manager แต่ละแท็บ ลดการ hydrate ที่ยังไม่เปิด
- widget public (analytics, cookie UI, scroll effects) โหลดเฉพาะ route ที่ไม่ใช่ `/admin`
- partner carousel animate เฉพาะตอนใกล้ viewport, หยุดตาม `prefers-reduced-motion`
- scroll reveal throttle ผ่าน `requestAnimationFrame`, preview refresh ใน admin ถูก debounce
- hero background ใช้ `next/image` + `priority`, `fetchPriority="high"`, `sizes="100vw"` สำหรับ LCP

baseline ก่อนแก้ perf:

```bash
npm run build
Get-ChildItem -Recurse -File .next\static\chunks | Sort-Object Length -Descending | Select-Object -First 12 @{Name='KB';Expression={[math]::Round($_.Length/1KB,1)}},Name | Format-Table -AutoSize
```

---

## 🚀 Build และ Deploy

```bash
npm run build     # → ไฟล์ static อยู่ใน out/
```

นำ `out/` ไปใช้กับ static hosting: GitHub Pages, Netlify, Vercel static, หรือ host ที่รองรับ HTML/CSS/JS ถ้า host ไม่อ่าน `vercel.json`/`public/_headers` อัตโนมัติ ให้ตั้ง security headers เทียบเท่าก่อนเปิด production

---

## 🩹 ปัญหาที่พบบ่อย

<details>
<summary>เปิด dev server ไม่ได้ (port 3000 ถูกใช้)</summary>

```bash
npm run dev -- -p 3001
```
</details>

<details>
<summary>รูปผลงานไม่ขึ้น</summary>

ตรวจ 3 จุด: (1) รูปอยู่ใน `public/images/portfolio/` (2) ชื่อไฟล์ตรงกับ `coverImage.src`/`gallery[].src` ใน `src/content/site.ts` (3) path ขึ้นต้น `/images/portfolio/` แล้วรัน `npm test`
</details>

<details>
<summary>แก้ภาษาแล้ว test fail</summary>

มัก key ใน `th.json` / `en.json` ไม่ตรงกัน → ดู error จาก `npm test`, เพิ่ม key ที่หาย, ตรวจ comma/เครื่องหมายคำพูดใน JSON
</details>

<details>
<summary>Build fail หลังรับโปรเจกต์มาใหม่</summary>

```bash
Remove-Item -Recurse -Force node_modules
npm install
npm run build
```
</details>

---

## ⚠️ ข้อควรระวัง

- อย่าแก้ไฟล์ใน `.next/` หรือ `out/` (ระบบสร้างใหม่)
- อย่า commit password, token, API key หรือ secret ใดๆ — ใช้ `.env.example` เป็น template
- อย่าลบ tests เพื่อให้คำสั่งผ่าน
- เปลี่ยนสูตรค่าไฟ = แก้ test พร้อมกันเสมอ
- อย่าใช้ `npm audit fix --force` โดยไม่ review (อาจ downgrade framework แบบ breaking)

---

## 📚 ข้อมูลอ้างอิง

| ภายในโปรเจกต์ | ภายนอก |
| --- | --- |
| [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) | [Next.js Docs](https://nextjs.org/docs) |
| [docs/HANDOFF_SPEC.md](docs/HANDOFF_SPEC.md) | [React Docs](https://react.dev) |
| [docs/DB_MIGRATION.md](docs/DB_MIGRATION.md) | [Tailwind CSS Docs](https://tailwindcss.com/docs) |
| [supabase/migrations/README.md](supabase/migrations/README.md) | [Supabase Docs](https://supabase.com/docs) |
