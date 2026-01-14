"use server";

import { updateOrderStatus as updateStatus } from "lib/supabase/orders";

export async function updateOrderStatus(
  orderId: string,
  status: "new" | "paid" | "shipped" | "completed" | "canceled"
) {
  return await updateStatus(orderId, status);
}
