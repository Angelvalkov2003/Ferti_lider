"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCollectionAction, updateCollectionAction } from "app/admin/collections/actions";
import { toast } from "sonner";

interface CollectionFormData {
  handle: string;
  title: string;
  description: string;
  position: string;
}

interface CollectionFormProps {
  collection?: any;
}

export function CollectionForm({ collection }: CollectionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [handleError, setHandleError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CollectionFormData>({
    handle: collection?.handle || "",
    title: collection?.title || "",
    description: collection?.description || "",
    position: collection?.position?.toString() || "0",
  });

  // Format handle/slug: lowercase, remove spaces, only allow letters, numbers, and hyphens
  const formatHandle = (value: string): string => {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "") // Remove all spaces
      .replace(/[^a-z0-9-]/g, "") // Remove all non-alphanumeric characters except hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  // Generate handle from title
  const generateHandleFromTitle = (title: string): string => {
    return formatHandle(title);
  };

  const handleHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatHandle(e.target.value);
    setFormData({ ...formData, handle: formatted });
    // Clear error when user starts typing
    if (handleError) {
      setHandleError(null);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    // Auto-generate handle from title if handle is empty
    if (!formData.handle || formData.handle === formatHandle(collection?.title || "")) {
      setFormData({ 
        ...formData, 
        title: newTitle,
        handle: generateHandleFromTitle(newTitle)
      });
    } else {
      setFormData({ ...formData, title: newTitle });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate handle from title if not provided, and trim to remove any spaces
      const finalHandle = (formData.handle.trim() || generateHandleFromTitle(formData.title)).trim();

      const collectionData = {
        handle: finalHandle,
        title: formData.title,
        description: formData.description.trim() || undefined,
        position: parseInt(formData.position) || 0,
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
        const errorMessage = result.error || "Грешка при запазване на колекция";
        // Check if error is about duplicate handle
        if (errorMessage.includes("Slug") && errorMessage.includes("зает")) {
          setHandleError(errorMessage);
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error: any) {
      console.error("Error saving collection:", error);
      const errorMessage = error.message || "Грешка при запазване на колекция";
      // Check if error is about duplicate handle
      if (errorMessage.includes("Slug") && errorMessage.includes("зает")) {
        setHandleError(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Handle (URL slug)
          </label>
          <input
            type="text"
            value={formData.handle}
            onChange={handleHandleChange}
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
              handleError 
                ? "border-red-500 dark:border-red-500" 
                : "border-gray-300 dark:border-gray-700"
            }`}
            placeholder="teniskazelena"
          />
          {handleError ? (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {handleError}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Ако не се въведе, ще се генерира автоматично от името. Само малки букви, числа и без разстояния. Пример: /teniskazelena
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Име *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={handleTitleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Позиция
          </label>
          <input
            type="number"
            min="0"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="0 = първа позиция"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            0 = първа позиция, по-големи числа = по-назад
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Описание
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="Описание на колекцията (незадължително)"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Описание, което ще се показва под заглавието на колекцията
        </p>
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
