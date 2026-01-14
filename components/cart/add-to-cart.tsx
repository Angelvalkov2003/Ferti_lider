"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { addItem } from "components/cart/actions";
import { Product, ProductVariant } from "lib/types";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useCart } from "./cart-context";

function SubmitButton({
  available,
  selectedVariantId,
}: {
  available: boolean;
  selectedVariantId: string | undefined;
}) {
  const buttonClasses =
    "relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  if (!available) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <button
      aria-label="Add to cart"
      className={clsx(buttonClasses, {
        "hover:opacity-90": true,
      })}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      Add To Cart
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, available } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) => {
    if (!variant.selectedOptions || variant.selectedOptions.length === 0) {
      return true;
    }
    return variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    );
  });
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : variants[0]?.id || product.id;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = variant || variants[0] || {
    id: product.id,
    title: "Default",
    price: product.price,
    available: product.available,
  };

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product);
        await formAction({
          productId: product.id,
          variantId: selectedVariantId,
          price: finalVariant.price,
        });
      }}
    >
      <SubmitButton
        available={available}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
