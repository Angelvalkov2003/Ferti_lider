import OpengraphImage from "components/opengraph-image";

/** Същата визуализация като Open Graph — Viber / X / др. ползват twitter:image */
export default async function Image() {
  return await OpengraphImage();
}
