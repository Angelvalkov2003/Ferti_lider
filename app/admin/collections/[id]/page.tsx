import { getCollectionByIdForAdmin } from "lib/supabase/admin-collections";
import { CollectionForm } from "components/admin/collection-form";
import { notFound } from "next/navigation";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collection = await getCollectionByIdForAdmin(id).catch(() => null);

  if (!collection) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Редактирай Колекция
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {collection.title}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <CollectionForm collection={collection} />
      </div>
    </div>
  );
}
