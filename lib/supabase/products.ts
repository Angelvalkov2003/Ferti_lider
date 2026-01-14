import type { Product, Collection } from "lib/types";
import { createServerClient } from "./server";

export async function getProducts(params?: {
  query?: string;
  collection?: string;
  limit?: number;
  offset?: number;
}): Promise<Product[]> {
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

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  if (params?.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return (data || []).map(transformProduct);
}

export async function getProduct(handle: string): Promise<Product | null> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("handle", handle)
    .eq("available", true)
    .single();

  if (error || !data) {
    return null;
  }

  return transformProduct(data);
}

export async function getCollections(): Promise<Collection[]> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .order("title");

  if (error) {
    console.error("Error fetching collections:", error);
    return [];
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    handle: item.handle,
    title: item.title,
    description: item.description,
    image: item.image ? {
      id: item.image.id || "",
      url: item.image.url,
      altText: item.image.altText,
    } : undefined,
    updatedAt: item.updated_at || new Date().toISOString(),
  }));
}

export async function getCollectionProducts(handle: string): Promise<Product[]> {
  const supabase = await createServerClient();
  
  const { data: collection } = await supabase
    .from("collections")
    .select("id")
    .eq("handle", handle)
    .single();

  if (!collection) {
    return [];
  }

  return getProducts({ collection: collection.id });
}

function transformProduct(data: any): Product {
  return {
    id: data.id,
    handle: data.handle,
    title: data.title,
    description: data.description || "",
    descriptionHtml: data.description_html,
    featuredImage: data.featured_image || {
      id: "",
      url: "/placeholder-image.jpg",
      altText: data.title,
    },
    images: data.images || [],
    price: data.price,
    compareAtPrice: data.compare_at_price,
    variants: data.variants || [],
    tags: data.tags || [],
    category: data.category,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    available: data.available !== false,
  };
}
