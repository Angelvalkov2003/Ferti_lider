import { ReactNode } from "react";

export default function AdminLoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Login page should not check for admin authentication
  // This layout bypasses the admin layout check
  return <>{children}</>;
}
