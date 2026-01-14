"use server";

import { redirect } from "next/navigation";
import { createCheckoutSession } from "lib/stripe";
import { baseUrl } from "lib/utils";
import type { Cart } from "lib/types";

// Cart is now stored in localStorage on client side
// These server actions are kept for compatibility but do minimal work
// The actual cart management happens in cart-context.tsx using localStorage

export async function addItem(
  prevState: any,
  payload: {
    productId: string;
    variantId: string;
    price: number;
  }
) {
  // Cart is managed client-side via useCart() hook
  // This action is kept for form compatibility but does nothing
  return null;
}

export async function removeItem(prevState: any, itemId: string) {
  // Cart is managed client-side via useCart() hook
  // This action is kept for form compatibility but does nothing
  return null;
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    itemId: string;
    quantity: number;
  }
) {
  // Cart is managed client-side via useCart() hook
  // This action is kept for form compatibility but does nothing
  return null;
}

export async function redirectToCheckout(cart: Cart) {
  // Cart is passed from client side (from localStorage)
  if (!cart || cart.items.length === 0) {
    return "Cart is empty";
  }

  try {
    const session = await createCheckoutSession(
      cart,
      `${baseUrl}/checkout/success`,
      `${baseUrl}/checkout/cancel`
    );

    redirect(session.url!);
  } catch (e) {
    console.error(e);
    return "Error creating checkout session";
  }
}

export async function createCartAndSetCookie() {
  // Cart is created automatically in localStorage on client side
  // This function is kept for compatibility but does nothing
}
