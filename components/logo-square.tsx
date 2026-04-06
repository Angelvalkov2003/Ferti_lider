"use client";

import clsx from "clsx";
import Image from "next/image";

const LOGO_SRC = "/logo.png";

export default function LogoSquare({ size }: { size?: "sm" | "lg" }) {
  const isSm = size === "sm";
  const isLg = size === "lg";
  return (
    <div
      className={clsx(
        "relative flex flex-none items-center justify-center overflow-visible bg-transparent",
        {
          "h-[4.5rem] w-[4.5rem] max-h-[4.5rem] max-w-[4.5rem]": isLg,
          "h-20 w-20 sm:h-24 sm:w-24": !isSm && !isLg,
          "h-9 w-9 rounded-lg": isSm,
        },
      )}
    >
      <Image
        src={LOGO_SRC}
        alt=""
        fill
        className={clsx("object-contain object-center", isSm ? "p-0.5" : "p-0")}
        sizes={
          isSm
            ? "36px"
            : isLg
              ? "72px"
              : "(max-width: 640px) 80px, 96px"
        }
        priority
      />
    </div>
  );
}
