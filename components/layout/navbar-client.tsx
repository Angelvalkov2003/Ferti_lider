"use client";

import { useEffect, useState, useRef } from "react";
import CartModal from "components/cart/modal";
import LogoSquare from "components/logo-square";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./navbar/mobile-menu";
import Search, { SearchSkeleton } from "./navbar/search";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Ecommerce Store";

interface Collection {
  id: string;
  handle: string;
  title: string;
}

export function NavbarClient() {
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
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />
            <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              {SITE_NAME}
            </div>
          </Link>
          <ul className="hidden gap-6 text-sm md:flex md:items-center">
            {/* Products Dropdown */}
            <li className="relative">
              <div ref={dropdownRef}>
                <button
                  onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                  className="flex items-center gap-1 text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                >
                  Продукти
                  <ChevronDownIcon className={`h-4 w-4 transition-transform ${productsDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {productsDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-48 rounded-lg bg-white shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50">
                    <ul className="py-2">
                      <li>
                        <Link
                          href="/products"
                          onClick={() => setProductsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Всички
                        </Link>
                      </li>
                      {!loading &&
                        collections.map((collection) => (
                          <li key={collection.id}>
                            <Link
                              href={`/products?collection=${collection.handle}`}
                              onClick={() => setProductsDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              {collection.title}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </li>

            {/* Contact Link */}
            <li>
              <Link
                href="/contact"
                prefetch={true}
                className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
              >
                Контакти
              </Link>
            </li>
          </ul>
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="flex justify-end md:w-1/3">
          <CartModal />
        </div>
      </div>
    </nav>
  );
}
