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
type DashboardState =
  | { status: 'loading'; email?: string }
  | { status: 'ready'; email: string; role: string }
  | { status: 'config-missing' }
  | { status: 'forbidden' };

const adminSections: Array<{
  key: AdminSectionKey;
  label: string;
  description: string;
  previewHash: string;
}> = [
  { key: 'analytics', label: 'แดชบอร์ด', description: 'ดูการเคลื่อนไหวหน้าเว็บ', previewHash: '#hero' },
  { key: 'texts', label: 'ข้อความ', description: 'หัวข้อและ copy หลัก', previewHash: '#hero' },
  { key: 'services', label: 'บริการ', description: 'การ์ดและข้อมูลเตรียมงาน', previewHash: '#services' },
  { key: 'portfolioPosts', label: 'ผลงาน', description: 'ข้อมูลโครงการ', previewHash: '#portfolio' },
  { key: 'portfolioImages', label: 'รูปผลงาน', description: 'หน้าปกและ gallery', previewHash: '#portfolio' },
  { key: 'media', label: 'คลังรูป', description: 'อัปโหลดรูป', previewHash: '#portfolio' },
  { key: 'process', label: 'ขั้นตอน', description: 'ลำดับงาน', previewHash: '#process' },
  { key: 'faqs', label: 'FAQ', description: 'คำถามตอบ', previewHash: '#faq' },
  { key: 'contact', label: 'ติดต่อ', description: 'ช่องทางและแผนที่', previewHash: '#contact' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [state, setState] = useState<DashboardState>({ status: 'loading' });
  const [activeSection, setActiveSection] = useState<AdminSectionKey>('analytics');
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

  return (
    <section className="admin-page admin-stagger space-y-5">
      <div className="overflow-hidden rounded-lg border border-[#0f2a5f]/20 bg-[#0f2a5f] text-white shadow-[0_18px_52px_rgba(15,42,95,0.16)]">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#f8a34a]">TRP Powers Plus CMS</p>
            <h1 className="mt-2 text-2xl font-black text-white">จัดการข้อมูลเว็บไซต์</h1>
            <p className="mt-2 text-sm text-blue-100">
            เข้าสู่ระบบด้วย {state.email} · สิทธิ์ {state.role}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
            className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:border-[#f8a34a] hover:bg-white/16 focus:outline-none focus:ring-2 focus:ring-[#f08a24]/40"
        >
          ออกจากระบบ
        </button>
      </div>

        <nav className="flex gap-2 overflow-x-auto border-t border-white/12 bg-[#0d2748] px-3 py-3" aria-label="Admin sections">
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
                    ? 'border-[#f08a24] bg-white text-[#0f2a5f]'
                    : 'border-white/12 bg-white/8 text-blue-50 hover:border-white/30 hover:bg-white/14'
                }`}
              >
                <span className="block text-sm font-black">{section.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className={`grid gap-5 ${showPreview ? '2xl:grid-cols-[minmax(0,1fr)_460px]' : ''}`}>
        <div className="min-w-0 space-y-6">
          {showPreview ? (
            <div className="admin-card rounded-lg border border-[#f08a24] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#f08a24]">กำลังแก้ไข</p>
                  <h2 className="mt-2 text-xl font-black text-[#0f2a5f]">{currentSection.label}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{currentSection.description}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">ช่อง English เว้นว่างได้ ระบบจะเติมให้จากคำหลักอัตโนมัติ</p>
                </div>
                <span className="inline-flex w-fit rounded-lg border border-[#f08a24] bg-[#e3f2fd] px-3 py-2 text-xs font-black text-[#0f2a5f]">
                  Preview: {currentSection.previewHash}
                </span>
              </div>
            </div>
          ) : null}
          {renderAdminSection(activeSection)}
        </div>

        {showPreview ? (
          <aside className="admin-card rounded-lg border border-[#f08a24] bg-white p-4 shadow-sm 2xl:sticky 2xl:top-5 2xl:self-start">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-black text-[#0f2a5f]">ตัวอย่างหน้าบ้าน</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">{currentSection.previewHash}</p>
              </div>
              <a
                href={`/${currentSection.previewHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-[#0f2a5f] transition hover:border-[#f08a24] hover:text-[#d66d0c]"
              >
                เปิดเต็ม
              </a>
            </div>
            <div className="mt-4 overflow-hidden rounded-lg border border-[#f08a24] bg-slate-100">
              <iframe
                key={currentSection.previewHash}
                title={`ตัวอย่าง ${currentSection.label}`}
                src={`/${currentSection.previewHash}?preview=${previewVersion}`}
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
