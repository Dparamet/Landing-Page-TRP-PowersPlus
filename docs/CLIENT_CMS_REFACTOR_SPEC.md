# คู่มือแก้ข้อความและรูปภาพสำหรับผู้ดูแลเว็บ

คู่มือนี้เขียนสำหรับคนที่ไม่เคยเขียนโปรแกรมมาก่อน ให้แก้เฉพาะไฟล์ที่ระบุไว้ในหน้านี้ก่อน ถ้าไม่แน่ใจให้สำรองไฟล์เดิมไว้ก่อนแก้

## แก้ข้อความในเว็บไซต์

ข้อความภาษาไทยอยู่ที่:

`src/locales/th.json`

ข้อความภาษาอังกฤษอยู่ที่:

`src/locales/en.json`

วิธีแก้:

1. เปิดไฟล์ภาษาที่ต้องการแก้
2. ค้นหาข้อความเดิม เช่น `ติดต่อเรา`
3. เปลี่ยนเฉพาะข้อความหลังเครื่องหมาย `:`
4. อย่าลบเครื่องหมายคำพูด `" "` และอย่าลบ comma `,`
5. ถ้าเพิ่มหัวข้อใหม่ในภาษาไทย ต้องเพิ่ม key เดียวกันในภาษาอังกฤษด้วย
6. รัน `npm test` เพื่อตรวจว่าภาษาไทย/อังกฤษยังมีโครงสร้างตรงกัน

ตัวอย่าง:

```json
"contact": {
	"title": "ติดต่อเรา"
}
```

เปลี่ยนเป็น:

```json
"contact": {
	"title": "ติดต่อทีมงาน"
}
```

## แก้เบอร์โทร อีเมล Line Facebook และแผนที่

แก้ที่ไฟล์เดียว:

`src/content/site.ts`

หา `companyProfile` แล้วแก้ค่าที่ต้องการ เช่น:

```ts
phoneDisplay: '+66 (0) 12-345-6789',
email: 'TRPPowersplus@gmail.com',
lineId: '@TRPPowersplus',
facebookDisplay: 'TRP Powers Plus',
facebookUrl: 'https://facebook.com/TRPPowersplus',
```

ข้อควรระวัง:

- `phoneHref` ต้องใช้ตัวเลขติดกันสำหรับลิงก์โทรศัพท์ เช่น `+66012345678`
- `facebookUrl` ต้องเป็นลิงก์หน้าเพจ ไม่ใช่ Facebook plugin หรือ iframe
- `googleMapsEmbedUrl` ต้องเป็นลิงก์ embed จาก Google Maps
- `googleMapsSearchUrl` ใช้สำหรับปุ่มเปิดตำแหน่งใน Google Maps

## เพิ่มหรือเปลี่ยนรูปผลงาน

โฟลเดอร์สำหรับรูปผลงาน:

`public/images/portfolio/`

ขั้นตอนที่ง่ายที่สุด:

1. เตรียมรูปเป็น `.webp`, `.jpg`, หรือ `.png`
2. ตั้งชื่อไฟล์เป็นภาษาอังกฤษ ไม่มีเว้นวรรค เช่น `factory-solar.webp`
3. วางไฟล์ไว้ใน `public/images/portfolio/`
4. เปิดไฟล์ `src/content/site.ts`
5. หา `portfolioProjects`
6. แก้ค่า `coverImage.src` หรือรูปใน `gallery` ของผลงานที่ต้องการ

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

สำคัญ:

- path ต้องขึ้นต้นด้วย `/images/portfolio/`
- ชื่อไฟล์ใน `src` ต้องตรงกับไฟล์จริงทุกตัวอักษร
- `alt` คือคำอธิบายรูปสำหรับ SEO และผู้ใช้ screen reader
- ถ้ามีรูปหลายช่วง ให้ใส่ใน `gallery` เป็น `before`, `during`, และ `after`

## เพิ่มหรือแก้บริการ

บริการและตัวเลือกในส่วน "เลือกประเภทงาน" อยู่ที่ไฟล์:

`src/content/site.ts`

หา `serviceCategories` แล้วแก้ข้อมูลในรายการที่ต้องการ แต่ละบริการมีข้อมูลสำคัญ:

- `title`: ชื่อบริการเต็ม
- `shortTitle`: ชื่อสั้นที่ใช้บนปุ่ม
- `description`: คำอธิบายบริการ
- `bestFor`: เหมาะกับลูกค้าแบบไหน
- `includes`: งานที่รับ
- `prepare`: ข้อมูลที่ลูกค้าควรเตรียม
- `lineMessage`: ข้อความแนะนำสำหรับส่งใน LINE
- `accent`: ใช้ `orange` หรือ `blue`

ค่า `key` ใช้เชื่อมกับผลงานและปุ่มกรอง เลือกจากชุดนี้:

- `residential` บ้านพักอาศัย
- `building` อาคารและสำนักงาน
- `factory` โรงงานและคลังสินค้า
- `solar` โซลาร์เซลล์
- `maintenance` ตรวจสอบและบำรุงรักษา
- `controlPanel` ตู้ควบคุม

## เพิ่มผลงานใหม่

ใน `src/content/site.ts` ให้คัดลอกหนึ่ง block ใน `portfolioProjects` แล้วเปลี่ยนข้อมูล:

```ts
{
	title: { th: 'ชื่อผลงานภาษาไทย', en: 'Project name in English' },
	categoryKey: 'solar',
	category: { th: 'ประเภทงานภาษาไทย', en: 'Category in English' },
	description: {
		th: 'คำอธิบายภาษาไทย',
		en: 'English description.',
	},
	systemType: { th: 'ระบบออนกริด', en: 'On-grid system' },
	metrics: [
		{
			label: { th: 'ขนาดระบบ', en: 'System size' },
			value: { th: '10 kWp', en: '10 kWp' },
			highlight: true,
		},
		{
			label: { th: 'ผลิตไฟต่อเดือน', en: 'Monthly production' },
			value: { th: '1,200 kWh', en: '1,200 kWh' },
		},
		{
			label: { th: 'ลดค่าไฟต่อเดือน', en: 'Monthly savings' },
			value: { th: 'ประมาณ ฿5,400', en: 'Approx. ฿5,400' },
			highlight: true,
		},
		{
			label: { th: 'ประเภทหน้างาน', en: 'Site type' },
			value: { th: 'บ้านพักอาศัย', en: 'Residential' },
		},
	],
	location: { th: 'กรุงเทพฯ', en: 'Bangkok' },
	province: { th: 'กรุงเทพฯ', en: 'Bangkok' },
	accent: 'orange',
	coverImage: {
		src: '/images/portfolio/example.webp',
		alt: {
			th: 'คำอธิบายรูปภาษาไทย',
			en: 'English image description',
		},
	},
	gallery: [
		{
			stage: 'before',
			label: { th: 'ก่อนติดตั้ง', en: 'Before' },
			src: '/images/portfolio/example-before.webp',
			alt: { th: 'รูปก่อนติดตั้ง', en: 'Before installation image' },
		},
		{
			stage: 'during',
			label: { th: 'ระหว่างติดตั้ง', en: 'During' },
			src: '/images/portfolio/example-during.webp',
			alt: { th: 'รูประหว่างติดตั้ง', en: 'During installation image' },
		},
		{
			stage: 'after',
			label: { th: 'หลังติดตั้ง', en: 'After' },
			src: '/images/portfolio/example-after.webp',
			alt: { th: 'รูปหลังติดตั้ง', en: 'After installation image' },
		},
	],
}
```

ใช้ `accent: 'orange'` หรือ `accent: 'blue'` เท่านั้น

ค่า `categoryKey` ต้องตรงกับ `key` ใน `serviceCategories`

ตัวอย่าง `metrics` สำหรับงานไฟฟ้าอาคาร:

```ts
metrics: [
	{ label: { th: 'ขอบเขตงาน', en: 'Scope' }, value: { th: 'ตู้ควบคุมและโหลดไฟ', en: 'Panels and loads' }, highlight: true },
	{ label: { th: 'พื้นที่', en: 'Area' }, value: { th: 'อาคาร 3 ชั้น', en: '3 floors' } },
	{ label: { th: 'จุดที่ปรับปรุง', en: 'Improvement' }, value: { th: 'แยกวงจรและจัดโหลด', en: 'Circuit and load organization' } },
	{ label: { th: 'ผลลัพธ์', en: 'Result' }, value: { th: 'อ่านง่ายและปลอดภัยขึ้น', en: 'Clearer and safer operation' }, highlight: true },
]
```

## ตรวจหลังแก้ทุกครั้ง

รันคำสั่งนี้ตามลำดับ:

```bash
npm test
npm run lint
npm run build
```

ถ้าทั้งสามคำสั่งผ่าน แปลว่าโครงสร้างข้อมูล รูปภาพ และ build เบื้องต้นปลอดภัยสำหรับส่งต่อหรือ deploy
