// Cookie Consent Categories and Colors

export type CookieCategoryId = 'necessary' | 'analytics' | 'marketing' | 'preferences';

export interface CookieCategory {
  id: CookieCategoryId;
  nameEn: string;
  nameTh: string;
  descEn: string;
  descTh: string;
  required: boolean;
  examples: string[];
}

export const COOKIE_CATEGORIES: Record<CookieCategoryId, CookieCategory> = {
  necessary: {
    id: 'necessary',
    nameEn: 'Necessary',
    nameTh: 'คุกกี้ที่จำเป็น',
    descEn: 'Cookies required for website functionality and security',
    descTh: 'จำเป็นต่อการใช้งานเว็บไซต์และความปลอดภัย',
    required: true,
    examples: ['session', 'security', 'language', 'user_preferences'],
  },
  analytics: {
    id: 'analytics',
    nameEn: 'Analytics',
    nameTh: 'คุกกี้วิเคราะห์',
    descEn: 'Help us measure and improve the user experience',
    descTh: 'ช่วยให้เราวัดผลและปรับปรุงประสบการณ์ใช้งาน',
    required: false,
    examples: ['Google Analytics', 'page views', 'user behavior'],
  },
  marketing: {
    id: 'marketing',
    nameEn: 'Marketing',
    nameTh: 'คุกกี้การตลาด',
    descEn: 'Track your activity to show relevant ads',
    descTh: 'ติดตามกิจกรรมของคุณเพื่อแสดงโฆษณาที่เกี่ยวข้อง',
    required: false,
    examples: ['advertising', 'retargeting'],
  },
  preferences: {
    id: 'preferences',
    nameEn: 'Preferences',
    nameTh: 'คุกกี้ค่ากำหนด',
    descEn: 'Remember your preferences and settings',
    descTh: 'จดจำค่ากำหนดและการตั้งค่าของคุณ',
    required: false,
    examples: ['theme', 'language', 'layout'],
  },
};

// Customizable Color Theme - Orange & Blue Brand Colors
export const COOKIE_COLORS = {
  // Banner/Modal backgrounds - Orange to Blue gradient feel
  bgPrimary: 'bg-white',
  bgSecondary: 'bg-[#f8fafc]',
  bgTertiary: 'bg-[#fff7ed]',

  // Borders
  borderPrimary: 'border-slate-200',
  borderHover: 'border-orange-400',

  // Text colors
  textPrimary: 'text-gray-900',
  textSecondary: 'text-gray-700',
  textTertiary: 'text-gray-600',

  // Buttons
  btnPrimaryBg: 'bg-[#f08a24]',
  btnPrimaryBgHover: 'hover:-translate-y-0.5 hover:bg-[#d66d0c] hover:shadow-md active:translate-y-0',
  btnSecondaryBg: 'bg-blue-50',
  btnSecondaryBgHover: 'hover:-translate-y-0.5 hover:bg-blue-100 active:translate-y-0',
  btnTertiaryBg: 'bg-transparent',

  // Status colors
  enabledBg: 'bg-blue-100',
  enabledText: 'text-blue-700',
  toggleBg: 'bg-gray-300',
  toggleActive: 'peer-checked:bg-orange-500',

  // Accent colors
  badgeBg: 'bg-orange-100',
  badgeBorder: 'border-orange-200',
  badgeText: 'text-orange-700',
};

export const STORAGE_KEY = 'trp_cookie_consent_v1';
export const CONSENT_EVENT = 'trp-cookie-consent-updated';
export const STORAGE_EXPIRY = 60 * 60 * 24 * 180; // 180 days in seconds
