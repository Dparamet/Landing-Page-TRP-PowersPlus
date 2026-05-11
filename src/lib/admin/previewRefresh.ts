export const ADMIN_PREVIEW_REFRESH_EVENT = 'trp-admin-preview-refresh';

export function requestPreviewRefresh() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(ADMIN_PREVIEW_REFRESH_EVENT));
}
