import { ReactNode } from "react";

export default function LoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Allow login page to always show - no redirect check needed
  // If user is already logged in, they can still access login page
  return <>{children}</>;
}
