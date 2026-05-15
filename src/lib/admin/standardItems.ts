export type StandardItemUpsertInput = {
  id: unknown;
  title: unknown;
  altText?: unknown;
  imageUrl?: unknown;
  assetAltText?: unknown;
  sortOrder?: unknown;
  published?: unknown;
};

export type StandardItemUpsertRow = {
  id: string;
  title: string;
  image_url: string | null;
  image_alt: string;
  sort_order: number;
  published: boolean;
  deleted_at: null;
  purge_after: null;
  updated_at: string;
};

export function buildStandardItemUpsertRow(input: StandardItemUpsertInput, updatedAt = new Date().toISOString()): StandardItemUpsertRow {
  const title = safeText(input.title).trim();
  const imageUrl = safeText(input.imageUrl).trim();

  return {
    id: safeText(input.id).trim(),
    title,
    image_url: imageUrl || null,
    image_alt: safeText(input.altText).trim() || safeText(input.assetAltText).trim() || title,
    sort_order: Number.isFinite(input.sortOrder) ? Number(input.sortOrder) : 10,
    published: typeof input.published === 'boolean' ? input.published : true,
    deleted_at: null,
    purge_after: null,
    updated_at: updatedAt,
  };
}

function safeText(value: unknown) {
  return typeof value === 'string' ? value : '';
}
