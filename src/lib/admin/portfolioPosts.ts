import type { Database, Json } from '../supabase/database.types';

type LocalizedText = {
  th: string;
  en: string;
};

type ServiceCategoryKey = 'residential' | 'building' | 'factory' | 'solar' | 'maintenance' | 'controlPanel';

type PortfolioMetric = {
  label: LocalizedText;
  value: LocalizedText;
  highlight?: boolean;
};

type PortfolioStageImage = {
  stage: 'before' | 'during' | 'after';
  label: LocalizedText;
  src: string;
  alt: LocalizedText;
};

export type PortfolioProjectView = {
  title: LocalizedText;
  categoryKey: ServiceCategoryKey;
  category: LocalizedText;
  description: LocalizedText;
  systemType: LocalizedText;
  metrics: PortfolioMetric[];
  location: LocalizedText;
  province: LocalizedText;
  accent: 'orange' | 'blue';
  coverImage: {
    src: string;
    alt: LocalizedText;
  };
  gallery: PortfolioStageImage[];
};

const categoryLabels: Record<ServiceCategoryKey, LocalizedText> = {
  residential: { th: 'บ้านพักอาศัย', en: 'Residential' },
  building: { th: 'อาคารสำนักงาน', en: 'Building' },
  factory: { th: 'โรงงาน', en: 'Factory' },
  solar: { th: 'โซลาร์เซลล์', en: 'Solar' },
  maintenance: { th: 'ตรวจสอบระบบ', en: 'Inspection' },
  controlPanel: { th: 'ตู้ควบคุม', en: 'Control Panel' },
};

export type PortfolioProjectRow = Database['public']['Tables']['portfolio_projects']['Row'];
export type PortfolioProjectInsert = Database['public']['Tables']['portfolio_projects']['Insert'];

export type PortfolioPostFormValues = {
  titleTh: string;
  titleEn: string;
  categoryKey: ServiceCategoryKey;
  descriptionTh: string;
  descriptionEn: string;
  systemTypeTh: string;
  systemTypeEn: string;
  locationTh: string;
  locationEn: string;
  metricLabelTh: string;
  metricLabelEn: string;
  metricValueTh: string;
  metricValueEn: string;
  accent: 'orange' | 'blue';
  published: boolean;
};

export type PortfolioPostValidationResult =
  | { ok: true; value: PortfolioPostFormValues }
  | { ok: false; message: string };

export const defaultPortfolioPostFormValues: PortfolioPostFormValues = {
  titleTh: '',
  titleEn: '',
  categoryKey: 'solar',
  descriptionTh: '',
  descriptionEn: '',
  systemTypeTh: '',
  systemTypeEn: '',
  locationTh: '',
  locationEn: '',
  metricLabelTh: 'ขอบเขตงาน',
  metricLabelEn: 'Scope',
  metricValueTh: '',
  metricValueEn: '',
  accent: 'orange',
  published: true,
};

function localized(th: string, en: string): LocalizedText {
  return { th: th.trim(), en: en.trim() || th.trim() };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function asLocalizedText(value: Json, fallback: LocalizedText): LocalizedText {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return fallback;
  }

  return {
    th: typeof value.th === 'string' ? value.th : fallback.th,
    en: typeof value.en === 'string' ? value.en : fallback.en,
  };
}

function asPortfolioMetrics(value: Json): PortfolioMetric[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((metric): PortfolioMetric | null => {
      if (!metric || typeof metric !== 'object' || Array.isArray(metric)) {
        return null;
      }

      return {
        label: asLocalizedText(metric.label ?? null, { th: 'ข้อมูล', en: 'Info' }),
        value: asLocalizedText(metric.value ?? null, { th: '-', en: '-' }),
        highlight: metric.highlight === true,
      };
    })
    .filter((metric): metric is PortfolioMetric => metric !== null);
}

function defaultGallery(): PortfolioStageImage[] {
  return [
    {
      stage: 'before',
      label: { th: 'ก่อนติดตั้ง', en: 'Before' },
      src: '/images/LogoTRP.webp',
      alt: { th: 'รูปก่อนติดตั้ง', en: 'Before project image' },
    },
    {
      stage: 'during',
      label: { th: 'ระหว่างติดตั้ง', en: 'During' },
      src: '/images/LogoTRP.webp',
      alt: { th: 'รูประหว่างติดตั้ง', en: 'During project image' },
    },
    {
      stage: 'after',
      label: { th: 'หลังติดตั้ง', en: 'After' },
      src: '/images/LogoTRP.webp',
      alt: { th: 'รูปหลังติดตั้ง', en: 'After project image' },
    },
  ];
}

export function validatePortfolioPost(values: PortfolioPostFormValues): PortfolioPostValidationResult {
  const trimmed: PortfolioPostFormValues = {
    ...values,
    titleTh: values.titleTh.trim(),
    titleEn: values.titleEn.trim(),
    descriptionTh: values.descriptionTh.trim(),
    descriptionEn: values.descriptionEn.trim(),
    systemTypeTh: values.systemTypeTh.trim(),
    systemTypeEn: values.systemTypeEn.trim(),
    locationTh: values.locationTh.trim(),
    locationEn: values.locationEn.trim(),
    metricLabelTh: values.metricLabelTh.trim(),
    metricLabelEn: values.metricLabelEn.trim(),
    metricValueTh: values.metricValueTh.trim(),
    metricValueEn: values.metricValueEn.trim(),
  };

  if (!trimmed.titleTh || !trimmed.titleEn) {
    return { ok: false, message: 'กรุณากรอกชื่อผลงานทั้งไทยและอังกฤษ' };
  }

  if (!trimmed.descriptionTh || !trimmed.systemTypeTh || !trimmed.locationTh) {
    return { ok: false, message: 'กรุณากรอกคำอธิบาย ประเภทระบบ และพื้นที่ภาษาไทย' };
  }

  if (!trimmed.metricValueTh) {
    return { ok: false, message: 'กรุณากรอก metric หลักอย่างน้อย 1 ค่า' };
  }

  return { ok: true, value: trimmed };
}

export function mapPortfolioPostFormToInsert(values: PortfolioPostFormValues): PortfolioProjectInsert {
  const title = localized(values.titleTh, values.titleEn);
  const metric: PortfolioMetric = {
    label: localized(values.metricLabelTh, values.metricLabelEn),
    value: localized(values.metricValueTh, values.metricValueEn),
    highlight: true,
  };

  return {
    slug: slugify(values.titleEn) || `${values.categoryKey}-${Date.now()}`,
    category_key: values.categoryKey,
    title,
    description: localized(values.descriptionTh, values.descriptionEn),
    system_type: localized(values.systemTypeTh, values.systemTypeEn),
    metrics: [metric],
    location: localized(values.locationTh, values.locationEn),
    accent: values.accent,
    published: values.published,
    gallery: [],
    sort_order: Date.now(),
  };
}

export function mapPortfolioProjectRowToProject(row: PortfolioProjectRow): PortfolioProjectView {
  const title = asLocalizedText(row.title, { th: row.slug, en: row.slug });
  const categoryKey = row.category_key as ServiceCategoryKey;
  const metrics = asPortfolioMetrics(row.metrics);

  return {
    title,
    categoryKey,
    category: categoryLabels[categoryKey] ?? { th: row.category_key, en: row.category_key },
    description: asLocalizedText(row.description, { th: '', en: '' }),
    systemType: asLocalizedText(row.system_type, { th: '', en: '' }),
    metrics:
      metrics.length > 0
        ? metrics
        : [{ label: { th: 'ขอบเขตงาน', en: 'Scope' }, value: { th: '-', en: '-' }, highlight: true }],
    location: asLocalizedText(row.location, { th: '', en: '' }),
    province: asLocalizedText(row.location, { th: '', en: '' }),
    accent: row.accent,
    coverImage: {
      src: '/images/LogoTRP.webp',
      alt: { th: `รูปหน้าปก ${title.th}`, en: `Cover image for ${title.en}` },
    },
    gallery: defaultGallery(),
  };
}
