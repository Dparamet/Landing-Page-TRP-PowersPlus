'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import CompanySettingsForm from '@/components/admin/CompanySettingsForm';
import MediaUploadManager from '@/components/admin/MediaUploadManager';
import PortfolioImageManager from '@/components/admin/PortfolioImageManager';
import PortfolioPostManager from '@/components/admin/PortfolioPostManager';
import ServiceManager from '@/components/admin/ServiceManager';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type DashboardState =
  | { status: 'loading'; email?: string }
  | { status: 'ready'; email: string; role: string }
  | { status: 'config-missing' }
  | { status: 'forbidden' };

export default function AdminDashboard() {
  const router = useRouter();
  const [state, setState] = useState<DashboardState>({ status: 'loading' });

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
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600" aria-busy="true">
        กำลังตรวจสอบสิทธิ์ผู้ดูแล...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#f08a24]">Admin dashboard</p>
          <h1 className="mt-2 text-2xl font-black text-[#12345f]">จัดการข้อมูลเว็บไซต์</h1>
          <p className="mt-2 text-sm text-slate-600">
            เข้าสู่ระบบด้วย {state.email} · สิทธิ์ {state.role}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-[#f08a24] hover:text-[#f08a24] focus:outline-none focus:ring-2 focus:ring-[#f08a24]/30"
        >
          ออกจากระบบ
        </button>
      </div>

      <CompanySettingsForm />

      <MediaUploadManager />

      <PortfolioImageManager />

      <PortfolioPostManager />

      <ServiceManager />
    </section>
  );
}

function AdminNotice({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-900" role="status">
      <h1 className="text-lg font-black">{title}</h1>
      <p className="mt-2 text-sm">{body}</p>
    </div>
  );
}
