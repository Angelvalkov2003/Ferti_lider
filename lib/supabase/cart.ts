import type { Cart, CartItem } from "lib/types";
import { createServerClient } from "./server";
import { cookies } from "next/headers";

export async function getCart(): Promise<Cart | null> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  if (!cartId) {
    return {
      id: undefined,
      items: [],
      totalQuantity: 0,
      subtotal: 0,
      total: 0,
      currency: "USD",
    };
  }

  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      *,
      product:products(*),
      variant:product_variants(*)
    `)
    .eq("cart_id", cartId);

  if (error || !data) {
    return {
      id: cartId,
      items: [],
      totalQuantity: 0,
      subtotal: 0,
      total: 0,
      currency: "USD",
    };
  }

  const items: CartItem[] = data.map((item: any) => ({
    id: item.id,
    productId: item.product_id,
    variantId: item.variant_id,
    quantity: item.quantity,
    price: item.price,
    product: {
      id: item.product.id,
      title: item.product.title,
      handle: item.product.handle,
      image: item.product.featured_image || {
        id: "",
        url: "/placeholder-image.jpg",
        altText: item.product.title,
      },
    },
    variant: {
      id: item.variant?.id || "",
      title: item.variant?.title || "Default",
    },
  }));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: cartId,
    items,
    totalQuantity,
    subtotal,
    total: subtotal, // Add tax/shipping calculation here if needed
    currency: "USD",
  };
}

export async function createCart(): Promise<string> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from("carts")
    .insert({})
    .select()
    .single();

  if (error || !data) {
    throw new Error("Failed to create cart");
  }

  return data.id;
}

export async function addToCart(
  cartId: string,
  productId: string,
  variantId: string,
  quantity: number,
  price: number
): Promise<void> {
  const supabase = await createServerClient();
  
  // Check if item already exists
  const { data: existing } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .eq("variant_id", variantId)
    .single();

  if (existing) {
    await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("cart_items")
      .insert({
        cart_id: cartId,
        product_id: productId,
        variant_id: variantId,
        quantity,
        price,
      });
  }
}

export async function removeFromCart(cartId: string, itemId: string): Promise<void> {
  const supabase = await createServerClient();
  
  await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cartId)
    .eq("id", itemId);
}

export async function updateCartItem(
  cartId: string,
  itemId: string,
  quantity: number
): Promise<void> {
  const supabase = await createServerClient();
  
  if (quantity <= 0) {
    await removeFromCart(cartId, itemId);
  } else {
    await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("cart_id", cartId)
      .eq("id", itemId);
  }
}
