import { ProductPurchase } from "components/product/product-purchase";
import type { Product } from "lib/types";

export function ProductDescription({ product }: { product: Product }) {
  return <ProductPurchase product={product} />;
}
