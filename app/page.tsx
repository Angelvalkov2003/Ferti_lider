import { getCollections } from "lib/supabase/products";
import Footer from "components/layout/footer";
import Link from "next/link";

export const metadata = {
  description: "Семена и продукти по категории.",
  openGraph: {
    type: "website",
  },
};

export default async function HomePage() {
  const collections = await getCollections();

  return (
    <>
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-12 md:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-4xl">
          Категории
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Избери категория, за да разгледаш продуктите в нея.
        </p>

        {collections.length === 0 ? (
          <div className="mt-10 rounded-xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-950">
            <p className="text-neutral-600 dark:text-neutral-400">
              Все още няма категории. Добави ги от админ панела → Колекции.
            </p>
            <Link
              href="/search"
              className="mt-4 inline-block text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              Към всички продукти
            </Link>
          </div>
        ) : (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/search/${c.handle}`}
                  className="block h-full rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-brand-500/40 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-brand-500/30"
                >
                  <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {c.title}
                  </span>
                  {c.description ? (
                    <p className="mt-2 line-clamp-3 text-sm text-neutral-600 dark:text-neutral-400">
                      {c.description}
                    </p>
                  ) : null}
                  <span className="mt-4 inline-flex text-sm font-medium text-brand-600 dark:text-brand-400">
                    Виж продуктите →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
}
