import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { isAdmin } from "lib/supabase/auth";
import { AdminNavbar } from "components/admin/navbar";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
