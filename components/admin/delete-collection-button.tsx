"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCollectionAction } from "app/admin/collections/actions";
import { toast } from "sonner";

export function DeleteCollectionButton({
  collectionId,
  collectionTitle,
}: {
  collectionId: string;
  collectionTitle: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Сигурен ли си, че искаш да изтриеш "${collectionTitle}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await deleteCollectionAction(collectionId);
      if (result.success) {
        toast.success("Колекцията е изтрита успешно");
        router.refresh();
      } else {
        toast.error(result.error || "Грешка при изтриване на колекция");
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
      toast.error("Грешка при изтриване на колекция");
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
