"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="absolute top-0 left-0 z-40 flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-br-lg shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 border-r border-b border-neutral-200 dark:border-neutral-700 hover:shadow-xl group"
      aria-label="Върни се назад"
      title="Върни се назад"
    >
      <ArrowLeftIcon className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
        назад
      </span>
    </button>
  );
}
