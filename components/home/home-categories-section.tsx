"use client";

import clsx from "clsx";
import Link from "next/link";
import { useCallback, useState } from "react";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { getChildCollections, getRootCollections } from "lib/collection-hierarchy";
import type { Collection } from "lib/types";

function CategoryAccordionItem({
  node,
  collections,
  depth,
  openIds,
  toggle,
}: {
  node: Collection;
  collections: Collection[];
  depth: number;
  openIds: Set<string>;
  toggle: (id: string) => void;
}) {
  const children = getChildCollections(node.id, collections);
  const hasChildren = children.length > 0;
  const isOpen = openIds.has(node.id);

  if (!hasChildren) {
    return (
      <Link
        href={`/search/${node.handle}`}
        prefetch={true}
        className={clsx(
          "group flex items-center justify-between gap-3 rounded-xl border border-transparent px-4 py-3 transition",
          depth === 0
            ? "bg-neutral-50/90 text-base font-semibold hover:border-brand-200/60 hover:bg-brand-50/80 dark:bg-neutral-800/40 dark:hover:border-brand-800/50 dark:hover:bg-brand-950/25"
            : "text-sm font-medium text-neutral-800 hover:bg-brand-50/60 dark:text-neutral-200 dark:hover:bg-brand-950/30",
        )}
      >
        <span className="min-w-0">{node.title}</span>
        <ArrowRightIcon className="h-4 w-4 shrink-0 text-brand-500 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-brand-400" />
      </Link>
    );
  }

  return (
    <div
      className={clsx(
        "overflow-hidden rounded-2xl border transition-all duration-300",
        depth === 0
          ? "border-neutral-200/90 bg-white shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] dark:border-neutral-800 dark:bg-neutral-900/75"
          : "border-neutral-200/70 bg-neutral-50/50 dark:border-neutral-700 dark:bg-neutral-900/50",
        isOpen &&
          depth === 0 &&
          "border-brand-200/70 shadow-[0_8px_30px_-8px_rgba(34,120,40,0.18)] ring-1 ring-brand-100/80 dark:border-brand-800/50 dark:ring-brand-900/40",
      )}
    >
      <button
        type="button"
        onClick={() => toggle(node.id)}
        aria-expanded={isOpen}
        className={clsx(
          "flex w-full items-start gap-4 text-left transition-colors hover:bg-brand-50/40 dark:hover:bg-brand-950/20",
          depth === 0 ? "p-5 md:p-6" : "p-4",
        )}
      >
        {depth === 0 ? (
          <span
            className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-emerald-600 text-white shadow-lg shadow-brand-600/20"
            aria-hidden
          >
            <Squares2X2Icon className="h-5 w-5" />
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <span
            className={clsx(
              "font-semibold text-neutral-900 dark:text-white",
              depth === 0 ? "text-lg md:text-xl" : "text-base",
            )}
          >
            {node.title}
          </span>
          {depth === 0 && node.description ? (
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 line-clamp-2">
              {node.description}
            </p>
          ) : null}
          {depth === 0 && (
            <p className="mt-2 text-xs font-medium text-brand-700 dark:text-brand-400">
              {children.length}{" "}
              {children.length === 1 ? "подкатегория" : "подкатегории"} — натисни за списък
            </p>
          )}
        </div>
        <ChevronDownIcon
          className={clsx(
            "mt-1 h-5 w-5 shrink-0 text-brand-600 transition-transform duration-300 dark:text-brand-400",
            isOpen && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <div
        className={clsx(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={clsx(
              "border-t border-neutral-100 dark:border-neutral-800",
              depth === 0 ? "px-5 pb-5 pt-4 md:px-6 md:pb-6" : "px-4 pb-4 pt-2",
            )}
          >
            <ul className="space-y-2">
              {children.map((ch) => (
                <li key={ch.id}>
                  <CategoryAccordionItem
                    node={ch}
                    collections={collections}
                    depth={depth + 1}
                    openIds={openIds}
                    toggle={toggle}
                  />
                </li>
              ))}
            </ul>
            {depth === 0 ? (
              <Link
                href={`/search/${node.handle}`}
                prefetch={true}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700 dark:shadow-brand-900/30"
              >
                Виж всички в „{node.title}“
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeCategoriesSection({ collections }: { collections: Collection[] }) {
  const roots = getRootCollections(collections);
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  const toggle = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  if (roots.length === 0) return null;

  return (
    <section className="relative border-t border-neutral-200/80 bg-gradient-to-b from-neutral-50 via-white to-neutral-50/90 py-16 dark:border-neutral-800 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-950/95 md:py-24">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_80%_100%_at_50%_0%,rgba(113,168,38,0.12),transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_100%_at_50%_0%,rgba(113,168,38,0.08),transparent_70%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 min-[1320px]:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-400">
              Каталог
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-4xl">
              Категории
            </h2>
            <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
              Избери главна категория — при налични подкатегории списъкът се отваря с клик.
            </p>
          </div>
          <Link
            href="/products"
            prefetch={true}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-brand-200/80 bg-white px-5 py-3 text-sm font-semibold text-brand-800 shadow-sm transition hover:border-brand-400 hover:bg-brand-50 dark:border-brand-800 dark:bg-neutral-900 dark:text-brand-200 dark:hover:bg-brand-950/50"
          >
            Всички продукти
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <ul className="mx-auto mt-12 max-w-3xl space-y-4 md:mt-14 md:space-y-5">
          {roots.map((root) => (
            <li key={root.id}>
              <CategoryAccordionItem
                node={root}
                collections={collections}
                depth={0}
                openIds={openIds}
                toggle={toggle}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
