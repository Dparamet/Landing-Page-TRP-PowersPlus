export const MEDIA_BUCKET = 'site-media';
export const MEDIA_OUTPUT_MIME = 'image/webp';
export const MEDIA_MAX_SOURCE_BYTES = 20 * 1024 * 1024;
export const MEDIA_MAX_OUTPUT_DIMENSION = 1920;
export const MEDIA_WEBP_QUALITY = 0.82;

const allowedSourceTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export type MediaValidationResult =
  | { ok: true }
  | { ok: false; message: string };

export function validateMediaFile(file: { type: string; size: number }): MediaValidationResult {
  if (!allowedSourceTypes.has(file.type)) {
    return { ok: false, message: 'รองรับเฉพาะไฟล์ JPG, PNG หรือ WebP' };
  }

  if (file.size > MEDIA_MAX_SOURCE_BYTES) {
    return { ok: false, message: 'ไฟล์ต้นฉบับต้องไม่เกิน 20MB' };
  }

  return { ok: true };
}

export function slugifyFileName(fileName: string): string {
  const baseName = fileName.replace(/\.[^.]+$/, '');
  const slug = baseName
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return slug || 'image';
}

export function buildMediaStoragePath(fileName: string, now = new Date()): string {
  const datePath = now.toISOString().slice(0, 10);
  const stamp = now.getTime();

  return `uploads/${datePath}/${stamp}-${slugifyFileName(fileName)}.webp`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function scaleImageSize(width: number, height: number, maxDimension = MEDIA_MAX_OUTPUT_DIMENSION) {
  const largestSide = Math.max(width, height);

  if (largestSide <= maxDimension) {
    return { width, height };
  }

  const ratio = maxDimension / largestSide;

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}
