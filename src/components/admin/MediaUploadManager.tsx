'use client';

import Image from 'next/image';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';

import ConfirmResetButton from '@/components/admin/ConfirmResetButton';
import { formatMediaAssetDeleteError } from '@/lib/admin/databaseErrors';
import {
  buildMediaStoragePath,
  formatBytes,
  getCoverCropRect,
  getHeroOutputSize,
  HERO_BACKGROUND_HEIGHT,
  HERO_BACKGROUND_WIDTH,
  MEDIA_BUCKET,
  MEDIA_OUTPUT_MIME,
  MEDIA_WEBP_QUALITY,
  scaleImageSize,
  validateHeroCropSize,
  validateMediaFile,
} from '@/lib/admin/mediaUpload';
import { requestPreviewRefresh } from '@/lib/admin/previewRefresh';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

type MediaAsset = Database['public']['Tables']['media_assets']['Row'];

type UploadStatus = 'idle' | 'compressing' | 'uploading' | 'deleting' | 'saved' | 'error';
type UploadPreset = 'standard' | 'hero';

type ProcessedImage = {
  blob: Blob;
  width: number;
  height: number;
  originalBytes: number;
  outputBytes: number;
};

const fieldClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#f08a24] focus:ring-2 focus:ring-[#f08a24]/20';

export default function MediaUploadManager() {
  const [file, setFile] = useState<File | null>(null);
  const [altTh, setAltTh] = useState('');
  const [altEn, setAltEn] = useState('');
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [message, setMessage] = useState('');
  const [processed, setProcessed] = useState<ProcessedImage | null>(null);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [uploadPreset, setUploadPreset] = useState<UploadPreset>('standard');

  useEffect(() => {
    void loadAssets();
  }, []);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);
  const processedPreviewUrl = useMemo(() => (processed ? URL.createObjectURL(processed.blob) : ''), [processed]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (processedPreviewUrl) {
        URL.revokeObjectURL(processedPreviewUrl);
      }
    };
  }, [processedPreviewUrl]);

  useEffect(() => {
    if (!file) {
      return;
    }

    if (uploadPreset !== 'hero') {
      return;
    }

    const selectedFile = file;
    let isCurrent = true;

    async function processHeroPreview() {
      setStatus('compressing');
      setMessage('');

      try {
        const cropped = await compressImageToWebp(selectedFile, 'hero');

        if (!isCurrent) {
          return;
        }

        setProcessed(cropped);
        setStatus('idle');
      } catch (error) {
        if (!isCurrent) {
          return;
        }

        setProcessed(null);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'crop รูป Hero ไม่สำเร็จ กรุณาลองไฟล์อื่น');
      }
    }

    void processHeroPreview();

    return () => {
      isCurrent = false;
    };
  }, [file, uploadPreset]);

  const compressionSummary = useMemo(() => {
    if (!processed) {
      return '';
    }

    const savedBytes = Math.max(processed.originalBytes - processed.outputBytes, 0);
    const savedPercent = processed.originalBytes > 0 ? Math.round((savedBytes / processed.originalBytes) * 100) : 0;

    return `${formatBytes(processed.originalBytes)} → ${formatBytes(processed.outputBytes)} (${processed.width}×${processed.height}, ลด ${savedPercent}%)`;
  }, [processed]);

  async function loadAssets() {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const { data } = await supabase
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(12);

    setAssets((data as MediaAsset[] | null) ?? []);
    requestPreviewRefresh();
  }

  function removeAssetFromView(assetId: string) {
    setAssets((currentAssets) => currentAssets.filter((currentAsset) => currentAsset.id !== assetId));
  }

  async function hardDeleteAsset(asset: MediaAsset) {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    setStatus('deleting');
    setMessage('');

    const { error: storageError } = await supabase.storage.from(MEDIA_BUCKET).remove([asset.path]);

    if (storageError && !storageError.message?.toLowerCase().includes('not found')) {
      setStatus('error');
      setMessage(`ลบไฟล์รูปไม่สำเร็จ: ${storageError.message}`);
      return;
    }

    const { error: deleteError } = await supabase.rpc('hard_delete_media_asset', { asset_id: asset.id });

    if (deleteError) {
      setStatus('error');
      setMessage(formatMediaAssetDeleteError(deleteError));
      return;
    }

    removeAssetFromView(asset.id);
    setStatus('saved');
    setMessage('ลบไฟล์รูปถาวรแล้ว');
    await loadAssets();
    requestPreviewRefresh();
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;
    setProcessed(null);
    setMessage('');

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const validation = validateMediaFile(selectedFile);

    if (!validation.ok) {
      setFile(null);
      setStatus('error');
      setMessage(validation.message);
      return;
    }

    setFile(selectedFile);
    setStatus('idle');
  }

  function selectUploadPreset(nextPreset: UploadPreset) {
    setUploadPreset(nextPreset);

    if (nextPreset !== 'hero') {
      setProcessed(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setStatus('error');
      setMessage('กรุณาเลือกรูปภาพก่อน upload');
      return;
    }

    if (!altTh.trim()) {
      setStatus('error');
      setMessage('กรุณากรอก alt text ภาษาไทย');
      return;
    }

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    setStatus('compressing');
    setMessage('');

    let compressed: ProcessedImage;

    try {
      compressed = uploadPreset === 'hero' && processed ? processed : await compressImageToWebp(file, uploadPreset);
      setProcessed(compressed);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'แปลงรูปไม่สำเร็จ กรุณาลองไฟล์อื่น');
      return;
    }

    setStatus('uploading');

    const path = buildMediaStoragePath(file.name);
    const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(path, compressed.blob, {
      cacheControl: '31536000',
      contentType: MEDIA_OUTPUT_MIME,
      upsert: false,
    });

    if (uploadError) {
      setStatus('error');
      setMessage(formatUploadError(uploadError));
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

    const { error: insertError } = await supabase.from('media_assets').insert({
      bucket: MEDIA_BUCKET,
      path,
      public_url: publicUrl,
      alt_th: altTh.trim(),
      alt_en: altEn.trim(),
      mime_type: MEDIA_OUTPUT_MIME,
      size_bytes: compressed.outputBytes,
    });

    if (insertError) {
      setStatus('error');
      setMessage(`upload สำเร็จ แต่บันทึก metadata ไม่สำเร็จ: ${insertError.message}`);
      return;
    }

    setStatus('saved');
    setMessage('upload รูปและบันทึกข้อมูลแล้ว');
    setFile(null);
    setAltTh('');
    setAltEn('');
    setUploadPreset('standard');
    await loadAssets();
    requestPreviewRefresh();
  }

  const isBusy = status === 'compressing' || status === 'uploading' || status === 'deleting';

  return (
    <section className="admin-card rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-[#0f2a5f]">รูปภาพเว็บไซต์</h2>
          <p className="mt-1 text-sm text-slate-600">แปลงรูปเป็น WebP และลดขนาดก่อนเก็บใน Supabase Storage</p>
        </div>
        <p className="rounded-full bg-[#e3f2fd] px-3 py-1.5 text-xs font-bold text-[#0f2a5f]">สูงสุด 20MB ก่อนแปลง</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]" noValidate>
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-800">
            ประเภทการใช้งาน
            <select value={uploadPreset} onChange={(event) => selectUploadPreset(event.target.value as UploadPreset)} className={`${fieldClass} mt-2`}>
              <option value="standard">รูปทั่วไป</option>
              <option value="hero">พื้นหลัง Hero (crop อัตโนมัติ)</option>
            </select>
            <span className="mt-2 block text-xs font-semibold leading-relaxed text-slate-500">
              โหมด Hero จะ crop กลางภาพทันทีตอนเลือกไฟล์ และบันทึกได้สูงสุด {HERO_BACKGROUND_WIDTH}×{HERO_BACKGROUND_HEIGHT} px
            </span>
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            เลือกรูปภาพ
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="mt-2 block w-full cursor-pointer rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-[#0f2a5f] file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
            />
            <span className="mt-2 block text-xs font-semibold leading-relaxed text-slate-500">
              พื้นหลัง Hero ควรใช้รูปแนวนอนขนาดใหญ่ และวางจุดสำคัญไว้กลางภาพ
            </span>
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            Alt text ภาษาไทย
            <input value={altTh} onChange={(event) => setAltTh(event.target.value)} className={`${fieldClass} mt-2`} />
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            Alt text ภาษาอังกฤษ (ไม่บังคับ)
            <input value={altEn} onChange={(event) => setAltEn(event.target.value)} className={`${fieldClass} mt-2`} />
          </label>

          <button
            type="submit"
            disabled={isBusy}
            className="w-full rounded-lg bg-[#0f2a5f] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#061a3d] focus:outline-none focus:ring-2 focus:ring-[#0f2a5f]/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'compressing' ? 'กำลังแปลงรูป...' : status === 'uploading' ? 'กำลัง upload...' : 'แปลงและ Upload'}
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className={`relative flex items-center justify-center overflow-hidden rounded-lg bg-white ${uploadPreset === 'hero' ? 'aspect-[256/110] min-h-0' : 'min-h-56'}`}>
            {processedPreviewUrl ? (
              <Image src={processedPreviewUrl} alt="Preview cropped upload" fill className="object-cover" unoptimized />
            ) : previewUrl ? (
              <Image src={previewUrl} alt="Preview selected upload" fill className={uploadPreset === 'hero' ? 'object-cover' : 'object-contain p-3'} unoptimized />
            ) : (
              <p className="text-sm font-semibold text-slate-500">ยังไม่ได้เลือกรูป</p>
            )}
          </div>

          {file ? (
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div>
                <dt className="font-bold text-slate-500">ไฟล์ต้นฉบับ</dt>
                <dd className="mt-1 break-words font-semibold">{file.name}</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">ขนาด</dt>
                <dd className="mt-1 font-semibold">{formatBytes(file.size)}</dd>
              </div>
            </dl>
          ) : null}

          {compressionSummary ? <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">{compressionSummary}</p> : null}
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

      {assets.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-sm font-black text-[#0f2a5f]">รูปล่าสุด</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset) => (
              <article
                key={asset.id}
                className="group rounded-lg border border-[#f08a24] bg-white p-3 transition hover:border-[#d66d0c]"
              >
                <a href={asset.public_url} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="relative aspect-video overflow-hidden rounded-md bg-slate-100">
                    <Image src={asset.public_url} alt={asset.alt_th || asset.alt_en} fill className="object-cover" unoptimized />
                  </div>
                </a>
                <p className="mt-2 truncate text-xs font-bold text-slate-700">{asset.alt_th || asset.path}</p>
                <p className="mt-1 text-xs text-slate-500">{asset.size_bytes ? formatBytes(asset.size_bytes) : 'ไม่ทราบขนาด'}</p>
                <div className="mt-3">
                  <ConfirmResetButton
                    title="ลบไฟล์รูปนี้ถาวร"
                    description="ระบบจะลบไฟล์ออกจาก Supabase Storage และลบ metadata ออกจากฐานข้อมูลทันที การลบนี้กู้คืนไม่ได้"
                    buttonLabel="ลบถาวร"
                    confirmButtonLabel="ยืนยันลบถาวร"
                    confirmText="ลบถาวร"
                    variant="danger"
                    disabled={isBusy}
                    onConfirm={() => hardDeleteAsset(asset)}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

async function compressImageToWebp(file: File, preset: UploadPreset): Promise<ProcessedImage> {
  const bitmap = await createImageBitmap(file);
  const heroCrop = preset === 'hero' ? getCoverCropRect(bitmap.width, bitmap.height, HERO_BACKGROUND_WIDTH, HERO_BACKGROUND_HEIGHT) : null;

  if (heroCrop) {
    const validation = validateHeroCropSize(heroCrop.width, heroCrop.height);

    if (!validation.ok) {
      bitmap.close();
      throw new Error(validation.message);
    }
  }

  const size = heroCrop ? getHeroOutputSize(heroCrop.width, heroCrop.height) : scaleImageSize(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = size.width;
  canvas.height = size.height;

  const context = canvas.getContext('2d');

  if (!context) {
    bitmap.close();
    throw new Error('Canvas is unavailable.');
  }

  if (heroCrop) {
    context.drawImage(bitmap, heroCrop.x, heroCrop.y, heroCrop.width, heroCrop.height, 0, 0, size.width, size.height);
  } else {
    context.drawImage(bitmap, 0, 0, size.width, size.height);
  }

  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, MEDIA_OUTPUT_MIME, MEDIA_WEBP_QUALITY);
  });

  if (!blob) {
    throw new Error('Could not encode image.');
  }

  return {
    blob,
    width: size.width,
    height: size.height,
    originalBytes: file.size,
    outputBytes: blob.size,
  };
}

function formatUploadError(error: { message?: string; statusCode?: string }) {
  if (error.message?.toLowerCase().includes('row-level security')) {
    return 'upload ไม่สำเร็จเพราะ Storage policy ยังไม่ครบ ให้รัน migration 202605100004_media_storage_bucket.sql';
  }

  if (error.statusCode === '404') {
    return 'ไม่พบ bucket site-media ให้รัน migration 202605100004_media_storage_bucket.sql ใน Supabase SQL Editor ก่อน';
  }

  return `upload ไม่สำเร็จ: ${error.message ?? 'กรุณาตรวจสอบ Supabase Storage'}`;
}
