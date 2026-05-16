'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useMemo, useState } from 'react';

import { formatBytes } from '@/lib/admin/mediaUpload';
import { buildStandardItemUpsertRow, deriveStandardItemIdentity, type StandardItemUpsertRow } from '@/lib/admin/standardItems';
import { requestPreviewRefresh } from '@/lib/admin/previewRefresh';
import { fallbackStandardItems, getStandardItemAltText, type StandardItemRow } from '@/lib/standards';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

type MediaAsset = Database['public']['Tables']['media_assets']['Row'];
type StandardItem = StandardItemRow;
type SaveStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

type StandardItemsClient = {
  from: (table: 'standard_items') => {
    upsert: (row: StandardItemUpsertRow, options?: { onConflict?: string }) => Promise<{ error: { message: string } | null }>;
  };
};

const fieldClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#f08a24] focus:ring-2 focus:ring-[#f08a24]/20';

const selectClass = `${fieldClass} font-semibold`;

type StandardItemForm = {
  id: string;
  title: string;
  altText: string;
  sortOrder: number;
  published: boolean;
};

type StandardItemFormInput = Partial<Record<keyof StandardItemForm, unknown>>;

const defaultForm: StandardItemForm = {
  id: '',
  title: '',
  altText: '',
  sortOrder: 10,
  published: true,
};

export default function StandardItemManager() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [items, setItems] = useState<StandardItem[]>([]);
  const [assetId, setAssetId] = useState('');
  const [hoverAssetId, setHoverAssetId] = useState('');
  const [form, setForm] = useState<StandardItemForm>(() => normalizeForm(defaultForm));
  const [status, setStatus] = useState<SaveStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    void loadData();
  }, []);

  const selectedAsset = useMemo(() => assets.find((asset) => asset.id === assetId) ?? null, [assetId, assets]);
  const selectedHoverAsset = useMemo(() => assets.find((asset) => asset.id === hoverAssetId) ?? null, [hoverAssetId, assets]);
  const displayItems = useMemo(
    () =>
      items.length > 0
        ? items
        : fallbackStandardItems.map((item) => ({
            id: item.id,
            title: item.title,
            image_url: item.imageUrl,
            hover_image_url: item.hoverImageUrl,
            image_alt: item.altText,
            alt_text: item.altText,
            media_asset_id: null,
            hover_media_asset_id: null,
            sort_order: item.sortOrder,
            published: item.published,
            created_at: null,
            updated_at: null,
            deleted_at: item.deletedAt,
            purge_after: item.purgeAfter,
          })),
    [items],
  );

  async function loadData() {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    const [{ data: assetRows, error: assetError }, { data: itemRows, error: itemError }] = await Promise.all([
      supabase.from('media_assets').select('*').order('created_at', { ascending: false }).limit(48),
      supabase.from('standard_items').select('*').order('sort_order', { ascending: true }),
    ]);

    if (assetError || itemError) {
      setStatus('error');
      setMessage('โหลดรูปหรือรายการพาร์ทเนอร์/ลูกค้าไม่สำเร็จ ตรวจสอบ migration ล่าสุด');
      return;
    }

    const nextAssets = (assetRows as MediaAsset[] | null) ?? [];
    setAssets(nextAssets);
    setItems((itemRows as StandardItem[] | null) ?? []);
    setAssetId((current) => current || nextAssets[0]?.id || '');
    setHoverAssetId((current) => current || '');
    setStatus('idle');
    requestPreviewRefresh();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const altText = safeText(form.altText).trim();
    const assetLabel =
      selectedAsset?.alt_th ||
      selectedAsset?.alt_en ||
      selectedAsset?.path ||
      selectedHoverAsset?.alt_th ||
      selectedHoverAsset?.alt_en ||
      selectedHoverAsset?.path;
    const identity = deriveStandardItemIdentity({
      id: form.id,
      title: form.title,
      altText,
      assetLabel,
      fallbackSuffix: Date.now().toString(36),
    });
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    setStatus('saving');
    setMessage('');

    const standardClient = supabase as unknown as StandardItemsClient;
    const upsertRow = buildStandardItemUpsertRow({
        id: identity.id,
        title: identity.title,
        imageUrl: selectedAsset?.public_url ?? null,
        hoverImageUrl: selectedHoverAsset?.public_url ?? null,
        altText,
        assetAltText: selectedAsset?.alt_th || selectedAsset?.alt_en || selectedAsset?.path,
        sortOrder: form.sortOrder,
        published: form.published,
      });
    const { error } = await standardClient.from('standard_items').upsert(upsertRow, { onConflict: 'id' });

    if (error && isMissingStandardHoverColumnError(error)) {
      const fallbackRow = { ...upsertRow };
      delete fallbackRow.hover_image_url;
      const fallbackResult = await standardClient.from('standard_items').upsert(fallbackRow, { onConflict: 'id' });

      if (!fallbackResult.error) {
        setStatus('saved');
        setMessage('บันทึกรายการพาร์ทเนอร์/ลูกค้าแล้ว แต่ยังไม่บันทึกรูป hover เพราะฐานข้อมูลยังไม่ได้รัน migration hover_image_url');
        setForm(normalizeForm(defaultForm));
        setAssetId('');
        setHoverAssetId('');
        await loadData();
        requestPreviewRefresh();
        return;
      }
    }

    if (error) {
      setStatus('error');
      setMessage(`บันทึกรายการพาร์ทเนอร์/ลูกค้าไม่สำเร็จ: ${error.message}`);
      return;
    }

    setStatus('saved');
    setMessage('บันทึกรายการพาร์ทเนอร์/ลูกค้าแล้ว');
    setForm(normalizeForm(defaultForm));
    setAssetId('');
    setHoverAssetId('');
    await loadData();
    requestPreviewRefresh();
  }

  function editItem(item: StandardItem) {
    setForm(normalizeForm({
      id: item.id,
      title: item.title,
      altText: getStandardItemAltText(item),
      sortOrder: item.sort_order,
      published: item.published,
    }));
    setAssetId(item.media_asset_id ?? assets.find((asset) => asset.public_url === item.image_url)?.id ?? '');
    setHoverAssetId(item.hover_media_asset_id ?? assets.find((asset) => asset.public_url === item.hover_image_url)?.id ?? '');
    setMessage('');
    setStatus('idle');
  }

  async function callItemRpc(functionName: 'soft_delete_standard_item' | 'restore_standard_item' | 'hard_delete_standard_item', itemId: string) {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const { error } = await supabase.rpc(functionName, { item_id: itemId });

    if (error) {
      setStatus('error');
      setMessage(error.message);
      return;
    }

    await loadData();
    requestPreviewRefresh();
  }

  function updateForm(values: Partial<StandardItemForm>) {
    setForm((current) => normalizeForm({ ...current, ...values }));
  }

  const isBusy = status === 'loading' || status === 'saving';

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-[#12345f]">พาร์ทเนอร์และลูกค้าที่ไว้วางใจ</h2>
          <p className="mt-1 text-sm text-slate-600">เลือกรูปจากคลังรูป แล้วจัดลำดับโลโก้พาร์ทเนอร์/ลูกค้าที่แสดงในหน้าเว็บ</p>
        </div>
        <button
          type="button"
          onClick={() => void loadData()}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-[#f08a24] hover:text-[#f08a24]"
        >
          โหลดใหม่
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]" noValidate>
        <div className="space-y-4">
          <div className="grid gap-4">
            <label className="block text-sm font-semibold text-slate-800">
              ลำดับ
              <input
                type="number"
                value={Number.isFinite(form.sortOrder) ? form.sortOrder : 10}
                onChange={(event) => updateForm({ sortOrder: Number(event.target.value) })}
                className={`${fieldClass} mt-2`}
              />
            </label>
          </div>

          <label className="block text-sm font-semibold text-slate-800">
            Alt text
            <input value={safeText(form.altText)} onChange={(event) => updateForm({ altText: event.target.value })} className={`${fieldClass} mt-2`} />
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            รูปหลักใน carousel
            <select value={assetId} onChange={(event) => setAssetId(event.target.value)} className={`${selectClass} mt-2`}>
              <option value="">ไม่ใช้รูป แสดงเป็นชื่อแทน</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.alt_th || asset.path}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            รูปตอนเอาเมาส์วาง (Hover)
            <select value={hoverAssetId} onChange={(event) => setHoverAssetId(event.target.value)} className={`${selectClass} mt-2`}>
              <option value="">ไม่ใช้รูป hover</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.alt_th || asset.path}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3 text-sm font-bold text-slate-800">
            <input
              type="checkbox"
              checked={form.published ?? true}
              onChange={(event) => updateForm({ published: event.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-[#f08a24] focus:ring-[#f08a24]"
            />
            แสดงบนหน้าเว็บ
          </label>

          <button
            type="submit"
            disabled={isBusy}
            className="w-full rounded-lg bg-[#12345f] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d2748] focus:outline-none focus:ring-2 focus:ring-[#12345f]/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'saving' ? 'กำลังบันทึก...' : 'บันทึกรายการพาร์ทเนอร์/ลูกค้า'}
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-black text-[#12345f]">ตัวอย่างรูปหลัก</p>
          <div className="relative mt-3 flex min-h-60 items-center justify-center overflow-hidden rounded-lg bg-white">
            {selectedAsset ? (
              <Image src={selectedAsset.public_url} alt={selectedAsset.alt_th || selectedAsset.path} fill className="object-contain p-4" unoptimized />
            ) : (
              <span className="text-center text-4xl font-black text-black">{safeText(form.title) || 'Partner'}</span>
            )}
          </div>
          {selectedAsset ? (
            <p className="mt-3 text-xs font-semibold text-slate-600">
              {selectedAsset.alt_th || selectedAsset.path} · {selectedAsset.size_bytes ? formatBytes(selectedAsset.size_bytes) : 'ไม่ทราบขนาด'}
            </p>
          ) : null}
          <div className="relative mt-4 flex min-h-40 items-center justify-center overflow-hidden rounded-lg bg-white">
            <span className="absolute left-3 top-3 z-10 rounded bg-[#0f2a5f] px-2 py-1 text-[10px] font-black text-white">Hover preview</span>
            {selectedHoverAsset ? (
              <Image src={selectedHoverAsset.public_url} alt={selectedHoverAsset.alt_th || selectedHoverAsset.path} fill className="object-contain p-4" unoptimized />
            ) : (
              <span className="text-center text-sm font-bold text-slate-500">ยังไม่ได้เลือกรูป hover</span>
            )}
          </div>
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

      <div className="mt-6">
        <h3 className="text-sm font-black text-[#12345f]">รายการที่ตั้งค่าไว้</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item) => (
            <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-md bg-slate-100">
                {item.image_url ? (
                  <Image src={item.image_url} alt={getStandardItemAltText(item)} fill className="object-contain p-3" unoptimized />
                ) : (
                  <span className="text-xl font-black text-slate-900">{item.title}</span>
                )}
              </div>
              {item.hover_image_url ? (
                <div className="relative mt-2 flex aspect-video items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white">
                  <Image src={item.hover_image_url} alt={getStandardItemAltText(item)} fill className="object-contain p-3" unoptimized />
                  <span className="absolute left-2 top-2 rounded bg-[#0f2a5f] px-2 py-1 text-[10px] font-black text-white">Hover</span>
                </div>
              ) : null}
              <p className="mt-2 truncate text-xs font-bold text-slate-700">
                {item.sort_order}. {item.title}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {item.deleted_at ? `ถังพัก ลบจริงหลัง ${item.purge_after ?? '-'}` : item.published ? 'ใช้งานอยู่' : 'ซ่อนอยู่'}
              </p>
              {items.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-3">
                  <button type="button" onClick={() => editItem(item)} className="text-xs font-bold text-[#0f2a5f] transition hover:text-[#d66d0c]">
                    แก้ไข
                  </button>
                  {item.deleted_at ? (
                    <>
                      <button type="button" onClick={() => void callItemRpc('restore_standard_item', item.id)} className="text-xs font-bold text-emerald-700 transition hover:text-emerald-800">
                        กู้คืน
                      </button>
                      <button type="button" onClick={() => void callItemRpc('hard_delete_standard_item', item.id)} className="text-xs font-bold text-red-700 transition hover:text-red-800">
                        ลบถาวร
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => void callItemRpc('soft_delete_standard_item', item.id)} className="text-xs font-bold text-red-600 transition hover:text-red-700">
                      ลบแบบพักไว้ 30 วัน
                    </button>
                  )}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


function normalizeForm(form: StandardItemFormInput): StandardItemForm {
  return {
    id: safeText(form.id),
    title: safeText(form.title),
    altText: safeText(form.altText),
    sortOrder: Number.isFinite(form.sortOrder) ? Number(form.sortOrder) : 10,
    published: typeof form.published === 'boolean' ? form.published : true,
  };
}

function safeText(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function isMissingStandardHoverColumnError(error: { message?: string }) {
  return Boolean(error.message?.includes("'hover_image_url' column") || error.message?.includes('hover_image_url'));
}
