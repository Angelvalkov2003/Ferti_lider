import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { getProducts } from "lib/supabase/products";

export const metadata = {
  title: "Търсене",
  description: "Търсене на продукти в магазина.",
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { q: searchValue } = searchParams as { [key: string]: string };

  const products = await getProducts({ query: searchValue });
  const resultsText = products.length > 1 ? "резултата" : "резултат";

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? "Няма продукти, които отговарят на "
            : `Показване на ${products.length} ${resultsText} за `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
