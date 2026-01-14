"use server";

import { createOrder as createOrderInDb } from "lib/supabase/orders";
import type { CreateOrderData } from "lib/supabase/orders";

export async function createOrder(data: CreateOrderData) {
  try {
    const order = await createOrderInDb(data);
    return order;
  } catch (error: any) {
    console.error("Error creating order:", error);
    throw new Error(error.message || "Грешка при създаване на поръчката");
  }
}
