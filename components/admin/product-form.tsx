"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction, updateProductAction } from "app/admin/products/actions";
import { toast } from "sonner";
import type { ProductVariant, Image } from "lib/types";

interface ProductFormData {
  handle: string;
  title: string;
  description: string;
  description_html: string;
  price: string;
  compare_at_price: string;
  featured_image_url: string;
  featured_image_alt: string;
  category: string;
  available: boolean;
  tags: string;
  variants: ProductVariant[];
  images: Image[];
}

interface ProductFormProps {
  product?: any;
  collections: any[];
}

export function ProductForm({ product, collections }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    handle: product?.handle || "",
    title: product?.title || "",
    description: product?.description || "",
    description_html: product?.description_html || "",
    price: product?.price?.toString() || "0",
    compare_at_price: product?.compare_at_price?.toString() || "",
    featured_image_url: product?.featured_image?.url || "",
    featured_image_alt: product?.featured_image?.altText || "",
    category: product?.category || "",
    available: product?.available !== false,
    tags: product?.tags?.join(", ") || "",
    variants: product?.variants || [],
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
            altText: formData.featured_image_alt || formData.title,
          }
        : undefined;

      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const productData = {
        handle: formData.handle,
        title: formData.title,
        description: formData.description || undefined,
        description_html: formData.description_html || undefined,
        price: parseFloat(formData.price),
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : undefined,
        featured_image: featuredImage,
        images: formData.images,
        variants: formData.variants,
        tags: tags,
        category: formData.category || undefined,
        available: formData.available,
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
        toast.error(result.error || "Грешка при запазване на продукт");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Грешка при запазване на продукт");
    } finally {
      setLoading(false);
    }
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: `variant-${Date.now()}`,
      title: "",
      price: 0,
      available: true,
    };
    setFormData({ ...formData, variants: [...formData.variants, newVariant] });
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const updated = [...formData.variants];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, variants: updated });
  };

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  const addImage = () => {
    const newImage: Image = {
      id: `img-${Date.now()}`,
      url: "",
      altText: "",
    };
    setFormData({ ...formData, images: [...formData.images, newImage] });
  };

  const updateImage = (index: number, field: keyof Image, value: any) => {
    const updated = [...formData.images];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, images: updated });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
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
            placeholder="product-handle"
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

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Описание
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          HTML Описание
        </label>
        <textarea
          value={formData.description_html}
          onChange={(e) => setFormData({ ...formData, description_html: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Главна Снимка URL
          </label>
          <input
            type="url"
            value={formData.featured_image_url}
            onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Alt Текст за Главна Снимка
          </label>
          <input
            type="text"
            value={formData.featured_image_alt}
            onChange={(e) => setFormData({ ...formData, featured_image_alt: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {formData.featured_image_url && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Преглед на Главна Снимка
          </label>
          <img
            src={formData.featured_image_url}
            alt={formData.featured_image_alt}
            className="h-32 w-32 object-cover rounded border"
          />
        </div>
      )}

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
        {formData.images.map((image, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="url"
              value={image.url}
              onChange={(e) => updateImage(index, "url", e.target.value)}
              placeholder="URL на снимка"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <input
              type="text"
              value={image.altText || ""}
              onChange={(e) => updateImage(index, "altText", e.target.value)}
              placeholder="Alt текст"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="px-3 py-2 text-red-600 hover:text-red-700"
            >
              Изтрий
            </button>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Варианти
          </label>
          <button
            type="button"
            onClick={addVariant}
            className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            + Добави Вариант
          </button>
        </div>
        {formData.variants.map((variant, index) => (
          <div key={index} className="border p-4 rounded mb-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input
                type="text"
                value={variant.title}
                onChange={(e) => updateVariant(index, "title", e.target.value)}
                placeholder="Име на вариант"
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                step="0.01"
                value={variant.price}
                onChange={(e) => updateVariant(index, "price", parseFloat(e.target.value))}
                placeholder="Цена"
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                step="0.01"
                value={variant.compareAtPrice || ""}
                onChange={(e) => updateVariant(index, "compareAtPrice", e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Стара цена"
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <div className="flex gap-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={variant.available}
                    onChange={(e) => updateVariant(index, "available", e.target.checked)}
                    className="mr-2"
                  />
                  Достъпен
                </label>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="ml-auto text-red-600 hover:text-red-700"
                >
                  Изтрий
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Тагове (разделени със запетая)
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="tag1, tag2, tag3"
        />
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
