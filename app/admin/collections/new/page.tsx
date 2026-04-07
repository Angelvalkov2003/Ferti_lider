import { CollectionForm } from "components/admin/collection-form";
import { getAllCollectionsForAdmin } from "lib/supabase/admin-collections";

export default async function NewCollectionPage() {
  const allCollections = await getAllCollectionsForAdmin();
  const rows = allCollections.map(
    (c: { id: string; handle: string; title: string; parent_id: string | null }) => ({
      id: c.id,
      handle: c.handle,
      title: c.title,
      parent_id: c.parent_id ?? null,
    }),
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Нова Колекция
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Създай нова колекция
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <CollectionForm allCollections={rows} />
      </div>
    </div>
  );
}
