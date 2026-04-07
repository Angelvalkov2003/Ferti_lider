"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createCollectionAction, updateCollectionAction } from "app/admin/collections/actions";
import { getDescendantIds, parentSelectOptions } from "lib/collection-hierarchy";
import type { Collection } from "lib/types";
import { toast } from "sonner";

interface CollectionFormData {
  handle: string;
  title: string;
  description: string;
  position: string;
  parentId: string;
}

export type AdminCollectionRow = {
  id: string;
  handle: string;
  title: string;
  parent_id: string | null;
};

interface CollectionFormProps {
  collection?: Record<string, unknown> & { id: string };
  allCollections?: AdminCollectionRow[];
}

export function CollectionForm({
  collection,
  allCollections = [],
}: CollectionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [handleError, setHandleError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CollectionFormData>({
    handle: (collection?.handle as string) || "",
    title: (collection?.title as string) || "",
    description: (collection?.description as string) || "",
    position: collection?.position != null ? String(collection.position) : "0",
    parentId: collection?.parent_id ? String(collection.parent_id) : "",
  });

  const asCollection: Collection[] = useMemo(
    () =>
      allCollections.map((c) => ({
        id: c.id,
        handle: c.handle,
        title: c.title,
        parentId: c.parent_id ?? null,
        updatedAt: "",
      })),
    [allCollections],
  );

  const parentOptions = useMemo(() => {
    const excludeIds = new Set<string>();
    if (collection?.id) {
      excludeIds.add(collection.id);
      const desc = getDescendantIds(collection.id, asCollection);
      desc.forEach((id) => excludeIds.add(id));
    }
    return parentSelectOptions(asCollection, excludeIds);
  }, [collection?.id, asCollection]);

  const formatHandle = (value: string): string => {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const generateHandleFromTitle = (title: string): string => {
    return formatHandle(title);
  };

  const handleHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatHandle(e.target.value);
    setFormData({ ...formData, handle: formatted });
    if (handleError) setHandleError(null);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (
      !formData.handle ||
      formData.handle === formatHandle((collection?.title as string) || "")
    ) {
      setFormData({
        ...formData,
        title: newTitle,
        handle: generateHandleFromTitle(newTitle),
      });
    } else {
      setFormData({ ...formData, title: newTitle });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalHandle = (
        formData.handle.trim() || generateHandleFromTitle(formData.title)
      ).trim();

      const collectionData = {
        handle: finalHandle,
        title: formData.title,
        description: formData.description.trim() || undefined,
        position: parseInt(formData.position, 10) || 0,
        parentId: formData.parentId.trim() || null,
      };

      let result;
      if (collection) {
        result = await updateCollectionAction({ ...collectionData, id: collection.id });
      } else {
        result = await createCollectionAction(collectionData);
      }

      if (result.success) {
        toast.success(
          collection ? "Категорията е обновена успешно" : "Категорията е създадена успешно",
        );
        router.push("/admin/collections");
        router.refresh();
      } else {
        const errorMessage = result.error || "Грешка при запазване";
        if (errorMessage.includes("Slug") && errorMessage.includes("зает")) {
          setHandleError(errorMessage);
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error: unknown) {
      console.error("Error saving collection:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Грешка при запазване";
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Handle (URL slug)
          </label>
          <input
            type="text"
            value={formData.handle}
            onChange={handleHandleChange}
            className={`w-full rounded-md border bg-white px-3 py-2 text-gray-900 dark:bg-gray-800 dark:text-white ${
              handleError
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-700"
            }`}
            placeholder="semena-zelenchuci"
          />
          {handleError ? (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{handleError}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Малки букви, числа и тире. Използва се в адреса /search/...
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Име *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={handleTitleChange}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Родителска категория
          </label>
          <select
            value={formData.parentId}
            onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">— Главна категория (без родител) —</option>
            {parentOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Подкатегориите се показват под родителя в менюто. Не може да избереш себе си или
            своя подкатегория като родител.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Позиция
          </label>
          <input
            type="number"
            min="0"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="0 = първа позиция"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Описание
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="Описание (незадължително)"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {loading ? "Запазване..." : collection ? "Обнови" : "Създай"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Отказ
        </button>
      </div>
    </form>
  );
}
