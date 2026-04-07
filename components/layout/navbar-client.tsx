"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import CartModal from "components/cart/modal";
import LogoSquare from "components/logo-square";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./navbar/mobile-menu";
import Search, { SearchSkeleton } from "./navbar/search";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { CategoryNavTree } from "components/layout/category-nav-tree";
import type { Collection } from "lib/types";

function NavbarClientInner({
  activeCollectionHandle,
}: {
  activeCollectionHandle: string | null;
}) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/collections")
      .then((res) => res.json())
      .then((data) => {
        setCollections(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching collections:", error);
        setLoading(false);
      });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProductsDropdownOpen(false);
      }
    };

    if (productsDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [productsDropdownOpen]);

  const menu = collections.map((c) => ({ title: c.title, path: `/search/${c.handle}` }));

  return (
    <nav className="relative max-w-full overflow-x-hidden px-3 py-2.5 md:mx-auto md:max-w-5xl md:overflow-visible md:px-6 md:py-2.5 lg:px-8 xl:max-w-6xl">
      {/* Mobile: equal side columns; minmax(0,1fr) avoids grid blowout */}
      <div className="grid w-full max-w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5 md:hidden">
        <div className="flex min-h-9 max-w-9 justify-start">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} />
          </Suspense>
        </div>
        <Link
          href="/"
          prefetch={true}
          className="flex max-w-[4.5rem] shrink-0 justify-self-center"
          aria-label="Начало"
        >
          <LogoSquare size="lg" />
        </Link>
        <div className="flex min-h-9 max-w-9 justify-self-end justify-end">
          <CartModal compactTrigger />
        </div>
      </div>

      <div className="hidden w-full items-center gap-2 md:flex md:gap-3 lg:gap-4">
        <div className="flex w-1/3 min-w-0 items-center">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex shrink-0 items-center md:w-auto lg:mr-4"
          >
            <LogoSquare />
          </Link>
          <ul className="hidden min-w-0 gap-4 text-sm md:flex md:items-center">
            {/* Products Dropdown */}
            <li className="relative">
              <div ref={dropdownRef}>
                <button
                  onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                  className="flex items-center gap-1 text-neutral-500 underline-offset-4 hover:text-brand-700 hover:underline dark:text-neutral-400 dark:hover:text-brand-400"
                >
                  Продукти
                  <ChevronDownIcon className={`h-4 w-4 transition-transform ${productsDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {productsDropdownOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 min-w-[220px] max-w-[min(100vw-2rem,20rem)] rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    {loading ? (
                      <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Зареждане…</p>
                    ) : (
                      <CategoryNavTree
                        collections={collections}
                        variant="dropdown"
                        activeHandle={activeCollectionHandle}
                        onNavigate={() => setProductsDropdownOpen(false)}
                        includeAllProductsLink={true}
                      />
                    )}
                  </div>
                )}
              </div>
            </li>
          </ul>
        </div>
        <div className="hidden w-1/3 min-w-0 justify-center md:flex">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="flex w-1/3 min-w-0 items-center justify-end gap-3 md:gap-4">
          <div className="hidden shrink-0 items-center gap-4 text-sm md:flex">
            <Link
              href="/contact"
              prefetch={true}
              className="text-neutral-500 underline-offset-4 hover:text-brand-700 hover:underline dark:text-neutral-400 dark:hover:text-brand-400"
            >
              Контакти
            </Link>
          </div>
          <CartModal />
        </div>
      </div>
    </nav>
  );
}

function NavbarClientWithSearchParams() {
  const searchParams = useSearchParams();
  return (
    <NavbarClientInner activeCollectionHandle={searchParams.get("collection")} />
  );
}

export function NavbarClient() {
  return (
    <Suspense fallback={<NavbarClientInner activeCollectionHandle={null} />}>
      <NavbarClientWithSearchParams />
    </Suspense>
  );
}
