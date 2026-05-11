'use client';

import { FormEvent, useEffect, useState } from 'react';

import {
  defaultCompanySettings,
  mapCompanySettingsFormToUpsert,
  mapSiteSettingsRowToForm,
  validateCompanySettings,
  type CompanySettingsFormValues,
  type SiteSettingsRow,
} from '@/lib/admin/companySettings';
import { requestPreviewRefresh } from '@/lib/admin/previewRefresh';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type SaveStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

const fieldClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#f08a24] focus:ring-2 focus:ring-[#f08a24]/20';

export default function CompanySettingsForm() {
  const [values, setValues] = useState<CompanySettingsFormValues>(defaultCompanySettings);
  const [status, setStatus] = useState<SaveStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        setStatus('error');
        setMessage('ยังไม่ได้ตั้งค่า Supabase env');
        return;
      }

      const { data, error } = await supabase.from('site_settings').select('*').eq('id', true).maybeSingle();

      if (!isMounted) {
        return;
      }

      if (error) {
        setStatus('error');
        setMessage('โหลดข้อมูลบริษัทไม่สำเร็จ');
        return;
      }

      setValues(mapSiteSettingsRowToForm(data as SiteSettingsRow | null));
      setStatus('idle');
      setMessage('');
      requestPreviewRefresh();
    }

    void loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  function updateField(field: keyof CompanySettingsFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateCompanySettings(values);

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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus('error');
      setMessage('session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
      return;
    }

    const { error } = await supabase
      .from('site_settings')
      .upsert(mapCompanySettingsFormToUpsert(validation.value), { onConflict: 'id' });

    if (error) {
      setStatus('error');
      setMessage(formatSaveError(error));
      return;
    }

    setValues(validation.value);
    setStatus('saved');
    setMessage('บันทึกข้อมูลบริษัทแล้ว');
    requestPreviewRefresh();
  }

  const isBusy = status === 'loading' || status === 'saving';

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5" noValidate>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-[#12345f]">ข้อมูลบริษัท</h2>
          <p className="mt-1 text-sm text-slate-600">แก้ข้อมูลติดต่อหลักที่ใช้บนเว็บไซต์</p>
        </div>
        <button
          type="submit"
          disabled={isBusy}
          className="rounded-lg bg-[#12345f] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d2748] focus:outline-none focus:ring-2 focus:ring-[#12345f]/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'saving' ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Field label="ชื่อบริษัท" value={values.name} onChange={(value) => updateField('name', value)} />
        <Field label="อีเมล" type="email" value={values.email} onChange={(value) => updateField('email', value)} />
        <Field label="เบอร์โทรที่แสดง" value={values.phoneDisplay} onChange={(value) => updateField('phoneDisplay', value)} />
        <Field label="เบอร์โทรสำหรับกดโทร" value={values.phoneHref} onChange={(value) => updateField('phoneHref', value)} />
        <Field label="LINE ID" value={values.lineId} onChange={(value) => updateField('lineId', value)} />
        <Field label="LINE URL" type="url" value={values.lineUrl} onChange={(value) => updateField('lineUrl', value)} />
        <Field
          label="ชื่อ Facebook"
          value={values.facebookDisplay}
          onChange={(value) => updateField('facebookDisplay', value)}
        />
        <Field
          label="Facebook URL"
          type="url"
          value={values.facebookUrl}
          onChange={(value) => updateField('facebookUrl', value)}
        />
        <Field
          label="Google Maps URL"
          type="url"
          value={values.googleMapsSearchUrl}
          onChange={(value) => updateField('googleMapsSearchUrl', value)}
        />
        <Field
          label="Google Maps Embed URL"
          type="url"
          value={values.googleMapsEmbedUrl}
          onChange={(value) => updateField('googleMapsEmbedUrl', value)}
        />
      </div>

      <label className="mt-4 block text-sm font-semibold text-slate-800">
        ที่อยู่
        <textarea
          value={values.address}
          onChange={(event) => updateField('address', event.target.value)}
          className={`${fieldClass} mt-2 min-h-24 resize-y`}
        />
      </label>

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
    </form>
  );
}

function formatSaveError(error: { code?: string; message?: string }) {
  if (error.code === '42501') {
    return 'บันทึกไม่สำเร็จ เพราะ Supabase ยังไม่ให้สิทธิ์ table นี้กับ admin ให้รันไฟล์ supabase/fix-admin-policies.sql ใน SQL Editor';
  }

  if (error.message) {
    return `บันทึกไม่สำเร็จ: ${error.message}`;
  }

  return 'บันทึกไม่สำเร็จ กรุณาตรวจสอบ Supabase อีกครั้ง';
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'email' | 'text' | 'url';
}) {
  return (
    <label className="block text-sm font-semibold text-slate-800">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={`${fieldClass} mt-2`} />
    </label>
  );
}
