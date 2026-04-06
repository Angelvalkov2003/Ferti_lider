/** Публичен път към логото (статичен файл в /public) */
export const SITE_LOGO_PATH = "/logo.png" as const;

export function absoluteLogoUrl(siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}${SITE_LOGO_PATH}`;
}
