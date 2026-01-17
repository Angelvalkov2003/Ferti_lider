import Link from "next/link";
import { getOrderById } from "lib/supabase/orders";
import { sendNewOrderNotification } from "lib/email";
import { ClearCartOnSuccess } from "components/cart/clear-cart-on-success";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const params = await searchParams;
  const orderId = params.orderId;

  let order = null;
  let emailSent = false;
  
  if (orderId) {
    try {
      order = await getOrderById(orderId);
      
      // Send email notification when order is finalized
      // Only send if order exists and hasn't been sent before (check if order was just created)
      if (order) {
        try {
          const emailResult = await sendNewOrderNotification({
            orderId: order.id,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            customerPhone: order.customer_phone || undefined,
            customerAddress: order.customer_address,
            totalPrice: Number(order.total_price),
            paymentMethod: order.payment_method as "cash_on_delivery" | "card",
            products: (order.products as any[]).map((p: any) => ({
              id: p.id,
              name: p.name,
              price: Number(p.price),
              quantity: p.quantity,
            })),
            comment: order.comment || undefined,
          });
          
          if (emailResult.success) {
            emailSent = true;
            console.log(`Order notification email sent successfully for order ${order.id}`);
          }
        } catch (emailError: any) {
          // Log detailed email error
          console.error("Failed to send order notification email:", {
            error: emailError,
            message: emailError?.message,
            statusCode: emailError?.statusCode,
            name: emailError?.name,
            orderId: order.id,
            stack: emailError?.stack,
          });
          // Don't throw - we want the page to load even if email fails
        }
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  }

  return (
    <>
      <ClearCartOnSuccess />
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          Поръчката е приета!
        </h1>
        {order && (
          <div className="mb-6 text-left bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Номер на поръчка:</strong> #{order.id.substring(0, 8)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Начин на плащане:</strong>{" "}
              {order.payment_method === "cash_on_delivery"
                ? "Наложен платеж"
                : "Плащане с карта"}
            </p>
            {order.payment_method === "cash_on_delivery" && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ще платите при получаване на поръчката.
              </p>
            )}
          </div>
        )}
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          Благодарим ви за поръчката. Ще получите потвърждение по имейл скоро.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition-colors"
          >
            Към началната страница
          </Link>
          <Link
            href="/search"
            className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            Продължи пазаруване
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
