"use client";

import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, Suspense, useEffect, useState } from "react";

import { Bars3Icon, XMarkIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Search, { SearchSkeleton } from "./search";

type MenuItem = {
  title: string;
  path: string;
};

interface Collection {
  id: string;
  handle: string;
  title: string;
}

export default function MobileMenu({ menu }: { menu: MenuItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [productsSubmenuOpen, setProductsSubmenuOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors md:hidden dark:border-neutral-700 dark:text-white"
      >
        <Bars3Icon className="h-4" />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col bg-white pb-6 dark:bg-black">
              <div className="p-4">
                <button
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
                  onClick={closeMobileMenu}
                  aria-label="Затвори мобилно меню"
                >
                  <XMarkIcon className="h-6" />
                </button>

                <div className="mb-4 w-full">
                  <Suspense fallback={<SearchSkeleton />}>
                    <Search />
                  </Suspense>
                </div>
                <ul className="flex w-full flex-col">
                  <li>
                    <button
                      onClick={() => setProductsSubmenuOpen(!productsSubmenuOpen)}
                      className="flex w-full items-center justify-between py-2 text-xl text-black transition-colors hover:text-neutral-500 dark:text-white"
                    >
                      Продукти
                      <ChevronRightIcon
                        className={`h-5 w-5 transition-transform ${productsSubmenuOpen ? "rotate-90" : ""}`}
                      />
                    </button>
                    {productsSubmenuOpen && (
                      <ul className="ml-4 mt-2 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                        <li>
                          <Link
                            href="/products"
                            prefetch={true}
                            onClick={closeMobileMenu}
                            className="block py-2 text-lg text-gray-700 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-white"
                          >
                            Всички
                          </Link>
                        </li>
                        {!loading &&
                          collections.map((collection) => (
                            <li key={collection.id}>
                              <Link
                                href={`/products?collection=${collection.handle}`}
                                prefetch={true}
                                onClick={closeMobileMenu}
                                className="block py-2 text-lg text-gray-700 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-white"
                              >
                                {collection.title}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                  <li className="py-2 text-xl text-black transition-colors hover:text-neutral-500 dark:text-white">
                    <Link
                      href="/contact"
                      prefetch={true}
                      onClick={closeMobileMenu}
                    >
                      Контакти
                    </Link>
                  </li>
                </ul>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
