"use client";

import { FilterDropdown } from "./filter-dropdown";
import type { Collection } from "lib/types";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterButtonProps {
  collections: Collection[];
  currentFilters: {
    minPrice?: number;
    maxPrice?: number;
    categories: string[];
    onSaleOnly: boolean;
  };
}

export function FilterButton({ collections, currentFilters }: FilterButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleApplyFilters = (filters: {
    minPrice?: number;
    maxPrice?: number;
    categories: string[];
    onSaleOnly: boolean;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (filters.minPrice !== undefined) {
      params.set("minPrice", filters.minPrice.toString());
    } else {
      params.delete("minPrice");
    }

    if (filters.maxPrice !== undefined) {
      params.set("maxPrice", filters.maxPrice.toString());
    } else {
      params.delete("maxPrice");
    }

    if (filters.categories.length > 0) {
      params.set("categories", filters.categories.join(","));
    } else {
      params.delete("categories");
    }

    if (filters.onSaleOnly) {
      params.set("onSaleOnly", "true");
    } else {
      params.delete("onSaleOnly");
    }

    router.push(`/products?${params.toString()}`);
  };

  return (
    <FilterDropdown
      collections={collections}
      onApply={handleApplyFilters}
      currentFilters={currentFilters}
    />
  );
}
