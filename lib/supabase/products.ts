import type { Product, Collection } from "lib/types";
import { cache } from "react";
import { createServerClient } from "./server";

// Helper to check if error is React.postpone()
function isReactPostpone(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "$$typeof" in error &&
    error.$$typeof === Symbol.for("react.postpone")
  );
}

export async function getProducts(params?: {
  query?: string;
  collection?: string;
  limit?: number;
  offset?: number;
  excludeId?: string;
}): Promise<Product[]> {
  try {
    const supabase = await createServerClient();
    
    let query = supabase
      .from("products")
      .select("*")
      .eq("available", true);

    if (params?.query) {
      query = query.or(`title.ilike.%${params.query}%,description.ilike.%${params.query}%`);
    }

    if (params?.collection) {
      query = query.eq("category", params.collection);
    }

    // Exclude specific product ID if provided
    if (params?.excludeId) {
      query = query.neq("id", params.excludeId);
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    if (params?.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    const { data, error } = await query
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error.message || error);
      return [];
    }

    if (!data) {
      return [];
    }

    return data.map(transformProduct);
  } catch (error) {
    // Don't catch React.postpone() - let it propagate for PPR
    if (isReactPostpone(error)) {
      throw error;
    }
    console.error("Error in getProducts:", error);
    return [];
  }
}

// Cache getProduct to prevent duplicate calls in the same request
export const getProduct = cache(async (handle: string): Promise<Product | null> => {
  try {
    const supabase = await createServerClient();
    
    // Trim the handle to match database (in case there are trailing spaces)
    const trimmedHandle = handle.trim();
    
    // Query directly by handle - much more efficient than fetching all products
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("handle", trimmedHandle)
      .eq("available", true)
      .single();

    if (error || !data) {
      return null;
    }

    return transformProduct(data);
  } catch (error) {
    // Don't catch React.postpone() - let it propagate for PPR
    if (isReactPostpone(error)) {
      throw error;
    }
    console.error("Error in getProduct:", error);
    return null;
  }
});

export async function getCollections(): Promise<Collection[]> {
  try {
    const supabase = await createServerClient();
    
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .order("position", { ascending: true })
      .order("title", { ascending: true });

    if (error) {
      // If table doesn't exist or other error, return empty array
      console.error("Error fetching collections:", error.message || error);
      return [];
    }

    if (!data) {
      return [];
    }

    return data.map((item: any) => ({
      id: item.id,
      handle: item.handle,
      title: item.title,
      updatedAt: item.updated_at || new Date().toISOString(),
    }));
  } catch (error) {
    // Catch any unexpected errors and return empty array
    console.error("Error in getCollections:", error);
    return [];
  }
}

export async function getCollectionProducts(handle: string): Promise<Product[]> {
  try {
    const supabase = await createServerClient();
    
    // Verify collection exists
    const { data: collection, error } = await supabase
      .from("collections")
      .select("handle")
      .eq("handle", handle)
      .single();

    if (error || !collection) {
      return [];
    }

    // Use handle (which is stored in products.category) to filter products
    return getProducts({ collection: handle });
  } catch (error) {
    // Don't catch React.postpone() - let it propagate for PPR
    if (isReactPostpone(error)) {
      throw error;
    }
    console.error("Error in getCollectionProducts:", error);
    return [];
  }
}

function transformProduct(data: any): Product {
  return {
    id: data.id,
    handle: data.handle,
    title: data.title,
    description: data.description || "",
    featuredImage: data.featured_image || {
      id: "",
      url: "/placeholder-image.jpg",
      altText: data.title,
    },
    images: data.images || [],
    price: data.price,
    compareAtPrice: data.compare_at_price,
    category: data.category,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    available: data.available !== false,
  };
}
