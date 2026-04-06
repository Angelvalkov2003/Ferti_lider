import Link from "next/link";

import LogoSquare from "components/logo-square";
import {
  getFacebookUrl,
  getSiteEmail,
  getSitePhone,
  getSitePhoneTelHref,
  getWhatsAppUrl,
  SITE_ADDRESS_FULL,
} from "lib/site-contact";

const SITE_NAME = process.env.SITE_NAME || "Ferti Lider";

const sep = (
  <span className="text-brand-300/80 dark:text-brand-700" aria-hidden>
    ·
  </span>
);

export default function Footer() {
  const phone = getSitePhone();
  const email = getSiteEmail();
  const wa = getWhatsAppUrl();
  const facebookUrl = getFacebookUrl();

  return (
    <footer className="border-t border-brand-200/70 bg-brand-50 text-xs text-neutral-700 dark:border-brand-800 dark:bg-brand-950/45 dark:text-neutral-300 sm:text-sm">
      <div className="mx-auto max-w-7xl space-y-3 px-4 py-5 min-[1320px]:px-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-900 dark:text-white"
          >
            <LogoSquare size="sm" />
            <span className="font-semibold">{SITE_NAME}</span>
          </Link>
          <nav className="flex flex-wrap gap-x-4 gap-y-1">
            <Link
              href="/contact"
              className="font-medium text-brand-700 hover:underline dark:text-brand-400"
            >
              Контакти
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-brand-600 hover:underline dark:text-neutral-400"
            >
              Политика за поверителност
            </Link>
          </nav>
        </div>

        <p className="text-neutral-600 dark:text-neutral-400">
          {SITE_ADDRESS_FULL}
        </p>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <a
            href={getSitePhoneTelHref()}
            className="hover:text-brand-600 dark:hover:text-brand-400"
          >
            {phone}
          </a>
          {sep}
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-600 dark:hover:text-brand-400"
          >
            WhatsApp
          </a>
          {sep}
          <a
            href={`mailto:${email}`}
            className="break-all hover:text-brand-600 dark:hover:text-brand-400"
          >
            {email}
          </a>
          {sep}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-600 dark:hover:text-brand-400"
          >
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
}
