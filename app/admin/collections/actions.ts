"use server";

import {
  createCollection,
  updateCollection,
  deleteCollection,
  type CreateCollectionData,
  type UpdateCollectionData,
} from "lib/supabase/admin-collections";
import { revalidatePath } from "next/cache";

export async function createCollectionAction(data: CreateCollectionData) {
  try {
    const collection = await createCollection(data);
    revalidatePath("/admin/collections");
    revalidatePath("/admin");
    return { success: true, collection };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create collection" };
  }
}

export async function updateCollectionAction(data: UpdateCollectionData) {
  try {
    const collection = await updateCollection(data);
    revalidatePath("/admin/collections");
    revalidatePath(`/admin/collections/${data.id}`);
    revalidatePath("/admin");
    return { success: true, collection };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update collection" };
  }
}

export async function deleteCollectionAction(collectionId: string) {
  try {
    await deleteCollection(collectionId);
    revalidatePath("/admin/collections");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete collection" };
  }
}
