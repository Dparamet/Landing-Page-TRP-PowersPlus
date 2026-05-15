# TRP Powers Plus Web

เว็บไซต์ Landing Page สำหรับบริษัท TRP Powers Plus (ระบบไฟฟ้าและโซลาร์เซลล์) พร้อมระบบ CMS ฝั่งผู้ดูแลผ่าน Supabase

โปรเจกต์นี้ออกแบบให้ส่งมอบต่อได้ง่าย: หน้าเว็บลูกค้าเป็น Next.js, ข้อมูลหลักยังแก้จาก content files ได้, และมีระบบ Admin สำหรับแก้ข้อมูลจริงในฐานข้อมูล

## สารบัญ

- [สิ่งที่ต้องติดตั้งก่อน](#สิ่งที่ต้องติดตั้งก่อน)
- [เริ่มใช้งานในเครื่อง](#เริ่มใช้งานในเครื่อง)
- [ตั้งค่า Supabase และ ENV](#ตั้งค่า-supabase-และ-env)
- [ระบบ Admin และ CMS](#ระบบ-admin-และ-cms)
- [คำสั่งทั้งหมด](#คำสั่งทั้งหมด)
- [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
- [แก้ข้อความ รูปภาพ และข้อมูลบริษัท](#แก้ข้อความ-รูปภาพ-และข้อมูลบริษัท)
- [ระบบคำนวณโซลาร์เซลล์](#ระบบคำนวณโซลาร์เซลล์)
- [การตรวจงานก่อนส่งมอบ](#การตรวจงานก่อนส่งมอบ)
- [การ Build และ Deploy](#การ-build-และ-deploy)
- [แก้ปัญหาที่พบบ่อย](#แก้ปัญหาที่พบบ่อย)

## สิ่งที่ต้องติดตั้งก่อน

ติดตั้งโปรแกรมเหล่านี้ก่อนเริ่มงาน:

- Node.js 20 ขึ้นไป แนะนำ Node.js 22
- npm ซึ่งติดมากับ Node.js
- Git
- โปรแกรมแก้ไฟล์ เช่น VS Code

ตรวจเวอร์ชัน:

```bash
node --version
npm --version
git --version
```

## เริ่มใช้งานในเครื่อง

1. เข้าโฟลเดอร์โปรเจกต์

```bash
cd "C:\Users\Acer\Desktop\Project My Future\trp-powers-plus\trp-powers-plus-web"
```

2. ติดตั้ง dependencies

```bash
npm install
```

3. เปิดเว็บสำหรับพัฒนา

```bash
npm run dev
```

4. เปิดเว็บใน browser

```text
http://localhost:3000
```

ถ้า port 3000 ถูกใช้อยู่ ให้ใช้:

```bash
npm run dev -- -p 3001
```

แล้วเปิด:

```text
http://localhost:3001
```

## ตั้งค่า Supabase และ ENV

สร้างไฟล์ `.env.local` ใน root ของโปรเจกต์:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

ถ้าไม่มีค่าข้างต้น เว็บส่วน Admin/CMS จะไม่สามารถเชื่อมต่อฐานข้อมูลได้

ตั้งค่า Supabase ครั้งแรก:

1. สร้างโปรเจกต์ Supabase
2. เปิด SQL Editor แล้วรัน `supabase/schema.sql`
3. รันไฟล์ใน `supabase/migrations/` ตามลำดับชื่อไฟล์
4. เพิ่มผู้ใช้แอดมินคนแรกในตาราง `admin_profiles`
5. สร้าง Storage bucket ชื่อ `site-media`

ดูคู่มือเต็ม: [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)

## ระบบ Admin และ CMS

- หน้าเข้าสู่ระบบแอดมิน: `/admin/login`
- หน้าแดชบอร์ดแอดมิน: `/admin`
- ใช้อีเมลที่มีใน Supabase Auth และต้องมีสิทธิ์ใน `admin_profiles`

หมายเหตุ:

- หน้าเว็บไซต์หลักยังใช้งานได้ตามปกติแม้ยังไม่ล็อกอิน
- ฟีเจอร์แก้ข้อมูล/อัปโหลดรูปในระบบหลังบ้านต้องพึ่ง Supabase

## คำสั่งทั้งหมด

| คำสั่ง | ใช้ทำอะไร |
| --- | --- |
| `npm install` | ติดตั้ง dependencies หลัง clone หรือรับโปรเจกต์มาใหม่ |
| `npm run dev` | เปิดเว็บในโหมดพัฒนา |
| `npm test` | ตรวจสูตรคำนวณ, โครงสร้างภาษา, content schema และ integration tests ของ data layer |
| `npm run lint` | ตรวจคุณภาพโค้ดและ accessibility พื้นฐาน |
| `npm run build` | build static site สำหรับส่งขึ้น hosting |
| `npm run start` | ใช้กับ Next server mode (โปรเจกต์นี้ตั้งค่า static export เป็นหลัก) |

## โครงสร้างโปรเจกต์

```text
trp-powers-plus-web/
├── docs/
│   ├── CLIENT_CMS_REFACTOR_SPEC.md สเปกการปรับโครงสร้าง CMS
│   ├── CONTENT_GUIDE.md       คู่มือแก้ข้อความและรูปภาพสำหรับผู้ดูแลเว็บ
│   ├── HANDOFF_SPEC.md        สเปกการจัดโครงสร้างเพื่อส่งมอบ
│   └── SUPABASE_SETUP.md      คู่มือตั้งค่า Supabase
├── public/
│   └── images/
│       ├── LogoTRP.webp       โลโก้หลัก
│       └── portfolio/         ใส่รูปผลงานที่นี่
├── src/
│   ├── app/                   Next.js App Router, metadata, global CSS
│   │   └── admin/             หน้า login/dashboard สำหรับผู้ดูแล
│   ├── components/            ส่วนประกอบ UI เช่น Hero, Portfolio, Calculator
│   ├── content/
│   │   └── site.ts            ข้อมูลบริษัท ช่องทางติดต่อ และผลงาน
│   ├── context/               Language และ cookie consent providers
│   ├── data/                  compatibility export สำหรับไฟล์เก่า
│   ├── lib/                   logic ใช้ซ้ำ เช่น solar estimator และ supabase clients
│   └── locales/               ข้อความภาษาไทยและอังกฤษ
├── supabase/
│   ├── schema.sql             schema หลักของฐานข้อมูล
│   └── migrations/            SQL migrations ของ CMS/Admin
├── tests/                     test files
├── next.config.ts             ตั้งค่า static export และ image mode
├── package.json               scripts และ dependencies
└── README.md                  คู่มือหลัก
```

## แก้ข้อความ รูปภาพ และข้อมูลบริษัท

สำหรับผู้ดูแลที่ไม่เขียนโปรแกรม ให้เริ่มจากคู่มือนี้:

[docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)

ไฟล์ที่ต้องรู้มี 3 กลุ่ม:

| สิ่งที่จะแก้ | ไฟล์หรือโฟลเดอร์ |
| --- | --- |
| ข้อความภาษาไทย | `src/locales/th.json` |
| ข้อความภาษาอังกฤษ | `src/locales/en.json` |
| เบอร์โทร อีเมล Line Facebook แผนที่ | `src/content/site.ts` |
| รายการบริการและตัวเลือกประเภทงาน | `src/content/site.ts` |
| รายการผลงาน | `src/content/site.ts` |
| รูปผลงาน | `public/images/portfolio/` |
| โลโก้ | `public/images/LogoTRP.webp` |

หลังแก้ทุกครั้งให้รัน:

```bash
npm test
npm run build
```

### วิธีเพิ่มรูปผลงานแบบสั้น

1. วางรูปใน `public/images/portfolio/`
2. ตั้งชื่อไฟล์เป็นภาษาอังกฤษ ไม่มีเว้นวรรค เช่น `factory-solar.webp`
3. เปิด `src/content/site.ts`
4. หา project ที่ต้องการแก้
5. เปลี่ยน `coverImage.src` หรือรูปใน `gallery` เป็น path ของรูปใหม่

ตัวอย่าง:

```ts
coverImage: {
  src: '/images/portfolio/factory-solar.webp',
  alt: {
    th: 'งานติดตั้งโซลาร์เซลล์โรงงาน',
    en: 'Factory solar installation project',
  },
},
```

ถ้าพิมพ์ชื่อไฟล์ผิด `npm test` จะฟ้องว่า image file is missing

### วิธีเพิ่มผลงานใหม่แบบสั้น

เปิด `src/content/site.ts` แล้วเพิ่ม object ใหม่ใน `portfolioProjects`

สิ่งที่ต้องกรอก:

- `title`: ชื่อผลงานไทย/อังกฤษ
- `categoryKey`: ประเภทสำหรับปุ่มกรอง ต้องตรงกับ `serviceCategories.key`
- `category`: ประเภทงานไทย/อังกฤษ
- `description`: คำอธิบายไทย/อังกฤษ
- `systemType`: ประเภทระบบหรืองาน เช่น ออนกริด, ระบบไฟฟ้าอาคาร, ตู้ควบคุม
- `metrics`: ข้อมูลตัดสินใจของงานนั้น เช่น ขนาดระบบ, ขอบเขตงาน, โหลดไฟ, ผลประหยัด, ผลลัพธ์
- `location`: พื้นที่ไทย/อังกฤษ
- `province`: จังหวัดหรือพื้นที่บริการ
- `accent`: ใช้ได้แค่ `orange` หรือ `blue`
- `coverImage`: รูปหลักของผลงาน
- `gallery`: รูปก่อนติดตั้ง ระหว่างติดตั้ง และหลังติดตั้ง

### วิธีเพิ่มหรือแก้บริการแบบสั้น

เปิด `src/content/site.ts` แล้วแก้รายการใน `serviceCategories`

สิ่งที่ต้องกรอก:

- `key`: รหัสบริการ เช่น `residential`, `building`, `factory`, `solar`, `maintenance`, `controlPanel`
- `title` และ `shortTitle`: ชื่อบริการเต็มและชื่อสั้น
- `description`: อธิบายว่ารับงานอะไร
- `bestFor`: เหมาะกับลูกค้าแบบไหน
- `includes`: งานที่รับอย่างน้อย 3 รายการ
- `prepare`: ข้อมูลที่ลูกค้าควรเตรียมอย่างน้อย 3 รายการ
- `lineMessage`: ข้อความตั้งต้นสำหรับให้ลูกค้าส่งใน LINE
- `accent`: ใช้ `orange` หรือ `blue`

## ระบบคำนวณโซลาร์เซลล์

ไฟล์หลัก:

- UI: `src/components/SolarCalculator.tsx`
- สูตรคำนวณ: `src/lib/solarEstimator.ts`
- Test: `tests/solarEstimator.test.mjs`

ระบบคำนวณตอนนี้ใช้:

- ค่าไฟบ้านแบบขั้นบันได
- ค่า Ft `0.1623 บาท/หน่วย`
- VAT 7%
- ค่าผลิตไฟเฉลี่ยตามสภาพหลังคา `105 / 120 / 135 kWh ต่อ kWp ต่อเดือน`
- ปัดขนาดติดตั้งเป็นขั้น `0.5 kWp`
- แยก On-grid และ Hybrid

ก่อนเปลี่ยนค่าไฟหรือสูตร ให้แก้ test ใน `tests/solarEstimator.test.mjs` ให้สะท้อนพฤติกรรมใหม่ แล้วรัน:

```bash
npm test
```

## การตรวจงานก่อนส่งมอบ

รันทุกคำสั่งนี้ก่อนส่งงาน:

```bash
npm test
npm run lint
npm run build
```

ผลที่ต้องการ:

- `npm test`: ผ่านทั้งหมด
- `npm run lint`: ไม่มี error
- `npm run build`: build สำเร็จและสร้างไฟล์ใน `out/`

ห้ามส่งงานถ้า build ไม่ผ่าน

## การ Build และ Deploy

โปรเจกต์นี้ตั้งค่า static export ใน `next.config.ts` (`output: 'export'`) และปิด Next image optimization เพื่อรองรับ static hosting

Build:

```bash
npm run build
```

ไฟล์เว็บสำหรับ deploy จะอยู่ใน:

```text
out/
```

นำโฟลเดอร์ `out/` ไปใช้กับ static hosting ได้ เช่น GitHub Pages, Netlify, Vercel static output หรือ hosting ที่รองรับไฟล์ HTML/CSS/JS

ถ้า deploy เว็บหลักพร้อม CMS:

- ฝั่ง frontend deploy จากโฟลเดอร์ `out/`
- ฝั่งข้อมูลและแอดมินใช้งานผ่าน Supabase project ที่ตั้งค่าไว้ใน `.env.local` (และค่าที่เทียบเท่าใน environment ของ production)

## แก้ปัญหาที่พบบ่อย

### เปิด dev server ไม่ได้ เพราะ port 3000 ถูกใช้

```bash
npm run dev -- -p 3001
```

### รูปผลงานไม่ขึ้น

ตรวจ 3 จุด:

1. รูปอยู่ใน `public/images/portfolio/` หรือไม่
2. ชื่อไฟล์ตรงกับ `coverImage.src` หรือ `gallery[].src` ใน `src/content/site.ts` หรือไม่
3. path ขึ้นต้นด้วย `/images/portfolio/` หรือไม่

จากนั้นรัน:

```bash
npm test
```

### แก้ภาษาแล้ว test fail

แปลว่า `src/locales/th.json` และ `src/locales/en.json` มี key ไม่ตรงกัน

วิธีแก้:

1. ดูข้อความ error จาก `npm test`
2. เพิ่ม key ที่หายไปในอีกภาษา
3. อย่าลืม comma และเครื่องหมายคำพูดใน JSON

### Build fail หลังรับโปรเจกต์มาใหม่

ลบ dependencies แล้วติดตั้งใหม่:

```bash
Remove-Item -Recurse -Force node_modules
npm install
npm run build
```

## ข้อควรระวัง

- อย่าแก้ไฟล์ใน `.next/` หรือ `out/` เพราะเป็นไฟล์ที่ระบบสร้างใหม่เอง
- อย่า commit password, token, API key หรือข้อมูลลับ
- อย่าลบ tests เพื่อให้คำสั่งผ่าน
- ถ้าจะเปลี่ยนสูตรค่าไฟ ให้แก้ test พร้อมกันเสมอ

## ข้อมูลอ้างอิงเพิ่มเติม

- [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)
- [docs/HANDOFF_SPEC.md](docs/HANDOFF_SPEC.md)
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## สถานะล่าสุด

- Last updated: May 15, 2026
- Maintained for: TRP Powers Plus
- Project type: Static Next.js landing page + Supabase-backed CMS/Admin
- Current branch: `feat/cms-admin`
- Default branch: `main`

### ความเปลี่ยนแปลงล่าสุด (May 2026)

- ✅ เพิ่ม SolarCalculator component สำหรับคำนวณต้นทุนโซลาร์เซลล์
- ✅ ปรับปรุง localization (Thai/English)
- ✅ ปรับปรุง Navbar และ Hero component
- ✅ เพิ่ม Language Switcher
- ✅ เพิ่ม Cookie Consent Modal
- ✅ ปรับปรุง Footer และ Content components
- ✅ เพิ่มระบบ Admin Login และ Dashboard ที่เชื่อม Supabase
- ✅ เพิ่ม migrations ฝั่ง CMS/Content หลายชุดใน `supabase/migrations/`
- ✅ เพิ่ม RPC สำหรับลบ media asset ฝั่งฐานข้อมูล (`202605150008_media_delete_storage_api.sql`)
