import { NextResponse } from "next/server";
import { getCollections } from "lib/supabase/products";

export async function GET() {
  try {
    const collections = await getCollections();
    return NextResponse.json(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json([], { status: 500 });
  }
}
