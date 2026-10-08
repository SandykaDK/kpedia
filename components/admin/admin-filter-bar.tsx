"use client";

import { ArrowPathIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type AdminFilterOption = {
  value: string;
  label: string;
};

export type AdminFilterDefinition = {
  key: string;
  label: string;
  placeholder: string;
  options: AdminFilterOption[];
};

type AdminFilterBarProps = {
  filters?: AdminFilterDefinition[];
  searchLabel?: string;
  searchPlaceholder?: string;
  className?: string;
};

export function AdminFilterBar({
  filters = [],
  searchLabel = "Search",
  searchPlaceholder = "Search...",
  className,
}: AdminFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const query = searchParams.get("q") ?? "";
  const [draft, setDraft] = useState({ query, value: query });
  const search = draft.query === query ? draft.value : query;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const next = new URLSearchParams(queryString);
      const value = search.trim();
      if (value) next.set("q", value);
      else next.delete("q");
      if (value !== query) next.delete("page");

      const nextQuery = next.toString();
      if (nextQuery !== queryString) {
        router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
          scroll: false,
        });
      }
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [pathname, query, queryString, router, search]);

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    const nextQuery = next.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }

  function clearFilter(key: string) {
    if (key === "q") {
      setDraft({ query, value: "" });
    }
    updateFilter(key, "");
  }

  function resetFilters() {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("q");
    filters.forEach(({ key }) => next.delete(key));
    next.delete("page");
    setDraft({ query, value: "" });
    const nextQuery = next.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }

  const activeFilters = [
    ...(query ? [{ key: "q", label: searchLabel, value: query }] : []),
    ...filters.flatMap((filter) => {
      const value = searchParams.get(filter.key);
      return value
        ? [
            {
              key: filter.key,
              label: filter.label,
              value: filter.options.find((option) => option.value === value)?.label ?? value,
            },
          ]
        : [];
    }),
  ];

  return (
    <div className={cn("mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-4", className)}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex xl:items-center">
        <div className="relative xl:min-w-64 xl:flex-[2]">
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
          />
          <Input
            aria-label={searchLabel}
            className="pl-9"
            onChange={(event) => setDraft({ query, value: event.target.value })}
            placeholder={searchPlaceholder}
            type="search"
            value={search}
          />
        </div>
        {filters.map((filter) => (
          <Select
            key={filter.key}
            onValueChange={(value) => updateFilter(filter.key, value)}
            value={searchParams.get(filter.key) ?? undefined}
          >
            <SelectTrigger aria-label={filter.label} className="xl:min-w-40 xl:flex-1">
              <SelectValue placeholder={filter.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        {activeFilters.length ? (
          <Button
            className="w-full sm:col-span-2 xl:col-span-1"
            onClick={resetFilters}
            size="sm"
            type="button"
            variant="outline"
          >
            <ArrowPathIcon aria-hidden="true" className="mr-2 size-4" />
            Reset filter
          </Button>
        ) : null}
      </div>
      {activeFilters.length ? (
        <div aria-label="Filter aktif" className="mt-3 flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge className="gap-1.5" key={filter.key} variant="secondary">
              <span>
                {filter.label}: {filter.value}
              </span>
              <button
                aria-label={`Hapus filter ${filter.label}`}
                className="rounded-full text-zinc-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                onClick={() => clearFilter(filter.key)}
                type="button"
              >
                <XMarkIcon aria-hidden="true" className="size-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}
