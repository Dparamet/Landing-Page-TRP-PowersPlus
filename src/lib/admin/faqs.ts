import type { Database } from '@/lib/supabase/database.types';
import type { FaqItem } from '@/lib/faqs';
import { fillEnglish } from './autoTranslate.js';

export type FaqInsert = Database['public']['Tables']['faq_items']['Insert'];
export type FaqUpdate = Database['public']['Tables']['faq_items']['Update'];

export type FaqFormValues = {
  id: string | null;
  questionTh: string;
  questionEn: string;
  answerTh: string;
  answerEn: string;
  sortOrder: number;
  published: boolean;
};

export type FaqValidationResult =
  | { ok: true; value: FaqFormValues }
  | { ok: false; message: string };

export function createBlankFaqForm(sortOrder: number): FaqFormValues {
  return {
    id: null,
    questionTh: '',
    questionEn: '',
    answerTh: '',
    answerEn: '',
    sortOrder,
    published: true,
  };
}

export function mapFaqItemToForm(item: FaqItem): FaqFormValues {
  return {
    id: item.id,
    questionTh: item.question.th,
    questionEn: item.question.en,
    answerTh: item.answer.th,
    answerEn: item.answer.en,
    sortOrder: item.sortOrder,
    published: item.published,
  };
}

export function validateFaqForm(values: FaqFormValues): FaqValidationResult {
  const trimmed = {
    ...values,
    questionTh: values.questionTh.trim(),
    questionEn: values.questionEn.trim(),
    answerTh: values.answerTh.trim(),
    answerEn: values.answerEn.trim(),
  };

  if (!trimmed.questionTh || !trimmed.answerTh) {
    return { ok: false, message: 'กรุณากรอกคำถามและคำตอบภาษาไทย' };
  }

  if (!Number.isFinite(trimmed.sortOrder) || trimmed.sortOrder < 0) {
    return { ok: false, message: 'ลำดับต้องเป็นตัวเลข 0 ขึ้นไป' };
  }

  return { ok: true, value: trimmed };
}

export function mapFaqFormToInsert(values: FaqFormValues): FaqInsert {
  return {
    question: {
      th: values.questionTh,
      en: fillEnglish(values.questionTh, values.questionEn),
    },
    answer: {
      th: values.answerTh,
      en: fillEnglish(values.answerTh, values.answerEn),
    },
    sort_order: values.sortOrder,
    published: values.published,
    updated_at: new Date().toISOString(),
  };
}

export function mapFaqFormToUpdate(values: FaqFormValues): FaqUpdate {
  return {
    ...mapFaqFormToInsert(values),
    updated_at: new Date().toISOString(),
  };
}
