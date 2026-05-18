export const ADMIN_PREVIEW_REFRESH_EVENT = 'trp-admin-preview-refresh';

let pendingPreviewRefresh = 0;

export function requestPreviewRefresh() {
  if (typeof window === 'undefined') return;
  if (pendingPreviewRefresh) return;

  pendingPreviewRefresh = window.setTimeout(() => {
    pendingPreviewRefresh = 0;
    window.dispatchEvent(new Event(ADMIN_PREVIEW_REFRESH_EVENT));
  }, 120);
}
