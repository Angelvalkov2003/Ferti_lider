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

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: Image;
  images: Image[];
  price: number;
  compareAtPrice?: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
  available: boolean;
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
