import { getProductByIdForAdmin } from "lib/supabase/admin-products";
import { getAllCollectionsForAdmin } from "lib/supabase/admin-collections";
import { ProductForm } from "components/admin/product-form";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, collections] = await Promise.all([
    getProductByIdForAdmin(id).catch(() => null),
    getAllCollectionsForAdmin(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Редактирай Продукт
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {product.title}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <ProductForm product={product} collections={collections} />
      </div>
    </div>
  );
}
