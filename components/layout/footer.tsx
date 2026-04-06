import Link from "next/link";

import FooterMenu from "components/layout/footer-menu";
import LogoSquare from "components/logo-square";
import {
  getSiteEmail,
  getSitePhone,
  getSitePhoneTelHref,
  SITE_ADDRESS_FULL,
} from "lib/site-contact";
import { getCollections } from "lib/supabase/products";
import { Suspense } from "react";

const SITE_NAME = process.env.SITE_NAME || "Ecommerce Store";

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");
  const skeleton =
    "w-full h-6 animate-pulse rounded-sm bg-neutral-200 dark:bg-neutral-700";
  const collections = await getCollections();
  const menu = collections.map(c => ({ title: c.title, path: `/search/${c.handle}` }));
  const copyrightName = SITE_NAME;

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0 dark:border-neutral-700">
        <div className="max-w-sm">
          <Link
            className="flex items-center gap-2 text-black md:pt-1 dark:text-white"
            href="/"
          >
            <LogoSquare size="sm" />
            <span className="uppercase">{SITE_NAME}</span>
          </Link>
          <nav className="mt-4 flex flex-col gap-2 text-sm">
            <Link
              href="/za-nas"
              className="text-neutral-600 hover:text-brand-600 hover:underline dark:text-neutral-400 dark:hover:text-brand-400"
            >
              За нас
            </Link>
            <Link
              href="/contact"
              className="text-neutral-600 hover:text-brand-600 hover:underline dark:text-neutral-400 dark:hover:text-brand-400"
            >
              Контакти
            </Link>
            <Link
              href="/privacy-policy"
              className="text-neutral-600 hover:text-brand-600 hover:underline dark:text-neutral-400 dark:hover:text-brand-400"
            >
              Политика за поверителност
            </Link>
          </nav>
          <p className="mt-4 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
            {SITE_ADDRESS_FULL}
          </p>
          <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
            <a
              href={getSitePhoneTelHref()}
              className="hover:text-brand-600 dark:hover:text-brand-400"
            >
              {getSitePhone()}
            </a>
            {" · "}
            <a
              href={`mailto:${getSiteEmail()}`}
              className="hover:text-brand-600 dark:hover:text-brand-400"
            >
              {getSiteEmail()}
            </a>
          </p>
        </div>
        <Suspense
          fallback={
            <div className="flex h-[188px] w-[200px] flex-col gap-2">
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
            </div>
          }
        >
          <FooterMenu menu={menu} />
        </Suspense>
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 md:px-4 min-[1320px]:px-0">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith(".")
              ? "."
              : ""}{" "}
            Всички права запазени.
          </p>
        </div>
      </div>
    </footer>
  );
}
