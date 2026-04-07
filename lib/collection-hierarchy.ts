import type { Collection } from "lib/types";

/** Всички id-та на наследници (директни и непреки), без самия rootId */
export function getDescendantIds(
  rootId: string,
  flat: Pick<Collection, "id" | "parentId">[],
): Set<string> {
  const byParent = new Map<string, string[]>();
  for (const c of flat) {
    if (c.parentId == null) continue;
    if (!byParent.has(c.parentId)) byParent.set(c.parentId, []);
    byParent.get(c.parentId)!.push(c.id);
  }
  const out = new Set<string>();
  const walk = (id: string) => {
    for (const kid of byParent.get(id) || []) {
      out.add(kid);
      walk(kid);
    }
  };
  walk(rootId);
  return out;
}

/** Handle на избраната категория + всички подкатегории (за филтър на продукти) */
export function getSelfAndDescendantHandles(
  rootHandle: string,
  collections: Collection[],
): string[] | null {
  const root = collections.find((c) => c.handle === rootHandle);
  if (!root) return null;
  const flat = collections.map((c) => ({
    id: c.id,
    parentId: c.parentId ?? null,
  }));
  const handles = new Set<string>([root.handle]);
  const descIds = getDescendantIds(root.id, flat);
  for (const c of collections) {
    if (descIds.has(c.id)) handles.add(c.handle);
  }
  return [...handles];
}

/** Само главни категории (без родител) */
export function getRootCollections(collections: Collection[]): Collection[] {
  return collections.filter((c) => c.parentId == null);
}

/** Деца на дадена категория */
export function getChildCollections(
  parentId: string,
  collections: Collection[],
): Collection[] {
  return collections
    .filter((c) => c.parentId === parentId)
    .sort((a, b) => a.title.localeCompare(b.title, "bg"));
}

const flatParentLinks = (
  collections: Pick<Collection, "id" | "parentId">[],
): Pick<Collection, "id" | "parentId">[] =>
  collections.map((c) => ({
    id: c.id,
    parentId: c.parentId ?? null,
  }));

/** Има ли поне една подкатегория (директна) */
export function collectionHasChildren(
  id: string,
  collections: Pick<Collection, "id" | "parentId">[],
): boolean {
  return collections.some((c) => c.parentId === id);
}

/** Категории без подкатегории — тук се закачат продуктите */
export function getLeafCollections(collections: Collection[]): Collection[] {
  const flat = flatParentLinks(collections);
  return collections.filter((c) => !collectionHasChildren(c.id, flat));
}

/** За dropdown на продукт: само крайни категории, с йерархичен етикет */
export function leafCategorySelectOptions(
  all: Collection[],
): { handle: string; label: string }[] {
  const byParent = new Map<string | null, Collection[]>();
  for (const c of all) {
    const p = c.parentId ?? null;
    if (!byParent.has(p)) byParent.set(p, []);
    byParent.get(p)!.push(c);
  }
  for (const arr of byParent.values()) {
    arr.sort((a, b) => a.title.localeCompare(b.title, "bg"));
  }
  const flat = flatParentLinks(all);
  const out: { handle: string; label: string }[] = [];
  const walk = (parentId: string | null, depth: number) => {
    const kids = byParent.get(parentId) || [];
    for (const c of kids) {
      if (!collectionHasChildren(c.id, flat)) {
        out.push({
          handle: c.handle,
          label: `${"\u2014 ".repeat(depth)}${c.title}`,
        });
      }
      walk(c.id, depth + 1);
    }
  };
  walk(null, 0);
  return out;
}

export function isLeafCategoryByHandle(
  handle: string,
  collections: Collection[],
): boolean {
  const c = collections.find((x) => x.handle === handle);
  if (!c) return false;
  return !collectionHasChildren(c.id, flatParentLinks(collections));
}

/** Опции за dropdown „родител“: йерархичен списък, без excludeIds */
export function parentSelectOptions(
  all: Collection[],
  excludeIds: Set<string>,
): { id: string; label: string }[] {
  const available = all.filter((c) => !excludeIds.has(c.id));
  const byParent = new Map<string | null, Collection[]>();
  for (const c of available) {
    const p = c.parentId ?? null;
    if (!byParent.has(p)) byParent.set(p, []);
    byParent.get(p)!.push(c);
  }
  for (const arr of byParent.values()) {
    arr.sort((a, b) => a.title.localeCompare(b.title, "bg"));
  }
  const out: { id: string; label: string }[] = [];
  const walk = (parentId: string | null, depth: number) => {
    const kids = byParent.get(parentId) || [];
    for (const c of kids) {
      out.push({
        id: c.id,
        label: `${"\u2014 ".repeat(depth)}${c.title}`,
      });
      walk(c.id, depth + 1);
    }
  };
  walk(null, 0);
  return out;
}
