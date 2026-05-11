import type { Database } from '@/lib/supabase/database.types';
import type { ProcessStep } from '@/lib/processSteps';
import { fillEnglish } from './autoTranslate.js';

export type ProcessStepInsert = Database['public']['Tables']['process_steps']['Insert'];
export type ProcessStepUpdate = Database['public']['Tables']['process_steps']['Update'];

export type ProcessStepFormValues = {
  id: string | null;
  titleTh: string;
  titleEn: string;
  descriptionTh: string;
  descriptionEn: string;
  sortOrder: number;
  published: boolean;
};

export type ProcessStepValidationResult =
  | { ok: true; value: ProcessStepFormValues }
  | { ok: false; message: string };

export function createBlankProcessStepForm(sortOrder: number): ProcessStepFormValues {
  return {
    id: null,
    titleTh: '',
    titleEn: '',
    descriptionTh: '',
    descriptionEn: '',
    sortOrder,
    published: true,
  };
}

export function mapProcessStepToForm(step: ProcessStep): ProcessStepFormValues {
  return {
    id: step.id,
    titleTh: step.title.th,
    titleEn: step.title.en,
    descriptionTh: step.description.th,
    descriptionEn: step.description.en,
    sortOrder: step.sortOrder,
    published: step.published,
  };
}

export function validateProcessStepForm(values: ProcessStepFormValues): ProcessStepValidationResult {
  const trimmed = {
    ...values,
    titleTh: values.titleTh.trim(),
    titleEn: values.titleEn.trim(),
    descriptionTh: values.descriptionTh.trim(),
    descriptionEn: values.descriptionEn.trim(),
  };

  if (!trimmed.titleTh || !trimmed.descriptionTh) {
    return { ok: false, message: 'กรุณากรอกหัวข้อและคำอธิบายภาษาไทย' };
  }

  if (!Number.isFinite(trimmed.sortOrder) || trimmed.sortOrder < 0) {
    return { ok: false, message: 'ลำดับต้องเป็นตัวเลข 0 ขึ้นไป' };
  }

  return { ok: true, value: trimmed };
}

export function mapProcessStepFormToInsert(values: ProcessStepFormValues): ProcessStepInsert {
  return {
    title: {
      th: values.titleTh,
      en: fillEnglish(values.titleTh, values.titleEn),
    },
    description: {
      th: values.descriptionTh,
      en: fillEnglish(values.descriptionTh, values.descriptionEn),
    },
    sort_order: values.sortOrder,
    published: values.published,
    updated_at: new Date().toISOString(),
  };
}

export function mapProcessStepFormToUpdate(values: ProcessStepFormValues): ProcessStepUpdate {
  return {
    ...mapProcessStepFormToInsert(values),
    updated_at: new Date().toISOString(),
  };
}
