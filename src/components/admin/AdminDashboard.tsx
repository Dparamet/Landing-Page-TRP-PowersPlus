'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard';
import CompanySettingsForm from '@/components/admin/CompanySettingsForm';
import ContactItemManager from '@/components/admin/ContactItemManager';
import FaqManager from '@/components/admin/FaqManager';
import MediaUploadManager from '@/components/admin/MediaUploadManager';
import PortfolioImageManager from '@/components/admin/PortfolioImageManager';
import PortfolioPostManager from '@/components/admin/PortfolioPostManager';
import ProcessStepManager from '@/components/admin/ProcessStepManager';
import ServiceManager from '@/components/admin/ServiceManager';
import SiteTextManager from '@/components/admin/SiteTextManager';
import { ADMIN_PREVIEW_REFRESH_EVENT } from '@/lib/admin/previewRefresh';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type AdminSectionKey =
  | 'analytics'
  | 'texts'
  | 'services'
  | 'media'
  | 'portfolioImages'
  | 'portfolioPosts'
  | 'process'
  | 'faqs'
  | 'contact';
type PreviewPageMode = 'landing' | 'details';
type DashboardState =
  | { status: 'loading'; email?: string }
  | { status: 'ready'; email: string; role: string }
  | { status: 'config-missing' }
  | { status: 'forbidden' };

const adminSections: Array<{
  key: AdminSectionKey;
  label: string;
  description: string;
  landingPreviewPath: string;
  landingPreviewHash: string;
  detailsPreviewPath: string;
  detailsPreviewHash: string;
}> = [
  { key: 'analytics', label: 'แดชบอร์ด', description: 'ดูการเคลื่อนไหวหน้าเว็บ', landingPreviewPath: '/', landingPreviewHash: '#hero', detailsPreviewPath: '/', detailsPreviewHash: '#hero' },
  { key: 'texts', label: 'ข้อความ', description: 'หัวข้อและ copy หลัก', landingPreviewPath: '/', landingPreviewHash: '#hero', detailsPreviewPath: '/', detailsPreviewHash: '#hero' },
  { key: 'services', label: 'บริการ', description: 'การ์ดและข้อมูลเตรียมงาน', landingPreviewPath: '/', landingPreviewHash: '#services', detailsPreviewPath: '/services', detailsPreviewHash: '#services' },
  { key: 'portfolioPosts', label: 'ผลงาน', description: 'ข้อมูลโครงการ', landingPreviewPath: '/', landingPreviewHash: '#portfolio', detailsPreviewPath: '/portfolio', detailsPreviewHash: '#portfolio' },
  { key: 'portfolioImages', label: 'รูปผลงาน', description: 'หน้าปกและ gallery', landingPreviewPath: '/', landingPreviewHash: '#portfolio', detailsPreviewPath: '/portfolio', detailsPreviewHash: '#portfolio' },
  { key: 'media', label: 'คลังรูป', description: 'อัปโหลดรูป', landingPreviewPath: '/', landingPreviewHash: '#portfolio', detailsPreviewPath: '/portfolio', detailsPreviewHash: '#portfolio' },
  { key: 'process', label: 'ขั้นตอน', description: 'ลำดับงาน', landingPreviewPath: '/', landingPreviewHash: '#process', detailsPreviewPath: '/process', detailsPreviewHash: '#process' },
  { key: 'faqs', label: 'FAQ', description: 'คำถามตอบ', landingPreviewPath: '/faq', landingPreviewHash: '#faq', detailsPreviewPath: '/faq', detailsPreviewHash: '#faq' },
  { key: 'contact', label: 'ติดต่อ', description: 'ช่องทางและแผนที่', landingPreviewPath: '/', landingPreviewHash: '#contact', detailsPreviewPath: '/contact', detailsPreviewHash: '#contact' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [state, setState] = useState<DashboardState>({ status: 'loading' });
  const [activeSection, setActiveSection] = useState<AdminSectionKey>('analytics');
  const [previewPageMode, setPreviewPageMode] = useState<PreviewPageMode>('landing');
  const [previewVersion, setPreviewVersion] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadAdmin() {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        setState({ status: 'config-missing' });
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/admin/login');
        return;
      }

      const { data } = await supabase
        .from('admin_profiles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      const profile = data as { role: string } | null;

      if (!isMounted) {
        return;
      }

      if (!profile) {
        await supabase.auth.signOut();
        setState({ status: 'forbidden' });
        return;
      }

      setState({
        status: 'ready',
        email: user.email ?? 'admin',
        role: profile.role,
      });
    }

    void loadAdmin();

    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    function refreshPreview() {
      setPreviewVersion((version) => version + 1);
    }

    window.addEventListener(ADMIN_PREVIEW_REFRESH_EVENT, refreshPreview);
    return () => window.removeEventListener(ADMIN_PREVIEW_REFRESH_EVENT, refreshPreview);
  }, []);

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase?.auth.signOut();
    router.replace('/admin/login');
  }

  if (state.status === 'config-missing') {
    return <AdminNotice title="ยังไม่ได้ตั้งค่า Supabase" body="ตรวจสอบไฟล์ .env.local แล้วเปิด dev server ใหม่อีกครั้ง" />;
  }

  if (state.status === 'forbidden') {
    return <AdminNotice title="ไม่มีสิทธิ์เข้าใช้งาน" body="บัญชีนี้ยังไม่ได้ถูกเพิ่มใน admin_profiles" />;
  }

  if (state.status === 'loading') {
    return (
      <div className="admin-card rounded-lg border border-[#f08a24] bg-white p-6 text-sm text-slate-600" aria-busy="true">
        กำลังตรวจสอบสิทธิ์ผู้ดูแล...
      </div>
    );
  }

  const currentSection = adminSections.find((section) => section.key === activeSection) ?? adminSections[0];
  const showPreview = activeSection !== 'analytics';
  const previewPath = previewPageMode === 'landing' ? currentSection.landingPreviewPath : currentSection.detailsPreviewPath;
  const previewHash = previewPageMode === 'landing' ? currentSection.landingPreviewHash : currentSection.detailsPreviewHash;
  const previewUrl = `${previewPath}?preview=${previewVersion}${previewHash}`;

  return (
    <section className="admin-page admin-stagger space-y-4 text-[#182230]">
      <div className="rounded-[28px] bg-[#0f2a5f] p-3 text-white shadow-[0_18px_48px_rgba(15,42,95,0.24)] sm:p-4">
        <div className="rounded-[24px] bg-[#12345f] p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#f8a34a]">TRP Powers Plus CMS</p>
              <h1 className="mt-2 text-2xl font-black text-white">จัดการข้อมูลเว็บไซต์</h1>
              <p className="mt-2 text-sm leading-6 text-blue-100">
                หน้าปัจจุบัน: {currentSection.label} · เข้าสู่ระบบด้วย {state.email} · สิทธิ์ {state.role}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-lg border border-white/24 bg-white px-4 py-2 text-sm font-bold text-[#0f2a5f] transition hover:border-[#f08a24] hover:bg-[#fff7ed] hover:text-[#d66d0c] focus:outline-none focus:ring-2 focus:ring-[#f08a24]/40"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>

        <div className="mt-3">
          <nav className="flex gap-2 overflow-x-auto rounded-[20px] bg-[#0b214f] px-3 py-3" aria-label="Admin sections">
          {adminSections.map((section) => {
            const selected = section.key === activeSection;

            return (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveSection(section.key)}
                aria-pressed={selected}
                className={`shrink-0 rounded-lg border px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-[#f08a24]/40 ${
                  selected
                    ? 'border-white bg-white text-[#0f2a5f]'
                    : 'border-white/14 bg-white/8 text-blue-50 hover:border-white/60 hover:bg-white hover:text-[#0f2a5f]'
                }`}
              >
                <span className="block text-sm font-black">{section.label}</span>
              </button>
            );
          })}
          </nav>
        </div>
      </div>

      <div className={`grid gap-5 ${showPreview ? 'xl:grid-cols-[minmax(0,1fr)_420px] 2xl:grid-cols-[minmax(0,1fr)_460px]' : ''}`}>
        <div className="min-w-0 rounded-[28px] border border-[#f08a24] bg-white p-4 shadow-[0_18px_48px_rgba(15,42,95,0.12)]">
          {showPreview ? (
            <div className="mb-4 rounded-[20px] border border-[#f08a24] bg-white p-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#f08a24]">ข้อมูลหน้า</p>
                    <h2 className="mt-2 text-xl font-black text-[#0f2a5f]">กำลังแก้ไข: {currentSection.label}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{currentSection.description}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">กดปุ่มเพิ่มรายการของแต่ละหน้า แล้วกรอกข้อมูลในฟอร์มแก้ไข</p>
                  </div>
                  <span className="inline-flex w-fit rounded-lg border border-[#f08a24] bg-[#e3f2fd] px-3 py-2 text-xs font-black text-[#0f2a5f]">
                    Preview: {previewPath}{previewHash}
                  </span>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">เลือกหน้าที่กำลังแก้ไข</p>
                  <div className="mt-2 flex flex-wrap gap-2" aria-label="Preview page mode">
                    {[
                      { key: 'landing' as const, label: 'หน้า Landing Page' },
                      { key: 'details' as const, label: 'หน้าข้อมูลเพิ่มเติม' },
                    ].map((mode) => {
                      const selected = previewPageMode === mode.key;

                      return (
                        <button
                          key={mode.key}
                          type="button"
                          onClick={() => setPreviewPageMode(mode.key)}
                          aria-pressed={selected}
                          className={`rounded-lg border px-4 py-2 text-sm font-black transition ${
                            selected
                              ? 'border-[#0f2a5f] bg-[#0f2a5f] text-white'
                              : 'border-slate-300 bg-white text-[#0f2a5f] hover:border-[#f08a24] hover:text-[#d66d0c]'
                          }`}
                        >
                          {mode.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {renderAdminSection(activeSection)}
        </div>

        {showPreview ? (
          <aside className="rounded-[28px] border border-[#f08a24] bg-white p-4 shadow-[0_18px_48px_rgba(15,42,95,0.12)] xl:sticky xl:top-5 xl:self-start">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-black text-[#0f2a5f]">ตัวอย่างหน้า</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">{previewPath}{previewHash}</p>
              </div>
              <a
                href={`${previewPath}${previewHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-[#0f2a5f] transition hover:border-[#f08a24] hover:text-[#d66d0c]"
              >
                เปิดเต็ม
              </a>
            </div>
            <div className="mt-4 overflow-hidden rounded-[20px] border border-[#f08a24] bg-slate-100">
              <iframe
                key={`${previewPageMode}-${currentSection.key}-${previewVersion}`}
                title={`ตัวอย่าง ${currentSection.label}`}
                src={previewUrl}
                className="h-[580px] w-full bg-white"
                loading="lazy"
              />
            </div>
          </aside>
        ) : null}
      </div>
    </section>
  );
}

function renderAdminSection(section: AdminSectionKey) {
  switch (section) {
    case 'analytics':
      return <AdminAnalyticsDashboard />;
    case 'texts':
      return <SiteTextManager />;
    case 'services':
      return <ServiceManager />;
    case 'media':
      return <MediaUploadManager />;
    case 'portfolioImages':
      return <PortfolioImageManager />;
    case 'portfolioPosts':
      return <PortfolioPostManager />;
    case 'process':
      return <ProcessStepManager />;
    case 'faqs':
      return <FaqManager />;
    case 'contact':
      return (
        <div className="space-y-6">
          <ContactItemManager />
          <CompanySettingsForm />
        </div>
      );
  }
}

function AdminNotice({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-900" role="status">
      <h1 className="text-lg font-black">{title}</h1>
      <p className="mt-2 text-sm">{body}</p>
    </div>
  );
}
