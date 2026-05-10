import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <AdminDashboard />
      </div>
    </main>
  );
}
