import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#e8eef8] px-3 py-5 sm:px-5">
      <div className="mx-auto w-full max-w-[1600px]">
        <AdminDashboard />
      </div>
    </main>
  );
}
