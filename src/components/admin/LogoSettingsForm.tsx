'use client';

/* eslint-disable @next/next/no-img-element */

import { FormEvent, useEffect, useState } from 'react';

import { defaultCompanySettings, isSafeLogoUrl, type SiteSettingsRow } from '@/lib/admin/companySettings';
import { requestPreviewRefresh } from '@/lib/admin/previewRefresh';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

type SaveStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';
type MediaAsset = Database['public']['Tables']['media_assets']['Row'];

const fieldClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#f08a24] focus:ring-2 focus:ring-[#f08a24]/20';

export default function LogoSettingsForm() {
  const [logoUrl, setLogoUrl] = useState(defaultCompanySettings.logoUrl);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [status, setStatus] = useState<SaveStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadLogo() {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        setStatus('error');
        setMessage('ยังไม่ได้ตั้งค่า Supabase env');
        return;
      }

      const [{ data: settings, error: settingsError }, { data: mediaAssets }] = await Promise.all([
        supabase.from('site_settings').select('logo_url').eq('id', true).maybeSingle(),
        supabase.from('media_assets').select('*').order('created_at', { ascending: false }).limit(12),
      ]);

      if (!isMounted) {
        return;
      }

      if (settingsError) {
        setStatus('error');
        setMessage('โหลดโลโก้ไม่สำเร็จ');
        return;
      }

      setLogoUrl((settings as Pick<SiteSettingsRow, 'logo_url'> | null)?.logo_url || defaultCompanySettings.logoUrl);
      setAssets((mediaAssets as MediaAsset[] | null) ?? []);
      setStatus('idle');
      setMessage('');
    }

    void loadLogo();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextLogoUrl = logoUrl.trim();

    if (!nextLogoUrl) {
      setStatus('error');
      setMessage('กรุณาใส่ Logo URL');
      return;
    }

    if (!isSafeLogoUrl(nextLogoUrl)) {
      setStatus('error');
      setMessage('Logo URL ต้องเป็น https:// หรือ path ที่ขึ้นต้นด้วย / เท่านั้น');
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

    const { error } = await supabase.from('site_settings').upsert(
      {
        id: true,
        logo_url: nextLogoUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    );

    if (error) {
      setStatus('error');
      setMessage(error.message ? `บันทึกโลโก้ไม่สำเร็จ: ${error.message}` : 'บันทึกโลโก้ไม่สำเร็จ');
      return;
    }

    setLogoUrl(nextLogoUrl);
    setStatus('saved');
    setMessage('บันทึกโลโก้แล้ว');
    requestPreviewRefresh();
  }

  const isBusy = status === 'loading' || status === 'saving';

  return (
    <form onSubmit={handleSubmit} className="admin-card rounded-lg border border-[#f08a24] bg-white p-5" noValidate>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-black text-[#12345f]">โลโก้</h2>
          <p className="mt-1 text-sm text-slate-600">แก้รูปโลโก้ที่ใช้บน Navbar, Footer และการ์ดติดต่อ โดยไม่เปลี่ยนไฟล์รูปเดิม</p>
        </div>
        <button
          type="submit"
          disabled={isBusy}
          className="rounded-lg bg-[#12345f] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d2748] focus:outline-none focus:ring-2 focus:ring-[#12345f]/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'saving' ? 'กำลังบันทึก...' : 'บันทึกโลโก้'}
        </button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Preview</p>
          <div className="mt-3 flex min-h-36 items-center justify-center rounded-lg bg-white p-5">
            <img src={logoUrl || defaultCompanySettings.logoUrl} alt="TRP Powers Plus logo preview" className="max-h-28 w-auto object-contain" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800">
            Logo URL
            <input value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} className={`${fieldClass} mt-2`} />
          </label>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-500">
            ใช้ URL จากคลังรูป หรือ path เดิม เช่น /images/LogoTRP.webp
          </p>

          {assets.length > 0 ? (
            <div className="mt-5">
              <h3 className="text-sm font-black text-[#0f2a5f]">เลือกรูปจากคลัง</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {assets.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setLogoUrl(asset.public_url)}
                    className={`rounded-lg border bg-white p-3 text-left transition hover:border-[#d66d0c] ${
                      logoUrl === asset.public_url ? 'border-[#0f2a5f] ring-2 ring-[#0f2a5f]/20' : 'border-[#f08a24]'
                    }`}
                  >
                    <span className="relative block aspect-video overflow-hidden rounded-md bg-slate-100">
                      <img src={asset.public_url} alt={asset.alt_th || asset.alt_en || asset.path} className="h-full w-full object-contain p-2" />
                    </span>
                    <span className="mt-2 block truncate text-xs font-bold text-slate-700">{asset.alt_th || asset.path}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
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
    </form>
  );
}
