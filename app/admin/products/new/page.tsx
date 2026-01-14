import { getAllCollectionsForAdmin } from "lib/supabase/admin-collections";
import { ProductForm } from "components/admin/product-form";

export default async function NewProductPage() {
  const collections = await getAllCollectionsForAdmin();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Нов Продукт
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Създай нов продукт
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <ProductForm collections={collections} />
      </div>
    </div>
  );
}
