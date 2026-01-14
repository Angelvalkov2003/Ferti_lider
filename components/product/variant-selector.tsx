"use client";

import clsx from "clsx";
import { ProductVariant } from "lib/types";
import { useRouter, useSearchParams } from "next/navigation";

export function VariantSelector({
  variants,
}: {
  variants: ProductVariant[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!variants || variants.length <= 1) {
    return null;
  }

  // Extract unique options from variants
  const optionsMap = new Map<string, Set<string>>();
  variants.forEach((variant) => {
    if (variant.selectedOptions) {
      variant.selectedOptions.forEach((option) => {
        if (!optionsMap.has(option.name)) {
          optionsMap.set(option.name, new Set());
        }
        optionsMap.get(option.name)!.add(option.value);
      });
    }
  });

  if (optionsMap.size === 0) {
    return null;
  }

  const updateOption = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name.toLowerCase(), value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      {Array.from(optionsMap.entries()).map(([optionName, values]) => (
        <form key={optionName}>
          <dl className="mb-8">
            <dt className="mb-4 text-sm uppercase tracking-wide">{optionName}</dt>
            <dd className="flex flex-wrap gap-3">
              {Array.from(values).map((value) => {
                const optionNameLowerCase = optionName.toLowerCase();
                const isActive = searchParams.get(optionNameLowerCase) === value;

                // Check if variant with this option is available
                const variantWithOption = variants.find((v) =>
                  v.selectedOptions?.some(
                    (opt) => opt.name.toLowerCase() === optionNameLowerCase && opt.value === value
                  ) && v.available
                );
                const isAvailable = !!variantWithOption;

                return (
                  <button
                    formAction={() => updateOption(optionNameLowerCase, value)}
                    key={value}
                    aria-disabled={!isAvailable}
                    disabled={!isAvailable}
                    title={`${optionName} ${value}${!isAvailable ? " (Изчерпан)" : ""}`}
                    className={clsx(
                      "flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900",
                      {
                        "cursor-default ring-2 ring-blue-600": isActive,
                        "ring-1 ring-transparent transition duration-300 ease-in-out hover:ring-blue-600":
                          !isActive && isAvailable,
                        "relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 dark:before:bg-neutral-700":
                          !isAvailable,
                      },
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </dd>
          </dl>
        </form>
      ))}
    </>
  );
}
