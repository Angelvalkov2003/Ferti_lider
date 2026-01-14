"use server";

import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "lib/supabase/cart";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createCheckoutSession } from "lib/stripe";
import { baseUrl } from "lib/utils";

export async function addItem(
  prevState: any,
  payload: {
    productId: string;
    variantId: string;
    price: number;
  }
) {
  try {
    const cookieStore = await cookies();
    let cartId = cookieStore.get("cartId")?.value;

    if (!cartId) {
      cartId = await createCart();
      cookieStore.set("cartId", cartId);
    }

    await addToCart(cartId, payload.productId, payload.variantId, 1, payload.price);
  } catch (e) {
    console.error(e);
    return "Error adding item to cart";
  }
}

export async function removeItem(prevState: any, itemId: string) {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    if (!cartId) {
      return "Cart not found";
    }

    await removeFromCart(cartId, itemId);
  } catch (e) {
    console.error(e);
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    itemId: string;
    quantity: number;
  }
) {
  const { itemId, quantity } = payload;

  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    if (!cartId) {
      return "Cart not found";
    }

    await updateCartItem(cartId, itemId, quantity);
  } catch (e) {
    console.error(e);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  const cart = await getCart();
  
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
  const cookieStore = await cookies();
  const cartId = await createCart();
  cookieStore.set("cartId", cartId);
}
