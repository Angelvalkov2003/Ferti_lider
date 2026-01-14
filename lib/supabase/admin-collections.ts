import { createServerClient } from "./server";

export interface CreateCollectionData {
  handle: string;
  title: string;
}

export interface UpdateCollectionData extends Partial<CreateCollectionData> {
  id: string;
}

/**
 * Get all collections for admin
 */
export async function getAllCollectionsForAdmin() {
  try {
    const supabase = await createServerClient();
    
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .order("title");

    if (error) {
      console.error("Error fetching collections:", error);
      throw new Error("Failed to fetch collections");
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllCollectionsForAdmin:", error);
    throw error;
  }
}

/**
 * Get collection by ID for admin
 */
export async function getCollectionByIdForAdmin(collectionId: string) {
  try {
    const supabase = await createServerClient();
    
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .eq("id", collectionId)
      .single();

    if (error) {
      console.error("Error fetching collection:", error);
      throw new Error("Failed to fetch collection");
    }

    return data;
  } catch (error) {
    console.error("Error in getCollectionByIdForAdmin:", error);
    throw error;
  }
}

/**
 * Create a new collection
 */
export async function createCollection(data: CreateCollectionData) {
  try {
    const supabase = await createServerClient();
    
    const collectionData = {
      handle: data.handle,
      title: data.title,
      updated_at: new Date().toISOString(),
    };

    const { data: collection, error } = await supabase
      .from("collections")
      .insert(collectionData)
      .select()
      .single();

    if (error) {
      console.error("Error creating collection:", error);
      throw new Error("Failed to create collection");
    }

    return collection;
  } catch (error) {
    console.error("Error in createCollection:", error);
    throw error;
  }
}

/**
 * Update a collection
 */
export async function updateCollection(data: UpdateCollectionData) {
  try {
    const supabase = await createServerClient();
    
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (data.handle !== undefined) updateData.handle = data.handle;
    if (data.title !== undefined) updateData.title = data.title;

    const { data: collection, error } = await supabase
      .from("collections")
      .update(updateData)
      .eq("id", data.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating collection:", error);
      throw new Error("Failed to update collection");
    }

    return collection;
  } catch (error) {
    console.error("Error in updateCollection:", error);
    throw error;
  }
}

/**
 * Delete a collection
 */
export async function deleteCollection(collectionId: string) {
  try {
    const supabase = await createServerClient();
    
    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("id", collectionId);

    if (error) {
      console.error("Error deleting collection:", error);
      throw new Error("Failed to delete collection");
    }

    return true;
  } catch (error) {
    console.error("Error in deleteCollection:", error);
    throw error;
  }
}
