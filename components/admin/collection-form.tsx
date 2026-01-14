"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCollectionAction, updateCollectionAction } from "app/admin/collections/actions";
import { toast } from "sonner";

interface CollectionFormData {
  handle: string;
  title: string;
}

interface CollectionFormProps {
  collection?: any;
}

export function CollectionForm({ collection }: CollectionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CollectionFormData>({
    handle: collection?.handle || "",
    title: collection?.title || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const collectionData = {
        handle: formData.handle,
        title: formData.title,
      };

      let result;
      if (collection) {
        result = await updateCollectionAction({ ...collectionData, id: collection.id });
      } else {
        result = await createCollectionAction(collectionData);
      }

      if (result.success) {
        toast.success(collection ? "Колекцията е обновена успешно" : "Колекцията е създадена успешно");
        router.push("/admin/collections");
        router.refresh();
      } else {
        toast.error(result.error || "Грешка при запазване на колекция");
      }
    } catch (error) {
      console.error("Error saving collection:", error);
      toast.error("Грешка при запазване на колекция");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Handle (URL slug) *
          </label>
          <input
            type="text"
            required
            value={formData.handle}
            onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="collection-handle"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Име *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Запазване..." : collection ? "Обнови" : "Създай"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Отказ
        </button>
      </div>
    </form>
  );
}
