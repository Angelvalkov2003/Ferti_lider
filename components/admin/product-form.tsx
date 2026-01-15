"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction, updateProductAction } from "app/admin/products/actions";
import { toast } from "sonner";
import type { Image } from "lib/types";
import { ImageUploadButton } from "./image-upload-button";

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
}

interface ProductFormProps {
  product?: any;
  collections: any[];
}

export function ProductForm({ product, collections }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
  });

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

      const productData = {
        handle: finalHandle,
        title: formData.title,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : undefined,
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Цена *
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Категория
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Избери категория</option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.handle}>
                {collection.title}
              </option>
            ))}
          </select>
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
            className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
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
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
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
