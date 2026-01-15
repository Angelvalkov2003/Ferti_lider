"use client";

import { useEffect } from "react";
import { useCart } from "./cart-context";

/**
 * Client component that clears the cart when the success page loads
 * This ensures the cart is emptied after a successful order
 */
export function ClearCartOnSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart when component mounts (page loads)
    clearCart();
  }, [clearCart]);

  return null;
}
