import { getProducts, getCollections } from "lib/supabase/products";
import { Metadata } from "next";
import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { SortFilter } from "components/products/sort-filter";
import { FilterButton } from "components/products/filter-button";
import { FilterModal } from "components/products/filter-modal";

export const metadata: Metadata = {
  title: "Продукти",
  description: "Всички продукти в магазина",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    collection?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    categories?: string;
    onSaleOnly?: string;
  }>;
}) {
  const params = await searchParams;
  const collection = params.collection;
  const sort = params.sort as "price-asc" | "price-desc" | "discount-desc" | "name-asc" | "newest" | undefined;
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const categories = params.categories ? params.categories.split(",") : undefined;
  const onSaleOnly = params.onSaleOnly === "true";
  
  const [products, collections] = await Promise.all([
    getProducts({
      collection,
      sort: sort || "newest",
      minPrice,
      maxPrice,
      categories,
      onSaleOnly,
    }),
    getCollections(),
  ]);

  const currentFilters = {
    minPrice,
    maxPrice,
    categories: categories || [],
    onSaleOnly,
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-4 text-black md:flex-row dark:text-white">
      {/* Products Grid - Main Content */}
      <div className="order-first min-h-screen w-full md:order-none">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">
              {collection
                ? collections.find((c) => c.handle === collection)?.title || "Продукти"
                : "Всички Продукти"}
            </h1>
          </div>
          {collection && collections.find((c) => c.handle === collection)?.description && (
            <p className="mt-3 mb-4 text-lg text-neutral-700 dark:text-neutral-300">
              {collections.find((c) => c.handle === collection)?.description}
            </p>
          )}
          {products.length > 0 && (
            <p className="mb-4 text-neutral-600 dark:text-neutral-400">
              {products.length} {products.length === 1 ? "продукт" : "продукта"}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4">
            <div className="w-full sm:w-auto">
              <SortFilter />
            </div>
            <div className="w-full sm:w-auto">
              <FilterButton collections={collections} currentFilters={currentFilters} />
            </div>
          </div>
        </div>
        {products.length === 0 ? (
          <p className="py-3 text-lg">Няма намерени продукти</p>
        ) : (
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products} />
          </Grid>
        )}
      </div>

      {/* Collections Menu - Right Side */}
      <div className="order-last w-full flex-none md:order-last md:w-[250px]">
        <div className="sticky top-4">
          <h2 className="mb-4 text-lg font-semibold">Категории</h2>
          <ul className="space-y-2">
            <li>
              <a
                href="/products"
                className={`block rounded-lg px-4 py-2 transition-colors ${
                  !collection
                    ? "bg-stone-400 text-white dark:bg-stone-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                Всичко
              </a>
            </li>
            {collections.map((col) => (
              <li key={col.id}>
                <a
                  href={`/products?collection=${col.handle}`}
                  className={`block rounded-lg px-4 py-2 transition-colors ${
                    collection === col.handle
                      ? "bg-stone-400 text-white dark:bg-stone-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {col.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
