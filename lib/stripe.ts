import Stripe from "stripe";
import type { Cart } from "./types";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia" as any,
});

export async function createCheckoutSession(cart: Cart, successUrl: string, cancelUrl: string) {
  // Ensure currency is always EUR
  const currency = "eur";
  
  const lineItems = cart.items.map((item) => ({
    price_data: {
      currency: currency,
      product_data: {
        name: item.product.title,
        images: item.product.image.url ? [item.product.image.url] : [],
      },
      unit_amount: Math.round(item.price * 100), // Convert to cents
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    currency: currency, // Explicitly set currency
    locale: "bg", // Bulgarian language for checkout interface
    metadata: {
      cartId: cart.id || "",
    },
    // Ensure customer email is passed through
    customer_email: undefined, // Will be collected during checkout
  });

  return session;
}

export async function getSession(sessionId: string) {
  return await stripe.checkout.sessions.retrieve(sessionId);
}
