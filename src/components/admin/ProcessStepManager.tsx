'use client';

import { FormEvent, useEffect, useState } from 'react';

import {
  createBlankProcessStepForm,
  mapProcessStepFormToInsert,
  mapProcessStepFormToUpdate,
  mapProcessStepToForm,
  validateProcessStepForm,
  type ProcessStepFormValues,
} from '@/lib/admin/processSteps';
import { formatAdminLoadError, formatAdminRpcError, formatAdminSaveError } from '@/lib/admin/databaseErrors';
import { requestPreviewRefresh } from '@/lib/admin/previewRefresh';
import { buildDefaultProcessSteps, mapProcessStepRows, type ProcessStep, type ProcessStepRow } from '@/lib/processSteps';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import en from '@/locales/en.json';
import th from '@/locales/th.json';
import SortOrderControls from './SortOrderControls';

type SaveStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

const fallbackSteps = buildDefaultProcessSteps(th.process.steps, en.process.steps);

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#f08a24] focus:ring-2 focus:ring-[#f08a24]/20';

export default function ProcessStepManager() {
  const [items, setItems] = useState<ProcessStep[]>([]);
  const [values, setValues] = useState<ProcessStepFormValues>(createBlankProcessStepForm(10));
  const [status, setStatus] = useState<SaveStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    void loadSteps();
  }, []);

  async function loadSteps() {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    const { data, error } = await supabase.from('process_steps').select('*').order('sort_order', { ascending: true });

    if (error) {
      setStatus('error');
      setMessage(formatAdminLoadError('ขั้นตอนทำงาน', 'process_steps', error));
      return;
    }

    const nextItems = mapProcessStepRows((data as ProcessStepRow[] | null) ?? [], fallbackSteps, true);
    setItems(nextItems);
    setValues(nextItems[0] ? mapProcessStepToForm(nextItems[0]) : createBlankProcessStepForm(10));
    setStatus('idle');
    setMessage('');
    requestPreviewRefresh();
  }

  function updateField<K extends keyof ProcessStepFormValues>(field: K, value: ProcessStepFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function startNewStep() {
    const nextSortOrder = items.reduce((max, item) => Math.max(max, item.sortOrder), 0) + 10;
    setValues(createBlankProcessStepForm(nextSortOrder));
    setMessage('');
  }

  async function moveSelectedStep(direction: -1 | 1) {
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
      const form = { ...mapProcessStepToForm(item), sortOrder: (index + 1) * 10 };
      const itemId = await ensureProcessStepRow(form);

      if (!itemId) {
        setStatus('error');
        setMessage('สร้างขั้นตอนเพื่อบันทึกลำดับไม่สำเร็จ');
        return;
      }

      const { error } = await supabase.from('process_steps').update({ sort_order: form.sortOrder, updated_at: new Date().toISOString() }).eq('id', itemId);

      if (error) {
        setStatus('error');
        setMessage(formatAdminSaveError('ขั้นตอนทำงาน', 'process_steps', error));
        return;
      }
    }

    setStatus('saved');
    setMessage(direction < 0 ? 'ขยับขั้นตอนขึ้นแล้ว' : 'ขยับขั้นตอนลงแล้ว');
    await loadSteps();
    requestPreviewRefresh();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateProcessStepForm(values);

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
      ? supabase.from('process_steps').update(mapProcessStepFormToUpdate(validation.value)).eq('id', validation.value.id)
      : supabase.from('process_steps').insert(mapProcessStepFormToInsert(validation.value));
    const { error } = await saveQuery;

    if (error) {
      setStatus('error');
      setMessage(formatAdminSaveError('ขั้นตอนทำงาน', 'process_steps', error));
      return;
    }

    setStatus('saved');
    setMessage('บันทึกขั้นตอนทำงานแล้ว');
    await loadSteps();
    requestPreviewRefresh();
  }

  async function softDeleteStep() {
    if (!values.id) return;

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    setStatus('saving');
    const { error } = await supabase.rpc('soft_delete_process_step', {
      step_id: values.id,
      retention_days: 30,
    });

    if (error) {
      setStatus('error');
      setMessage(formatAdminRpcError('ลบขั้นตอน', 'soft_delete_process_step', error));
      return;
    }

    setStatus('saved');
    setMessage('ย้ายขั้นตอนไปถังพักแล้ว สามารถกู้คืนได้ภายใน 30 วัน');
    await loadSteps();
    requestPreviewRefresh();
  }

  async function restoreStep() {
    if (!values.id) return;

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    setStatus('saving');
    const { error } = await supabase.rpc('restore_process_step', {
      step_id: values.id,
    });

    if (error) {
      setStatus('error');
      setMessage(formatAdminRpcError('กู้คืนขั้นตอน', 'restore_process_step', error));
      return;
    }

    setStatus('saved');
    setMessage('กู้คืนขั้นตอนแล้ว');
    await loadSteps();
    requestPreviewRefresh();
  }

  async function hardDeleteStep() {
    if (!values.id) return;

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    setStatus('saving');
    const { error } = await supabase.rpc('hard_delete_process_step', {
      step_id: values.id,
    });

    if (error) {
      setStatus('error');
      setMessage(formatAdminRpcError('ลบถาวรขั้นตอน', 'hard_delete_process_step', error));
      return;
    }

    setStatus('saved');
    setMessage('ลบถาวรขั้นตอนแล้ว');
    await loadSteps();
    requestPreviewRefresh();
  }

  const activeIndex = items.findIndex((item) => item.id === values.id);
  const isBusy = status === 'loading' || status === 'saving';

  return (
    <section className="admin-card rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-[#12345f]">ขั้นตอนทำงาน</h2>
          <p className="mt-1 text-sm text-slate-600">เพิ่ม แก้ไข ลบ และซ่อนขั้นตอนใน section กระบวนการทำงาน</p>
        </div>
        <button type="button" onClick={startNewStep} disabled={status === 'saving'} className="rounded-lg bg-[#12345f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0d2748] disabled:cursor-not-allowed disabled:opacity-60">
          เพิ่มขั้นตอน
        </button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setValues(mapProcessStepToForm(item));
                setMessage('');
              }}
              className={`rounded-lg border p-3 text-left transition ${
                values.id === item.id ? 'border-[#12345f] bg-[#12345f] text-white' : 'border-slate-200 bg-slate-50 text-[#12345f]'
              }`}
            >
              <span className="block text-sm font-bold">{item.title.th}</span>
              <span className={`mt-1 block text-xs ${values.id === item.id ? 'text-blue-100' : 'text-slate-500'}`}>
                ลำดับที่ {item.sortOrder} · {item.deletedAt ? `ถังพัก ลบจริงหลัง ${item.purgeAfter ?? '-'}` : item.published ? 'แสดงอยู่' : 'ซ่อนอยู่'}
              </span>
            </button>
          ))}
        </div>

        <form id="process-step-manager-form" onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2" noValidate>
          <Field label="หัวข้อ ภาษาไทย" value={values.titleTh} onChange={(value) => updateField('titleTh', value)} />
          <Field label="หัวข้อ ภาษาอังกฤษ" value={values.titleEn} onChange={(value) => updateField('titleEn', value)} />
          <Textarea label="คำอธิบาย ภาษาไทย" value={values.descriptionTh} onChange={(value) => updateField('descriptionTh', value)} />
          <Textarea label="คำอธิบาย ภาษาอังกฤษ" value={values.descriptionEn} onChange={(value) => updateField('descriptionEn', value)} />
          <SortOrderControls
            canMoveUp={activeIndex > 0}
            canMoveDown={activeIndex >= 0 && activeIndex < items.length - 1}
            disabled={isBusy}
            onMoveUp={() => void moveSelectedStep(-1)}
            onMoveDown={() => void moveSelectedStep(1)}
          />
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <input type="checkbox" checked={values.published} onChange={(event) => updateField('published', event.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            แสดงบนหน้าเว็บ
          </label>
          <div className="flex flex-col gap-2 sm:flex-row md:col-span-2">
            <button type="submit" disabled={status === 'saving' || status === 'loading'} className="rounded-lg bg-[#12345f] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d2748] disabled:cursor-not-allowed disabled:opacity-60">
              {status === 'saving' ? 'กำลังบันทึก...' : 'บันทึกขั้นตอน'}
            </button>
            <button type="button" onClick={() => void softDeleteStep()} disabled={!values.id || status === 'saving'} className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60">
              ลบแบบพักไว้ 30 วัน
            </button>
            <button type="button" onClick={() => void restoreStep()} disabled={!values.id || status === 'saving'} className="rounded-lg border border-emerald-200 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60">
              กู้คืน
            </button>
            {items.find((item) => item.id === values.id)?.deletedAt ? (
              <button type="button" onClick={() => void hardDeleteStep()} disabled={!values.id || status === 'saving'} className="rounded-lg border border-red-500 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-800 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60">
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

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-semibold text-slate-800 md:col-span-2">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className={`${inputClass} mt-2 min-h-24 resize-y`} />
    </label>
  );
}

async function ensureProcessStepRow(values: ProcessStepFormValues) {
  if (values.id && !values.id.startsWith('fallback-process-')) {
    return values.id;
  }

  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return '';
  }

  const { data, error } = await supabase.from('process_steps').insert(mapProcessStepFormToInsert({ ...values, id: null })).select('id').single();

  if (error || !data) {
    return '';
  }

  return data.id;
}
