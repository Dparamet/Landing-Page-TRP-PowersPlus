export type LocalizedText = {
  th: string;
  en: string;
};

export type PortfolioProject = {
  title: LocalizedText;
  category: LocalizedText;
  description: LocalizedText;
  size: string;
  location: LocalizedText;
  accent: 'orange' | 'blue';
};

export const portfolioProjects: PortfolioProject[] = [
  {
    title: { th: 'โรงงานผลิตชิ้นส่วน', en: 'Manufacturing Facility' },
    category: { th: 'ระบบโซลาร์ออนกริด', en: 'On-grid Solar' },
    description: {
      th: 'ออกแบบระบบผลิตไฟช่วงกลางวันเพื่อช่วยลดค่าไฟฐานของสายการผลิต',
      en: 'Daytime generation design to reduce base electricity costs for production lines.',
    },
    size: '120 kWp',
    location: { th: 'สมุทรปราการ', en: 'Samut Prakan' },
    accent: 'orange',
  },
  {
    title: { th: 'อาคารสำนักงาน', en: 'Office Building' },
    category: { th: 'ระบบไฟฟ้าอาคาร', en: 'Building Electrical' },
    description: {
      th: 'ปรับปรุงตู้ควบคุม โหลดไฟฟ้า และจัดระเบียบวงจรเพื่อเพิ่มความปลอดภัย',
      en: 'Panel, load, and circuit improvements for safer daily operation.',
    },
    size: '3 Floors',
    location: { th: 'กรุงเทพฯ', en: 'Bangkok' },
    accent: 'blue',
  },
  {
    title: { th: 'บ้านพักอาศัย', en: 'Residential Home' },
    category: { th: 'ระบบโซลาร์ไฮบริด', en: 'Hybrid Solar' },
    description: {
      th: 'เพิ่มแบตเตอรี่สำรองไฟสำหรับโหลดสำคัญและลดการพึ่งพาไฟช่วงกลางคืน',
      en: 'Battery backup for critical loads and reduced nighttime grid dependence.',
    },
    size: '8 kWp',
    location: { th: 'นนทบุรี', en: 'Nonthaburi' },
    accent: 'orange',
  },
  {
    title: { th: 'คลังสินค้า', en: 'Warehouse' },
    category: { th: 'ตรวจสอบและบำรุงรักษา', en: 'Inspection & Maintenance' },
    description: {
      th: 'ตรวจความร้อน จุดต่อสาย และประสิทธิภาพอินเวอร์เตอร์สำหรับระบบเดิม',
      en: 'Thermal, wiring, and inverter performance checks for an existing system.',
    },
    size: '60 kWp',
    location: { th: 'ชลบุรี', en: 'Chonburi' },
    accent: 'blue',
  },
];

export const calculatorAssumptions = {
  ftRate: 0.1623,
  vatRate: 0.07,
  monthlyYieldPerKwp: 120,
  onGridCostPerKwp: 45000,
  hybridCostPerKwp: 65000,
  lowUsageServiceCharge: 8.19,
  normalServiceCharge: 24.62,
};
