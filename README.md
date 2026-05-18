# TRP Powers Plus Web

เว็บไซต์ Landing Page สำหรับบริษัท TRP Powers Plus ที่ให้บริการงานระบบไฟฟ้า งานโซลาร์เซลล์ และบริการประเมินเบื้องต้นสำหรับลูกค้าในประเทศไทย

โปรเจกต์นี้ออกแบบมาให้ส่งมอบต่อได้ง่าย ข้อมูลธุรกิจและผลงานถูกรวมไว้ในไฟล์ content กลาง ข้อความภาษาไทยและอังกฤษแยกเป็น locale files และมีคู่มือสำหรับผู้ดูแลที่ไม่ใช่นักพัฒนา

## ภาพรวม

- Next.js App Router + TypeScript + React
- Tailwind CSS + custom CSS variables
- รองรับภาษาไทยและอังกฤษ
- ตั้งค่าเป็น static export สำหรับ deploy แบบไฟล์ static
- มีระบบทดสอบสำหรับ content, locale, รูปภาพ, และ solar estimator

## เริ่มใช้งาน

1. เปิดโฟลเดอร์โปรเจกต์

```bash
cd "C:\Users\Acer\Desktop\Project My Future\trp-powers-plus\trp-powers-plus-web"
```

2. ติดตั้ง dependencies

```bash
npm install
```

3. เปิดโหมดพัฒนา

```bash
npm run dev
```

4. เปิดเว็บที่

```text
http://localhost:3000
```

ถ้า port 3000 ถูกใช้อยู่ ให้ใช้

```bash
npm run dev -- -p 3001
```

แล้วเปิด

```text
http://localhost:3001
```

## สิ่งที่ต้องติดตั้ง

- Node.js 20 ขึ้นไป แนะนำ Node.js 22
- npm ซึ่งติดมากับ Node.js
- Git
- โปรแกรมแก้ไฟล์ เช่น VS Code

ตรวจเวอร์ชันได้ด้วย

```bash
node --version
npm --version
git --version
```

## คำสั่งหลัก

| คำสั่ง | ใช้ทำอะไร |
| --- | --- |
| `npm install` | ติดตั้ง dependencies |
| `npm run dev` | เปิดเว็บในโหมดพัฒนา |
| `npm test` | ตรวจสูตรคำนวณ โครงสร้างภาษา และ path รูปภาพ |
| `npm run lint` | ตรวจคุณภาพโค้ดและรูปแบบการเขียน |
| `npm run build` | build static site สำหรับส่งขึ้น hosting |
| `npm run start` | ใช้กับ Next server mode แต่โปรเจกต์นี้เน้น static export |

## โครงสร้างโปรเจกต์

```text
trp-powers-plus-web/
├── docs/
│   ├── CONTENT_GUIDE.md   คู่มือแก้ข้อความและรูปภาพ
│   └── HANDOFF_SPEC.md    แนวทางการส่งมอบและโครงสร้างเนื้อหา
├── public/
│   └── images/
│       ├── LogoTRP.webp   โลโก้หลัก
│       └── portfolio/     รูปผลงาน
├── src/
│   ├── app/               หน้าเว็บ, layout, globals.css
│   ├── components/        ส่วนประกอบ UI หลัก
│   ├── content/           ข้อมูลบริษัท บริการ และผลงาน
│   ├── context/           providers สำหรับภาษาและ cookie consent
│   ├── data/              compatibility export สำหรับไฟล์เก่า
│   ├── lib/               logic ใช้ซ้ำ เช่น solar estimator
│   └── locales/           ข้อความภาษาไทยและอังกฤษ
├── tests/                 test files
├── next.config.ts         static export และ image settings
├── package.json           scripts และ dependencies
└── README.md              คู่มือหลัก
```

## แก้ข้อความและข้อมูล

ถ้าต้องการแก้ข้อความ รูปภาพ หรือข้อมูลบริษัท ให้เริ่มจาก [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)

ไฟล์สำคัญมีดังนี้

| สิ่งที่ต้องแก้ | ไฟล์หรือโฟลเดอร์ |
| --- | --- |
| ข้อความภาษาไทย | `src/locales/th.json` |
| ข้อความภาษาอังกฤษ | `src/locales/en.json` |
| เบอร์โทร อีเมล Line Facebook แผนที่ | `src/content/site.ts` |
| รายการบริการ | `src/content/site.ts` |
| รายการผลงาน | `src/content/site.ts` |
| รูปผลงาน | `public/images/portfolio/` |
| โลโก้ | `public/images/LogoTRP.webp` |

หลังแก้ content ให้รัน

```bash
npm test
npm run build
```

### เพิ่มรูปผลงาน

1. วางรูปใน `public/images/portfolio/`
2. ตั้งชื่อไฟล์เป็นภาษาอังกฤษ ไม่มีเว้นวรรค เช่น `factory-solar.webp`
3. เปิด `src/content/site.ts`
4. หา project ที่ต้องการแก้
5. เปลี่ยน `coverImage.src` หรือรูปใน `gallery` ให้ชี้ไปที่ path ใหม่

ตัวอย่าง

```ts
coverImage: {
  src: '/images/portfolio/factory-solar.webp',
  alt: {
    th: 'งานติดตั้งโซลาร์เซลล์โรงงาน',
    en: 'Factory solar installation project',
  },
},
```

ถ้าพิมพ์ชื่อไฟล์ผิด `npm test` จะรายงานว่า image file is missing

### เพิ่มผลงานใหม่

เปิด `src/content/site.ts` แล้วเพิ่ม object ใหม่ใน `portfolioProjects`

ช่องที่ควรกรอก

- `title`: ชื่อผลงานไทย/อังกฤษ
- `categoryKey`: ต้องตรงกับ `serviceCategories.key`
- `category`: ประเภทงานไทย/อังกฤษ
- `description`: คำอธิบายไทย/อังกฤษ
- `systemType`: ประเภทระบบ เช่น ออนกริด, ระบบไฟฟ้าอาคาร, ตู้ควบคุม
- `metrics`: ข้อมูลสำคัญของงาน เช่น ขนาดระบบ ขอบเขตงาน ผลประหยัด
- `location`: พื้นที่ไทย/อังกฤษ
- `province`: จังหวัดหรือพื้นที่บริการ
- `accent`: ใช้ได้แค่ `orange` หรือ `blue`
- `coverImage`: รูปหลักของผลงาน
- `gallery`: รูปก่อนติดตั้ง ระหว่างติดตั้ง และหลังติดตั้ง

### เพิ่มหรือแก้บริการ

เปิด `src/content/site.ts` แล้วแก้รายการใน `serviceCategories`

ช่องที่ควรกรอก

- `key`: รหัสบริการ เช่น `residential`, `building`, `factory`, `solar`, `maintenance`, `controlPanel`
- `title` และ `shortTitle`: ชื่อบริการเต็มและชื่อสั้น
- `description`: อธิบายว่ารับงานอะไร
- `bestFor`: เหมาะกับลูกค้าแบบไหน
- `includes`: งานที่รับอย่างน้อย 3 รายการ
- `prepare`: ข้อมูลที่ลูกค้าควรเตรียมอย่างน้อย 3 รายการ
- `lineMessage`: ข้อความเริ่มต้นสำหรับส่งใน LINE
- `accent`: ใช้ `orange` หรือ `blue`

## Solar Calculator

ไฟล์ที่เกี่ยวข้อง

- UI: `src/components/SolarCalculator.tsx`
- สูตรคำนวณ: `src/lib/solarEstimator.ts`
- Test: `tests/solarEstimator.test.mjs`

ระบบคำนวณใช้หลักการดังนี้

- ค่าไฟบ้านแบบขั้นบันได
- ค่า Ft `0.1623 บาท/หน่วย`
- VAT 7%
- ค่าผลิตไฟเฉลี่ยตามสภาพหลังคา `105 / 120 / 135 kWh ต่อ kWp ต่อเดือน`
- ปัดขนาดติดตั้งเป็นขั้น `0.5 kWp`
- แยก On-grid และ Hybrid

ถ้าจะเปลี่ยนค่าไฟหรือสูตร ให้แก้ test ใน `tests/solarEstimator.test.mjs` ให้ตรงกับพฤติกรรมใหม่ แล้วรัน

```bash
npm test
```

## ตรวจงานก่อนส่งมอบ

รันคำสั่งเหล่านี้ก่อนส่งงาน

```bash
npm test
npm run lint
npm run build
```

ผลที่ควรได้

- `npm test` ผ่านทั้งหมด
- `npm run lint` ไม่มี error
- `npm run build` สำเร็จและสร้างไฟล์ใน `out/`

## Performance และ latency guard

โปรเจกต์นี้มี guard สำหรับลดอาการหน่วงบนหน้า public และหน้า admin:

- หน้า admin ใช้ dynamic import แยก manager แต่ละแท็บ เพื่อลดการ hydrate ฟอร์มและ dashboard ที่ยังไม่ได้เปิด
- widget ฝั่ง public เช่น analytics, cookie UI และ scroll effects โหลดเฉพาะ route ที่ไม่ใช่ `/admin`
- partner carousel จะ animate เฉพาะตอน section อยู่ใกล้ viewport, หยุดตาม `prefers-reduced-motion`, และไม่ query hover state ทุก frame
- scroll reveal throttle งานจาก `MutationObserver` ผ่าน `requestAnimationFrame`
- preview refresh ใน admin ถูก debounce เพื่อลดการ reload iframe ติดกันหลายครั้ง
- hero background ใช้ `next/image` พร้อม `priority`, `fetchPriority="high"` และ `sizes="100vw"` สำหรับ LCP

ก่อนแก้ performance เพิ่ม ให้รัน baseline:

```bash
npm run build
Get-ChildItem -Recurse -File .next\static\chunks | Sort-Object Length -Descending | Select-Object -First 12 @{Name='KB';Expression={[math]::Round($_.Length/1KB,1)}},Name | Format-Table -AutoSize
```

หลังแก้ต้องรัน:

```bash
npm test
npm run lint
npm run build
```

## Build และ Deploy

โปรเจกต์นี้ตั้งค่า static export ไว้ใน `next.config.ts`

Build ด้วย

```bash
npm run build
```

ไฟล์สำหรับ deploy จะอยู่ใน

```text
out/
```

นำโฟลเดอร์ `out/` ไปใช้กับ static hosting ได้ เช่น GitHub Pages, Netlify, Vercel static output หรือ hosting ที่รองรับ HTML/CSS/JS

## ปัญหาที่พบบ่อย

### เปิด dev server ไม่ได้เพราะ port 3000 ถูกใช้

```bash
npm run dev -- -p 3001
```

### รูปผลงานไม่ขึ้น

ตรวจ 3 จุด

1. รูปอยู่ใน `public/images/portfolio/`
2. ชื่อไฟล์ตรงกับ `coverImage.src` หรือ `gallery[].src` ใน `src/content/site.ts`
3. path ขึ้นต้นด้วย `/images/portfolio/`

จากนั้นรัน

```bash
npm test
```

### แก้ภาษาแล้ว test fail

มักเกิดจาก `src/locales/th.json` และ `src/locales/en.json` มี key ไม่ตรงกัน

วิธีแก้

1. ดู error จาก `npm test`
2. เพิ่ม key ที่หายไปในอีกภาษา
3. ตรวจ comma และเครื่องหมายคำพูดใน JSON

### Build fail หลังรับโปรเจกต์มาใหม่

ติดตั้ง dependencies ใหม่แล้วลอง build อีกครั้ง

```bash
Remove-Item -Recurse -Force node_modules
npm install
npm run build
```

## ข้อควรระวัง

- อย่าแก้ไฟล์ใน `.next/` หรือ `out/` เพราะเป็นไฟล์ที่ระบบสร้างใหม่
- อย่า commit password, token, API key หรือข้อมูลลับ
- อย่าลบ tests เพื่อให้คำสั่งผ่าน
- ถ้าจะเปลี่ยนสูตรค่าไฟ ให้แก้ test พร้อมกันเสมอ

## ข้อมูลอ้างอิง

- [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)
- [docs/HANDOFF_SPEC.md](docs/HANDOFF_SPEC.md)
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
