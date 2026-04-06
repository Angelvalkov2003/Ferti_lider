import { ContactInfoCards } from "components/contact-info-cards";
import { GoogleMapEmbed } from "components/google-map-embed";
import Footer from "components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "За нас",
  description:
    "Ferti Lider — семена и селскостопански продукти. Адрес в с. Батулци, община Ябланица.",
};

export default function AboutPage() {
  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-5xl">
          За нас
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
          Добре дошли при Ferti Lider. Предлагаме качествени семена и продукти за вашата
          градина и стопанство. Свържете се с нас по телефон, WhatsApp или имейл — ще
          отговорим възможно най-скоро.
        </p>

        <section className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Контакти
            </h2>
            <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
              <ContactInfoCards />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Локация
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Село Батулци, община Ябланица, област Ловеч.
            </p>
            <div className="mt-6">
              <GoogleMapEmbed />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
