import { CollectionForm } from "components/admin/collection-form";

export default async function NewCollectionPage() {
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
        <CollectionForm />
      </div>
    </div>
  );
}
