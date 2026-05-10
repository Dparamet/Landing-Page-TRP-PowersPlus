'use client';

import { FormEvent, useEffect, useState } from 'react';

import { serviceCategories } from '@/content/site';
import {
  mapServiceFormToUpsert,
  mapServiceToForm,
  validateServiceForm,
  type ServiceFormValues,
  type ServiceRow,
} from '@/lib/admin/services';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type SaveStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#f08a24] focus:ring-2 focus:ring-[#f08a24]/20';

export default function ServiceManager() {
  const [rows, setRows] = useState<ServiceRow[]>([]);
  const [activeId, setActiveId] = useState(serviceCategories[0].key);
  const [values, setValues] = useState<ServiceFormValues>(mapServiceToForm(serviceCategories[0]));
  const [status, setStatus] = useState<SaveStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadInitialServices() {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        setStatus('error');
        setMessage('ยังไม่ได้ตั้งค่า Supabase env');
        return;
      }

      const { data, error } = await supabase.from('services').select('*').order('sort_order', { ascending: true });

      if (error) {
        setStatus('error');
        setMessage(`โหลดบริการไม่สำเร็จ: ${error.message}`);
        return;
      }

      const nextRows = (data as ServiceRow[] | null) ?? [];
      setRows(nextRows);
      setValues(mapServiceToForm(serviceCategories[0], nextRows.find((item) => item.id === serviceCategories[0].key)));
      setStatus('idle');
    }

    void loadInitialServices();
  }, []);

  const activeService = serviceCategories.find((service) => service.key === activeId) ?? serviceCategories[0];

  async function loadServices() {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    const { data, error } = await supabase.from('services').select('*').order('sort_order', { ascending: true });

    if (error) {
      setStatus('error');
      setMessage(`โหลดบริการไม่สำเร็จ: ${error.message}`);
      return;
    }

    const nextRows = (data as ServiceRow[] | null) ?? [];
    const currentService = serviceCategories.find((service) => service.key === activeId) ?? serviceCategories[0];

    setRows(nextRows);
    setValues(mapServiceToForm(currentService, nextRows.find((item) => item.id === activeId)));
    setStatus('idle');
  }

  function selectService(serviceId: ServiceFormValues['id']) {
    const service = serviceCategories.find((item) => item.key === serviceId) ?? serviceCategories[0];
    setActiveId(serviceId);
    setValues(mapServiceToForm(service, rows.find((item) => item.id === serviceId)));
  }

  function updateField<K extends keyof ServiceFormValues>(field: K, value: ServiceFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateServiceForm(values);

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

    const { error } = await supabase.from('services').upsert(mapServiceFormToUpsert(validation.value, activeService), { onConflict: 'id' });

    if (error) {
      setStatus('error');
      setMessage(`บันทึกบริการไม่สำเร็จ: ${error.message}`);
      return;
    }

    setStatus('saved');
    setMessage('บันทึกบริการแล้ว');
    await loadServices();
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-[#12345f]">บริการ</h2>
          <p className="mt-1 text-sm text-slate-600">แก้ชื่อ คำอธิบาย ข้อความ LINE และสถานะเผยแพร่ของบริการหลัก</p>
        </div>
        <button
          type="button"
          onClick={() => void loadServices()}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-[#f08a24] hover:text-[#f08a24]"
        >
          โหลดบริการใหม่
        </button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {serviceCategories.map((service) => (
            <button
              key={service.key}
              type="button"
              onClick={() => selectService(service.key)}
              className={`rounded-lg border p-3 text-left text-sm font-bold transition ${
                activeId === service.key ? 'border-[#12345f] bg-[#12345f] text-white' : 'border-slate-200 bg-slate-50 text-[#12345f]'
              }`}
            >
              {service.shortTitle.th}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2" noValidate>
          <Field label="ชื่อบริการ ภาษาไทย" value={values.titleTh} onChange={(value) => updateField('titleTh', value)} />
          <Field label="ชื่อบริการ ภาษาอังกฤษ" value={values.titleEn} onChange={(value) => updateField('titleEn', value)} />
          <Field label="ชื่อสั้น ภาษาไทย" value={values.shortTitleTh} onChange={(value) => updateField('shortTitleTh', value)} />
          <Field label="ชื่อสั้น ภาษาอังกฤษ" value={values.shortTitleEn} onChange={(value) => updateField('shortTitleEn', value)} />
          <Textarea label="คำอธิบาย ภาษาไทย" value={values.descriptionTh} onChange={(value) => updateField('descriptionTh', value)} />
          <Textarea label="คำอธิบาย ภาษาอังกฤษ" value={values.descriptionEn} onChange={(value) => updateField('descriptionEn', value)} />
          <Textarea label="เหมาะกับ ภาษาไทย" value={values.bestForTh} onChange={(value) => updateField('bestForTh', value)} />
          <Textarea label="เหมาะกับ ภาษาอังกฤษ" value={values.bestForEn} onChange={(value) => updateField('bestForEn', value)} />
          <Field label="ข้อความ LINE ภาษาไทย" value={values.lineMessageTh} onChange={(value) => updateField('lineMessageTh', value)} />
          <Field label="ข้อความ LINE ภาษาอังกฤษ" value={values.lineMessageEn} onChange={(value) => updateField('lineMessageEn', value)} />
          <label className="block text-sm font-semibold text-slate-800">
            สีเน้น
            <select
              value={values.accent}
              onChange={(event) => updateField('accent', event.target.value as 'orange' | 'blue')}
              className={`${inputClass} mt-2`}
            >
              <option value="orange">ส้ม</option>
              <option value="blue">น้ำเงิน</option>
            </select>
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
          <button
            type="submit"
            disabled={status === 'saving' || status === 'loading'}
            className="rounded-lg bg-[#12345f] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d2748] focus:outline-none focus:ring-2 focus:ring-[#12345f]/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'saving' ? 'กำลังบันทึก...' : 'บันทึกบริการ'}
          </button>
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
    <label className="block text-sm font-semibold text-slate-800">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className={`${inputClass} mt-2 min-h-24 resize-y`} />
    </label>
  );
}
