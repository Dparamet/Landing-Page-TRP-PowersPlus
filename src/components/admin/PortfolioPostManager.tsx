'use client';

import { FormEvent, useEffect, useState } from 'react';

import { serviceCategories as fallbackServiceCategories } from '@/content/site';
import { useServiceCategories } from '@/hooks/useServiceCategories';
import {
  defaultPortfolioPostFormValues,
  mapPortfolioPostFormToInsert,
  mapPortfolioPostFormToUpdate,
  mapPortfolioProjectRowToForm,
  validatePortfolioPost,
  type PortfolioPostFormValues,
  type PortfolioProjectRow,
} from '@/lib/admin/portfolioPosts';
import { formatAdminLoadError, formatAdminRpcError, formatAdminSaveError } from '@/lib/admin/databaseErrors';
import { requestPreviewRefresh } from '@/lib/admin/previewRefresh';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type SaveStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#f08a24] focus:ring-2 focus:ring-[#f08a24]/20';

export default function PortfolioPostManager() {
  const serviceCategories = useServiceCategories();
  const [values, setValues] = useState<PortfolioPostFormValues>(defaultPortfolioPostFormValues);
  const [posts, setPosts] = useState<PortfolioProjectRow[]>([]);
  const [status, setStatus] = useState<SaveStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    void loadPosts();
  }, []);

  function updateField<K extends keyof PortfolioPostFormValues>(field: K, value: PortfolioPostFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function editPost(post: PortfolioProjectRow) {
    setValues(mapPortfolioProjectRowToForm(post));
    setMessage('');
    window.requestAnimationFrame(() => {
      document.getElementById('portfolio-post-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  async function loadPosts() {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus('error');
      setMessage('ยังไม่ได้ตั้งค่า Supabase env');
      return;
    }

    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('updated_at', { ascending: false, nullsFirst: false });

    if (error) {
      setStatus('error');
      setMessage(formatAdminLoadError('โพสต์ผลงาน', 'portfolio_projects', error));
      return;
    }

    setPosts((data as PortfolioProjectRow[] | null) ?? []);
    setStatus('idle');
    requestPreviewRefresh();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validatePortfolioPost(values);

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
      ? supabase.from('portfolio_projects').update(mapPortfolioPostFormToUpdate(validation.value)).eq('id', validation.value.id)
      : supabase.from('portfolio_projects').insert(mapPortfolioPostFormToInsert(validation.value));
    const { error } = await saveQuery;

    if (error) {
      setStatus('error');
      setMessage(formatAdminSaveError('โพสต์ผลงาน', 'portfolio_projects', error));
      return;
    }

    setValues(defaultPortfolioPostFormValues);
    setStatus('saved');
    setMessage(validation.value.id ? 'บันทึกโพสต์ผลงานแล้ว' : 'สร้างโพสต์ผลงานแล้ว');
    await loadPosts();
    requestPreviewRefresh();
  }

  async function softDeletePost(postId: string) {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const { error } = await supabase.rpc('soft_delete_portfolio_project', {
      project_id: postId,
      retention_days: 30,
    });

    if (error) {
      setStatus('error');
      setMessage(formatAdminRpcError('ลบโพสต์', 'soft_delete_portfolio_project', error));
      return;
    }

    setMessage('ย้ายโพสต์ไปถังพักแล้ว สามารถกู้คืนได้ภายใน 30 วัน');
    setStatus('saved');
    await loadPosts();
    requestPreviewRefresh();
  }

  async function restorePost(postId: string) {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const { error } = await supabase.rpc('restore_portfolio_project', {
      project_id: postId,
    });

    if (error) {
      setStatus('error');
      setMessage(formatAdminRpcError('กู้คืนโพสต์', 'restore_portfolio_project', error));
      return;
    }

    setMessage('กู้คืนโพสต์แล้ว');
    setStatus('saved');
    await loadPosts();
    requestPreviewRefresh();
  }

  async function hardDeletePost(postId: string) {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const { error } = await supabase.rpc('hard_delete_portfolio_project', {
      project_id: postId,
    });

    if (error) {
      setStatus('error');
      setMessage(formatAdminRpcError('ลบถาวรโพสต์', 'hard_delete_portfolio_project', error));
      return;
    }

    setMessage('ลบถาวรโพสต์แล้ว');
    setStatus('saved');
    await loadPosts();
    requestPreviewRefresh();
  }

  const isBusy = status === 'loading' || status === 'saving';

  return (
    <section className="admin-card rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-[#12345f]">โพสต์ผลงาน</h2>
          <p className="mt-1 text-sm text-slate-600">สร้าง แก้ไข ซ่อน ลบแบบพักไว้ 30 วัน และกู้คืนโพสต์ผลงาน</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={() => { setValues(defaultPortfolioPostFormValues); setMessage(''); }} className="rounded-lg bg-[#12345f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0d2748]">
            เพิ่มผลงาน
          </button>
          <button type="button" onClick={() => void loadPosts()} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-[#f08a24] hover:text-[#f08a24]">
            โหลดโพสต์ใหม่
          </button>
        </div>
      </div>

      <form id="portfolio-post-form" onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2" noValidate>
        <Field label="ชื่อผลงาน ภาษาไทย" value={values.titleTh} onChange={(value) => updateField('titleTh', value)} />
        <Field label="ชื่อผลงาน ภาษาอังกฤษ" value={values.titleEn} onChange={(value) => updateField('titleEn', value)} />
        <label className="block text-sm font-semibold text-slate-800">
          หมวดหมู่
          <select
            value={values.categoryKey}
            onChange={(event) => updateField('categoryKey', event.target.value as PortfolioPostFormValues['categoryKey'])}
            className={`${inputClass} mt-2`}
          >
            {(serviceCategories.length > 0 ? serviceCategories : fallbackServiceCategories).map((service) => (
              <option key={service.key} value={service.key}>
                {service.shortTitle.th}
              </option>
            ))}
          </select>
        </label>
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
        <Field label="ประเภทระบบ ภาษาไทย" value={values.systemTypeTh} onChange={(value) => updateField('systemTypeTh', value)} />
        <Field label="ประเภทระบบ ภาษาอังกฤษ" value={values.systemTypeEn} onChange={(value) => updateField('systemTypeEn', value)} />
        <Field label="พื้นที่ ภาษาไทย" value={values.locationTh} onChange={(value) => updateField('locationTh', value)} />
        <Field label="พื้นที่ ภาษาอังกฤษ" value={values.locationEn} onChange={(value) => updateField('locationEn', value)} />
        <Field label="Metric หลัก ภาษาไทย" value={values.metricValueTh} onChange={(value) => updateField('metricValueTh', value)} />
        <Field label="Metric หลัก ภาษาอังกฤษ" value={values.metricValueEn} onChange={(value) => updateField('metricValueEn', value)} />
        <label className="block text-sm font-semibold text-slate-800">
          ลำดับที่
          <input type="number" min="0" value={values.sortOrder} onChange={(event) => updateField('sortOrder', Number(event.target.value))} className={`${inputClass} mt-2`} />
        </label>
        <Textarea label="คำอธิบาย ภาษาไทย" value={values.descriptionTh} onChange={(value) => updateField('descriptionTh', value)} />
        <Textarea label="คำอธิบาย ภาษาอังกฤษ" value={values.descriptionEn} onChange={(value) => updateField('descriptionEn', value)} />
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(event) => updateField('published', event.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          publish ทันที
        </label>
        <button
          type="submit"
          disabled={isBusy}
          className="rounded-lg bg-[#12345f] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d2748] focus:outline-none focus:ring-2 focus:ring-[#12345f]/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'saving' ? 'กำลังบันทึกโพสต์...' : 'บันทึกโพสต์'}
        </button>
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
        <h3 className="text-sm font-black text-[#12345f]">โพสต์จากฐานข้อมูล</h3>
        <div className="mt-3 grid gap-3">
          {posts.length === 0 ? <p className="text-sm text-slate-500">ยังไม่มีโพสต์จากฐานข้อมูล</p> : null}
          {posts.map((post) => {
            const title = readLocalized(post.title, 'th') || post.slug;
            const isDeleted = Boolean(post.deleted_at);
            const isActive = values.id === post.id;

            return (
              <article
                key={post.id}
                className={`flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between ${
                  isActive ? 'border-[#f08a24] bg-[#fff7ed]' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div>
                  <p className="text-sm font-black text-[#12345f]">{title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {isActive ? 'กำลังเปิดแก้ไข · ' : ''}
                    {isDeleted ? `อยู่ในถังพัก ลบจริงหลัง ${post.purge_after ?? '-'}` : post.published ? 'เผยแพร่อยู่' : 'draft'}
                  </p>
                </div>
                {isDeleted ? (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => void restorePost(post.id)}
                      className="rounded-lg border border-emerald-300 px-3 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
                    >
                      กู้คืน
                    </button>
                    <button
                      type="button"
                      onClick={() => void hardDeletePost(post.id)}
                      className="rounded-lg border border-red-500 bg-red-50 px-3 py-2 text-sm font-bold text-red-800 transition hover:bg-red-100"
                    >
                      ลบถาวร
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => editPost(post)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-[#12345f] transition hover:border-[#f08a24] hover:text-[#b85c00]"
                    >
                      ดู/แก้ไข
                    </button>
                    <a
                      href="/portfolio#portfolio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-[#12345f] transition hover:border-[#f08a24] hover:text-[#b85c00]"
                    >
                      ดูหน้าเว็บ
                    </a>
                    <button
                      type="button"
                      onClick={() => void softDeletePost(post.id)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
                    >
                      ลบแบบพักไว้ 30 วัน
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
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

function readLocalized(value: unknown, language: 'th' | 'en') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return '';
  }

  const localized = value as Record<string, unknown>;
  return typeof localized[language] === 'string' ? localized[language] : '';
}
