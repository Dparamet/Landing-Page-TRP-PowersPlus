'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCookieConsent } from '@/context/CookieConsentContext';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Json } from '@/lib/supabase/database.types';

const SESSION_STORAGE_KEY = 'trp-analytics-session';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const MAX_TEXT_LENGTH = 140;

const IGNORED_PATH_PREFIXES = ['/admin'];

type SessionData = {
  id: string;
  lastSeen: number;
};

type AnalyticsEventPayload = {
  event_type: 'page_view' | 'click' | 'form_submit';
  page_url: string;
  path: string;
  referrer: string | null;
  element_tag?: string | null;
  element_text?: string | null;
  element_id?: string | null;
  element_href?: string | null;
  form_id?: string | null;
  form_name?: string | null;
  form_action?: string | null;
  session_id?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  user_agent?: string | null;
  metadata?: Json;
};

function safeText(input: string | null | undefined) {
  if (!input) return null;
  const trimmed = input.replace(/\s+/g, ' ').trim();
  if (!trimmed) return null;
  return trimmed.length > MAX_TEXT_LENGTH ? trimmed.slice(0, MAX_TEXT_LENGTH) : trimmed;
}

function shouldTrackPath(pathname: string) {
  return !IGNORED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function getOrCreateSessionId() {
  if (typeof localStorage === 'undefined') return null;

  const now = Date.now();
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SessionData;
      if (parsed.id && now - parsed.lastSeen < SESSION_TIMEOUT_MS) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ ...parsed, lastSeen: now }));
        return parsed.id;
      }
    }
  } catch {
    // ignore corrupted session storage
  }

  const id = crypto.randomUUID();
  const session: SessionData = { id, lastSeen: now };
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  return id;
}

function getUtmParams() {
  if (typeof window === 'undefined') return { utm_source: null, utm_medium: null, utm_campaign: null };
  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: safeText(params.get('utm_source')),
    utm_medium: safeText(params.get('utm_medium')),
    utm_campaign: safeText(params.get('utm_campaign')),
  };
}

function getElementLabel(element: Element) {
  return (
    safeText(element.getAttribute('data-analytics-label')) ||
    safeText(element.getAttribute('aria-label')) ||
    safeText(element.getAttribute('title')) ||
    safeText(element.textContent)
  );
}

function isIgnoredElement(element: Element) {
  return Boolean(element.closest('[data-analytics-ignore="true"]'));
}

async function sendEvent(payload: AnalyticsEventPayload) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  await supabase.from('web_events').insert(payload);
}

export default function AnalyticsTracker() {
  const { consent } = useCookieConsent();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = useMemo(() => searchParams?.toString() ?? '', [searchParams]);

  useEffect(() => {
    if (!consent.analytics) return;
    if (typeof window === 'undefined') return;
    if (!shouldTrackPath(pathname)) return;
    if (navigator.doNotTrack === '1') return;

    const pageUrl = search ? `${window.location.pathname}?${search}` : window.location.pathname;
    const sessionId = getOrCreateSessionId();
    const { utm_source, utm_medium, utm_campaign } = getUtmParams();

    void sendEvent({
      event_type: 'page_view',
      page_url: pageUrl,
      path: window.location.pathname,
      referrer: document.referrer || null,
      session_id: sessionId,
      utm_source,
      utm_medium,
      utm_campaign,
      user_agent: navigator.userAgent,
    });
  }, [consent.analytics, pathname, search]);

  useEffect(() => {
    if (!consent.analytics) return;
    if (typeof window === 'undefined') return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      if (!shouldTrackPath(window.location.pathname)) return;

      const clickable = target.closest('button, a');
      if (!clickable || isIgnoredElement(clickable)) return;

      const tag = clickable.tagName.toLowerCase();
      const href = tag === 'a' ? safeText((clickable as HTMLAnchorElement).getAttribute('href')) : null;
      const label = getElementLabel(clickable);

      void sendEvent({
        event_type: 'click',
        page_url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer || null,
        element_tag: tag,
        element_text: label,
        element_id: safeText(clickable.getAttribute('id')),
        element_href: href,
        session_id: getOrCreateSessionId(),
        user_agent: navigator.userAgent,
      });
    };

    const handleSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement | null;
      if (!form || form.tagName.toLowerCase() !== 'form') return;
      if (!shouldTrackPath(window.location.pathname)) return;
      if (isIgnoredElement(form)) return;

      void sendEvent({
        event_type: 'form_submit',
        page_url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer || null,
        form_id: safeText(form.getAttribute('id')),
        form_name: safeText(form.getAttribute('name')),
        form_action: safeText(form.getAttribute('action')),
        session_id: getOrCreateSessionId(),
        user_agent: navigator.userAgent,
      });
    };

    document.addEventListener('click', handleClick, true);
    document.addEventListener('submit', handleSubmit, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('submit', handleSubmit, true);
    };
  }, [consent.analytics]);

  return null;
}
