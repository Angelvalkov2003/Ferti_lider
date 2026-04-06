import Footer from "components/layout/footer";
import Image from "next/image";

export const metadata = {
  description: "Ferti Lider — семена и продукти.",
  openGraph: {
    type: "website",
  },
};

/** Сложи файла в `public/main_pick.png` (или смени разширението по-долу). */
const HOME_HERO_SRC = "/main_pick.png";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto w-full max-w-[2000px] px-3 py-4 sm:px-4 md:py-5">
        <div className="relative h-[calc(100svh-5.5rem)] w-full">
          <Image
            src={HOME_HERO_SRC}
            alt="Ferti Lider"
            fill
            className="object-contain object-center"
            sizes="100vw"
            priority
          />
        </div>
      </section>
      <Footer />
    </>
  );
}
