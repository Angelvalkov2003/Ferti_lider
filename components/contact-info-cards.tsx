import {
  getSiteEmail,
  getSitePhone,
  getSitePhoneTelHref,
  getWhatsAppUrl,
  SITE_ADDRESS_LINES,
  SITE_ADDRESS_FULL,
} from "lib/site-contact";
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";

export function ContactInfoCards() {
  const email = getSiteEmail();
  const phone = getSitePhone();
  const wa = getWhatsAppUrl();

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/15 dark:bg-amber-500/20">
          <MapPinIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" aria-hidden />
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Адрес
          </h3>
          <p className="mt-1 text-base text-neutral-900 dark:text-white">
            {SITE_ADDRESS_LINES.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-950/60">
          <PhoneIcon className="h-6 w-6 text-brand-600 dark:text-brand-400" aria-hidden />
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Телефон | WhatsApp
          </h3>
          <a
            href={getSitePhoneTelHref()}
            className="mt-1 block text-base text-neutral-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
          >
            {phone}
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            Пиши в WhatsApp →
          </a>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/15 dark:bg-amber-500/20">
          <EnvelopeIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" aria-hidden />
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Имейл
          </h3>
          <a
            href={`mailto:${email}`}
            className="mt-1 block text-base text-neutral-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
          >
            {email}
          </a>
        </div>
      </div>

      <p className="sr-only">{SITE_ADDRESS_FULL}</p>
    </div>
  );
}
