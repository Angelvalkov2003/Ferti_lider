import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function OpenCart({
  className,
  quantity,
  compact,
}: {
  className?: string;
  quantity?: number;
  compact?: boolean;
}) {
  return (
    <div
      className={clsx(
        "relative flex items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white",
        compact ? "h-9 w-9 max-h-9 max-w-9" : "h-11 w-11",
      )}
    >
      <ShoppingCartIcon
        className={clsx(
          compact ? "h-[1.05rem]" : "h-4",
          "transition-all ease-in-out hover:scale-110",
          className,
        )}
      />

      {quantity ? (
        <div
          className={clsx(
            "absolute right-0 top-0 rounded-sm bg-brand-500 font-medium text-white",
            compact
              ? "-mr-1.5 -mt-1.5 h-3.5 min-w-3.5 px-0.5 text-[10px]"
              : "-mr-2 -mt-2 h-4 w-4 text-[11px]",
          )}
        >
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
