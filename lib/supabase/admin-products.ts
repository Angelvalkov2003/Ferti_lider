import { createServerClient } from "./server";
import type { Product, ProductVariant, Image } from "lib/types";

export interface CreateProductData {
  handle: string;
  title: string;
  description?: string;
  description_html?: string;
  price: number;
  compare_at_price?: number;
  featured_image?: Image;
  images?: Image[];
  variants?: ProductVariant[];
  tags?: string[];
  category?: string;
  available?: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

/**
 * Get all products (including unavailable ones) for admin
 */
export async function getAllProductsForAdmin() {
  try {
    const supabase = await createServerClient();
    
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllProductsForAdmin:", error);
    throw error;
  }
}

/**
 * Get product by ID for admin
 */
export async function getProductByIdForAdmin(productId: string) {
  try {
    const supabase = await createServerClient();
    
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      throw new Error("Failed to fetch product");
    }

    return data;
  } catch (error) {
    console.error("Error in getProductByIdForAdmin:", error);
    throw error;
  }
}

/**
 * Create a new product
 */
export async function createProduct(data: CreateProductData) {
  try {
    const supabase = await createServerClient();
    
    const productData = {
      handle: data.handle,
      title: data.title,
      description: data.description || null,
      description_html: data.description_html || null,
      price: data.price,
      compare_at_price: data.compare_at_price || null,
      featured_image: data.featured_image || null,
      images: data.images || [],
      variants: data.variants || [],
      tags: data.tags || [],
      category: data.category || null,
      available: data.available !== false,
      updated_at: new Date().toISOString(),
    };

    const { data: product, error } = await supabase
      .from("products")
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      throw new Error("Failed to create product");
    }

    return product;
  } catch (error) {
    console.error("Error in createProduct:", error);
    throw error;
  }
}

/**
 * Update a product
 */
export async function updateProduct(data: UpdateProductData) {
  try {
    const supabase = await createServerClient();
    
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (data.handle !== undefined) updateData.handle = data.handle;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description || null;
    if (data.description_html !== undefined) updateData.description_html = data.description_html || null;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.compare_at_price !== undefined) updateData.compare_at_price = data.compare_at_price || null;
    if (data.featured_image !== undefined) updateData.featured_image = data.featured_image || null;
    if (data.images !== undefined) updateData.images = data.images || [];
    if (data.variants !== undefined) updateData.variants = data.variants || [];
    if (data.tags !== undefined) updateData.tags = data.tags || [];
    if (data.category !== undefined) updateData.category = data.category || null;
    if (data.available !== undefined) updateData.available = data.available;

    const { data: product, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", data.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      throw new Error("Failed to update product");
    }

    return product;
  } catch (error) {
    console.error("Error in updateProduct:", error);
    throw error;
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string) {
  try {
    const supabase = await createServerClient();
    
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error("Error deleting product:", error);
      throw new Error("Failed to delete product");
    }

    return true;
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    throw error;
  }
}
