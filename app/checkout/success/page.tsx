import Link from "next/link";
import { getOrderById } from "lib/supabase/orders";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const params = await searchParams;
  const orderId = params.orderId;

  let order = null;
  if (orderId) {
    try {
      order = await getOrderById(orderId);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  }

  return (
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
  );
}
