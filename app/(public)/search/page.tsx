import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchBar } from "@/components/search/search-bar";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchResults, SearchResultsSkeleton } from "@/components/search/search-results";
import { searchEntities, type SearchParams } from "@/lib/queries/search-queries";

export const metadata: Metadata = {
  title: "Search | KPedia",
  description: "Cari idol, grup, agensi, dan album K-Pop di KPedia.",
};

async function SearchContent({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const data = await searchEntities(await searchParams);
  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{data.totalCount} hasil ditemukan</p>
        <p className="text-sm text-zinc-500">
          Halaman {data.page} dari {data.totalPages}
        </p>
      </div>
      <SearchResults data={data} />
    </>
  );
}

export default function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-8 text-zinc-100 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-400">
            Explore KPedia
          </p>
          <h1 className="text-4xl font-semibold text-white">Search</h1>
          <Suspense
            fallback={<div className="h-12 rounded-xl border border-zinc-800 bg-zinc-900" />}
          >
            <SearchBar />
          </Suspense>
        </header>
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <Suspense
            fallback={<div className="h-48 rounded-xl border border-zinc-800 bg-zinc-950" />}
          >
            <SearchFilters />
          </Suspense>
          <section className="space-y-4">
            <Suspense fallback={<SearchResultsSkeleton />}>
              <SearchContent searchParams={searchParams} />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
}
