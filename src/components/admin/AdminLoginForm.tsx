'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { validateAdminLoginInput } from '@/lib/admin/authValidation';
import { clearAdminLoginRateLimit, getAdminLoginRateLimitState, recordFailedAdminLogin } from '@/lib/admin/rateLimit';
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

    const rateLimit = getAdminLoginRateLimitState(window.localStorage);

    if (!rateLimit.allowed) {
      setState((current) => ({
        ...current,
        message: `ลองใหม่อีกครั้งใน ${formatRetryAfter(rateLimit.retryAfterMs)}`,
      }));
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
      const nextLimit = recordFailedAdminLogin(window.localStorage);
      setState((current) => ({
        ...current,
        isSubmitting: false,
        message: nextLimit.allowed
          ? `เข้าสู่ระบบไม่สำเร็จ ตรวจสอบอีเมลหรือรหัสผ่านอีกครั้ง เหลือ ${nextLimit.remainingAttempts} ครั้ง`
          : `พยายามเข้าสู่ระบบหลายครั้งเกินไป ลองใหม่ใน ${formatRetryAfter(nextLimit.retryAfterMs)}`,
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
      const nextLimit = recordFailedAdminLogin(window.localStorage);
      setState((current) => ({
        ...current,
        isSubmitting: false,
        message: nextLimit.allowed ? 'บัญชีนี้ยังไม่มีสิทธิ์ผู้ดูแลเว็บ' : `ลองใหม่อีกครั้งใน ${formatRetryAfter(nextLimit.retryAfterMs)}`,
      }));
      return;
    }

    clearAdminLoginRateLimit(window.localStorage);
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
        className="w-full rounded-lg bg-[#0f2a5f] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#061a3d] focus:outline-none focus:ring-2 focus:ring-[#0f2a5f]/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.isSubmitting ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ Admin'}
      </button>
    </form>
  );
}

function formatRetryAfter(milliseconds: number) {
  const minutes = Math.max(1, Math.ceil(milliseconds / 60000));

  return `${minutes} นาที`;
}
