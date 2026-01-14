"use client";

import { usePathname } from "next/navigation";
import { NavbarClient } from "./navbar-client";

export function ConditionalNavbar() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) {
    return null;
  }

  return <NavbarClient />;
}
