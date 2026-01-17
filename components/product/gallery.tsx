"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { GridTileImage } from "components/grid/tile";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [imageIndex, setImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const index = searchParams.has("image")
      ? parseInt(searchParams.get("image")!)
      : 0;
    setImageIndex(Math.max(0, Math.min(index, images.length - 1)));
  }, [searchParams, images.length]);

  // Use 0 as fallback during SSR to prevent hydration mismatch
  const currentIndex = mounted ? imageIndex : 0;
  const currentImage = useMemo(() => images[currentIndex], [images, currentIndex]);

  const updateImage = useCallback((index: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("image", index);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const nextImageIndex = useMemo(() => 
    currentIndex + 1 < images.length ? currentIndex + 1 : 0,
    [currentIndex, images.length]
  );
  const previousImageIndex = useMemo(() =>
    currentIndex === 0 ? images.length - 1 : currentIndex - 1,
    [currentIndex, images.length]
  );

  const buttonClassName =
    "h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center";

  return (
    <form>
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        {currentImage && (
          <Image
            className="h-full w-full object-contain"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={currentImage.altText}
            src={currentImage.src}
            priority={true}
          />
        )}

        {images.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur-sm dark:border-black dark:bg-neutral-900/80">
              <button
                formAction={() => updateImage(previousImageIndex.toString())}
                aria-label="Предишна снимка на продукт"
                className={buttonClassName}
              >
                <ArrowLeftIcon className="h-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <button
                formAction={() => updateImage(nextImageIndex.toString())}
                aria-label="Следваща снимка на продукт"
                className={buttonClassName}
              >
                <ArrowRightIcon className="h-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="my-12 flex items-center flex-wrap justify-center gap-2 overflow-auto py-1 lg:mb-0">
          {images.map((image, index) => {
            const isActive = index === currentIndex;

            return (
              <li key={image.src} className="h-20 w-20">
                <button
                  formAction={() => updateImage(index.toString())}
                  aria-label="Избери снимка на продукт"
                  className="h-full w-full"
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    width={80}
                    height={80}
                    active={isActive}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </form>
  );
}
