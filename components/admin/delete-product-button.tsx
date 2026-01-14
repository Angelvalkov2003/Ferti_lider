"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProductAction } from "app/admin/products/actions";
import { toast } from "sonner";

export function DeleteProductButton({
  productId,
  productTitle,
}: {
  productId: string;
  productTitle: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Сигурен ли си, че искаш да изтриеш "${productTitle}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await deleteProductAction(productId);
      if (result.success) {
        toast.success("Продуктът е изтрит успешно");
        router.refresh();
      } else {
        toast.error(result.error || "Грешка при изтриване на продукт");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Грешка при изтриване на продукт");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
    >
      {loading ? "Изтриване..." : "Изтрий"}
    </button>
  );
}
