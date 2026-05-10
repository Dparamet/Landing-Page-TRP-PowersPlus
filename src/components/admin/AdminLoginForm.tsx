'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { validateAdminLoginInput } from '@/lib/admin/authValidation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type LoginState = {
  email: string;
  password: string;
  message: string;
  isSubmitting: boolean;
};

const initialState: LoginState = {
  email: '',
  password: '',
  message: '',
  isSubmitting: false,
};

export default function AdminLoginForm() {
  const router = useRouter();
  const [state, setState] = useState<LoginState>(initialState);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateAdminLoginInput({
      email: state.email,
      password: state.password,
    });

    if (!validation.ok) {
      setState((current) => ({ ...current, message: validation.message }));
      return;
    }

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setState((current) => ({
        ...current,
        message: 'ยังไม่ได้ตั้งค่า Supabase env ใน .env.local',
      }));
      return;
    }

    setState((current) => ({ ...current, isSubmitting: true, message: '' }));

    const { data, error } = await supabase.auth.signInWithPassword(validation.value);

    if (error || !data.user) {
      setState((current) => ({
        ...current,
        isSubmitting: false,
        message: 'เข้าสู่ระบบไม่สำเร็จ ตรวจสอบอีเมลหรือรหัสผ่านอีกครั้ง',
      }));
      return;
    }

    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('role')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (!profile) {
      await supabase.auth.signOut();
      setState((current) => ({
        ...current,
        isSubmitting: false,
        message: 'บัญชีนี้ยังไม่มีสิทธิ์ผู้ดูแลเว็บ',
      }));
      return;
    }

    router.replace('/admin');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <label htmlFor="admin-email" className="text-sm font-semibold text-slate-800">
          อีเมลผู้ดูแล
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          value={state.email}
          onChange={(event) => setState((current) => ({ ...current, email: event.target.value }))}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-[#f08a24] focus:ring-2 focus:ring-[#f08a24]/20"
          placeholder="owner@example.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="admin-password" className="text-sm font-semibold text-slate-800">
          รหัสผ่าน
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={state.password}
          onChange={(event) => setState((current) => ({ ...current, password: event.target.value }))}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-[#f08a24] focus:ring-2 focus:ring-[#f08a24]/20"
          placeholder="••••••••"
        />
      </div>

      {state.message ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state.isSubmitting}
        className="w-full rounded-lg bg-[#12345f] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0d2748] focus:outline-none focus:ring-2 focus:ring-[#12345f]/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.isSubmitting ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ Admin'}
      </button>
    </form>
  );
}
