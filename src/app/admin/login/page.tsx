import AdminLoginForm from '@/components/admin/AdminLoginForm';

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
        <div className="w-full rounded-lg border border-[#f08a24] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#f08a24]">TRP Powers Plus</p>
          <h1 className="mt-3 text-2xl font-black text-[#12345f]">เข้าสู่ระบบผู้ดูแลเว็บ</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            ใช้อีเมลที่เพิ่มไว้ใน Supabase Auth และมีสิทธิ์ในตาราง admin_profiles
          </p>
          <div className="mt-6">
            <AdminLoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
