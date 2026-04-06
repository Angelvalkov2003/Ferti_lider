/** Публичен път към логото (файл в /public — източник за favicon, OG fallback, имейли) */
export const SITE_LOGO_PATH = "/logo.png" as const;

/** Динамично генерирани OG/Twitter изображения (лого върху фон) */
export const DEFAULT_OG_IMAGE_PATH = "/opengraph-image" as const;
export const DEFAULT_TWITTER_IMAGE_PATH = "/twitter-image" as const;

/** Next.js `app/icon.png` — същият визуален актив като логото */
export const APP_ICON_PATH = "/icon.png" as const;

export function absoluteLogoUrl(siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}${SITE_LOGO_PATH}`;
}

export function absoluteUrl(siteUrl: string, pathname: string): string {
  const base = siteUrl.replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}
