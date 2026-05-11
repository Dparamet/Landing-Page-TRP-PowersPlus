'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

import {
  buildDefaultContactItems,
  createBlankContactItemForm,
  mapContactFormToInsert,
  mapContactFormToUpdate,
  mapContactItemToForm,
  mapContactRows,
  validateContactItem,
  type ContactItemFormValues,
  type ContactItemRow,
  type ContactItemView,
} from '@/lib/admin/contactItems';
import { requestPreviewRefresh } from '@/lib/admin/previewRefresh';
import { defaultCompanyProfile } from '@/lib/companyProfile';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type SaveStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#f08a24] focus:ring-2 focus:ring-[#f08a24]/20';

export default function ContactItemManager() {
  const fallbackItems = useMemo(() => buildDefaultContactItems(defaultCompanyProfile), []);
  const [items, setItems] = useState<ContactItemView[]>(fallbackItems);
  const [values, setValues] = useState<ContactItemFormValues>(mapContactItemToForm(fallbackItems[0]));
  const [status, setStatus] = useState<SaveStatus>('loading');
  const [message, setMessage] = useState('');

  const loadItems = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    const { data, error } = await supabase.from('contact_items').select('*').order('sort_order', { ascending: true });

    if (error) {
      setStatus('error');
      setMessage('โหลดช่องทางติดต่อไม่สำเร็จ ให้รัน migration 202605100011_contact_items.sql ก่อน');
      return;
    }

    const nextItems = mapContactRows((data as ContactItemRow[] | null) ?? [], fallbackItems, true);
    setItems(nextItems);
    setValues(nextItems[0] ? mapContactItemToForm(nextItems[0]) : createBlankContactItemForm(10));
    setStatus('idle');
    setMessage('');
    requestPreviewRefresh();
  }, [fallbackItems]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadItems();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadItems]);

  function updateField<K extends keyof ContactItemFormValues>(field: K, value: ContactItemFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function selectItem(item: ContactItemView) {
    setValues(mapContactItemToForm(item));
    setMessage('');
  }

  function startNewItem() {
    const nextSortOrder = items.reduce((max, item) => Math.max(max, item.sortOrder), 0) + 10;
    setValues(createBlankContactItemForm(nextSortOrder));
    setMessage('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateContactItem(values);

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

    const query = validation.value.databaseId
      ? supabase.from('contact_items').update(mapContactFormToUpdate(validation.value)).eq('id', validation.value.databaseId)
      : supabase.from('contact_items').insert(mapContactFormToInsert(validation.value));
    const { error } = await query;

    if (error) {
      setStatus('error');
      setMessage(`บันทึกช่องทางติดต่อไม่สำเร็จ: ${error.message}`);
      return;
    }

    setStatus('saved');
    setMessage('บันทึกช่องทางติดต่อแล้ว');
    await loadItems();
    requestPreviewRefresh();
  }

  async function callItemRpc(fn: 'soft_delete_contact_item' | 'restore_contact_item' | 'hard_delete_contact_item', successMessage: string) {
    if (!values.databaseId) return;

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    setStatus('saving');
    const { error } = await supabase.rpc(fn, fn === 'soft_delete_contact_item' ? { item_id: values.databaseId, retention_days: 30 } : { item_id: values.databaseId });

    if (error) {
      setStatus('error');
      setMessage(`จัดการช่องทางติดต่อไม่สำเร็จ: ${error.message}`);
      return;
    }

    setStatus('saved');
    setMessage(successMessage);
    await loadItems();
    requestPreviewRefresh();
  }

  const activeItem = items.find((item) => item.id === values.id);
  const isBusy = status === 'loading' || status === 'saving';

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-[#12345f]">ช่องทางติดต่อ</h2>
          <p className="mt-1 text-sm text-slate-600">เพิ่ม แก้ไข เรียงลำดับ ซ่อน และลบรายการติดต่อที่แสดงในหน้าเว็บ</p>
        </div>
        <button type="submit" form="contact-item-form" disabled={isBusy} className="rounded-lg bg-[#12345f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0d2748] disabled:cursor-not-allowed disabled:opacity-60">
          {status === 'saving' ? 'กำลังบันทึก...' : values.databaseId ? 'บันทึกรายการ' : 'สร้างรายการ'}
        </button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="grid gap-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectItem(item)}
              className={`rounded-lg border p-3 text-left text-sm transition ${
                values.id === item.id ? 'border-[#12345f] bg-[#12345f] text-white' : 'border-slate-200 bg-slate-50 text-[#12345f]'
              }`}
            >
              <span className="block font-black">{item.label.th}</span>
              <span className={`mt-1 block text-xs ${values.id === item.id ? 'text-blue-100' : 'text-slate-500'}`}>
                {item.deletedAt ? `ถังพัก ลบจริงหลัง ${item.purgeAfter ?? '-'}` : item.published ? item.value.th : 'ซ่อนอยู่'}
              </span>
            </button>
          ))}
        </div>

        <form id="contact-item-form" onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2" noValidate>
          <Field label="ประเภท" value={values.type} onChange={(value) => updateField('type', value)} />
          <label className="block text-sm font-semibold text-slate-800">
            Icon
            <select value={values.icon} onChange={(event) => updateField('icon', event.target.value)} className={`${inputClass} mt-2`}>
              {['company', 'phone', 'line', 'facebook', 'email', 'address', 'custom'].map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </label>
          <Field label="ป้ายกำกับ ภาษาไทย" value={values.labelTh} onChange={(value) => updateField('labelTh', value)} />
          <Field label="ป้ายกำกับ ภาษาอังกฤษ" value={values.labelEn} onChange={(value) => updateField('labelEn', value)} />
          <Field label="ค่าที่แสดง ภาษาไทย" value={values.valueTh} onChange={(value) => updateField('valueTh', value)} />
          <Field label="ค่าที่แสดง ภาษาอังกฤษ" value={values.valueEn} onChange={(value) => updateField('valueEn', value)} />
          <Field label="ลิงก์เปิด" value={values.href} onChange={(value) => updateField('href', value)} />
          <Field label="ค่าที่ใช้ copy" value={values.copyValue} onChange={(value) => updateField('copyValue', value)} />
          <label className="block text-sm font-semibold text-slate-800">
            ลำดับ
            <input type="number" min="0" value={values.sortOrder} onChange={(event) => updateField('sortOrder', Number(event.target.value))} className={`${inputClass} mt-2`} />
          </label>
          <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <input type="checkbox" checked={values.external} onChange={(event) => updateField('external', event.target.checked)} className="h-4 w-4 rounded border-slate-300" />
              เปิดแท็บใหม่
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <input type="checkbox" checked={values.published} onChange={(event) => updateField('published', event.target.checked)} className="h-4 w-4 rounded border-slate-300" />
              แสดงบนหน้าเว็บ
            </label>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row md:col-span-2">
            <button type="button" onClick={startNewItem} disabled={isBusy} className="rounded-lg bg-[#12345f] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d2748] disabled:cursor-not-allowed disabled:opacity-60">
              เพิ่มรายการ
            </button>
            <button type="button" onClick={() => void callItemRpc('soft_delete_contact_item', 'ย้ายช่องทางติดต่อไปถังพักแล้ว')} disabled={!values.databaseId || isBusy} className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60">
              ลบแบบพักไว้ 30 วัน
            </button>
            <button type="button" onClick={() => void callItemRpc('restore_contact_item', 'กู้คืนช่องทางติดต่อแล้ว')} disabled={!values.databaseId || isBusy} className="rounded-lg border border-emerald-200 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60">
              กู้คืน
            </button>
            {activeItem?.deletedAt ? (
              <button type="button" onClick={() => void callItemRpc('hard_delete_contact_item', 'ลบถาวรแล้ว')} disabled={!values.databaseId || isBusy} className="rounded-lg border border-red-500 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-800 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60">
                ลบถาวร
              </button>
            ) : null}
          </div>
        </form>
      </div>

      {message ? (
        <p role={status === 'error' ? 'alert' : 'status'} className={`mt-4 rounded-lg border px-4 py-3 text-sm ${status === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
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
