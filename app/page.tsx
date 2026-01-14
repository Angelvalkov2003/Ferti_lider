import { getProducts } from "lib/supabase/products";
import { ThreeItemGrid } from "components/grid/three-items";
import Footer from "components/layout/footer";

export const metadata = {
  description:
    "High-performance ecommerce store built with Next.js, Supabase, and Stripe.",
  openGraph: {
    type: "website",
  },
};

export default async function HomePage() {
  // Get featured products for homepage
  const featuredProducts = await getProducts({ limit: 6 });

  return (
    <>
      <ThreeItemGrid products={featuredProducts} />
      <Footer />
    </>
  );
}
