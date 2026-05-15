'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

import ConfirmResetButton from '@/components/admin/ConfirmResetButton';
import { createBlankSiteTextForm, mapSiteTextFormToUpsert, mapSiteTextToForm, validateSiteTextForm, type SiteTextFormValues } from '@/lib/admin/siteTexts';
import { formatSiteTextError } from '@/lib/admin/databaseErrors';
import { requestPreviewRefresh } from '@/lib/admin/previewRefresh';
import { mapSiteTextRowList, type SiteText, type SiteTextRow } from '@/lib/siteTexts';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import en from '@/locales/en.json';
import th from '@/locales/th.json';

type SaveStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#f08a24] focus:ring-2 focus:ring-[#f08a24]/20';

const defaultHeroSiteTexts = [
  { key: 'hero.eyebrow', th: th.hero.eyebrow, en: en.hero.eyebrow },
  { key: 'hero.title', th: th.hero.title, en: en.hero.title },
  { key: 'hero.subtitle', th: th.hero.subtitle, en: en.hero.subtitle },
  { key: 'hero.description', th: th.hero.description, en: en.hero.description },
  { key: 'hero.cta', th: th.hero.cta, en: en.hero.cta },
  { key: 'hero.trust.engineers', th: th.hero.trust.engineers, en: en.hero.trust.engineers },
  { key: 'hero.trust.warranty', th: th.hero.trust.warranty, en: en.hero.trust.warranty },
  { key: 'hero.trust.survey', th: th.hero.trust.survey, en: en.hero.trust.survey },
];

export default function SiteTextManager() {
  const [items, setItems] = useState<SiteText[]>([]);
  const [values, setValues] = useState<SiteTextFormValues>(createBlankSiteTextForm());
  const [status, setStatus] = useState<SaveStatus>('loading');
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) => item.key.toLowerCase().includes(keyword) || item.value.th.toLowerCase().includes(keyword));
  }, [items, query]);

  useEffect(() => {
    void loadSiteTexts();
  }, []);

  async function loadSiteTexts() {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    const { data, error } = await supabase.from('site_texts').select('*').order('key', { ascending: true });

    if (error) {
      setStatus('error');
      setMessage('โหลดข้อความเว็บไม่สำเร็จ ให้รัน migration 202605100009_site_texts_and_process_steps.sql ก่อน');
      return;
    }

    const nextItems = mapSiteTextRowList((data as SiteTextRow[] | null) ?? [], true).sort((a, b) => a.key.localeCompare(b.key));

    setItems(nextItems);
    setValues(nextItems[0] ? mapSiteTextToForm(nextItems[0]) : createBlankSiteTextForm());
    setStatus('idle');
    setMessage('');
    requestPreviewRefresh();
  }

  function updateField<K extends keyof SiteTextFormValues>(field: K, value: SiteTextFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateSiteTextForm(values);

    if (!validation.ok) {
      setStatus('error');
      setMessage(validation.message);
      return;
    }

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    setStatus('saving');
    setMessage('');

    const { error } = await supabase.from('site_texts').upsert(mapSiteTextFormToUpsert(validation.value), { onConflict: 'key' });

    if (error) {
      setStatus('error');
      setMessage(formatSiteTextError(error));
      return;
    }

    setStatus('saved');
    setMessage('บันทึกข้อความแล้ว รีเฟรชหน้าเว็บเพื่อดูผลล่าสุด');
    await loadSiteTexts();
    requestPreviewRefresh();
  }

  async function resetHeroTexts() {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    setStatus('saving');
    setMessage('');

    const { error } = await supabase.from('site_texts').upsert(
      defaultHeroSiteTexts.map((item) => ({
        key: item.key,
        value: { th: item.th, en: item.en },
        deleted_at: null,
        purge_after: null,
        updated_at: new Date().toISOString(),
      })),
      { onConflict: 'key' },
    );

    if (error) {
      setStatus('error');
      setMessage(formatSiteTextError(error));
      return;
    }

    setStatus('saved');
    setMessage('ตั้งค่า Hero เป็นค่าเริ่มต้นแล้ว');
    await loadSiteTexts();
    requestPreviewRefresh();
  }

  return (
    <section className="admin-card rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-[#0f2a5f]">ข้อความหน้าเว็บ</h2>
          <p className="mt-1 text-sm text-slate-600">แก้ข้อความหลักของหน้าเว็บ เช่น Hero, Section title, Footer และ CTA</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ConfirmResetButton
            title="ตั้งค่า Hero เริ่มต้น"
            description="ระบบจะคืนข้อความ Hero, CTA และ trust badges เป็นค่าเริ่มต้นจากไฟล์ภาษา"
            disabled={status === 'saving' || status === 'loading'}
            onConfirm={resetHeroTexts}
          />
          <button
            type="submit"
            form="site-text-manager-form"
            disabled={status === 'saving' || status === 'loading'}
            className="rounded-lg bg-[#0f2a5f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#061a3d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'saving' ? 'กำลังบันทึก...' : 'บันทึกข้อความ'}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ค้นหา key หรือข้อความ"
            className={inputClass}
          />
          <div className="mt-3 grid max-h-[520px] gap-2 overflow-y-auto pr-1">
            {filteredItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setValues(mapSiteTextToForm(item));
                  setMessage('');
                }}
                className={`rounded-lg border p-3 text-left transition ${
                  values.key === item.key ? 'border-[#0f2a5f] bg-[#0f2a5f] text-white' : 'border-slate-200 bg-slate-50 text-[#0f2a5f]'
                }`}
              >
                <span className="block text-xs font-black uppercase tracking-wide">{item.key}</span>
                <span className={`mt-1 block text-sm ${values.key === item.key ? 'text-blue-100' : 'text-slate-600'}`}>{item.value.th}</span>
              </button>
            ))}
          </div>
        </div>

        <form id="site-text-manager-form" onSubmit={handleSubmit} className="grid gap-4" noValidate>
          <Field label="Key" value={values.key} onChange={(value) => updateField('key', value)} readOnly />
          <Textarea label="ข้อความ ภาษาไทย" value={values.textTh} onChange={(value) => updateField('textTh', value)} />
          <Textarea label="ข้อความ ภาษาอังกฤษ" value={values.textEn} onChange={(value) => updateField('textEn', value)} />
        </form>
      </div>

      {message ? (
        <p
          role={status === 'error' ? 'alert' : 'status'}
          className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
            status === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {message}
        </p>
      ) : null}
    </section>
  );
}

function Field({ label, value, onChange, readOnly = false }: { label: string; value: string; onChange: (value: string) => void; readOnly?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-slate-800">
      {label}
      <input value={value} readOnly={readOnly} onChange={(event) => onChange(event.target.value)} className={`${inputClass} mt-2 ${readOnly ? 'bg-slate-100 text-slate-500' : ''}`} />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-semibold text-slate-800">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className={`${inputClass} mt-2 min-h-28 resize-y`} />
    </label>
  );
}
