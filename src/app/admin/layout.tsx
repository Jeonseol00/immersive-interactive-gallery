import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Skip auth check on login page
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 overflow-auto ml-0 md:ml-64">
        {children}
      </main>
    </div>
  );
}
