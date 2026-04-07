"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction, updateProductAction } from "app/admin/products/actions";
import { leafCategorySelectOptions } from "lib/collection-hierarchy";
import { toast } from "sonner";
import type { Collection, Image } from "lib/types";
import type { PackageOptionRow } from "lib/supabase/admin-products";
import { ImageUploadButton } from "./image-upload-button";

interface PackageOptionFormRow {
  id: string;
  label: string;
  price: string;
  compare_at_price: string;
}

interface ProductFormData {
  handle: string;
  title: string;
  description: string;
  price: string;
  compare_at_price: string;
  featured_image_url: string;
  category: string;
  available: boolean;
  position: string;
  images: Image[];
  packageOptions: PackageOptionFormRow[];
}

function mapDbPackageOptions(product?: any): PackageOptionFormRow[] {
  const raw = product?.package_options;
  if (!Array.isArray(raw)) return [];
  return raw.map((o: any) => ({
    id: typeof o.id === "string" && o.id ? o.id : `opt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    label: String(o.label ?? ""),
    price: o.price != null && o.price !== "" ? String(o.price) : "",
    compare_at_price:
      o.compare_at_price != null && o.compare_at_price !== ""
        ? String(o.compare_at_price)
        : "",
  }));
}

interface ProductFormProps {
  product?: any;
  collections: any[];
}

export function ProductForm({ product, collections }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const collectionsMapped: Collection[] = useMemo(
    () =>
      collections.map(
        (c: {
          id: string;
          handle: string;
          title: string;
          parent_id?: string | null;
          updated_at?: string;
        }) => ({
          id: c.id,
          handle: c.handle,
          title: c.title,
          parentId: c.parent_id ?? null,
          updatedAt: c.updated_at || "",
        }),
      ),
    [collections],
  );

  const leafOptions = useMemo(
    () => leafCategorySelectOptions(collectionsMapped),
    [collectionsMapped],
  );

  const leafHandles = useMemo(
    () => new Set(leafOptions.map((o) => o.handle)),
    [leafOptions],
  );

  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());
  const [handleError, setHandleError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    handle: product?.handle || "",
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price?.toString() || "0",
    compare_at_price: product?.compare_at_price?.toString() || "",
    featured_image_url: product?.featured_image?.url || "",
    category: product?.category || "",
    available: product?.available !== false,
    position: product?.position?.toString() || "0",
    images: product?.images || [],
    packageOptions: mapDbPackageOptions(product),
  });

  const currentCategoryInvalid = Boolean(
    formData.category && !leafHandles.has(formData.category),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const featuredImage: Image | undefined = formData.featured_image_url
        ? {
            id: product?.featured_image?.id || "",
            url: formData.featured_image_url,
            altText: formData.title,
          }
        : undefined;

      // Ensure all images have altText set to product title
      const imagesWithAltText = formData.images.map((img) => ({
        ...img,
        altText: formData.title,
      }));

      // Generate handle from title if not provided, and trim to remove any spaces
      const finalHandle = (formData.handle.trim() || generateHandleFromTitle(formData.title)).trim();

      const normalizedOptions: PackageOptionRow[] = formData.packageOptions
        .map((row) => ({
          id: row.id,
          label: row.label.trim(),
          price: parseFloat(row.price),
          compare_at_price: row.compare_at_price.trim()
            ? parseFloat(row.compare_at_price)
            : undefined,
        }))
        .filter(
          (o) =>
            o.label.length > 0 &&
            Number.isFinite(o.price) &&
            o.price >= 0
        );

      const incompleteVariant = formData.packageOptions.some((row) => {
        const hasLabel = row.label.trim().length > 0;
        const hasPrice = row.price.trim() !== "";
        if (!hasLabel && !hasPrice) return false;
        const p = parseFloat(row.price);
        return !hasLabel || !hasPrice || !Number.isFinite(p) || p < 0;
      });
      if (incompleteVariant) {
        toast.error(
          "Попълни етикет и валидна цена за всеки започнат вариант, или го премахни."
        );
        setLoading(false);
        return;
      }

      if (collectionsMapped.length === 0) {
        toast.error("Няма категории. Създай поне една категория първо.");
        setLoading(false);
        return;
      }

      if (leafOptions.length === 0) {
        toast.error(
          "Няма крайни категории. Създай категория без подкатегории или премести продуктите в по-дълбоко ниво.",
        );
        setLoading(false);
        return;
      }

      if (!formData.category?.trim()) {
        toast.error("Избери категория.");
        setLoading(false);
        return;
      }

      if (!leafHandles.has(formData.category)) {
        toast.error(
          "Продуктът може да е само в крайна категория (без подкатегории). Избери по-конкретна категория.",
        );
        setLoading(false);
        return;
      }

      const hasVariants = normalizedOptions.length > 0;
      const basePrice = parseFloat(formData.price);
      if (!hasVariants && (!Number.isFinite(basePrice) || basePrice < 0)) {
        toast.error("Моля, въведи валидна цена или добави поне един вариант.");
        setLoading(false);
        return;
      }

      const productData = {
        handle: finalHandle,
        title: formData.title,
        description: formData.description || undefined,
        price: hasVariants
          ? Math.min(...normalizedOptions.map((o) => o.price))
          : basePrice,
        compare_at_price: hasVariants
          ? undefined
          : formData.compare_at_price
            ? parseFloat(formData.compare_at_price)
            : undefined,
        package_options: hasVariants ? normalizedOptions : [],
        featured_image: featuredImage,
        images: imagesWithAltText,
        category: formData.category || undefined,
        available: formData.available,
        position: parseInt(formData.position) || 0,
      };

      let result;
      if (product) {
        result = await updateProductAction({ ...productData, id: product.id });
      } else {
        result = await createProductAction(productData);
      }

      if (result.success) {
        toast.success(product ? "Продуктът е обновен успешно" : "Продуктът е създаден успешно");
        router.push("/admin/products");
        router.refresh();
      } else {
        const errorMessage = result.error || "Грешка при запазване на продукт";
        // Check if error is about duplicate handle
        if (errorMessage.includes("Slug") && errorMessage.includes("зает")) {
          setHandleError(errorMessage);
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error: any) {
      console.error("Error saving product:", error);
      const errorMessage = error.message || "Грешка при запазване на продукт";
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

  const addImage = () => {
    // Create a temporary file input to trigger file selection
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Моля, избери валиден файл със снимка");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Файлът е твърде голям. Максималният размер е 10MB");
        return;
      }

      // Create a new image entry with temporary ID
      const tempId = `img-${Date.now()}`;
      const newImage: Image = {
        id: tempId,
        url: "",
        altText: formData.title,
      };
      
      // Calculate the new index before adding
      const newIndex = formData.images.length;
      
      // Add the image to the list immediately (will show loading state)
      setFormData((prev) => ({ ...prev, images: [...prev.images, newImage] }));
      setUploadingImages((prev) => new Set(prev).add(tempId));

      try {
        // Upload the file
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          console.error("Failed to parse response:", parseError);
          throw new Error("Грешка при обработка на отговора от сървъра");
        }

        if (!response.ok) {
          console.error("Upload failed:", data);
          throw new Error(data.error || `Грешка при качване на снимка (${response.status})`);
        }

        // Update the image with the uploaded URL
        setFormData((prev) => {
          const updated = [...prev.images];
          const existingImage = updated[newIndex];
          updated[newIndex] = {
            id: existingImage?.id || tempId,
            url: data.url,
            altText: prev.title,
          };
          return { ...prev, images: updated };
        });
        
        setUploadingImages((prev) => {
          const next = new Set(prev);
          next.delete(tempId);
          return next;
        });
        
        toast.success("Снимката е качена успешно");
      } catch (error: any) {
        console.error("Error uploading image:", error);
        toast.error(error.message || "Грешка при качване на снимка");
        // Remove the failed image entry
        setFormData((prev) => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== newIndex),
        }));
        setUploadingImages((prev) => {
          const next = new Set(prev);
          next.delete(tempId);
          return next;
        });
      }
    };
    input.click();
  };

  const updateImage = (index: number, field: keyof Image, value: any) => {
    const updated = [...formData.images];
    const existingImage = updated[index];
    if (existingImage) {
      updated[index] = { 
        ...existingImage, 
        [field]: value,
        id: existingImage.id, // Ensure id is always a string
      };
    }
    setFormData({ ...formData, images: updated });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleFeaturedImageUpload = (url: string) => {
    setFormData({ ...formData, featured_image_url: url });
  };

  const handleImageUpload = (index: number, url: string) => {
    setFormData((prev) => {
      const updated = [...prev.images];
      if (updated[index]) {
        updated[index] = { 
          ...updated[index], 
          url: url,
          altText: prev.title, // Automatically set alt text to product title
        };
      }
      return { ...prev, images: updated };
    });
  };

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
    if (!formData.handle || formData.handle === formatHandle(product?.title || "")) {
      setFormData({ 
        ...formData, 
        title: newTitle,
        handle: generateHandleFromTitle(newTitle)
      });
    } else {
      setFormData({ ...formData, title: newTitle });
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
          placeholder="Описанието ще се покаже автоматично под продукта"
        />
      </div>

      <div className="rounded-lg border border-brand-200 dark:border-brand-900 bg-brand-50/50 dark:bg-brand-950/30 p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Варианти (опаковка / грамаж)
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              Напр. „200 г – 10 €“, „1 кг – 35 €“. Можеш да добавяш неограничен брой. В списъците се показва най-ниската цена.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                packageOptions: [
                  ...prev.packageOptions,
                  {
                    id:
                      typeof crypto !== "undefined" && crypto.randomUUID
                        ? crypto.randomUUID()
                        : `new-${Date.now()}`,
                    label: "",
                    price: "",
                    compare_at_price: "",
                  },
                ],
              }))
            }
            className="text-sm px-3 py-1.5 rounded-md bg-brand-500 text-white hover:bg-brand-600"
          >
            + Добави вариант
          </button>
        </div>
        {formData.packageOptions.length > 0 ? (
          <ul className="space-y-3">
            {formData.packageOptions.map((row, index) => (
              <li
                key={row.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                <div className="md:col-span-4">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Етикет (напр. 200 г, 1 кг)
                  </label>
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => {
                      const next = [...formData.packageOptions];
                      const cur = next[index];
                      if (cur) next[index] = { ...cur, label: e.target.value };
                      setFormData({ ...formData, packageOptions: next });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    placeholder="200 г"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Цена (EUR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={row.price}
                    onChange={(e) => {
                      const next = [...formData.packageOptions];
                      const cur = next[index];
                      if (cur) next[index] = { ...cur, price: e.target.value };
                      setFormData({ ...formData, packageOptions: next });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Стара цена (по избор)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={row.compare_at_price}
                    onChange={(e) => {
                      const next = [...formData.packageOptions];
                      const cur = next[index];
                      if (cur)
                        next[index] = { ...cur, compare_at_price: e.target.value };
                      setFormData({ ...formData, packageOptions: next });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div className="md:col-span-2 flex md:justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        packageOptions: formData.packageOptions.filter((_, i) => i !== index),
                      })
                    }
                    className="text-sm text-red-600 hover:text-red-700 py-2"
                  >
                    Премахни
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {formData.packageOptions.length > 0 ? "Единна цена (скрита при варианти)" : "Цена *"}
          </label>
          <input
            type="number"
            step="0.01"
            required={formData.packageOptions.length === 0}
            disabled={formData.packageOptions.length > 0}
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
          />
          {formData.packageOptions.length > 0 ? (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              При варианти основната цена в магазина е най-ниската от тях.
            </p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Стара Цена
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.compare_at_price}
            onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
            disabled={formData.packageOptions.length > 0}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
          />
          {formData.packageOptions.length > 0 ? (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Използвай „стара цена“ по ред във вариантите.
            </p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Категория <span className="text-red-600">*</span>
          </label>
          <select
            required={leafOptions.length > 0 && !currentCategoryInvalid}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
              currentCategoryInvalid
                ? "border-amber-500 dark:border-amber-500"
                : "border-gray-300 dark:border-gray-700"
            }`}
          >
            <option value="">
              {leafOptions.length === 0 && collectionsMapped.length > 0
                ? "— Няма крайни категории —"
                : "Избери крайна категория"}
            </option>
            {currentCategoryInvalid ? (
              <option value={formData.category} disabled>
                (не е крайна){" "}
                {collectionsMapped.find((c) => c.handle === formData.category)?.title ??
                  formData.category}
              </option>
            ) : null}
            {leafOptions.map((opt) => (
              <option key={opt.handle} value={opt.handle}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Продуктите се закачат само на категории без подкатегории (крайно ниво в дървото).
          </p>
          {currentCategoryInvalid ? (
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
              Текущата стойност е родителска категория. Избери подкатегория, в която реално стои
              продуктът.
            </p>
          ) : null}
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
          Главна Снимка
        </label>
        <div className="flex gap-2 items-end">
          <input
            type="url"
            value={formData.featured_image_url}
            onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="https://example.com/image.jpg"
          />
          <ImageUploadButton
            onUploadComplete={handleFeaturedImageUpload}
            label="Качи Снимка"
          />
        </div>
        {formData.featured_image_url && (
          <div className="mt-2">
            <img
              src={formData.featured_image_url}
              alt={formData.title}
              className="h-32 w-32 object-cover rounded border"
            />
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Допълнителни Снимки
          </label>
          <button
            type="button"
            onClick={addImage}
            className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            + Добави Снимка
          </button>
        </div>
        {formData.images.map((image, index) => {
          const isUploading = uploadingImages.has(image.id);
          return (
            <div key={image.id || index} className="mb-4 p-4 border border-gray-300 dark:border-gray-700 rounded-md">
              <div className="flex gap-2 mb-2 items-end">
                <input
                  type="url"
                  value={image.url}
                  onChange={(e) => updateImage(index, "url", e.target.value)}
                  placeholder="URL на снимка"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  disabled={isUploading}
                />
                <ImageUploadButton
                  onUploadComplete={(url) => handleImageUpload(index, url)}
                  label="Качи"
                  className="text-sm"
                  id={`additional-image-${index}`}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700"
                  disabled={isUploading}
                >
                  Изтрий
                </button>
              </div>
              {isUploading ? (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-32 w-32 bg-gray-200 dark:bg-gray-700 rounded border flex items-center justify-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Качване...</span>
                  </div>
                </div>
              ) : image.url ? (
                <div className="mt-2">
                  <img
                    src={image.url}
                    alt={formData.title}
                    className="h-32 w-32 object-cover rounded border"
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="available"
          checked={formData.available}
          onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor="available" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Продуктът е достъпен
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 disabled:opacity-50"
        >
          {loading ? "Запазване..." : product ? "Обнови" : "Създай"}
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
