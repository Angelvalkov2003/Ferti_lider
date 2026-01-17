"use client";

import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";
import { Bars3Icon, XMarkIcon, HomeIcon } from "@heroicons/react/24/outline";

export function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Успешно излизане");
        router.push("/admin/login");
        router.refresh();
      } else {
        toast.error("Грешка при излизане");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Грешка при излизане");
    }
  };

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(path);
  };

  const getLinkClassName = (path: string) => {
    const baseClasses = "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";
    if (isActive(path)) {
      return `${baseClasses} border-indigo-500 text-gray-900 dark:text-white`;
    }
    return `${baseClasses} border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300`;
  };

  const getMobileLinkClassName = (path: string) => {
    const baseClasses = "block px-3 py-2 text-base font-medium rounded-md";
    if (isActive(path)) {
      return `${baseClasses} bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200`;
    }
    return `${baseClasses} text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700`;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/admin"
                className="text-xl font-bold text-gray-900 dark:text-white"
              >
                Админ Панел
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/admin" className={getLinkClassName("/admin")}>
                Начало
              </Link>
              <Link href="/admin/orders" className={getLinkClassName("/admin/orders")}>
                Поръчки
              </Link>
              <Link href="/admin/products" className={getLinkClassName("/admin/products")}>
                Продукти
              </Link>
              <Link href="/admin/collections" className={getLinkClassName("/admin/collections")}>
                Колекции
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              title="Отвори уебсайта"
            >
              <HomeIcon className="h-5 w-5" />
              <span>Уебсайт</span>
            </Link>
            <button
              onClick={handleLogout}
              className="hidden sm:block text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
            >
              Излез
            </button>
            {/* Mobile menu button */}
            <button
              type="button"
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/admin"
              className={getMobileLinkClassName("/admin")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Начало
            </Link>
            <Link
              href="/admin/orders"
              className={getMobileLinkClassName("/admin/orders")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Поръчки
            </Link>
            <Link
              href="/admin/products"
              className={getMobileLinkClassName("/admin/products")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Продукти
            </Link>
            <Link
              href="/admin/collections"
              className={getMobileLinkClassName("/admin/collections")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Колекции
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <HomeIcon className="h-5 w-5" />
              <span>Уебсайт</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="block w-full text-left px-3 py-2 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Излез
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
