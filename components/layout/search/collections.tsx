import clsx from "clsx";
import { Suspense } from "react";

import { getChildCollections, getRootCollections } from "lib/collection-hierarchy";
import { getCollections } from "lib/supabase/products";
import FilterList from "./filter";

async function CollectionList() {
  const collections = await getCollections();
  const roots = getRootCollections(collections);
  const list: { title: string; path: string }[] = [];
  for (const r of roots) {
    list.push({ title: r.title, path: `/search/${r.handle}` });
    for (const ch of getChildCollections(r.id, collections)) {
      list.push({
        title: `\u2014 ${ch.title}`,
        path: `/search/${ch.handle}`,
      });
    }
  }
  return <FilterList list={list} title="Колекции" />;
}

const skeleton = "mb-3 h-4 w-5/6 animate-pulse rounded-sm";
const activeAndTitles = "bg-neutral-800 dark:bg-neutral-300";
const items = "bg-neutral-400 dark:bg-neutral-700";

export default function Collections() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <CollectionList />
    </Suspense>
  );
}
