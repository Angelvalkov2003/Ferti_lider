import Footer from "components/layout/footer";
import { HomeLanding } from "components/home/home-landing";
import { getCollections } from "lib/supabase/products";

export const metadata = {
  description:
    "Ferti Lider — семена, торове и продукти за градина и стопанство. Доставка с Еконт, лично обслужване.",
  openGraph: {
    type: "website",
  },
};

export default async function HomePage() {
  const collections = await getCollections();

  return (
    <>
      <HomeLanding collections={collections} />
      <Footer />
    </>
  );
}
