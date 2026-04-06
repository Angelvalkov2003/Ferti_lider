"use client";

import { useMemo, useState } from "react";
import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import { productToVariants } from "lib/package-options";
import type { Product } from "lib/types";
import { formatPrice } from "lib/utils";
import clsx from "clsx";

export function ProductPurchase({ product }: { product: Product }) {
  const variants = useMemo(() => productToVariants(product), [product]);
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? "");

  const selected =
    variants.find((v) => v.id === selectedId) ?? variants[0] ?? null;

  if (!selected) {
    return null;
  }

  const showVariantPicker = product.packageOptions.length > 0;

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full bg-brand-100 dark:bg-brand-950/60 p-2 text-sm text-neutral-900 dark:text-white">
          {selected.compareAtPrice && selected.compareAtPrice > selected.price ? (
            <div className="flex items-center gap-2">
              <span className="text-red-600 dark:text-red-400 line-through">
                <Price
                  amount={selected.compareAtPrice.toString()}
                  currencyCode="EUR"
                />
              </span>
              <Price amount={selected.price.toString()} currencyCode="EUR" />
            </div>
          ) : (
            <Price amount={selected.price.toString()} currencyCode="EUR" />
          )}
        </div>
      </div>

      {showVariantPicker ? (
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Избери опаковка / количество
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedId(v.id)}
                className={clsx(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  selectedId === v.id
                    ? "border-brand-600 bg-brand-500 text-white"
                    : "border-neutral-300 bg-white text-neutral-900 hover:border-brand-400 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:hover:border-brand-500"
                )}
              >
                <span className="font-medium">{v.title}</span>
                <span className="ml-2 opacity-90 tabular-nums">
                  {formatPrice(v.price)}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {product.description ? (
        <div className="mb-6 text-sm leading-tight dark:text-white/[60%]">
          {product.description}
        </div>
      ) : null}

      <AddToCart product={product} variant={selected} />
    </>
  );
}
