import Link from "next/link";
import type { SearchResults } from "@/lib/queries/search-queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function SearchResults({ data }: { data: SearchResults }) {
  const all = [...data.results.idols, ...data.results.groups, ...data.results.agencies, ...data.results.albums];
  if (!all.length) return <div className="rounded-xl border border-dashed border-zinc-800 px-6 py-16 text-center"><h2 className="font-medium text-white">Tidak ada hasil</h2><p className="mt-2 text-sm text-zinc-500">Coba kata kunci atau filter yang berbeda.</p></div>;
  return <div className="grid gap-4 sm:grid-cols-2">{all.map((item) => { const href = item.type === "IDOL" ? `/idols/${item.slug}` : item.type === "GROUP" ? `/groups/${item.slug}` : "#"; return <Link className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-rose-400/50" href={href} key={`${item.type}-${item.id}`}><Avatar className="size-14">{item.imageUrl ? <AvatarImage alt={item.name} src={item.imageUrl} /> : null}<AvatarFallback>{item.name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2"><h3 className="truncate font-medium text-white">{item.name}</h3><Badge variant="outline">{item.type}</Badge></div><p className="truncate text-sm text-zinc-500">{item.secondary ?? ""}</p></div></Link>; })}</div>;
}

export function SearchResultsSkeleton() { return <div className="grid gap-4 sm:grid-cols-2">{Array.from({ length: 6 }, (_, index) => <div className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4" key={index}><Skeleton className="size-14 rounded-full" /><div className="flex-1 space-y-3"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/2" /></div></div>)}</div>; }
