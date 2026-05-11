import type { Database, Json } from '@/lib/supabase/database.types';

export type FaqRow = Database['public']['Tables']['faq_items']['Row'];

export type LocalizedText = {
  th: string;
  en: string;
};

export type FaqItem = {
  id: string;
  question: LocalizedText;
  answer: LocalizedText;
  sortOrder: number;
  published: boolean;
  deletedAt: string | null;
  purgeAfter: string | null;
};

export type TranslationFaq = {
  question: string;
  answer: string;
};

function asLocalizedText(value: Json, fallback: LocalizedText): LocalizedText {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return fallback;
  }

  return {
    th: typeof value.th === 'string' ? value.th : fallback.th,
    en: typeof value.en === 'string' ? value.en : fallback.en,
  };
}

export function buildDefaultFaqItems(thFaqs: TranslationFaq[], enFaqs: TranslationFaq[]): FaqItem[] {
  return thFaqs.map((faq, index) => ({
    id: `fallback-${index + 1}`,
    question: {
      th: faq.question,
      en: enFaqs[index]?.question ?? faq.question,
    },
    answer: {
      th: faq.answer,
      en: enFaqs[index]?.answer ?? faq.answer,
    },
    sortOrder: (index + 1) * 10,
    published: true,
    deletedAt: null,
    purgeAfter: null,
  }));
}

export function mapFaqRows(rows: FaqRow[], fallback: FaqItem[], includeUnpublished = false): FaqItem[] {
  if (rows.length === 0) {
    return fallback;
  }

  return rows
    .filter((row) => includeUnpublished || (row.published && !row.deleted_at))
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row, index) => {
      const fallbackItem = fallback[index] ?? fallback[0] ?? {
        question: { th: '', en: '' },
        answer: { th: '', en: '' },
      };

      return {
        id: row.id,
        question: asLocalizedText(row.question, fallbackItem.question),
        answer: asLocalizedText(row.answer, fallbackItem.answer),
        sortOrder: row.sort_order,
        published: row.published,
        deletedAt: row.deleted_at,
        purgeAfter: row.purge_after,
      };
    });
}
