import { GridTileImage } from "components/grid/tile";
import Footer from "components/layout/footer";
import { Gallery } from "components/product/gallery";
import { BackButton } from "components/product/back-button";
import { ProductDescription } from "components/product/product-description";
import { getProduct, getProducts } from "lib/supabase/products";
import type { Image } from "lib/types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};

  return {
    title: product.title,
    description: product.description,
    robots: {
      index: product.available,
      follow: product.available,
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt: alt || product.title,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();
  
  // Pre-compute images array to avoid recreating it on every render
  const galleryImages = [
    // Главната снимка винаги е първа
    {
      src: product.featuredImage?.url || "",
      altText: product.featuredImage?.altText || product.title,
    },
    // След това идват допълнителните снимки
    ...(product.images || []).slice(0, 4).map((image: Image) => ({
      src: image.url,
      altText: image.altText || product.title,
    })),
  ].filter((img) => img.src);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url || "",
    offers: {
      "@type": "Offer",
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: "EUR",
      price: product.price,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="relative h-full w-full basis-full lg:basis-4/6">
            <BackButton />
            <Gallery images={galleryImages} />
          </div>

          <div className="basis-full lg:basis-2/6">
            <ProductDescription product={product} />
          </div>
        </div>
        <RelatedProducts category={product.category} currentId={product.id} />
      </div>
      <Footer />
    </>
  );
}

async function RelatedProducts({ category, currentId }: { category?: string; currentId: string }) {
  // Exclude current product directly in database query for better performance
  const relatedProducts = await getProducts({ 
    collection: category,
    limit: 4,
    excludeId: currentId
  });

  if (!relatedProducts.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Свързани Продукти</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((product) => (
          <li
            key={product.handle}
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <Link
              className="relative h-full w-full"
              href={`/product/${product.handle}`}
              prefetch={true}
            >
              <GridTileImage
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.price.toString(),
                  compareAtAmount: product.compareAtPrice?.toString(),
                  currencyCode: "EUR",
                }}
                src={product.featuredImage?.url}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
