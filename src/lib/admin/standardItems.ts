export type StandardItemUpsertInput = {
  id: unknown;
  title: unknown;
  altText?: unknown;
  imageUrl?: unknown;
  hoverImageUrl?: unknown;
  assetAltText?: unknown;
  sortOrder?: unknown;
  published?: unknown;
};

export type StandardItemUpsertRow = {
  id: string;
  title: string;
  image_url: string | null;
  image_alt: string;
  hover_image_url?: string;
  sort_order: number;
  published: boolean;
  deleted_at: null;
  purge_after: null;
  updated_at: string;
};

export function buildStandardItemUpsertRow(input: StandardItemUpsertInput, updatedAt = new Date().toISOString()): StandardItemUpsertRow {
  const title = safeText(input.title).trim();
  const imageUrl = safeText(input.imageUrl).trim();
  const hoverImageUrl = safeText(input.hoverImageUrl).trim();

  return {
    id: safeText(input.id).trim(),
    title,
    image_url: imageUrl || null,
    image_alt: safeText(input.altText).trim() || safeText(input.assetAltText).trim() || title,
    ...(hoverImageUrl ? { hover_image_url: hoverImageUrl } : {}),
    sort_order: Number.isFinite(input.sortOrder) ? Number(input.sortOrder) : 10,
    published: typeof input.published === 'boolean' ? input.published : true,
    deleted_at: null,
    purge_after: null,
    updated_at: updatedAt,
  };
}

export function deriveStandardItemIdentity(input: {
  id?: unknown;
  title?: unknown;
  altText?: unknown;
  assetLabel?: unknown;
  fallbackSuffix?: unknown;
}) {
  const existingId = safeText(input.id).trim();
  const title = safeText(input.title).trim() || safeText(input.altText).trim() || safeText(input.assetLabel).trim() || 'Standard item';
  const fallbackId = `standard-${safeText(input.fallbackSuffix).trim() || 'item'}`;
  const id = existingId || slugify(title) || fallbackId;

  return { id, title };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function safeText(value: unknown) {
  return typeof value === 'string' ? value : '';
}
