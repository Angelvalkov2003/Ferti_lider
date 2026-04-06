"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { addItem } from "components/cart/actions";
import type { Product, ProductVariant } from "lib/types";
import { useActionState } from "react";
import { useCart } from "./cart-context";

function SubmitButton({
  available,
}: {
  available: boolean;
}) {
  const buttonClasses =
    "relative flex w-full items-center justify-center rounded-full bg-brand-500 p-4 tracking-wide text-white";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  if (!available) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Изчерпан
      </button>
    );
  }

  return (
    <button
      aria-label="Добави в количка"
      className={clsx(buttonClasses, {
        "hover:opacity-90": true,
      })}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      Добави в Количка
    </button>
  );
}

export function AddToCart({
  product,
  variant,
}: {
  product: Product;
  variant: ProductVariant;
}) {
  const { available } = product;
  const { addCartItem } = useCart();
  const [message, formAction] = useActionState(addItem, null);

  const variantData: ProductVariant = {
    ...variant,
    available: variant.available && product.available,
    selectedOptions: variant.selectedOptions ?? [],
  };

  return (
    <form
      action={async () => {
        addCartItem(variantData, product);
        await formAction({
          productId: product.id,
          variantId: variant.id,
          price: variantData.price,
        });
      }}
    >
      <SubmitButton available={available} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
