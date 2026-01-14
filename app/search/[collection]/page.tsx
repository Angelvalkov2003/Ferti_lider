import { getCollectionProducts, getCollections } from "lib/supabase/products";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collections = await getCollections();
  const collection = collections.find(c => c.handle === params.collection);

  if (!collection) return notFound();

  return {
    title: collection.title,
    description: collection.description || `${collection.title} products`,
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const collections = await getCollections();
  const collection = collections.find(c => c.handle === params.collection);
  const products = await getCollectionProducts(params.collection);

  if (!collection) {
    return notFound();
  }

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{collection.title}</h1>
        {products.length > 0 && (
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        )}
      </div>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}
