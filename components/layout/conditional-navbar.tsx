"use client";

import { usePathname } from "next/navigation";
import { NavbarClient } from "./navbar-client";

export function ConditionalNavbar() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) {
    return null;
  }

  return (
    <header className="border-b border-brand-200/70 bg-brand-50 dark:border-brand-800 dark:bg-brand-950/45">
      <NavbarClient />
    </header>
  );
}
