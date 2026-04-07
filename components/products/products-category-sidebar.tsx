"use client";

import { CategoryNavTree } from "components/layout/category-nav-tree";
import type { Collection } from "lib/types";

export function ProductsCategorySidebar({
  collections,
  activeHandle,
}: {
  collections: Collection[];
  activeHandle: string | null | undefined;
}) {
  return (
    <>
      <h2 className="mb-4 text-lg font-semibold">Категории</h2>
      <CategoryNavTree
        collections={collections}
        variant="sidebar"
        activeHandle={activeHandle ?? null}
        includeAllProductsLink={true}
      />
    </>
  );
}
