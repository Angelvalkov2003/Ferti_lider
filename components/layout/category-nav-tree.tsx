"use client";

import clsx from "clsx";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { getChildCollections } from "lib/collection-hierarchy";
import type { Collection } from "lib/types";

export type CategoryNavVariant = "dropdown" | "mobile" | "sidebar";

type Props = {
  collections: Collection[];
  variant: CategoryNavVariant;
  /** Затваря дропдаун / чекмедже при навигация */
  onNavigate?: () => void;
  /** Текущ ?collection= (маркиране + разгъване до активната) */
  activeHandle?: string | null;
  /** Показва ли линк „Всички“ към /products */
  includeAllProductsLink?: boolean;
};

function sortByTitle(a: Collection, b: Collection) {
  return a.title.localeCompare(b.title, "bg");
}

export function CategoryNavTree({
  collections,
  variant,
  onNavigate,
  activeHandle,
  includeAllProductsLink = true,
}: Props) {
  const roots = useMemo(
    () => collections.filter((c) => c.parentId == null).sort(sortByTitle),
    [collections],
  );

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  const toggle = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  /** Разгъни пътя до активната категория */
  useEffect(() => {
    if (!activeHandle || !collections.length) return;
    const node = collections.find((c) => c.handle === activeHandle);
    if (!node) return;
    const next = new Set<string>();
    let p = node.parentId;
    while (p) {
      next.add(p);
      const parent = collections.find((c) => c.id === p);
      p = parent?.parentId ?? null;
    }
    setExpandedIds(next);
  }, [activeHandle, collections]);

  const allLinkClass = clsx(
    variant === "dropdown" &&
      "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
    variant === "mobile" &&
      "block py-2 text-lg text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white",
    variant === "sidebar" &&
      "block rounded-lg px-4 py-2 transition-colors",
    variant === "sidebar" &&
      !activeHandle &&
      "bg-brand-500 text-white dark:bg-brand-600",
    variant === "sidebar" &&
      !!activeHandle &&
      "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
  );

  const leafLinkClass = (depth: number, isActive: boolean) =>
    clsx(
      "block transition-colors",
      variant === "dropdown" &&
        clsx(
          "py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700",
          isActive
            ? "bg-brand-50 font-medium text-brand-800 dark:bg-brand-950/50 dark:text-brand-200"
            : "text-gray-700 dark:text-gray-300",
          depth === 0 ? "px-4" : "px-3",
        ),
      variant === "mobile" &&
        clsx(
          "py-2 hover:text-black dark:hover:text-white",
          isActive
            ? "font-semibold text-brand-700 dark:text-brand-300"
            : "text-gray-700 dark:text-gray-300",
          depth === 0 ? "text-lg" : "text-base",
        ),
      variant === "sidebar" &&
        clsx(
          "rounded-lg px-4 py-2 text-sm",
          isActive
            ? "border-brand-500 bg-brand-500 text-white dark:bg-brand-600"
            : "border border-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
        ),
    );

  const branchBtnClass = (depth: number) =>
    clsx(
      "flex w-full items-center justify-between gap-2 text-left transition-colors",
      variant === "dropdown" &&
        clsx(
          "px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
          depth === 0 ? "" : "pl-3 pr-3",
        ),
      variant === "mobile" &&
        clsx(
          "py-2 font-medium text-gray-800 dark:text-gray-200",
          depth === 0 ? "text-lg" : "text-base",
        ),
      variant === "sidebar" &&
        "rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
    );

  const nestedUlClass = clsx(
    "list-none",
    variant === "dropdown" && "ml-1 border-l border-gray-200 py-1 dark:border-gray-600",
    variant === "mobile" && "ml-2 border-l-2 border-gray-200 py-1 dark:border-gray-700",
    variant === "sidebar" && "ml-2 space-y-1 border-l border-gray-200 py-1 pl-2 dark:border-gray-600",
  );

  const renderNode = (node: Collection, depth: number): ReactNode => {
    const kids = getChildCollections(node.id, collections);
    const hasChildren = kids.length > 0;
    const isActive = activeHandle === node.handle;

    if (!hasChildren) {
      return (
        <li key={node.id}>
          <Link
            href={`/products?collection=${node.handle}`}
            prefetch={true}
            onClick={onNavigate}
            className={leafLinkClass(depth, isActive)}
          >
            {node.title}
          </Link>
        </li>
      );
    }

    const expanded = expandedIds.has(node.id);
    return (
      <li key={node.id} className="list-none">
        <button
          type="button"
          onClick={() => toggle(node.id)}
          className={branchBtnClass(depth)}
          aria-expanded={expanded}
        >
          <span>{node.title}</span>
          <ChevronRightIcon
            className={clsx(
              "h-4 w-4 shrink-0 text-gray-500 transition-transform dark:text-gray-400",
              variant === "mobile" && "h-5 w-5",
              expanded && "rotate-90",
            )}
          />
        </button>
        {expanded ? <ul className={nestedUlClass}>{kids.map((k) => renderNode(k, depth + 1))}</ul> : null}
      </li>
    );
  };

  const rootUl = clsx(
    "list-none",
    variant === "dropdown" && "max-h-[min(70vh,24rem)] overflow-y-auto py-2",
    variant === "mobile" && "space-y-1",
    variant === "sidebar" && "space-y-1",
  );

  return (
    <ul className={rootUl}>
      {includeAllProductsLink ? (
        <li>
          <Link href="/products" prefetch={true} onClick={onNavigate} className={allLinkClass}>
            {variant === "sidebar" ? "Всичко" : "Всички"}
          </Link>
        </li>
      ) : null}
      {roots.map((r) => renderNode(r, 0))}
    </ul>
  );
}
