import { ReadonlyURLSearchParams } from "next/navigation";

export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
  process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const formatPrice = (price: number, currency: string = "EUR"): string => {
  return new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency,
  }).format(price);
};
