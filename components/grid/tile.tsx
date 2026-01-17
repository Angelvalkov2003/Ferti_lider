import clsx from "clsx";
import Image from "next/image";
import { memo } from "react";
import Label from "../label";

export const GridTileImage = memo(function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    compareAtAmount?: string;
    currencyCode: string;
    position?: "bottom" | "center";
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        "group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-stone-400 dark:bg-black dark:hover:border-stone-600",
        {
          relative: label,
          "border-2 border-stone-400 dark:border-stone-600": active,
          "border-neutral-200 dark:border-neutral-800": !active,
        },
      )}
    >
      {props.src ? (
        <Image
          className={clsx("relative h-full w-full object-contain", {
            "transition duration-300 ease-in-out group-hover:scale-105":
              isInteractive,
          })}
          {...props}
        />
      ) : null}
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          compareAtAmount={label.compareAtAmount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
    </div>
  );
});
