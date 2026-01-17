"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BarsArrowUpIcon, ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";

type SortOption = "price-asc" | "price-desc" | "discount-desc" | "name-asc" | "newest";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "price-asc", label: "Цена: Възходяща" },
  { value: "price-desc", label: "Цена: Низходяща" },
  { value: "discount-desc", label: "Най-голямо намаление" },
  { value: "name-asc", label: "Азбучен ред" },
  { value: "newest", label: "Най-нови" },
];

export function SortFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = (searchParams.get("sort") as SortOption) || "newest";
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLabel = sortOptions.find((opt) => opt.value === currentSort)?.label || "Най-нови";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSortChange = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    router.push(`/products?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 min-w-[200px] justify-between"
      >
        <div className="flex items-center gap-2">
          <BarsArrowUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <span>{currentLabel}</span>
        </div>
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full sm:w-auto min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                currentSort === option.value
                  ? "bg-stone-50 dark:bg-stone-900/30 text-stone-900 dark:text-stone-100"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="text-sm font-medium">{option.label}</span>
              {currentSort === option.value && (
                <CheckIcon className="h-5 w-5 text-stone-600 dark:text-stone-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
