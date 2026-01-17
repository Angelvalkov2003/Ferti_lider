import { GridTileImage } from "components/grid/tile";
import type { Product } from "lib/types";
import Link from "next/link";
import { formatPrice } from "lib/utils";

function ThreeItemGridItem({
  item,
  size,
  priority,
}: {
  item: Product;
  size: "full" | "half";
  priority?: boolean;
}) {
  return (
    <div
      className={
        size === "full"
          ? "md:col-span-4 md:row-span-2"
          : "md:col-span-2 md:row-span-1"
      }
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/product/${item.handle}`}
        prefetch={true}
      >
        <GridTileImage
          src={item.featuredImage.url}
          fill
          sizes={
            size === "full"
              ? "(min-width: 768px) 66vw, 100vw"
              : "(min-width: 768px) 33vw, 100vw"
          }
          priority={priority}
          alt={item.featuredImage.altText || item.title}
          label={{
            position: size === "full" ? "center" : "bottom",
            title: item.title,
            amount: item.price.toString(),
            compareAtAmount: item.compareAtPrice?.toString(),
            currencyCode: "EUR",
          }}
        />
      </Link>
    </div>
  );
}

export function ThreeItemGrid({ products }: { products: Product[] }) {
  if (!products || products.length < 3) {
    return null;
  }

  const [firstProduct, secondProduct, thirdProduct] = products.slice(0, 3);

  // TypeScript guard: ensure all products exist
  if (!firstProduct || !secondProduct || !thirdProduct) {
    return null;
  }

  return (
    <section className="mx-auto grid max-w-(--breakpoint-2xl) gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      <ThreeItemGridItem size="full" item={firstProduct} priority={true} />
      <ThreeItemGridItem size="half" item={secondProduct} priority={true} />
      <ThreeItemGridItem size="half" item={thirdProduct} />
    </section>
  );
}
