import type { Database, Json } from './supabase/database.types';

export type ProcessStepRow = Database['public']['Tables']['process_steps']['Row'];

export type LocalizedText = {
  th: string;
  en: string;
};

export type ProcessStep = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  sortOrder: number;
  published: boolean;
  deletedAt: string | null;
  purgeAfter: string | null;
};

export type TranslationProcessStep = {
  title: string;
  description: string;
};

export function buildDefaultProcessSteps(thSteps: TranslationProcessStep[], enSteps: TranslationProcessStep[]): ProcessStep[] {
  return thSteps.map((step, index) => ({
    id: `fallback-process-${index + 1}`,
    title: {
      th: step.title,
      en: enSteps[index]?.title ?? step.title,
    },
    description: {
      th: step.description,
      en: enSteps[index]?.description ?? step.description,
    },
    sortOrder: (index + 1) * 10,
    published: true,
    deletedAt: null,
    purgeAfter: null,
  }));
}

function text(value: Json, fallback: LocalizedText) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return fallback;
  }

  return {
    th: typeof value.th === 'string' ? value.th : fallback.th,
    en: typeof value.en === 'string' ? value.en : fallback.en,
  };
}

export function mapProcessStepRows(rows: ProcessStepRow[], fallback: ProcessStep[], includeUnpublished = false): ProcessStep[] {
  if (rows.length === 0) {
    return fallback;
  }

  const visibleRows = rows.filter((row) => includeUnpublished || (row.published && !row.deleted_at));

  if (visibleRows.length === 0) {
    return fallback;
  }

  return visibleRows
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row, index) => {
      const fallbackStep = fallback[index] ?? fallback[0] ?? {
        title: { th: '', en: '' },
        description: { th: '', en: '' },
      };

      return {
        id: row.id,
        title: text(row.title, fallbackStep.title),
        description: text(row.description, fallbackStep.description),
        sortOrder: row.sort_order,
        published: row.published,
        deletedAt: row.deleted_at,
        purgeAfter: row.purge_after,
      };
    });
}
