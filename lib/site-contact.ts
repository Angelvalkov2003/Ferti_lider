/**
 * Контакти на Ferti Lider — ползвай env за override в продукция.
 */

export const SITE_ADDRESS_FULL =
  "България, с. Батулци, община Ябланица";

export const SITE_ADDRESS_LINES = [
  "България",
  "с. Батулци, община Ябланица",
] as const;

function envOr(defaultVal: string, key: string): string {
  if (typeof process !== "undefined" && process.env[key]) {
    return process.env[key] as string;
  }
  return defaultVal;
}

export function getSitePhone(): string {
  return envOr("0883300656", "NEXT_PUBLIC_CONTACT_PHONE");
}

/** За tel: линкове */
export function getSitePhoneTelHref(): string {
  const p = getSitePhone().replace(/\s/g, "");
  if (p.startsWith("+")) return `tel:${p}`;
  if (p.startsWith("0")) return `tel:+359${p.slice(1)}`;
  return `tel:+359${p}`;
}

export function getSiteEmail(): string {
  return envOr("fertilider@mail.bg", "NEXT_PUBLIC_CONTACT_EMAIL");
}

/** Линк за WhatsApp (без +, с код на държава) */
export function getWhatsAppUrl(): string {
  const raw = getSitePhone().replace(/\s/g, "");
  const digits = raw.replace(/^\+/, "");
  const normalized = digits.startsWith("0")
    ? `359${digits.slice(1)}`
    : digits.startsWith("359")
      ? digits
      : `359${digits}`;
  return `https://wa.me/${normalized}`;
}

/** Отваряне на локацията в Google Maps (приложение / браузър) */
export function getGoogleMapsPlaceUrl(): string {
  const q = encodeURIComponent(SITE_ADDRESS_FULL);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

/**
 * Вградена карта (без API ключ). Ако Google блокира iframe на някои домейни,
 * показваме и бутон „Отвори в Google Maps“.
 */
export function getGoogleMapsEmbedUrl(): string {
  const q = encodeURIComponent(SITE_ADDRESS_FULL);
  return `https://maps.google.com/maps?q=${q}&hl=bg&z=13&ie=UTF8&iwloc=&output=embed`;
}

const DEFAULT_FACEBOOK_URL = "https://www.facebook.com/fertiliderltd/";

export function getFacebookUrl(): string {
  return envOr(DEFAULT_FACEBOOK_URL, "NEXT_PUBLIC_FACEBOOK_URL");
}
