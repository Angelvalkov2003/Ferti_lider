import { getCollectionByIdForAdmin } from "lib/supabase/admin-collections";
import { CollectionForm } from "components/admin/collection-form";
import { notFound } from "next/navigation";
import Link from "next/link";

// Disable static generation for this page - always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  if (!id) {
    notFound();
  }
  
  let collection;
  try {
    collection = await getCollectionByIdForAdmin(id);
    
    if (!collection) {
      notFound();
    }
  } catch (error: any) {
    console.error("Error fetching collection:", error);
    // If it's a not found error, show 404
    if (error?.code === "PGRST116" || error?.message?.includes("not found")) {
      notFound();
    }
    // For other errors, also show 404 but log the error
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/collections"
          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
        >
          ← Назад към колекциите
        </Link>
      </div>

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
