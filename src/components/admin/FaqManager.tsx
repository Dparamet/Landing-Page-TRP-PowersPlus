'use client';

import { FormEvent, useEffect, useState } from 'react';

import {
  createBlankFaqForm,
  mapFaqFormToInsert,
  mapFaqFormToUpdate,
  mapFaqItemToForm,
  validateFaqForm,
  type FaqFormValues,
} from '@/lib/admin/faqs';
import { formatAdminLoadError, formatAdminRpcError, formatAdminSaveError } from '@/lib/admin/databaseErrors';
import { requestPreviewRefresh } from '@/lib/admin/previewRefresh';
import { buildDefaultFaqItems, mapFaqRows, type FaqItem, type FaqRow } from '@/lib/faqs';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import en from '@/locales/en.json';
import th from '@/locales/th.json';
import SortOrderControls from './SortOrderControls';

type SaveStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

const fallbackFaqs = buildDefaultFaqItems(th.faq.questions, en.faq.questions);

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#f08a24] focus:ring-2 focus:ring-[#f08a24]/20';

export default function FaqManager() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [values, setValues] = useState<FaqFormValues>(createBlankFaqForm(10));
  const [status, setStatus] = useState<SaveStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    void loadFaqs();
  }, []);

  async function loadFaqs() {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    const { data, error } = await supabase.from('faq_items').select('*').order('sort_order', { ascending: true });

    if (error) {
      setStatus('error');
      setMessage(formatAdminLoadError('FAQ', 'faq_items', error));
      return;
    }

    const nextItems = mapFaqRows((data as FaqRow[] | null) ?? [], fallbackFaqs, true);
    setItems(nextItems);
    setValues(nextItems[0] ? mapFaqItemToForm(nextItems[0]) : createBlankFaqForm(10));
    setStatus('idle');
    setMessage('');
    requestPreviewRefresh();
  }

  function updateField<K extends keyof FaqFormValues>(field: K, value: FaqFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function startNewFaq() {
    const nextSortOrder = items.reduce((max, item) => Math.max(max, item.sortOrder), 0) + 10;
    setValues(createBlankFaqForm(nextSortOrder));
    setMessage('');
  }

  function selectFaq(item: FaqItem) {
    setValues(mapFaqItemToForm(item));
    setMessage('');
  }

  async function moveSelectedFaq(direction: -1 | 1) {
    const currentIndex = items.findIndex((item) => item.id === values.id);
    const targetIndex = currentIndex + direction;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= items.length) {
      return;
    }

    const reorderedItems = [...items];
    const [selectedItem] = reorderedItems.splice(currentIndex, 1);
    reorderedItems.splice(targetIndex, 0, selectedItem);

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    setStatus('saving');
    setMessage('');

    for (const [index, item] of reorderedItems.entries()) {
      const form = { ...mapFaqItemToForm(item), sortOrder: (index + 1) * 10 };
      const itemId = await ensureFaqRow(form);

      if (!itemId) {
        setStatus('error');
        setMessage('สร้าง FAQ เพื่อบันทึกลำดับไม่สำเร็จ');
        return;
      }

      const { error } = await supabase.from('faq_items').update({ sort_order: form.sortOrder, updated_at: new Date().toISOString() }).eq('id', itemId);

      if (error) {
        setStatus('error');
        setMessage(formatAdminSaveError('FAQ', 'faq_items', error));
        return;
      }
    }

    setStatus('saved');
    setMessage(direction < 0 ? 'ขยับ FAQ ขึ้นแล้ว' : 'ขยับ FAQ ลงแล้ว');
    await loadFaqs();
    requestPreviewRefresh();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateFaqForm(values);

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

    const saveQuery = validation.value.id
      ? supabase.from('faq_items').update(mapFaqFormToUpdate(validation.value)).eq('id', validation.value.id)
      : supabase.from('faq_items').insert(mapFaqFormToInsert(validation.value));
    const { error } = await saveQuery;

    if (error) {
      setStatus('error');
      setMessage(formatAdminSaveError('FAQ', 'faq_items', error));
      return;
    }

    setStatus('saved');
    setMessage('บันทึก FAQ แล้ว');
    await loadFaqs();
    requestPreviewRefresh();
  }

  async function softDeleteFaq() {
    if (!values.id) return;

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    setStatus('saving');
    setMessage('');

    const { error } = await supabase.rpc('soft_delete_faq_item', {
      item_id: values.id,
      retention_days: 30,
    });

    if (error) {
      setStatus('error');
      setMessage(formatAdminRpcError('ลบ FAQ', 'soft_delete_faq_item', error));
      return;
    }

    setStatus('saved');
    setMessage('ย้าย FAQ ไปถังพักแล้ว สามารถกู้คืนได้ภายใน 30 วัน');
    await loadFaqs();
    requestPreviewRefresh();
  }

  async function restoreFaq() {
    if (!values.id) return;

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    setStatus('saving');
    setMessage('');

    const { error } = await supabase.rpc('restore_faq_item', {
      item_id: values.id,
    });

    if (error) {
      setStatus('error');
      setMessage(formatAdminRpcError('กู้คืน FAQ', 'restore_faq_item', error));
      return;
    }

    setStatus('saved');
    setMessage('กู้คืน FAQ แล้ว');
    await loadFaqs();
    requestPreviewRefresh();
  }

  async function hardDeleteFaq() {
    if (!values.id) return;

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    setStatus('saving');
    setMessage('');

    const { error } = await supabase.rpc('hard_delete_faq_item', {
      item_id: values.id,
    });

    if (error) {
      setStatus('error');
      setMessage(formatAdminRpcError('ลบถาวร FAQ', 'hard_delete_faq_item', error));
      return;
    }

    setStatus('saved');
    setMessage('ลบถาวร FAQ แล้ว');
    await loadFaqs();
    requestPreviewRefresh();
  }

  const activeIndex = items.findIndex((item) => item.id === values.id);
  const isBusy = status === 'loading' || status === 'saving';

  return (
    <section className="admin-card rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-[#0f2a5f]">คำถามที่พบบ่อย</h2>
          <p className="mt-1 text-sm text-slate-600">เพิ่ม แก้ไข และซ่อนคำถามในหน้า FAQ</p>
        </div>
        <button type="button" onClick={startNewFaq} disabled={status === 'saving'} className="rounded-lg bg-[#0f2a5f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#061a3d] disabled:cursor-not-allowed disabled:opacity-60">
          เพิ่มคำถาม
        </button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-2">
          {items.length === 0 ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              ยังไม่มี FAQ ใน database ให้รัน migration 202605100007_faq_items.sql ก่อน
            </p>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectFaq(item)}
                className={`rounded-lg border p-3 text-left transition ${
                  values.id === item.id ? 'border-[#0f2a5f] bg-[#0f2a5f] text-white' : 'border-slate-200 bg-slate-50 text-[#0f2a5f]'
                }`}
              >
                <span className="block text-sm font-bold">{item.question.th}</span>
                <span className={`mt-1 block text-xs ${values.id === item.id ? 'text-blue-100' : 'text-slate-500'}`}>
                  ลำดับที่ {item.sortOrder} · {item.deletedAt ? `ถังพัก ลบจริงหลัง ${item.purgeAfter ?? '-'}` : item.published ? 'แสดงอยู่' : 'ซ่อนอยู่'}
                </span>
              </button>
            ))
          )}
        </div>

        <form id="faq-manager-form" onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2" noValidate>
          <Field label="คำถาม ภาษาไทย" value={values.questionTh} onChange={(value) => updateField('questionTh', value)} />
          <Field label="คำถาม ภาษาอังกฤษ" value={values.questionEn} onChange={(value) => updateField('questionEn', value)} />
          <Textarea label="คำตอบ ภาษาไทย" value={values.answerTh} onChange={(value) => updateField('answerTh', value)} />
          <Textarea label="คำตอบ ภาษาอังกฤษ" value={values.answerEn} onChange={(value) => updateField('answerEn', value)} />
          <SortOrderControls
            canMoveUp={activeIndex > 0}
            canMoveDown={activeIndex >= 0 && activeIndex < items.length - 1}
            disabled={isBusy}
            onMoveUp={() => void moveSelectedFaq(-1)}
            onMoveDown={() => void moveSelectedFaq(1)}
          />
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={values.published}
              onChange={(event) => updateField('published', event.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            แสดงบนหน้าเว็บ
          </label>
          <div className="flex flex-col gap-2 sm:flex-row md:col-span-2">
            <button type="submit" disabled={status === 'saving' || status === 'loading'} className="rounded-lg bg-[#0f2a5f] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#061a3d] disabled:cursor-not-allowed disabled:opacity-60">
              {status === 'saving' ? 'กำลังบันทึก...' : 'บันทึกคำถาม'}
            </button>
            <button
              type="button"
              onClick={() => void softDeleteFaq()}
              disabled={!values.id || status === 'saving'}
              className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              ลบแบบพักไว้ 30 วัน
            </button>
            <button
              type="button"
              onClick={() => void restoreFaq()}
              disabled={!values.id || status === 'saving'}
              className="rounded-lg border border-emerald-200 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              กู้คืน FAQ
            </button>
            {items.find((item) => item.id === values.id)?.deletedAt ? (
              <button
                type="button"
                onClick={() => void hardDeleteFaq()}
                disabled={!values.id || status === 'saving'}
                className="rounded-lg border border-red-500 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-800 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                ลบถาวร
              </button>
            ) : null}
          </div>
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

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-semibold text-slate-800">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className={`${inputClass} mt-2`} />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-semibold text-slate-800 md:col-span-2">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className={`${inputClass} mt-2 min-h-24 resize-y`} />
    </label>
  );
}

async function ensureFaqRow(values: FaqFormValues) {
  if (values.id && !values.id.startsWith('fallback-')) {
    return values.id;
  }

  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return '';
  }

  const { data, error } = await supabase.from('faq_items').insert(mapFaqFormToInsert({ ...values, id: null })).select('id').single();

  if (error || !data) {
    return '';
  }

  return data.id;
}
