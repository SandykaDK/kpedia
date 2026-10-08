import { ArrowUpRight, Circle } from "lucide-react";
import Link from "next/link";
import type { getFeaturedIdols } from "@/lib/queries/home-queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Idol = Awaited<ReturnType<typeof getFeaturedIdols>>[number];

export function FeaturedIdols({ idols }: { idols: Idol[] }) {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-fuchsia-500">
            Fresh faces
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-white">
            Featured idols
          </h2>
        </div>
        <Link
          className="hidden items-center gap-1 text-sm text-zinc-500 hover:text-fuchsia-500 sm:flex"
          href="/search?type=IDOL"
        >
          Explore all <ArrowUpRight className="size-4" />
        </Link>
      </div>
      {idols.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {idols.map((idol) => (
            <Link
              className="group rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-fuchsia-300 hover:shadow-xl hover:shadow-fuchsia-500/10 dark:border-white/10 dark:bg-white/[0.04]"
              href={`/idols/${idol.slug}`}
              key={idol.id}
            >
              <div className="flex items-center gap-4">
                <Avatar className="size-16 transition-transform duration-300 group-hover:scale-105">
                  <AvatarImage alt={idol.stageName} src={idol.profileImageUrl ?? ""} />
                  <AvatarFallback>{idol.stageName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold text-zinc-950 dark:text-white">
                      {idol.stageName}
                    </h3>
                    {idol.status === "ACTIVE" ? (
                      <Circle className="size-2.5 fill-emerald-400 text-emerald-400" />
                    ) : null}
                  </div>
                  <p className="truncate text-sm text-zinc-500">
                    {idol.agency?.name ?? "Independent"}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge variant="outline">
                  {idol.generation ? `Gen ${idol.generation}` : "K-Pop"}
                </Badge>
                {idol.memberships.slice(0, 2).map((membership) => (
                  <Badge key={membership.id} variant="secondary">
                    {membership.group.name}
                  </Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-white/10">
          Belum ada idol unggulan.
        </p>
      )}
    </section>
  );
}
