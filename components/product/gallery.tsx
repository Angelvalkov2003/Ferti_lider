"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { GridTileImage } from "components/grid/tile";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToImage = useCallback((index: number) => {
    if (index === currentIndex || isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    // Reset transition state after animation
    setTimeout(() => setIsTransitioning(false), 200);
  }, [currentIndex, isTransitioning]);

  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % images.length;
    goToImage(nextIndex);
  }, [currentIndex, images.length, goToImage]);

  const goToPrevious = useCallback(() => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    goToImage(prevIndex);
  }, [currentIndex, images.length, goToImage]);

  // Preload adjacent images for instant switching
  useEffect(() => {
    if (images.length > 1 && typeof window !== "undefined") {
      const nextIndex = (currentIndex + 1) % images.length;
      const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      
      // Preload next and previous images using DOM Image API
      const nextImage = images[nextIndex];
      const prevImage = images[prevIndex];
      
      if (nextImage) {
        const preloadNext = new window.Image();
        preloadNext.src = nextImage.src;
      }
      
      if (prevImage) {
        const preloadPrev = new window.Image();
        preloadPrev.src = prevImage.src;
      }
    }
  }, [currentIndex, images]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [goToNext, goToPrevious]);

  const buttonClassName =
    "h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center";

  if (!images.length) return null;

  return (
    <div>
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        {/* Main image with fade transition */}
        <div className="relative h-full w-full">
          {images.map((image, index) => (
            <div
              key={image.src}
              className={`absolute inset-0 transition-opacity duration-200 will-change-opacity ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                className="h-full w-full object-contain"
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                alt={image.altText}
                src={image.src}
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {images.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full justify-center z-20">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur-sm dark:border-black dark:bg-neutral-900/80">
              <button
                onClick={goToPrevious}
                aria-label="Предишна снимка на продукт"
                className={buttonClassName}
                disabled={isTransitioning}
              >
                <ArrowLeftIcon className="h-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <button
                onClick={goToNext}
                aria-label="Следваща снимка на продукт"
                className={buttonClassName}
                disabled={isTransitioning}
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
                  onClick={() => goToImage(index)}
                  aria-label="Избери снимка на продукт"
                  className={`h-full w-full transition-opacity ${
                    isActive ? "opacity-100" : "opacity-70 hover:opacity-100"
                  }`}
                  disabled={isTransitioning}
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
    </div>
  );
}
