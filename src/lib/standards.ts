export type StandardItemRow = {
  id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  image_alt?: string | null;
  alt_text?: string | null;
  hover_image_url?: string | null;
  media_asset_id?: string | null;
  hover_media_asset_id?: string | null;
  sort_order: number | null;
  published: boolean | null;
  deleted_at?: string | null;
  purge_after?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type StandardItem = {
  id: string;
  title: string;
  imageUrl: string | null;
  hoverImageUrl: string | null;
  altText: string;
  sortOrder: number;
  published: boolean;
  deletedAt: string | null;
  purgeAfter: string | null;
};

export const fallbackStandardItems: StandardItem[] = [
  { id: 'homeowners', title: 'Home Owners', imageUrl: null, hoverImageUrl: null, altText: 'Residential clients', sortOrder: 10, published: true, deletedAt: null, purgeAfter: null },
  { id: 'commercial-buildings', title: 'Commercial', imageUrl: null, hoverImageUrl: null, altText: 'Commercial building clients', sortOrder: 20, published: true, deletedAt: null, purgeAfter: null },
  { id: 'factories', title: 'Factories', imageUrl: null, hoverImageUrl: null, altText: 'Factory and industrial clients', sortOrder: 30, published: true, deletedAt: null, purgeAfter: null },
  { id: 'developers', title: 'Developers', imageUrl: null, hoverImageUrl: null, altText: 'Property developer partners', sortOrder: 40, published: true, deletedAt: null, purgeAfter: null },
  { id: 'contractors', title: 'Contractors', imageUrl: null, hoverImageUrl: null, altText: 'Contractor partners', sortOrder: 50, published: true, deletedAt: null, purgeAfter: null },
  { id: 'businesses', title: 'Businesses', imageUrl: null, hoverImageUrl: null, altText: 'Business clients', sortOrder: 60, published: true, deletedAt: null, purgeAfter: null },
];

export function mapStandardItemRows(rows: StandardItemRow[], fallback = fallbackStandardItems, includeDeleted = false): StandardItem[] {
  const mappedRows = rows
    .filter((row) => includeDeleted || !row.deleted_at)
    .filter((row) => includeDeleted || row.published)
    .map((row) => ({
      id: row.id,
      title: row.title,
      imageUrl: row.image_url ?? null,
      hoverImageUrl: row.hover_image_url ?? null,
      altText: getStandardItemAltText(row),
      sortOrder: row.sort_order ?? 0,
      published: row.published ?? true,
      deletedAt: row.deleted_at ?? null,
      purgeAfter: row.purge_after ?? null,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));

  return mappedRows.length > 0 ? mappedRows : fallback;
}

export function getStandardItemAltText(row: StandardItemRow) {
  return safeText(row.alt_text) || safeText(row.image_alt) || row.title;
}

function safeText(value: unknown) {
  return typeof value === 'string' ? value : '';
}
