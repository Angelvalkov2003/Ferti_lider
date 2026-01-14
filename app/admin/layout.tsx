import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { isAdmin } from "lib/supabase/auth";
import { AdminNavbar } from "components/admin/navbar";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Check if we're on the login page - if so, don't check auth
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || "";
  
  // If we're on /admin/login, allow access without auth check
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  try {
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
  } catch (error: any) {
    // NEXT_REDIRECT is expected behavior from redirect() - re-throw it
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    // If there's an error checking admin status, redirect to login
    console.error("Error checking admin status:", error);
    redirect("/admin/login");
  }
}
