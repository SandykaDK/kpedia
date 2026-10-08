"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SEARCH_GENERATIONS, SEARCH_STATUSES, SEARCH_TYPES } from "@/lib/queries/search-constants";

function FilterControls() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value && value !== "ALL") next.set(key, value);
    else next.delete(key);
    next.delete("page");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">Tipe</p>
        <div className="flex flex-wrap gap-2">
          {SEARCH_TYPES.map((type) => (
            <button
              className={`rounded-lg border px-3 py-2 text-sm ${(params.get("type") ?? "ALL") === type ? "border-rose-400 bg-rose-400/10 text-rose-300" : "border-zinc-800 text-zinc-400 hover:border-zinc-600"}`}
              key={type}
              onClick={() => update("type", type)}
              type="button"
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      <label className="block text-sm text-zinc-400">
        Generasi
        <select
          className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-white"
          onChange={(event) => update("generation", event.target.value)}
          value={params.get("generation") ?? ""}
        >
          <option value="">Semua generasi</option>
          {SEARCH_GENERATIONS.map((generation) => (
            <option key={generation} value={generation}>
              Generasi {generation}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm text-zinc-400">
        Status
        <select
          className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-white"
          onChange={(event) => update("status", event.target.value)}
          value={params.get("status") ?? ""}
        >
          <option value="">Semua status</option>
          {SEARCH_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export function SearchFilters() {
  return (
    <aside className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
      <details className="lg:hidden">
        <summary className="cursor-pointer font-medium text-white">Filter pencarian</summary>
        <div className="mt-5">
          <FilterControls />
        </div>
      </details>
      <div className="hidden lg:block">
        <h2 className="mb-5 font-medium text-white">Filter</h2>
        <FilterControls />
      </div>
    </aside>
  );
}
