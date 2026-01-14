import { createServerClient } from "./server";
import { sendNewOrderNotification } from "lib/email";

export interface CreateOrderData {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total_price: number;
  comment?: string;
}

/**
 * Create a new order in the database
 */
export async function createOrder(data: CreateOrderData) {
  const supabase = await createServerClient();

  // Prepare products as JSONB
  const productsJson = data.products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: product.quantity,
  }));

  // Insert order into database
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone || null,
      customer_address: data.customer_address,
      products: productsJson,
      total_price: data.total_price,
      status: "new",
      comment: data.comment || null,
    })
    .select()
    .single();

  if (error || !order) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }

  // Send email notification about new order
  try {
    await sendNewOrderNotification({
      orderId: order.id,
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      customerAddress: data.customer_address,
      totalPrice: data.total_price,
      products: data.products,
      comment: data.comment,
    });
  } catch (emailError) {
    // Log email error but don't fail the order creation
    console.error("Failed to send order notification email:", emailError);
    // Order is still created successfully, just email failed
  }

  return order;
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !data) {
    throw new Error("Order not found");
  }

  return data;
}

/**
 * Get all orders (for admin)
 */
export async function getAllOrders() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch orders");
  }

  return data || [];
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: "new" | "paid" | "shipped" | "completed" | "canceled"
) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (error || !data) {
    throw new Error("Failed to update order status");
  }

  return data;
}
