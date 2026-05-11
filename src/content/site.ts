export type LocalizedText = {
  th: string;
  en: string;
};

export type ManagedImage = {
  src: string;
  alt: LocalizedText;
};

export type ServiceCategoryKey = string;

export type ServiceCategory = {
  key: ServiceCategoryKey;
  title: LocalizedText;
  shortTitle: LocalizedText;
  description: LocalizedText;
  bestFor: LocalizedText;
  includes: LocalizedText[];
  prepare: LocalizedText[];
  lineMessage: LocalizedText;
  accent: 'orange' | 'blue';
};

export type PortfolioCategory = ServiceCategoryKey;

export type PortfolioStage = 'before' | 'during' | 'after';

export type PortfolioStageImage = ManagedImage & {
  stage: PortfolioStage;
  label: LocalizedText;
};

export type PortfolioMetric = {
  label: LocalizedText;
  value: LocalizedText;
  highlight?: boolean;
};

export type PortfolioProject = {
  title: LocalizedText;
  categoryKey: PortfolioCategory;
  category: LocalizedText;
  description: LocalizedText;
  systemType: LocalizedText;
  metrics: PortfolioMetric[];
  location: LocalizedText;
  province: LocalizedText;
  accent: 'orange' | 'blue';
  coverImage: ManagedImage;
  gallery: PortfolioStageImage[];
};

export const companyProfile = {
  name: 'TRP Powers Plus',
  phoneDisplay: '+66 (0) 12-345-6789',
  phoneHref: '+66012345678',
  email: 'TRPPowersplus@gmail.com',
  lineId: '@TRPPowersplus',
  lineUrl: 'https://line.me/ti/p/@TRPPowersplus',
  facebookDisplay: 'TRP Powers Plus',
  facebookUrl: 'https://facebook.com/TRPPowersplus',
  address: '123 Solar Street, Green Energy District Bangkok 10500, Thailand',
  googleMapsSearchUrl:
    'https://maps.google.com/?q=123+Solar+Street,+Green+Energy+District,+Bangkok+10500,+Thailand',
  googleMapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.451493193648!2d100.53169!3d13.7563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d6b7a63b63%3A0x1234567890!2s123%20Solar%20Street%20Green%20Energy%20District%20Bangkok!5e0!3m2!1sen!2sth!4v1234567890123',
};

export const serviceCategories: ServiceCategory[] = [
  {
    key: 'residential',
    title: { th: 'ระบบไฟฟ้าบ้านพักอาศัย', en: 'Residential electrical systems' },
    shortTitle: { th: 'บ้านพักอาศัย', en: 'Residential' },
    description: {
      th: 'เดินระบบไฟ แยกวงจร เพิ่มโหลด และปรับปรุงความปลอดภัยสำหรับบ้านใหม่หรือบ้านที่ใช้งานมานาน',
      en: 'Wiring, circuit separation, load upgrades, and safety improvements for new or existing homes.',
    },
    bestFor: { th: 'เจ้าของบ้าน บ้านรีโนเวต บ้านสร้างใหม่ และบ้านที่ต้องเพิ่มโหลดไฟฟ้า', en: 'Home owners, renovations, new houses, and homes that need load upgrades.' },
    includes: [
      { th: 'เดินสายและแยกวงจรไฟฟ้า', en: 'Wiring and circuit separation' },
      { th: 'ตู้ไฟย่อยและอุปกรณ์ป้องกัน', en: 'Distribution boards and protection devices' },
      { th: 'ตรวจจุดเสี่ยงก่อนใช้งานจริง', en: 'Risk checks before operation' },
    ],
    prepare: [
      { th: 'รูปตู้ไฟหรือพื้นที่ติดตั้ง', en: 'Photos of the panel or installation area' },
      { th: 'ขนาดมิเตอร์หรือบิลไฟล่าสุด', en: 'Meter size or latest electricity bill' },
      { th: 'รายการอุปกรณ์ไฟฟ้าที่ต้องใช้', en: 'List of electrical equipment to support' },
    ],
    lineMessage: { th: 'สนใจประเมินงานระบบไฟฟ้าบ้านพักอาศัย', en: 'I would like to assess a residential electrical project.' },
    accent: 'blue',
  },
  {
    key: 'building',
    title: { th: 'ระบบไฟฟ้าอาคารและสำนักงาน', en: 'Building and office electrical systems' },
    shortTitle: { th: 'อาคารสำนักงาน', en: 'Building' },
    description: {
      th: 'ออกแบบและปรับปรุงระบบไฟฟ้าอาคาร ตู้ MDB/DB โหลดไฟ แสงสว่าง และเอกสารส่งมอบ',
      en: 'Design and upgrade building electrical systems, MDB/DB panels, loads, lighting, and handover documentation.',
    },
    bestFor: { th: 'อาคารสำนักงาน ร้านค้า โชว์รูม คลินิก และพื้นที่เชิงพาณิชย์', en: 'Offices, shops, showrooms, clinics, and commercial spaces.' },
    includes: [
      { th: 'ตู้ MDB/DB และโหลดไฟฟ้า', en: 'MDB/DB panels and electrical loads' },
      { th: 'ระบบแสงสว่างและเต้ารับ', en: 'Lighting and outlet systems' },
      { th: 'จัดระเบียบวงจรและป้ายกำกับ', en: 'Circuit organization and labeling' },
    ],
    prepare: [
      { th: 'แบบพื้นที่หรือจำนวนชั้น', en: 'Floor plan or number of floors' },
      { th: 'รายการโหลดไฟฟ้าหลัก', en: 'Main electrical load list' },
      { th: 'รูปตู้ไฟเดิมถ้ามี', en: 'Photos of existing panels if available' },
    ],
    lineMessage: { th: 'สนใจประเมินงานระบบไฟฟ้าอาคาร', en: 'I would like to assess a building electrical project.' },
    accent: 'blue',
  },
  {
    key: 'factory',
    title: { th: 'ระบบไฟฟ้าโรงงานและคลังสินค้า', en: 'Factory and warehouse electrical systems' },
    shortTitle: { th: 'โรงงาน', en: 'Factory' },
    description: {
      th: 'วางระบบจ่ายไฟ โหลดเครื่องจักร ตู้ควบคุม และตรวจสอบความปลอดภัยเพื่อลดความเสี่ยงหน้างาน',
      en: 'Power distribution, machine loads, control panels, and safety checks to reduce site risk.',
    },
    bestFor: { th: 'โรงงาน คลังสินค้า ไลน์ผลิต และธุรกิจที่มีโหลดไฟฟ้าสูง', en: 'Factories, warehouses, production lines, and high-load businesses.' },
    includes: [
      { th: 'เมนไฟและการกระจายโหลด', en: 'Main power and load distribution' },
      { th: 'ตู้ควบคุมและวงจรเครื่องจักร', en: 'Control panels and machine circuits' },
      { th: 'ตรวจโหลดและจุดเสี่ยงความร้อน', en: 'Load and heat-risk checks' },
    ],
    prepare: [
      { th: 'รายการเครื่องจักรหรือโหลดหลัก', en: 'Machine or main load list' },
      { th: 'รูปตู้ไฟและพื้นที่ทำงาน', en: 'Photos of panels and work areas' },
      { th: 'ปัญหาที่พบ เช่น ไฟตก เบรกเกอร์ตัด หรือโหลดเกิน', en: 'Observed issues such as voltage drop, breaker trips, or overloads' },
    ],
    lineMessage: { th: 'สนใจประเมินงานระบบไฟฟ้าโรงงาน', en: 'I would like to assess a factory electrical project.' },
    accent: 'blue',
  },
  {
    key: 'solar',
    title: { th: 'ระบบโซลาร์เซลล์ออนกริดและไฮบริด', en: 'On-grid and hybrid solar systems' },
    shortTitle: { th: 'โซลาร์เซลล์', en: 'Solar' },
    description: {
      th: 'คำนวณขนาดระบบจากค่าไฟจริง ออกแบบติดตั้ง และประเมินผลประหยัดสำหรับบ้าน อาคาร และธุรกิจ',
      en: 'Size systems from real bills, design installation, and estimate savings for homes, buildings, and businesses.',
    },
    bestFor: { th: 'ลูกค้าที่มีค่าไฟสูง ใช้ไฟกลางวันมาก หรือต้องการสำรองไฟบางส่วน', en: 'Customers with high bills, daytime usage, or partial backup needs.' },
    includes: [
      { th: 'ออนกริดและไฮบริด', en: 'On-grid and hybrid systems' },
      { th: 'ประเมินขนาดระบบและจุดคุ้มทุน', en: 'System sizing and payback estimate' },
      { th: 'ตรวจพื้นที่ติดตั้งและทิศทางหลังคา', en: 'Installation area and roof direction checks' },
    ],
    prepare: [
      { th: 'บิลไฟย้อนหลังหรือหน่วยไฟต่อเดือน', en: 'Past bills or monthly electricity units' },
      { th: 'รูปหลังคาหรือพื้นที่ติดตั้ง', en: 'Roof or installation area photos' },
      { th: 'ช่วงเวลาที่ใช้ไฟมากที่สุด', en: 'Main electricity usage period' },
    ],
    lineMessage: { th: 'สนใจประเมินระบบโซลาร์เซลล์', en: 'I would like to assess a solar installation.' },
    accent: 'orange',
  },
  {
    key: 'maintenance',
    title: { th: 'ตรวจสอบและบำรุงรักษาระบบไฟฟ้า', en: 'Electrical inspection and maintenance' },
    shortTitle: { th: 'ตรวจสอบระบบ', en: 'Inspection' },
    description: {
      th: 'ตรวจตู้ไฟ จุดต่อสาย ความร้อน โหลดเกิน และสภาพอุปกรณ์ พร้อมสรุปแนวทางแก้ไข',
      en: 'Inspect panels, wiring points, heat, overloads, and equipment condition with practical recommendations.',
    },
    bestFor: { th: 'อาคารหรือโรงงานที่ต้องการลดความเสี่ยงและวางแผนซ่อมบำรุง', en: 'Buildings or factories that need risk reduction and maintenance planning.' },
    includes: [
      { th: 'ตรวจตู้ไฟและจุดต่อสาย', en: 'Panel and connection checks' },
      { th: 'ตรวจความร้อนและโหลดใช้งาน', en: 'Heat and operating load checks' },
      { th: 'รายงานปัญหาและลำดับความเร่งด่วน', en: 'Issue report and priority guidance' },
    ],
    prepare: [
      { th: 'รูปตู้ไฟหรือจุดที่กังวล', en: 'Photos of panels or concern points' },
      { th: 'อาการที่พบ เช่น กลิ่นไหม้ ความร้อน หรือไฟตก', en: 'Symptoms such as smell, heat, or voltage drops' },
      { th: 'ช่วงเวลาที่สะดวกให้เข้าตรวจ', en: 'Preferred inspection time' },
    ],
    lineMessage: { th: 'สนใจนัดตรวจสอบและบำรุงรักษาระบบไฟฟ้า', en: 'I would like to schedule electrical inspection and maintenance.' },
    accent: 'orange',
  },
  {
    key: 'controlPanel',
    title: { th: 'ตู้ควบคุมและระบบควบคุมไฟฟ้า', en: 'Control panels and electrical controls' },
    shortTitle: { th: 'ตู้ควบคุม', en: 'Control Panel' },
    description: {
      th: 'ออกแบบ ประกอบ และปรับปรุงตู้ควบคุมสำหรับปั๊ม มอเตอร์ เครื่องจักร และระบบ automation เบื้องต้น',
      en: 'Design, assemble, and upgrade control panels for pumps, motors, machines, and basic automation.',
    },
    bestFor: { th: 'งานควบคุมปั๊ม มอเตอร์ เครื่องจักร หรือระบบที่ต้องสั่งงานเป็นลำดับ', en: 'Pump, motor, machine, or sequenced control applications.' },
    includes: [
      { th: 'ตู้ควบคุมปั๊มและมอเตอร์', en: 'Pump and motor control panels' },
      { th: 'อุปกรณ์ป้องกันและสั่งงาน', en: 'Protection and command devices' },
      { th: 'ปรับปรุงตู้เดิมให้อ่านง่ายและซ่อมง่าย', en: 'Existing panel upgrades for easier operation and maintenance' },
    ],
    prepare: [
      { th: 'รูปตู้ควบคุมเดิมหรือเครื่องจักร', en: 'Photos of existing panels or machines' },
      { th: 'ลำดับการทำงานที่ต้องการ', en: 'Required operating sequence' },
      { th: 'แรงดันไฟและขนาดมอเตอร์ถ้ามี', en: 'Voltage and motor size if known' },
    ],
    lineMessage: { th: 'สนใจประเมินงานตู้ควบคุมไฟฟ้า', en: 'I would like to assess a control panel project.' },
    accent: 'blue',
  },
];

export const portfolioProjects: PortfolioProject[] = [
  {
    title: { th: 'ติดตั้งโซลาร์เซลล์โรงงานผลิตชิ้นส่วน', en: 'Manufacturing facility solar installation' },
    categoryKey: 'solar',
    category: { th: 'โซลาร์เซลล์', en: 'Solar' },
    description: {
      th: 'ออกแบบระบบผลิตไฟช่วงกลางวันเพื่อช่วยลดค่าไฟฐานของสายการผลิต',
      en: 'Daytime generation design to reduce base electricity costs for production lines.',
    },
    systemType: { th: 'ระบบออนกริด', en: 'On-grid system' },
    metrics: [
      { label: { th: 'ขนาดระบบ', en: 'System size' }, value: { th: '120 kWp', en: '120 kWp' }, highlight: true },
      { label: { th: 'ผลิตไฟต่อเดือน', en: 'Monthly production' }, value: { th: '14,400 kWh', en: '14,400 kWh' } },
      { label: { th: 'ลดค่าไฟต่อเดือน', en: 'Monthly savings' }, value: { th: 'ประมาณ ฿64,800', en: 'Approx. ฿64,800' }, highlight: true },
      { label: { th: 'ประเภทหน้างาน', en: 'Site type' }, value: { th: 'โรงงานผลิต', en: 'Manufacturing' } },
    ],
    location: { th: 'สมุทรปราการ', en: 'Samut Prakan' },
    province: { th: 'สมุทรปราการ', en: 'Samut Prakan' },
    accent: 'orange',
    coverImage: {
      src: '/images/LogoTRP.webp',
      alt: {
        th: 'โลโก้ TRP Powers Plus สำหรับผลงานโซลาร์โรงงาน',
        en: 'TRP Powers Plus logo for a factory solar project',
      },
    },
    gallery: [
      {
        stage: 'before',
        label: { th: 'ก่อนติดตั้ง', en: 'Before' },
        src: '/images/LogoTRP.webp',
        alt: { th: 'พื้นที่หลังคาโรงงานก่อนติดตั้งระบบโซลาร์', en: 'Factory roof area before solar installation' },
      },
      {
        stage: 'during',
        label: { th: 'ระหว่างติดตั้ง', en: 'During' },
        src: '/images/LogoTRP.webp',
        alt: { th: 'ทีมติดตั้งกำลังจัดวางระบบโซลาร์โรงงาน', en: 'Installation team setting up the factory solar system' },
      },
      {
        stage: 'after',
        label: { th: 'หลังติดตั้ง', en: 'After' },
        src: '/images/LogoTRP.webp',
        alt: { th: 'ระบบโซลาร์โรงงานหลังติดตั้งและทดสอบระบบ', en: 'Factory solar system after installation and testing' },
      },
    ],
  },
  {
    title: { th: 'ปรับปรุงระบบไฟฟ้าอาคารสำนักงาน', en: 'Office building electrical upgrade' },
    categoryKey: 'building',
    category: { th: 'อาคารสำนักงาน', en: 'Building' },
    description: {
      th: 'ปรับปรุงตู้ควบคุม โหลดไฟฟ้า และจัดระเบียบวงจรเพื่อเพิ่มความปลอดภัย',
      en: 'Panel, load, and circuit improvements for safer daily operation.',
    },
    systemType: { th: 'ระบบไฟฟ้าอาคาร', en: 'Building electrical system' },
    metrics: [
      { label: { th: 'ขอบเขตงาน', en: 'Scope' }, value: { th: 'ตู้ควบคุมและโหลดไฟ', en: 'Panels and loads' }, highlight: true },
      { label: { th: 'พื้นที่', en: 'Area' }, value: { th: 'อาคาร 3 ชั้น', en: '3 floors' } },
      { label: { th: 'จุดที่ปรับปรุง', en: 'Improvement' }, value: { th: 'แยกวงจรและจัดโหลด', en: 'Circuit and load organization' } },
      { label: { th: 'ผลลัพธ์', en: 'Result' }, value: { th: 'อ่านง่ายและปลอดภัยขึ้น', en: 'Clearer and safer operation' }, highlight: true },
    ],
    location: { th: 'กรุงเทพฯ', en: 'Bangkok' },
    province: { th: 'กรุงเทพฯ', en: 'Bangkok' },
    accent: 'blue',
    coverImage: {
      src: '/images/LogoTRP.webp',
      alt: {
        th: 'โลโก้ TRP Powers Plus สำหรับผลงานระบบไฟฟ้าอาคารสำนักงาน',
        en: 'TRP Powers Plus logo for an office electrical project',
      },
    },
    gallery: [
      {
        stage: 'before',
        label: { th: 'ก่อนปรับปรุง', en: 'Before' },
        src: '/images/LogoTRP.webp',
        alt: { th: 'ตู้ควบคุมระบบไฟฟ้าเดิมก่อนปรับปรุง', en: 'Existing electrical control panel before upgrade' },
      },
      {
        stage: 'during',
        label: { th: 'ระหว่างทำงาน', en: 'During' },
        src: '/images/LogoTRP.webp',
        alt: { th: 'การจัดระเบียบวงจรและโหลดไฟฟ้าระหว่างปรับปรุง', en: 'Circuit and load organization during the upgrade' },
      },
      {
        stage: 'after',
        label: { th: 'ส่งมอบงาน', en: 'Handover' },
        src: '/images/LogoTRP.webp',
        alt: { th: 'ระบบไฟฟ้าอาคารสำนักงานหลังปรับปรุงและตรวจสอบ', en: 'Office electrical system after upgrade and inspection' },
      },
    ],
  },
  {
    title: { th: 'ติดตั้งโซลาร์เซลล์บ้านพักอาศัย', en: 'Residential hybrid solar installation' },
    categoryKey: 'solar',
    category: { th: 'โซลาร์เซลล์', en: 'Solar' },
    description: {
      th: 'เพิ่มแบตเตอรี่สำรองไฟสำหรับโหลดสำคัญและลดการพึ่งพาไฟช่วงกลางคืน',
      en: 'Battery backup for critical loads and reduced nighttime grid dependence.',
    },
    systemType: { th: 'ระบบไฮบริด', en: 'Hybrid system' },
    metrics: [
      { label: { th: 'ขนาดระบบ', en: 'System size' }, value: { th: '8 kWp', en: '8 kWp' }, highlight: true },
      { label: { th: 'ผลิตไฟต่อเดือน', en: 'Monthly production' }, value: { th: '960 kWh', en: '960 kWh' } },
      { label: { th: 'ลดค่าไฟต่อเดือน', en: 'Monthly savings' }, value: { th: 'ประมาณ ฿4,320', en: 'Approx. ฿4,320' }, highlight: true },
      { label: { th: 'ระบบสำรอง', en: 'Backup' }, value: { th: 'โหลดสำคัญ', en: 'Critical loads' } },
    ],
    location: { th: 'นนทบุรี', en: 'Nonthaburi' },
    province: { th: 'นนทบุรี', en: 'Nonthaburi' },
    accent: 'orange',
    coverImage: {
      src: '/images/LogoTRP.webp',
      alt: {
        th: 'โลโก้ TRP Powers Plus สำหรับผลงานโซลาร์บ้านพักอาศัย',
        en: 'TRP Powers Plus logo for a residential solar project',
      },
    },
    gallery: [
      {
        stage: 'before',
        label: { th: 'ก่อนติดตั้ง', en: 'Before' },
        src: '/images/LogoTRP.webp',
        alt: { th: 'พื้นที่บ้านพักอาศัยก่อนติดตั้งโซลาร์เซลล์', en: 'Residential site before solar installation' },
      },
      {
        stage: 'during',
        label: { th: 'ระหว่างติดตั้ง', en: 'During' },
        src: '/images/LogoTRP.webp',
        alt: { th: 'การติดตั้งระบบโซลาร์และแบตเตอรี่สำหรับบ้านพักอาศัย', en: 'Solar and battery installation for a residential home' },
      },
      {
        stage: 'after',
        label: { th: 'หลังติดตั้ง', en: 'After' },
        src: '/images/LogoTRP.webp',
        alt: { th: 'ระบบไฮบริดบ้านพักอาศัยหลังทดสอบการใช้งาน', en: 'Residential hybrid system after commissioning' },
      },
    ],
  },
  {
    title: { th: 'ตรวจสอบระบบโซลาร์คลังสินค้า', en: 'Warehouse solar inspection' },
    categoryKey: 'maintenance',
    category: { th: 'ตรวจสอบระบบ', en: 'Inspection' },
    description: {
      th: 'ตรวจความร้อน จุดต่อสาย และประสิทธิภาพอินเวอร์เตอร์สำหรับระบบเดิม',
      en: 'Thermal, wiring, and inverter performance checks for an existing system.',
    },
    systemType: { th: 'ตรวจสอบและบำรุงรักษา', en: 'Inspection and maintenance' },
    metrics: [
      { label: { th: 'สิ่งที่ตรวจ', en: 'Checked items' }, value: { th: 'แผง สาย อินเวอร์เตอร์', en: 'Panels, wiring, inverter' }, highlight: true },
      { label: { th: 'ขนาดระบบเดิม', en: 'Existing system' }, value: { th: '60 kWp', en: '60 kWp' } },
      { label: { th: 'ปัญหาที่โฟกัส', en: 'Focus issue' }, value: { th: 'ความร้อนและจุดต่อสาย', en: 'Heat and connections' } },
      { label: { th: 'ผลลัพธ์', en: 'Result' }, value: { th: 'รายงานพร้อมแนวทางแก้', en: 'Report with fixes' }, highlight: true },
    ],
    location: { th: 'ชลบุรี', en: 'Chonburi' },
    province: { th: 'ชลบุรี', en: 'Chonburi' },
    accent: 'blue',
    coverImage: {
      src: '/images/LogoTRP.webp',
      alt: {
        th: 'โลโก้ TRP Powers Plus สำหรับผลงานบำรุงรักษาระบบโซลาร์คลังสินค้า',
        en: 'TRP Powers Plus logo for a warehouse solar maintenance project',
      },
    },
    gallery: [
      {
        stage: 'before',
        label: { th: 'ก่อนตรวจสอบ', en: 'Before' },
        src: '/images/LogoTRP.webp',
        alt: { th: 'ระบบโซลาร์คลังสินค้าก่อนเข้าตรวจสอบ', en: 'Warehouse solar system before inspection' },
      },
      {
        stage: 'during',
        label: { th: 'ระหว่างตรวจสอบ', en: 'During' },
        src: '/images/LogoTRP.webp',
        alt: { th: 'การตรวจจุดต่อสายและอินเวอร์เตอร์ของระบบคลังสินค้า', en: 'Checking wiring points and inverter performance at the warehouse' },
      },
      {
        stage: 'after',
        label: { th: 'รายงานผล', en: 'Report' },
        src: '/images/LogoTRP.webp',
        alt: { th: 'ผลตรวจสอบระบบโซลาร์คลังสินค้าหลังบำรุงรักษา', en: 'Warehouse solar inspection result after maintenance' },
      },
    ],
  },
  {
    title: { th: 'ประกอบตู้ควบคุมปั๊มน้ำโรงงาน', en: 'Factory pump control panel assembly' },
    categoryKey: 'controlPanel',
    category: { th: 'ตู้ควบคุม', en: 'Control Panel' },
    description: {
      th: 'ออกแบบวงจรควบคุมปั๊มและอุปกรณ์ป้องกัน เพื่อให้ทีมหน้างานสั่งงานและซ่อมบำรุงได้ง่าย',
      en: 'Control circuit and protection design for easier operation and maintenance by the site team.',
    },
    systemType: { th: 'ตู้ควบคุมปั๊ม', en: 'Pump control panel' },
    metrics: [
      { label: { th: 'ประเภทโหลด', en: 'Load type' }, value: { th: 'ปั๊มน้ำและมอเตอร์', en: 'Pumps and motors' }, highlight: true },
      { label: { th: 'อุปกรณ์หลัก', en: 'Main equipment' }, value: { th: 'Breaker, Contactor, Relay', en: 'Breaker, Contactor, Relay' } },
      { label: { th: 'จุดที่ปรับปรุง', en: 'Improvement' }, value: { th: 'ป้ายวงจรและการป้องกัน', en: 'Labels and protection' } },
      { label: { th: 'ผลลัพธ์', en: 'Result' }, value: { th: 'ควบคุมง่าย ซ่อมง่าย', en: 'Easier control and service' }, highlight: true },
    ],
    location: { th: 'ระยอง', en: 'Rayong' },
    province: { th: 'ระยอง', en: 'Rayong' },
    accent: 'blue',
    coverImage: {
      src: '/images/LogoTRP.webp',
      alt: {
        th: 'โลโก้ TRP Powers Plus สำหรับผลงานตู้ควบคุมปั๊มน้ำ',
        en: 'TRP Powers Plus logo for a pump control panel project',
      },
    },
    gallery: [
      {
        stage: 'before',
        label: { th: 'ก่อนประกอบ', en: 'Before' },
        src: '/images/LogoTRP.webp',
        alt: { th: 'พื้นที่และอุปกรณ์ก่อนประกอบตู้ควบคุมปั๊ม', en: 'Area and equipment before pump control panel assembly' },
      },
      {
        stage: 'during',
        label: { th: 'ระหว่างประกอบ', en: 'During' },
        src: '/images/LogoTRP.webp',
        alt: { th: 'การจัดวางอุปกรณ์และเดินสายภายในตู้ควบคุม', en: 'Component layout and wiring inside the control panel' },
      },
      {
        stage: 'after',
        label: { th: 'หลังทดสอบ', en: 'After' },
        src: '/images/LogoTRP.webp',
        alt: { th: 'ตู้ควบคุมปั๊มน้ำหลังทดสอบและติดป้ายวงจร', en: 'Pump control panel after testing and circuit labeling' },
      },
    ],
  },
];
