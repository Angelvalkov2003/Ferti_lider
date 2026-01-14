import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { isAdmin } from "lib/supabase/auth";

export default async function LoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  // If already logged in, redirect to admin dashboard
  const admin = await isAdmin();
  if (admin) {
    redirect("/admin");
  }

  return <>{children}</>;
}
