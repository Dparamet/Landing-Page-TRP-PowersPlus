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
import { buildDefaultFaqItems, mapFaqRows, type FaqItem, type FaqRow } from '@/lib/faqs';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import en from '@/locales/en.json';
import th from '@/locales/th.json';

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
      setMessage('โหลด FAQ ไม่สำเร็จ ถ้ายังไม่ได้รัน migration ให้รัน 202605100007_faq_items.sql ใน Supabase SQL Editor');
      return;
    }

    const nextItems = mapFaqRows((data as FaqRow[] | null) ?? [], fallbackFaqs, true);
    setItems(nextItems);
    setValues(nextItems[0] ? mapFaqItemToForm(nextItems[0]) : createBlankFaqForm(10));
    setStatus('idle');
    setMessage('');
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
      setMessage(`บันทึก FAQ ไม่สำเร็จ: ${error.message}`);
      return;
    }

    setStatus('saved');
    setMessage('บันทึก FAQ แล้ว');
    await loadFaqs();
  }

  async function deleteFaq() {
    if (!values.id) return;

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    setStatus('saving');
    setMessage('');

    const { error } = await supabase.from('faq_items').delete().eq('id', values.id);

    if (error) {
      setStatus('error');
      setMessage(`ลบ FAQ ไม่สำเร็จ: ${error.message}`);
      return;
    }

    setStatus('saved');
    setMessage('ลบ FAQ แล้ว');
    await loadFaqs();
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-[#12345f]">คำถามที่พบบ่อย</h2>
          <p className="mt-1 text-sm text-slate-600">เพิ่ม แก้ไข และซ่อนคำถามในหน้า FAQ</p>
        </div>
        <button
          type="button"
          onClick={startNewFaq}
          className="rounded-lg bg-[#12345f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0d2748]"
        >
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
                  values.id === item.id ? 'border-[#12345f] bg-[#12345f] text-white' : 'border-slate-200 bg-slate-50 text-[#12345f]'
                }`}
              >
                <span className="block text-sm font-bold">{item.question.th}</span>
                <span className={`mt-1 block text-xs ${values.id === item.id ? 'text-blue-100' : 'text-slate-500'}`}>
                  ลำดับ {item.sortOrder} · {item.published ? 'แสดงอยู่' : 'ซ่อนอยู่'}
                </span>
              </button>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2" noValidate>
          <Field label="คำถาม ภาษาไทย" value={values.questionTh} onChange={(value) => updateField('questionTh', value)} />
          <Field label="คำถาม ภาษาอังกฤษ" value={values.questionEn} onChange={(value) => updateField('questionEn', value)} />
          <Textarea label="คำตอบ ภาษาไทย" value={values.answerTh} onChange={(value) => updateField('answerTh', value)} />
          <Textarea label="คำตอบ ภาษาอังกฤษ" value={values.answerEn} onChange={(value) => updateField('answerEn', value)} />
          <label className="block text-sm font-semibold text-slate-800">
            ลำดับ
            <input
              type="number"
              min="0"
              value={values.sortOrder}
              onChange={(event) => updateField('sortOrder', Number(event.target.value))}
              className={`${inputClass} mt-2`}
            />
          </label>
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
            <button
              type="submit"
              disabled={status === 'saving' || status === 'loading'}
              className="rounded-lg bg-[#12345f] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d2748] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'saving' ? 'กำลังบันทึก...' : values.id ? 'บันทึก FAQ' : 'สร้าง FAQ'}
            </button>
            <button
              type="button"
              onClick={() => void deleteFaq()}
              disabled={!values.id || status === 'saving'}
              className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              ลบ FAQ
            </button>
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
