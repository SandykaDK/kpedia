"use client";

import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const pageSizes = [10, 20, 50] as const;

type DataTablePaginationProps = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
};

export function DataTablePagination({
  page,
  limit,
  totalCount,
  totalPages,
}: DataTablePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPage = Math.max(totalPages, 1);
  const start = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalCount);

  function navigateTo(nextPage: number, nextLimit = limit) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    params.set("limit", String(nextLimit));
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const visiblePages = Array.from(
    new Set([1, page - 1, page, page + 1, lastPage].filter((value) => value >= 1 && value <= lastPage)),
  ).sort((left, right) => left - right);

  return (
    <nav
      aria-label="Pagination tabel"
      className="mt-4 flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span>
          Menampilkan {start}-{end} dari {totalCount} data
        </span>
        <label className="flex items-center gap-2">
          <span>Per halaman</span>
          <select
            aria-label="Jumlah data per halaman"
            className="rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-zinc-100 outline-none focus:border-rose-400"
            onChange={(event) => navigateTo(1, Number(event.target.value))}
            value={limit}
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        <button
          aria-label="Halaman pertama"
          className="rounded-md p-2 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => navigateTo(1)}
          type="button"
        >
          <ChevronFirst aria-hidden="true" className="size-4" />
        </button>
        <button
          aria-label="Halaman sebelumnya"
          className="rounded-md p-2 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => navigateTo(page - 1)}
          type="button"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </button>

        {visiblePages.map((pageNumber, index) => {
          const previousPage = visiblePages[index - 1];
          return (
            <span className="flex items-center gap-1" key={pageNumber}>
              {previousPage !== undefined && pageNumber - previousPage > 1 ? (
                <span aria-hidden="true" className="px-1">
                  …
                </span>
              ) : null}
              <button
                aria-current={pageNumber === page ? "page" : undefined}
                aria-label={`Halaman ${pageNumber}`}
                className={`min-w-9 rounded-md px-2.5 py-2 transition ${
                  pageNumber === page
                    ? "bg-rose-500 font-medium text-white"
                    : "hover:bg-zinc-800 hover:text-white"
                }`}
                onClick={() => navigateTo(pageNumber)}
                type="button"
              >
                {pageNumber}
              </button>
            </span>
          );
        })}

        <button
          aria-label="Halaman berikutnya"
          className="rounded-md p-2 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={page >= lastPage || totalCount === 0}
          onClick={() => navigateTo(page + 1)}
          type="button"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
        <button
          aria-label="Halaman terakhir"
          className="rounded-md p-2 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={page >= lastPage || totalCount === 0}
          onClick={() => navigateTo(lastPage)}
          type="button"
        >
          <ChevronLast aria-hidden="true" className="size-4" />
        </button>
      </div>
    </nav>
  );
}
