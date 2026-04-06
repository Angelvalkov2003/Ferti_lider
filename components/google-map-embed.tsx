import { getGoogleMapsEmbedUrl, getGoogleMapsPlaceUrl } from "lib/site-contact";

export function GoogleMapEmbed() {
  const src = getGoogleMapsEmbedUrl();
  const openHref = getGoogleMapsPlaceUrl();

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <div className="relative aspect-[16/10] w-full min-h-[280px]">
        <iframe
          title="Локация: с. Батулци, община Ябланица"
          src={src}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-950">
        <a
          href={openHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          Отвори в Google Maps →
        </a>
      </div>
    </div>
  );
}
