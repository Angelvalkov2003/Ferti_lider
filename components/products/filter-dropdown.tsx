"use client";

import { useState, useEffect, useRef } from "react";
import { FunnelIcon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { Collection } from "lib/types";

interface FilterDropdownProps {
  collections: Collection[];
  onApply: (filters: {
    minPrice?: number;
    maxPrice?: number;
    categories: string[];
    onSaleOnly: boolean;
  }) => void;
  currentFilters: {
    minPrice?: number;
    maxPrice?: number;
    categories: string[];
    onSaleOnly: boolean;
  };
}

export function FilterDropdown({
  collections,
  onApply,
  currentFilters,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice?.toString() || "");
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice?.toString() || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(currentFilters.categories);
  const [onSaleOnly, setOnSaleOnly] = useState(currentFilters.onSaleOnly);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMinPrice(currentFilters.minPrice?.toString() || "");
    setMaxPrice(currentFilters.maxPrice?.toString() || "");
    setSelectedCategories(currentFilters.categories);
    setOnSaleOnly(currentFilters.onSaleOnly);
  }, [currentFilters]);

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

  const hasActiveFilters =
    currentFilters.minPrice !== undefined ||
    currentFilters.maxPrice !== undefined ||
    currentFilters.categories.length > 0 ||
    currentFilters.onSaleOnly;

  const handleCategoryToggle = (categoryHandle: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryHandle)
        ? prev.filter((c) => c !== categoryHandle)
        : [...prev, categoryHandle]
    );
  };

  const handleApply = () => {
    onApply({
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      categories: selectedCategories,
      onSaleOnly,
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategories([]);
    setOnSaleOnly(false);
    onApply({
      minPrice: undefined,
      maxPrice: undefined,
      categories: [],
      onSaleOnly: false,
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium transition-all duration-200 min-w-[140px] justify-between ${
          hasActiveFilters
            ? "bg-stone-400 text-white dark:bg-stone-600 border-stone-400 dark:border-stone-600 hover:bg-stone-500 dark:hover:bg-stone-700"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
        }`}
      >
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5" />
          <span>Филтри</span>
          {hasActiveFilters && (
            <span className="ml-1 rounded-full bg-white/20 dark:bg-white/10 px-2 py-0.5 text-xs font-semibold">
              {[
                currentFilters.minPrice !== undefined || currentFilters.maxPrice !== undefined,
                currentFilters.categories.length > 0,
                currentFilters.onSaleOnly,
              ].filter(Boolean).length}
            </span>
          )}
        </div>
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 sm:right-0 left-0 sm:left-auto mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-[80vh] overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Филтри</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Затвори"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Ценови диапазон (EUR)
              </h4>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    От
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    До
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="1000.00"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Категории
              </h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {collections.map((collection) => (
                  <label
                    key={collection.id}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(collection.handle)}
                      onChange={() => handleCategoryToggle(collection.handle)}
                      className="h-4 w-4 text-stone-600 rounded border-gray-300 focus:ring-stone-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {collection.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* On Sale Only */}
            <div className="mb-4">
              <label className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={(e) => setOnSaleOnly(e.target.checked)}
                  className="h-4 w-4 text-stone-600 rounded border-gray-300 focus:ring-stone-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Само продукти на намаление
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-stone-400 dark:bg-stone-600 rounded-md hover:bg-stone-500 dark:hover:bg-stone-700 transition-colors"
              >
                Приложи
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Изчисти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
