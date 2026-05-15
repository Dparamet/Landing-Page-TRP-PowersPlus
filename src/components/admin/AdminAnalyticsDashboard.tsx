'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

const RANGE_OPTIONS = [
  { id: '24h', label: '24 ชั่วโมง', durationMs: 24 * 60 * 60 * 1000 },
  { id: '7d', label: '7 วัน', durationMs: 7 * 24 * 60 * 60 * 1000 },
  { id: '30d', label: '30 วัน', durationMs: 30 * 24 * 60 * 60 * 1000 },
  { id: '90d', label: '90 วัน', durationMs: 90 * 24 * 60 * 60 * 1000 },
  { id: 'custom', label: 'กำหนดเอง', durationMs: 0 },
];

type WebEventRow = {
  event_type: 'page_view' | 'click' | 'form_submit';
  path: string;
  page_url: string;
  referrer: string | null;
  element_tag: string | null;
  element_text: string | null;
  element_id: string | null;
  element_href: string | null;
  form_id: string | null;
  form_name: string | null;
  form_action: string | null;
  session_id: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string | null;
};

type DailyPoint = {
  date: string;
  count: number;
};

type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; events: WebEventRow[] }
  | { status: 'error'; message: string };

function formatNumber(value: number) {
  return new Intl.NumberFormat('th-TH').format(value);
}

function formatDateInput(value: Date) {
  return value.toISOString().slice(0, 10);
}

function parseDateInput(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function formatDayLabel(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' });
}

function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildDailySeries(events: WebEventRow[], start: Date, end: Date, eventType: WebEventRow['event_type']) {
  const map = new Map<string, number>();
  const startDate = new Date(start);
  const endDate = new Date(end);

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  for (const event of events) {
    if (event.event_type !== eventType || !event.created_at) continue;
    const date = new Date(event.created_at);
    if (Number.isNaN(date.getTime())) continue;
    const key = toLocalDateKey(date);
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  const points: DailyPoint[] = [];
  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    const key = toLocalDateKey(cursor);
    points.push({ date: key, count: map.get(key) ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  return points;
}

function getSourceLabel(event: WebEventRow) {
  if (event.utm_source) {
    return event.utm_medium ? `${event.utm_source} (${event.utm_medium})` : event.utm_source;
  }

  if (!event.referrer) return 'Direct';

  try {
    const hostname = new URL(event.referrer).hostname.replace('www.', '');
    if (hostname.includes('google.')) return 'Google';
    if (hostname.includes('facebook.')) return 'Facebook';
    if (hostname.includes('instagram.')) return 'Instagram';
    if (hostname.includes('line.me')) return 'LINE';
    return hostname;
  } catch {
    return 'Referral';
  }
}

function groupByCount<T>(items: T[], getKey: (item: T) => string | null) {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = getKey(item);
    if (!key) continue;
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-card rounded-lg border border-[#f08a24]/40 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-[#0f2a5f]">{value}</p>
    </div>
  );
}

function ListCard({ title, items, empty }: { title: string; items: Array<{ label: string; count: number }>; empty: string }) {
  return (
    <div className="admin-card rounded-lg border border-[#f08a24]/40 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-black text-[#0f2a5f]">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.label} className="flex items-center justify-between gap-4">
              <span className="text-slate-700">{item.label}</span>
              <span className="rounded-full bg-[#0f2a5f]/10 px-2 py-1 text-xs font-semibold text-[#0f2a5f]">
                {formatNumber(item.count)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ChartToggle({ active, onChange }: { active: string; onChange: (value: string) => void }) {
  const tabs = [
    { id: 'pageViews', label: 'Page Views รายวัน' },
    { id: 'clicks', label: 'คลิกปุ่มรายวัน' },
    { id: 'sources', label: 'แหล่งที่มา' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
              selected
                ? 'border-[#f08a24] bg-[#fff7ed] text-[#b85c00]'
                : 'border-slate-200 bg-white text-slate-600 hover:border-[#f08a24] hover:text-[#b85c00]'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function LineChart({ points }: { points: DailyPoint[] }) {
  if (points.length === 0) {
    return <p className="text-sm text-slate-500">ยังไม่มีข้อมูลในช่วงเวลานี้</p>;
  }

  const max = Math.max(...points.map((point) => point.count), 1);
  const width = 640;
  const height = 180;
  const padding = 24;
  const step = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;
  const path = points
    .map((point, index) => {
      const x = padding + index * step;
      const y = padding + (1 - point.count / max) * (height - padding * 2);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-40 w-full" aria-hidden="true">
        <path d={path} fill="none" stroke="#f08a24" strokeWidth="3" />
        {points.map((point, index) => {
          const x = padding + index * step;
          const y = padding + (1 - point.count / max) * (height - padding * 2);
          return <circle key={point.date} cx={x} cy={y} r="4" fill="#0f2a5f" />;
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
        {points.map((point) => (
          <span key={point.date} className="rounded-full bg-slate-100 px-2 py-1">
            {formatDayLabel(point.date)}: {formatNumber(point.count)}
          </span>
        ))}
      </div>
    </div>
  );
}

function BarChart({ points }: { points: DailyPoint[] }) {
  if (points.length === 0) {
    return <p className="text-sm text-slate-500">ยังไม่มีข้อมูลในช่วงเวลานี้</p>;
  }

  const max = Math.max(...points.map((point) => point.count), 1);

  return (
    <div className="grid gap-2">
      {points.map((point) => (
        <div key={point.date} className="grid grid-cols-[90px_1fr_60px] items-center gap-2 text-xs">
          <span className="text-slate-500">{formatDayLabel(point.date)}</span>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#0f2a5f]"
              style={{ width: `${(point.count / max) * 100}%` }}
            />
          </div>
          <span className="text-right font-semibold text-[#0f2a5f]">{formatNumber(point.count)}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ items }: { items: Array<{ label: string; count: number }> }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">ยังไม่มีข้อมูลแหล่งที่มาในช่วงเวลานี้</p>;
  }

  const total = items.reduce((sum, item) => sum + item.count, 0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const colors = ['#0f2a5f', '#f08a24', '#1e4f8f', '#f59e0b', '#334155', '#94a3b8', '#38bdf8', '#22c55e'];
  const segments = items.reduce(
    (acc, item, index) => {
      const value = item.count / total;
      const length = value * circumference;
      acc.items.push({
        item,
        index,
        strokeDasharray: `${length} ${circumference - length}`,
        strokeDashoffset: -acc.offset,
      });
      return { offset: acc.offset + length, items: acc.items };
    },
    {
      offset: 0,
      items: [] as Array<{
        item: { label: string; count: number };
        index: number;
        strokeDasharray: string;
        strokeDashoffset: number;
      }>,
    },
  ).items;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <svg viewBox="0 0 200 200" className="h-44 w-44">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="22" />
        {segments.map(({ item, index, strokeDasharray, strokeDashoffset }) => {
          return (
            <circle
              key={item.label}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={colors[index % colors.length]}
              strokeWidth="22"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div className="grid gap-2 text-sm">
        {items.map((item, index) => (
          <div key={item.label} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-slate-700">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
              {item.label}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {formatNumber(item.count)} ({Math.round((item.count / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminAnalyticsDashboard() {
  const [range, setRange] = useState('7d');
  const [customStart, setCustomStart] = useState(() => formatDateInput(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)));
  const [customEnd, setCustomEnd] = useState(() => formatDateInput(new Date()));
  const [state, setState] = useState<LoadState>({ status: 'idle' });
  const [activeChart, setActiveChart] = useState('pageViews');

  const rangeInfo = useMemo(() => {
    if (range === 'custom') {
      const start = parseDateInput(customStart);
      const end = parseDateInput(customEnd);
      return { start, end };
    }

    const option = RANGE_OPTIONS.find((item) => item.id === range) ?? RANGE_OPTIONS[1];
    const end = new Date();
    const start = new Date(end.getTime() - option.durationMs);
    return { start, end };
  }, [range, customStart, customEnd]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      queueMicrotask(() => setState({ status: 'error', message: 'ยังไม่ได้ตั้งค่า Supabase' }));
      return;
    }

    if (!rangeInfo.start || !rangeInfo.end) {
      queueMicrotask(() => setState({ status: 'error', message: 'กรุณาเลือกช่วงวันที่ให้ครบ' }));
      return;
    }

    const client = supabase;
    const start = rangeInfo.start;
    const end = rangeInfo.end;
    let isMounted = true;

    async function loadEvents() {
      setState({ status: 'loading' });

      const { data, error } = await client
        .from('web_events')
        .select(
          'event_type, path, page_url, referrer, element_tag, element_text, element_id, element_href, form_id, form_name, form_action, session_id, utm_source, utm_medium, utm_campaign, created_at'
        )
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at', { ascending: false });

      if (!isMounted) return;

      if (error) {
        setState({ status: 'error', message: error.message });
        return;
      }

      setState({ status: 'ready', events: data ?? [] });
    }

    void loadEvents();

    return () => {
      isMounted = false;
    };
  }, [rangeInfo]);

  const metrics = useMemo(() => {
    if (state.status !== 'ready') return null;
    const events = state.events;
    const pageViews = events.filter((event) => event.event_type === 'page_view');
    const clicks = events.filter((event) => event.event_type === 'click');
    const forms = events.filter((event) => event.event_type === 'form_submit');

    const uniqueSessions = new Set(
      events.map((event) => event.session_id).filter((sessionId): sessionId is string => Boolean(sessionId))
    );

    const topPages = groupByCount(pageViews, (event) => event.path);
    const topSources = groupByCount(pageViews, (event) => getSourceLabel(event));

    const topButtons = groupByCount(
      clicks.filter((event) => event.element_tag === 'button' || event.element_tag === 'a'),
      (event) => event.element_text || event.element_id || event.element_href
    );

    const topForms = groupByCount(forms, (event) => event.form_id || event.form_name || event.form_action || '(ไม่ระบุ)');

    const start = rangeInfo.start ?? new Date();
    const end = rangeInfo.end ?? new Date();

    return {
      pageViews: pageViews.length,
      clicks: clicks.length,
      forms: forms.length,
      visitors: uniqueSessions.size,
      topPages,
      topSources,
      topButtons,
      topForms,
      pageViewSeries: buildDailySeries(pageViews, start, end, 'page_view'),
      clickSeries: buildDailySeries(clicks, start, end, 'click'),
    };
  }, [state, rangeInfo.end, rangeInfo.start]);

  return (
    <div className="space-y-5">
      <div className="admin-card rounded-lg border border-[#f08a24]/40 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-black text-[#0f2a5f]">สรุปการเคลื่อนไหว</h3>
            <p className="mt-1 text-sm text-slate-600">แสดงข้อมูลตามช่วงเวลาที่เลือก</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={range}
              onChange={(event) => setRange(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-[#0f2a5f]"
            >
              {RANGE_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            {range === 'custom' && (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  value={customStart}
                  onChange={(event) => setCustomStart(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <span className="text-sm text-slate-500">ถึง</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(event) => setCustomEnd(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {state.status === 'loading' && (
        <div className="admin-card rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">กำลังโหลดข้อมูล...</div>
      )}

      {state.status === 'error' && (
        <div className="admin-card rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">{state.message}</div>
      )}

      {state.status === 'ready' && metrics && (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="ผู้เข้าชม (Session)" value={formatNumber(metrics.visitors)} />
            <StatCard label="Page Views" value={formatNumber(metrics.pageViews)} />
            <StatCard label="คลิกปุ่ม" value={formatNumber(metrics.clicks)} />
            <StatCard label="ส่งฟอร์ม" value={formatNumber(metrics.forms)} />
          </div>

          <div className="admin-card rounded-lg border border-[#f08a24]/40 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-black text-[#0f2a5f]">กราฟสรุป</h3>
                <p className="mt-1 text-xs text-slate-500">เลือกดูตามประเภทข้อมูล</p>
              </div>
              <ChartToggle active={activeChart} onChange={setActiveChart} />
            </div>
            <div className="mt-4">
              {activeChart === 'pageViews' ? <LineChart points={metrics.pageViewSeries} /> : null}
              {activeChart === 'clicks' ? <BarChart points={metrics.clickSeries} /> : null}
              {activeChart === 'sources' ? <DonutChart items={metrics.topSources} /> : null}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <ListCard title="หน้าเว็บยอดนิยม" items={metrics.topPages} empty="ยังไม่มี page views ในช่วงเวลานี้" />
            <ListCard title="แหล่งที่มา" items={metrics.topSources} empty="ยังไม่มีข้อมูลแหล่งที่มา" />
            <ListCard title="ปุ่มที่ถูกคลิก" items={metrics.topButtons} empty="ยังไม่มีคลิกในช่วงเวลานี้" />
            <ListCard title="ฟอร์มที่ถูกส่ง" items={metrics.topForms} empty="ยังไม่มีการส่งฟอร์ม" />
          </div>
        </div>
      )}
    </div>
  );
}
