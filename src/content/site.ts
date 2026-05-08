export type LocalizedText = {
  th: string;
  en: string;
};

export type ManagedImage = {
  src: string;
  alt: LocalizedText;
};

export type PortfolioCategory = 'residential' | 'factory' | 'business' | 'agriculture';

export type PortfolioStage = 'before' | 'during' | 'after';

export type PortfolioStageImage = ManagedImage & {
  stage: PortfolioStage;
  label: LocalizedText;
};

export type PortfolioProject = {
  title: LocalizedText;
  categoryKey: PortfolioCategory;
  category: LocalizedText;
  description: LocalizedText;
  systemType: LocalizedText;
  systemSize: string;
  monthlyProductionKwh: number;
  monthlySavingsBaht: number;
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

export const portfolioProjects: PortfolioProject[] = [
  {
    title: { th: 'ติดตั้งโซลาร์เซลล์โรงงานผลิตชิ้นส่วน', en: 'Manufacturing facility solar installation' },
    categoryKey: 'factory',
    category: { th: 'โรงงาน', en: 'Factory' },
    description: {
      th: 'ออกแบบระบบผลิตไฟช่วงกลางวันเพื่อช่วยลดค่าไฟฐานของสายการผลิต',
      en: 'Daytime generation design to reduce base electricity costs for production lines.',
    },
    systemType: { th: 'ระบบออนกริด', en: 'On-grid system' },
    systemSize: '120 kWp',
    monthlyProductionKwh: 14400,
    monthlySavingsBaht: 64800,
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
    categoryKey: 'business',
    category: { th: 'ธุรกิจ', en: 'Business' },
    description: {
      th: 'ปรับปรุงตู้ควบคุม โหลดไฟฟ้า และจัดระเบียบวงจรเพื่อเพิ่มความปลอดภัย',
      en: 'Panel, load, and circuit improvements for safer daily operation.',
    },
    systemType: { th: 'ระบบไฟฟ้าอาคาร', en: 'Building electrical system' },
    systemSize: '3 Floors',
    monthlyProductionKwh: 0,
    monthlySavingsBaht: 0,
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
    categoryKey: 'residential',
    category: { th: 'บ้านพักอาศัย', en: 'Residential' },
    description: {
      th: 'เพิ่มแบตเตอรี่สำรองไฟสำหรับโหลดสำคัญและลดการพึ่งพาไฟช่วงกลางคืน',
      en: 'Battery backup for critical loads and reduced nighttime grid dependence.',
    },
    systemType: { th: 'ระบบไฮบริด', en: 'Hybrid system' },
    systemSize: '8 kWp',
    monthlyProductionKwh: 960,
    monthlySavingsBaht: 4320,
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
    categoryKey: 'business',
    category: { th: 'ธุรกิจ', en: 'Business' },
    description: {
      th: 'ตรวจความร้อน จุดต่อสาย และประสิทธิภาพอินเวอร์เตอร์สำหรับระบบเดิม',
      en: 'Thermal, wiring, and inverter performance checks for an existing system.',
    },
    systemType: { th: 'ตรวจสอบและบำรุงรักษา', en: 'Inspection and maintenance' },
    systemSize: '60 kWp',
    monthlyProductionKwh: 7200,
    monthlySavingsBaht: 32400,
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
];
