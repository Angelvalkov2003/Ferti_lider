import Image from "next/image";
import Link from "next/link";
import type { Collection } from "lib/types";
import { HomeCategoriesSection } from "components/home/home-categories-section";
import {
  DELIVERY_CLIENT_PAYS_BELOW_EUR,
  getSitePhone,
  getSitePhoneTelHref,
  getWhatsAppUrl,
  SITE_ADDRESS_LINES,
} from "lib/site-contact";
import {
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  SparklesIcon,
  TruckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const HERO_IMAGE = "/main_pick.jpg";

type Props = {
  collections: Collection[];
};

export function HomeLanding({ collections }: Props) {
  const phone = getSitePhone();
  const telHref = getSitePhoneTelHref();
  const waHref = getWhatsAppUrl();

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative isolate">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(113,168,38,0.22),transparent_55%)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(113,168,38,0.15),transparent_50%)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute right-0 top-20 -z-10 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-700/20 md:top-32" />
        <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-64 w-64 rounded-full bg-brand-100/60 blur-3xl dark:bg-brand-900/30" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 md:gap-14 md:px-6 md:pb-20 md:pt-14 lg:grid-cols-2 lg:gap-12 lg:pt-16 min-[1320px]:px-8">
          <div className="max-w-xl lg:max-w-none">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50/90 px-3 py-1 text-xs font-medium uppercase tracking-wide text-brand-800 dark:border-brand-700/50 dark:bg-brand-950/50 dark:text-brand-200">
              <SparklesIcon className="h-4 w-4" aria-hidden />
              Семена · Градина · Стопанство
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl sm:leading-[1.1]">
              Качество от{" "}
              <span className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-300">
                Ferti Lider
              </span>
              <br />
              за твоята реколта
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
              Подбрани семена, торове и продукти за градина и поле. Лично отношение,
              съвети от хората зад магазина и доставка с{" "}
              <strong className="font-semibold text-neutral-800 dark:text-white">
                Еконт
              </strong>{" "}
              до цяла България.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                При поръчки до {DELIVERY_CLIENT_PAYS_BELOW_EUR} € доставката е за сметка на
                клиента — прозрачно и честно.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                База в{" "}
                {SITE_ADDRESS_LINES.join(" · ")} — работим с български земеделци и любители
                градинари.
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 hover:shadow-xl dark:shadow-brand-900/40"
              >
                Разгледай продуктите
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white/80 px-5 py-3 text-sm font-semibold text-neutral-800 backdrop-blur transition hover:border-brand-400 hover:bg-brand-50/80 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-white dark:hover:border-brand-600 dark:hover:bg-brand-950/50"
              >
                Свържи се с нас
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm">
              <a
                href={telHref}
                className="inline-flex items-center gap-2 text-neutral-700 transition hover:text-brand-600 dark:text-neutral-300 dark:hover:text-brand-400"
              >
                <span className="rounded-lg bg-brand-100 p-2 dark:bg-brand-900/60">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 text-brand-700 dark:text-brand-300" />
                </span>
                {phone}
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-brand-700 hover:underline dark:text-brand-400"
              >
                WhatsApp →
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-400/20 via-transparent to-brand-600/10 blur-2xl dark:from-brand-500/10 dark:to-brand-800/20" />
            <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 shadow-2xl shadow-neutral-900/10 ring-1 ring-black/5 dark:border-white/10 dark:bg-neutral-900/40 dark:shadow-black/40">
              <div className="relative aspect-[4/3] w-full sm:aspect-[16/11] lg:aspect-[5/4]">
                <Image
                  src={HERO_IMAGE}
                  alt="Ferti Lider — семена и продукти"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent p-5 pt-16 sm:p-6 sm:pt-20">
                <p className="text-sm font-medium text-white drop-shadow-md">
                  Всичко за успешна реколта — на едно място.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-brand-100/80 bg-brand-50/50 dark:border-brand-900/40 dark:bg-brand-950/30">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-5 text-center text-sm text-neutral-700 dark:text-neutral-300 min-[1320px]:px-8">
          <span className="inline-flex items-center gap-2 font-medium">
            <TruckIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            Доставка с Еконт
          </span>
          <span className="hidden h-4 w-px bg-brand-200 dark:bg-brand-800 sm:block" />
          <span className="inline-flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            България
          </span>
          <span className="hidden h-4 w-px bg-brand-200 dark:bg-brand-800 sm:block" />
          <span>Лично обслужване и съвет</span>
        </div>
      </section>

      <HomeCategoriesSection collections={collections} />

      {/* Защо да избереш нас — под категориите */}
      <section className="relative border-t border-neutral-200/80 bg-gradient-to-b from-white via-brand-50/30 to-neutral-50/90 py-16 dark:border-neutral-800 dark:from-neutral-950 dark:via-brand-950/20 dark:to-neutral-950 md:py-24">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-300/50 to-transparent dark:via-brand-700/40"
          aria-hidden
        />
        <div className="mx-auto max-w-7xl px-4 min-[1320px]:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-400">
              Предимства
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-4xl">
              Защо да избереш{" "}
              <span className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-300">
                нас
              </span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-lg">
              Качествени продукти и човешко отношение — без анонимни кол центрове и скрити условия.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {[
              {
                title: "Подбрана селекция",
                body: "Семена и продукти за нашия климат и почви — подбираме внимателно това, което предлагаме.",
                icon: ShoppingBagIcon,
                accent: "from-emerald-500 to-brand-600",
              },
              {
                title: "Ясни условия",
                body: `Доставка с Еконт; при поръчки до ${DELIVERY_CLIENT_PAYS_BELOW_EUR} € доставката е за клиента — без скрити такси в сайта.`,
                icon: ShieldCheckIcon,
                accent: "from-brand-500 to-emerald-600",
              },
              {
                title: "Директен контакт",
                body: "Телефон, WhatsApp и имейл — отговаряме лично и помагаме с избора според твоята култура.",
                icon: UserCircleIcon,
                accent: "from-brand-600 to-brand-500",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="group relative flex flex-col rounded-3xl border border-neutral-200/70 bg-white/90 p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.03] transition duration-300 hover:-translate-y-1 hover:border-brand-200/80 hover:shadow-[0_20px_40px_-12px_rgba(34,120,40,0.15)] dark:border-neutral-800 dark:bg-neutral-900/90 dark:ring-white/5 dark:hover:border-brand-800/60 dark:hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.45]"
              >
                <span
                  className="absolute right-6 top-6 font-mono text-4xl font-bold tabular-nums text-brand-100/90 dark:text-brand-950/40"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  className={`relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-lg shadow-brand-600/25 transition group-hover:scale-105 group-hover:shadow-xl`}
                >
                  <item.icon className="h-7 w-7" aria-hidden />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-[15px]">
                  {item.body}
                </p>
                <span
                  className="mt-6 h-1 w-12 rounded-full bg-gradient-to-r from-brand-400 to-brand-600 opacity-60 transition group-hover:w-16 group-hover:opacity-100"
                  aria-hidden
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20 min-[1320px]:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-600 to-brand-800 px-6 py-12 text-center shadow-xl dark:from-brand-800 dark:via-brand-900 dark:to-brand-950 md:px-12 md:py-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 40%)",
            }}
          />
          <div className="relative">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Имаш въпрос за сорт, дозировка или срок на сеитба?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-brand-100">
              Пиши ни — ще ти отговорим с внимание и опит.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-800 shadow-lg transition hover:bg-brand-50"
              >
                Форма за контакт
              </Link>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border-2 border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
