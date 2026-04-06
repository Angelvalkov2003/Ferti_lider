import type { MetadataRoute } from "next";
import { SITE_LOGO_PATH } from "lib/site-brand";

export default function manifest(): MetadataRoute.Manifest {
  const name = process.env.SITE_NAME || "Ferti Lider";
  return {
    name,
    short_name: name.slice(0, 12),
    description: "Семена и продукти за градина и стопанство.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#71a826",
    icons: [
      {
        src: SITE_LOGO_PATH,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: SITE_LOGO_PATH,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: SITE_LOGO_PATH,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: SITE_LOGO_PATH,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
