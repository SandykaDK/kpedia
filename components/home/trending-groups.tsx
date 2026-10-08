import { ArrowUpRight, Users } from "lucide-react";
import Link from "next/link";
import type { getTrendingGroups } from "@/lib/queries/home-queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Group = Awaited<ReturnType<typeof getTrendingGroups>>[number];

export function TrendingGroups({ groups }: { groups: Group[] }) {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-500">
            On the radar
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-white">
            Trending groups
          </h2>
        </div>
        <Link
          className="hidden items-center gap-1 text-sm text-zinc-500 hover:text-cyan-500 sm:flex"
          href="/search?type=GROUP"
        >
          Explore all <ArrowUpRight className="size-4" />
        </Link>
      </div>
      {groups.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <Link
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-white/[0.04]"
              href={`/groups/${group.slug}`}
              key={group.id}
            >
              <div className="absolute right-4 top-4">
                <span className="flex size-2.5">
                  <span className="absolute inline-flex size-2.5 animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
                </span>
              </div>
              <Avatar className="size-20 rounded-2xl transition-transform duration-300 group-hover:scale-105">
                <AvatarImage alt={group.name} src={group.profileImageUrl ?? ""} />
                <AvatarFallback>{group.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h3 className="mt-5 font-semibold text-zinc-950 dark:text-white">{group.name}</h3>
              <p className="mt-1 truncate text-sm text-zinc-500">
                {group.agency?.name ?? "Independent"}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Users className="size-3.5" /> {group._count.memberships} members
                </span>
                {group.generation ? <Badge variant="outline">Gen {group.generation}</Badge> : null}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-white/10">
          Belum ada grup trending.
        </p>
      )}
    </section>
  );
}
