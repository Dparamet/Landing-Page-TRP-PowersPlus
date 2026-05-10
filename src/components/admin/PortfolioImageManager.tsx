'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useMemo, useState } from 'react';

import { portfolioProjects } from '@/content/site';
import { formatBytes } from '@/lib/admin/mediaUpload';
import { portfolioProjectKey, type PortfolioImageSlot } from '@/lib/portfolioImages';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

type MediaAsset = Database['public']['Tables']['media_assets']['Row'];
type PortfolioImageOverride = Database['public']['Tables']['portfolio_image_overrides']['Row'];
type SaveStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

const imageSlots: Array<{ value: PortfolioImageSlot; label: string }> = [
  { value: 'cover', label: 'รูปหน้าปก' },
  { value: 'before', label: 'ก่อนติดตั้ง' },
  { value: 'during', label: 'ระหว่างติดตั้ง' },
  { value: 'after', label: 'หลังติดตั้ง' },
];

const selectClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#f08a24] focus:ring-2 focus:ring-[#f08a24]/20';

export default function PortfolioImageManager() {
  const firstProjectKey = portfolioProjectKey(portfolioProjects[0]);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [overrides, setOverrides] = useState<PortfolioImageOverride[]>([]);
  const [projectKey, setProjectKey] = useState(firstProjectKey);
  const [imageSlot, setImageSlot] = useState<PortfolioImageSlot>('cover');
  const [assetId, setAssetId] = useState('');
  const [status, setStatus] = useState<SaveStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    void loadData();
  }, []);

  const selectedAsset = useMemo(() => assets.find((asset) => asset.id === assetId) ?? null, [assetId, assets]);
  const selectedProject = useMemo(
    () => portfolioProjects.find((project) => portfolioProjectKey(project) === projectKey) ?? portfolioProjects[0],
    [projectKey],
  );

  async function loadData() {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    const [{ data: assetRows, error: assetError }, { data: overrideRows, error: overrideError }] = await Promise.all([
      supabase.from('media_assets').select('*').order('created_at', { ascending: false }).limit(24),
      supabase.from('portfolio_image_overrides').select('*'),
    ]);

    if (assetError || overrideError) {
      setStatus('error');
      setMessage('โหลดรูปหรือรายการ override ไม่สำเร็จ ตรวจสอบ migration ล่าสุด');
      return;
    }

    const nextAssets = (assetRows as MediaAsset[] | null) ?? [];
    setAssets(nextAssets);
    setOverrides((overrideRows as PortfolioImageOverride[] | null) ?? []);
    setAssetId((current) => current || nextAssets[0]?.id || '');
    setStatus('idle');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedAsset) {
      setStatus('error');
      setMessage('ยังไม่มีรูปที่ upload แล้วให้เลือก');
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

    const { error } = await supabase.from('portfolio_image_overrides').upsert(
      {
        project_key: projectKey,
        image_slot: imageSlot,
        image_url: selectedAsset.public_url,
        alt_th: selectedAsset.alt_th,
        media_asset_id: selectedAsset.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'project_key,image_slot' },
    );

    if (error) {
      setStatus('error');
      setMessage(`บันทึกรูปผลงานไม่สำเร็จ: ${error.message}`);
      return;
    }

    setStatus('saved');
    setMessage('บันทึกรูปผลงานแล้ว');
    await loadData();
  }

  async function clearOverride(override: PortfolioImageOverride) {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    await supabase
      .from('portfolio_image_overrides')
      .delete()
      .eq('project_key', override.project_key)
      .eq('image_slot', override.image_slot);
    await loadData();
  }

  const isBusy = status === 'loading' || status === 'saving';

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-[#12345f]">จัดรูปผลงาน</h2>
          <p className="mt-1 text-sm text-slate-600">เลือกรูปที่ upload แล้วไปแทนรูปหน้าปกหรือแกลเลอรีของผลงาน</p>
        </div>
        <button
          type="button"
          onClick={() => void loadData()}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-[#f08a24] hover:text-[#f08a24]"
        >
          โหลดรูปใหม่
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]" noValidate>
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-800">
            ผลงาน
            <select value={projectKey} onChange={(event) => setProjectKey(event.target.value)} className={`${selectClass} mt-2`}>
              {portfolioProjects.map((project) => (
                <option key={portfolioProjectKey(project)} value={portfolioProjectKey(project)}>
                  {project.title.th}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            ตำแหน่งรูป
            <select
              value={imageSlot}
              onChange={(event) => setImageSlot(event.target.value as PortfolioImageSlot)}
              className={`${selectClass} mt-2`}
            >
              {imageSlots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            รูปที่ upload แล้ว
            <select value={assetId} onChange={(event) => setAssetId(event.target.value)} className={`${selectClass} mt-2`}>
              {assets.length === 0 ? <option value="">ยังไม่มีรูป</option> : null}
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.alt_th || asset.path}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={isBusy || !selectedAsset}
            className="w-full rounded-lg bg-[#12345f] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d2748] focus:outline-none focus:ring-2 focus:ring-[#12345f]/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'saving' ? 'กำลังบันทึก...' : 'ใช้รูปนี้กับผลงาน'}
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-black text-[#12345f]">{selectedProject.title.th}</p>
          <div className="relative mt-3 flex min-h-60 items-center justify-center overflow-hidden rounded-lg bg-white">
            {selectedAsset ? (
              <Image src={selectedAsset.public_url} alt={selectedAsset.alt_th || selectedAsset.path} fill className="object-contain p-3" unoptimized />
            ) : (
              <p className="text-sm font-semibold text-slate-500">upload รูปก่อน แล้วกลับมาเลือกตรงนี้</p>
            )}
          </div>
          {selectedAsset ? (
            <p className="mt-3 text-xs font-semibold text-slate-600">
              {selectedAsset.alt_th || selectedAsset.path} · {selectedAsset.size_bytes ? formatBytes(selectedAsset.size_bytes) : 'ไม่ทราบขนาด'}
            </p>
          ) : null}
        </div>
      </form>

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

      {overrides.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-sm font-black text-[#12345f]">รูปที่ตั้งค่าไว้แล้ว</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {overrides.map((override) => (
              <article key={`${override.project_key}:${override.image_slot}`} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="relative aspect-video overflow-hidden rounded-md bg-slate-100">
                  <Image src={override.image_url} alt={override.alt_th} fill className="object-cover" unoptimized />
                </div>
                <p className="mt-2 truncate text-xs font-bold text-slate-700">
                  {override.project_key} · {slotLabel(override.image_slot)}
                </p>
                <button
                  type="button"
                  onClick={() => void clearOverride(override)}
                  className="mt-2 text-xs font-bold text-red-600 transition hover:text-red-700"
                >
                  ลบการตั้งค่านี้
                </button>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function slotLabel(slot: string) {
  return imageSlots.find((item) => item.value === slot)?.label ?? slot;
}
