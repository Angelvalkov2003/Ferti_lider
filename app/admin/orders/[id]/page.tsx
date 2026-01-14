import { getOrderById, updateOrderStatus } from "lib/supabase/orders";
import { notFound } from "next/navigation";
import Link from "next/link";
import { OrderStatusForm } from "components/admin/order-status-form";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let order;
  try {
    order = await getOrderById(params.id);
  } catch (error) {
    notFound();
  }

  const products = Array.isArray(order.products) ? order.products : [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
        >
          ← Назад към поръчките
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Поръчка #{order.id.substring(0, 8)}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Създадена на{" "}
          {new Date(order.created_at).toLocaleDateString("bg-BG", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Customer Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Информация за клиента
          </h2>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Име:
              </span>
              <p className="text-gray-900 dark:text-white">{order.customer_name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Имейл:
              </span>
              <p className="text-gray-900 dark:text-white">
                <a
                  href={`mailto:${order.customer_email}`}
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                >
                  {order.customer_email}
                </a>
              </p>
            </div>
            {order.customer_phone && (
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Телефон:
                </span>
                <p className="text-gray-900 dark:text-white">
                  <a
                    href={`tel:${order.customer_phone}`}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                  >
                    {order.customer_phone}
                  </a>
                </p>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Адрес:
              </span>
              <p className="text-gray-900 dark:text-white whitespace-pre-line">
                {order.customer_address}
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Резюме на поръчката
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Статус:</span>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  order.status === "new"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : order.status === "paid"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : order.status === "shipped"
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                    : order.status === "completed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Брой артикули:
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                {products.reduce(
                  (sum: number, p: any) => sum + (p.quantity || 0),
                  0
                )}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-900 dark:text-white">Обща сума:</span>
              <span className="text-gray-900 dark:text-white">
                ${Number(order.total_price).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <OrderStatusForm orderId={order.id} currentStatus={order.status} />
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Продукти
        </h2>
        <div className="space-y-4">
          {products.map((product: any, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {product.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Количество: {product.quantity} × ${product.price.toFixed(2)}
                </p>
              </div>
              <p className="font-medium text-gray-900 dark:text-white">
                ${(product.price * product.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Comment */}
      {order.comment && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Коментар от клиента
          </h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {order.comment}
          </p>
        </div>
      )}
    </div>
  );
}
