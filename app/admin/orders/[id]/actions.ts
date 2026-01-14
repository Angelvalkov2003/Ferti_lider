"use server";

import { updateOrderStatus as updateStatus, updateOrder, type UpdateOrderData } from "lib/supabase/orders";

export async function updateOrderStatus(
  orderId: string,
  status: "new" | "confirmed" | "shipped" | "paid" | "completed" | "canceled"
) {
  return await updateStatus(orderId, status);
}

export async function updateOrderFields(
  orderId: string,
  data: UpdateOrderData
) {
  return await updateOrder(orderId, data);
}
