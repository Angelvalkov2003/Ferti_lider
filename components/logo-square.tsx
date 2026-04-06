"use client";

import clsx from "clsx";
import Image from "next/image";

const LOGO_SRC = "/logo.png";

export default function LogoSquare({ size }: { size?: "sm" | undefined }) {
  const isSm = size === "sm";
  return (
    <div
      className={clsx(
        "relative flex flex-none items-center justify-center overflow-hidden border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-950",
        {
          "h-10 w-10 rounded-xl": !isSm,
          "h-8 w-8 rounded-lg": isSm,
        },
      )}
    >
      <Image
        src={LOGO_SRC}
        alt=""
        fill
        className="object-contain p-1"
        sizes={isSm ? "32px" : "40px"}
        priority
      />
    </div>
  );
}
