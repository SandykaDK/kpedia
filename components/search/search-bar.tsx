"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const next = new URLSearchParams(searchParams.toString());
      if (value.trim()) next.set("q", value.trim()); else next.delete("q");
      next.delete("page");
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [pathname, router, searchParams, value]);

  return <label className="relative block"><Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" /><input aria-label="Cari KPedia" className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-11 pr-4 text-sm text-white outline-none transition focus:border-rose-400" onChange={(event) => setValue(event.target.value)} placeholder="Cari idol, grup, agensi, album..." value={value} /></label>;
}
