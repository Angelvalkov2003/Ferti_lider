"use server";

import {
  createProduct,
  updateProduct,
  deleteProduct,
  type CreateProductData,
  type UpdateProductData,
} from "lib/supabase/admin-products";
import { revalidatePath } from "next/cache";

export async function createProductAction(data: CreateProductData) {
  try {
    const product = await createProduct(data);
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    return { success: true, product };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create product" };
  }
}

export async function updateProductAction(data: UpdateProductData) {
  try {
    const product = await updateProduct(data);
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${data.id}`);
    revalidatePath("/admin");
    return { success: true, product };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update product" };
  }
}

export async function deleteProductAction(productId: string) {
  try {
    await deleteProduct(productId);
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete product" };
  }
}
