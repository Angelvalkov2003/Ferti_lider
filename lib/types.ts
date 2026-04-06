// Base types for the ecommerce application

export type Image = {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
};

export type ProductVariant = {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  inventory?: number;
  available: boolean;
  selectedOptions?: { name: string; value: string }[];
};

/** Опаковка / грамаж с цена (напр. „200 г“ – 20 лв) */
export type PackageOption = {
  id: string;
  label: string;
  price: number;
  compareAtPrice?: number;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: Image;
  images: Image[];
  price: number;
  compareAtPrice?: number;
  /** Празно = единна цена от полето price; иначе клиентът избира вариант */
  packageOptions: PackageOption[];
  category?: string;
  createdAt: string;
  updatedAt: string;
  available: boolean;
};

/** Ред в поръчката (пази се в orders.products JSONB) */
export type OrderLineSnapshot = {
  id: string;
  name: string;
  /** Единична цена за избрания вариант (1 бр.) */
  price: number;
  quantity: number;
  variant_id: string;
  /** Напр. „200 г“; липсва при продукт без варианти */
  variant_label: string | null;
  /** price × quantity */
  line_total: number;
};

export type CartItem = {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    title: string;
    handle: string;
    image: Image;
  };
  variant: {
    id: string;
    title: string;
  };
};

export type Cart = {
  id?: string;
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  total: number;
  currency: string;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description?: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  currency: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
};
