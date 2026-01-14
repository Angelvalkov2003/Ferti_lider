import type { Cart } from "lib/types";

/**
 * Cart is now stored locally in browser (localStorage)
 * This file provides helper functions for server-side cart operations
 * Note: Actual cart management happens in client-side components using localStorage
 */

export async function getCart(): Promise<Cart | null> {
  // Cart is stored in localStorage on client side
  // This function is kept for compatibility but returns empty cart
  // The actual cart is managed by CartProvider in cart-context.tsx
  return {
    id: undefined,
    items: [],
    totalQuantity: 0,
    subtotal: 0,
    total: 0,
    currency: "EUR",
  };
}

// These functions are no longer needed as cart is stored locally
// They are kept for backward compatibility but do nothing
export async function createCart(): Promise<string> {
  // Cart is created automatically in localStorage on client side
  return "local-cart";
}

export async function addToCart(
  cartId: string,
  productId: string,
  variantId: string,
  quantity: number,
  price: number
): Promise<void> {
  // Cart operations happen in client-side components
  // This is a no-op for server-side compatibility
}

export async function removeFromCart(cartId: string, itemId: string): Promise<void> {
  // Cart operations happen in client-side components
  // This is a no-op for server-side compatibility
}

export async function updateCartItem(
  cartId: string,
  itemId: string,
  quantity: number
): Promise<void> {
  // Cart operations happen in client-side components
  // This is a no-op for server-side compatibility
}
