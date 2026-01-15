import { getProducts, getCollections } from "lib/supabase/products";
import { Metadata } from "next";
import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Продукти",
  description: "Всички продукти в магазина",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string }>;
}) {
  const params = await searchParams;
  const collection = params.collection;
  
  const [products, collections] = await Promise.all([
    getProducts({ collection }),
    getCollections(),
  ]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-4 text-black md:flex-row dark:text-white">
      {/* Collections Menu - Right Side */}
      <div className="order-last w-full flex-none md:order-last md:w-[250px]">
        <div className="sticky top-4">
          <h2 className="mb-4 text-lg font-semibold">Категории</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/products"
                className={`block rounded-lg px-4 py-2 transition-colors ${
                  !collection
                    ? "bg-blue-600 text-white dark:bg-blue-500"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                Всичко
              </Link>
            </li>
            {collections.map((col) => (
              <li key={col.id}>
                <Link
                  href={`/products?collection=${col.handle}`}
                  className={`block rounded-lg px-4 py-2 transition-colors ${
                    collection === col.handle
                      ? "bg-blue-600 text-white dark:bg-blue-500"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {col.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Products Grid - Main Content */}
      <div className="order-first min-h-screen w-full md:order-none">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {collection
              ? collections.find((c) => c.handle === collection)?.title || "Продукти"
              : "Всички Продукти"}
          </h1>
          {products.length > 0 && (
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {products.length} {products.length === 1 ? "продукт" : "продукта"}
            </p>
          )}
        </div>
        {products.length === 0 ? (
          <p className="py-3 text-lg">Няма намерени продукти</p>
        ) : (
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products} />
          </Grid>
        )}
      </div>
    </div>
  );
}
