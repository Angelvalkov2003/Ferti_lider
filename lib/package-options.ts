import type { PackageOption, Product, ProductVariant } from "lib/types";

function newOptionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `opt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Parse JSONB from DB into validated package options */
export function parsePackageOptionsFromDb(raw: unknown): PackageOption[] {
  if (!Array.isArray(raw)) return [];
  const out: PackageOption[] = [];
  for (let i = 0; i < raw.length; i++) {
    const o = raw[i] as Record<string, unknown>;
    const label = String(o.label ?? "").trim();
    const price = Number(o.price);
    if (!label || !Number.isFinite(price) || price < 0) continue;
    const id = typeof o.id === "string" && o.id.trim() ? o.id.trim() : newOptionId();
    const cap = o.compare_at_price;
    const compareAtPrice =
      cap != null && cap !== "" ? Number(cap) : undefined;
    out.push({
      id,
      label,
      price,
      compareAtPrice:
        compareAtPrice !== undefined && Number.isFinite(compareAtPrice) && compareAtPrice >= 0
          ? compareAtPrice
          : undefined,
    });
  }
  return out;
}

export const DEFAULT_VARIANT_TITLE = "Стандартен";

/** Варианти за количка / UI */
export function productToVariants(product: Product): ProductVariant[] {
  const opts = product.packageOptions;
  if (!opts.length) {
    return [
      {
        id: `${product.id}-default`,
        title: DEFAULT_VARIANT_TITLE,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        available: product.available,
      },
    ];
  }
  return opts.map((o) => ({
    id: o.id,
    title: o.label,
    price: o.price,
    compareAtPrice: o.compareAtPrice,
    available: product.available,
  }));
}

/** Най-ниска цена за филтри / етикет „от …“ */
export function minOptionPrice(options: PackageOption[], fallback: number): number {
  if (!options.length) return fallback;
  return Math.min(...options.map((o) => o.price));
}
