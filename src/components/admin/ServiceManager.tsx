'use client';

import { FormEvent, useEffect, useState } from 'react';

import { serviceCategories } from '@/content/site';
import {
  applyServiceRowsForAdmin,
  createBlankServiceForm,
  mapServiceFormToUpsert,
  mapServiceToForm,
  validateServiceForm,
  type ServiceCategory,
  type ServiceFormValues,
  type LocalizedText,
  type ServiceRow,
} from '@/lib/admin/services';
import { formatAdminLoadError, formatAdminRpcError, formatAdminSaveError } from '@/lib/admin/databaseErrors';
import { requestPreviewRefresh } from '@/lib/admin/previewRefresh';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type SaveStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#f08a24] focus:ring-2 focus:ring-[#f08a24]/20';

export default function ServiceManager() {
  const [rows, setRows] = useState<ServiceRow[]>([]);
  const [services, setServices] = useState<ServiceCategory[]>(serviceCategories);
  const [activeId, setActiveId] = useState<string>(serviceCategories[0].key);
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
        setMessage(formatAdminLoadError('บริการ', 'services', error));
        return;
      }

      const nextRows = (data as ServiceRow[] | null) ?? [];
      const nextServices = applyServiceRowsForAdmin(serviceCategories, nextRows);
      setRows(nextRows);
      setServices(nextServices);
      setValues(mapServiceToForm(nextServices[0] ?? serviceCategories[0], nextRows.find((item) => item.id === (nextServices[0]?.key ?? serviceCategories[0].key))));
      setStatus('idle');
      requestPreviewRefresh();
    }

    void loadInitialServices();
  }, []);

  const activeService = services.find((service) => service.key === activeId) ?? services[0] ?? serviceCategories[0];

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
      setMessage(formatAdminLoadError('บริการ', 'services', error));
      return;
    }

    const nextRows = (data as ServiceRow[] | null) ?? [];
    const nextServices = applyServiceRowsForAdmin(serviceCategories, nextRows);
    const currentService = nextServices.find((service) => service.key === activeId) ?? nextServices[0] ?? serviceCategories[0];

    setRows(nextRows);
    setServices(nextServices);
    setValues(mapServiceToForm(currentService, nextRows.find((item) => item.id === activeId)));
    setStatus('idle');
    requestPreviewRefresh();
  }

  function selectService(serviceId: ServiceFormValues['id']) {
    const service = services.find((item) => item.key === serviceId) ?? services[0] ?? serviceCategories[0];
    setActiveId(serviceId);
    setValues(mapServiceToForm(service, rows.find((item) => item.id === serviceId)));
  }

  function startNewService() {
    const nextSortOrder = rows.reduce((max, item) => Math.max(max, item.sort_order), 0) + 10;
    setActiveId('');
    setValues(createBlankServiceForm(nextSortOrder));
    setMessage('');
  }

  function updateField<K extends keyof ServiceFormValues>(field: K, value: ServiceFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function updateListField(field: 'includes' | 'prepare', index: number, language: keyof LocalizedText, value: string) {
    setValues((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) => (itemIndex === index ? { ...item, [language]: value } : item)),
    }));
  }

  function addListItem(field: 'includes' | 'prepare') {
    setValues((current) => ({
      ...current,
      [field]: [...current[field], { th: '', en: '' }],
    }));
  }

  function removeListItem(field: 'includes' | 'prepare', index: number) {
    setValues((current) => ({
      ...current,
      [field]: current[field].filter((_, itemIndex) => itemIndex !== index),
    }));
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
      setMessage(formatAdminSaveError('บริการ', 'services', error));
      return;
    }

    setStatus('saved');
    setMessage('บันทึกบริการแล้ว');
    await loadServices();
    requestPreviewRefresh();
  }

  async function softDeleteService() {
    if (!values.id) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setStatus('saving');
    const { error } = await supabase.rpc('soft_delete_service', {
      service_id: values.id,
      retention_days: 30,
    });

    if (error) {
      setStatus('error');
      setMessage(formatAdminRpcError('ลบบริการ', 'soft_delete_service', error));
      return;
    }

    setStatus('saved');
    setMessage('ย้ายบริการไปถังพักแล้ว กู้คืนได้ภายใน 30 วัน');
    await loadServices();
    requestPreviewRefresh();
  }

  async function restoreService() {
    if (!values.id) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setStatus('saving');
    const { error } = await supabase.rpc('restore_service', {
      service_id: values.id,
    });

    if (error) {
      setStatus('error');
      setMessage(formatAdminRpcError('กู้คืนบริการ', 'restore_service', error));
      return;
    }

    setStatus('saved');
    setMessage('กู้คืนบริการแล้ว');
    await loadServices();
    requestPreviewRefresh();
  }

  async function hardDeleteService() {
    if (!values.id) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setStatus('saving');
    const { error } = await supabase.rpc('hard_delete_service', {
      service_id: values.id,
    });

    if (error) {
      setStatus('error');
      setMessage(formatAdminRpcError('ลบถาวรบริการ', 'hard_delete_service', error));
      return;
    }

    setStatus('saved');
    setMessage('ลบถาวรแล้ว');
    await loadServices();
    requestPreviewRefresh();
  }

  return (
    <section className="admin-card rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-[#12345f]">บริการ</h2>
          <p className="mt-1 text-sm text-slate-600">แก้ชื่อ คำอธิบาย ข้อความ LINE และสถานะเผยแพร่ของบริการหลัก</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={startNewService} disabled={status === 'saving'} className="rounded-lg bg-[#12345f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0d2748] disabled:cursor-not-allowed disabled:opacity-60">
            เพิ่มบริการ
          </button>
          <button
            type="button"
            onClick={() => void loadServices()}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-[#f08a24] hover:text-[#f08a24]"
          >
            โหลดบริการใหม่
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {services.map((service) => (
            <button
              key={service.key}
              type="button"
              onClick={() => selectService(service.key)}
              className={`rounded-lg border p-3 text-left text-sm font-bold transition ${
                activeId === service.key ? 'border-[#12345f] bg-[#12345f] text-white' : 'border-slate-200 bg-slate-50 text-[#12345f]'
              }`}
            >
              <span className="block">{service.shortTitle.th}</span>
              <span className={`mt-1 block text-xs ${activeId === service.key ? 'text-blue-100' : 'text-slate-500'}`}>
                {service.deletedAt ? `ถังพัก ลบจริงหลัง ${service.purgeAfter ?? '-'}` : 'ใช้งานอยู่'}
              </span>
            </button>
          ))}
        </div>

        <form id="service-manager-form" onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2" noValidate>
          <Field label="Service ID" value={values.id} onChange={(value) => updateField('id', value)} />
          <label className="block text-sm font-semibold text-slate-800">
            ลำดับที่
            <input type="number" min="0" value={values.sortOrder} onChange={(event) => updateField('sortOrder', Number(event.target.value))} className={`${inputClass} mt-2`} />
          </label>
          <Field label="ชื่อบริการ ภาษาไทย" value={values.titleTh} onChange={(value) => updateField('titleTh', value)} />
          <Field label="ชื่อบริการ ภาษาอังกฤษ" value={values.titleEn} onChange={(value) => updateField('titleEn', value)} />
          <Field label="ชื่อสั้น ภาษาไทย" value={values.shortTitleTh} onChange={(value) => updateField('shortTitleTh', value)} />
          <Field label="ชื่อสั้น ภาษาอังกฤษ" value={values.shortTitleEn} onChange={(value) => updateField('shortTitleEn', value)} />
          <Textarea label="คำอธิบาย ภาษาไทย" value={values.descriptionTh} onChange={(value) => updateField('descriptionTh', value)} />
          <Textarea label="คำอธิบาย ภาษาอังกฤษ" value={values.descriptionEn} onChange={(value) => updateField('descriptionEn', value)} />
          <Textarea label="เหมาะกับ ภาษาไทย" value={values.bestForTh} onChange={(value) => updateField('bestForTh', value)} />
          <Textarea label="เหมาะกับ ภาษาอังกฤษ" value={values.bestForEn} onChange={(value) => updateField('bestForEn', value)} />
          <LocalizedListEditor
            title="งานที่รับ"
            items={values.includes}
            onChange={(index, language, value) => updateListField('includes', index, language, value)}
            onAdd={() => addListItem('includes')}
            onRemove={(index) => removeListItem('includes', index)}
          />
          <LocalizedListEditor
            title="ข้อมูลที่ควรเตรียม"
            items={values.prepare}
            onChange={(index, language, value) => updateListField('prepare', index, language, value)}
            onAdd={() => addListItem('prepare')}
            onRemove={(index) => removeListItem('prepare', index)}
          />
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
          <div className="flex flex-col gap-2 sm:flex-row md:col-span-2">
            <button type="submit" disabled={status === 'saving' || status === 'loading'} className="rounded-lg bg-[#12345f] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d2748] disabled:cursor-not-allowed disabled:opacity-60">
              {status === 'saving' ? 'กำลังบันทึก...' : 'บันทึกบริการ'}
            </button>
            <button type="button" onClick={() => void softDeleteService()} disabled={!values.id || status === 'saving'} className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60">
              ลบแบบพักไว้ 30 วัน
            </button>
            <button type="button" onClick={() => void restoreService()} disabled={!values.id || status === 'saving'} className="rounded-lg border border-emerald-200 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60">
              กู้คืน
            </button>
            {activeService.deletedAt ? (
              <button type="button" onClick={() => void hardDeleteService()} disabled={!values.id || status === 'saving'} className="rounded-lg border border-red-500 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-800 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60">
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

function LocalizedListEditor({
  title,
  items,
  onChange,
  onAdd,
  onRemove,
}: {
  title: string;
  items: LocalizedText[];
  onChange: (index: number, language: keyof LocalizedText, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <fieldset className="rounded-lg border border-slate-200 bg-slate-50 p-4 md:col-span-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <legend className="text-sm font-black text-[#12345f]">{title}</legend>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-[#12345f] transition hover:border-[#f08a24] hover:text-[#b85c00]"
        >
          เพิ่มรายการ
        </button>
      </div>
      <div className="mt-3 grid gap-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <Field label={`ภาษาไทย ${index + 1}`} value={item.th} onChange={(value) => onChange(index, 'th', value)} />
            <Field label={`ภาษาอังกฤษ ${index + 1}`} value={item.en} onChange={(value) => onChange(index, 'en', value)} />
            <button
              type="button"
              onClick={() => onRemove(index)}
              disabled={items.length <= 1}
              className="rounded-lg border border-red-200 px-3 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ลบ
            </button>
          </div>
        ))}
      </div>
    </fieldset>
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
