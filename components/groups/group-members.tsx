import Link from "next/link";
import type { getGroupBySlug } from "@/lib/queries/group-queries";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Group = NonNullable<Awaited<ReturnType<typeof getGroupBySlug>>>;

export function GroupMembers({ group }: { group: Group }) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-400">Line-up</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">Members</h2>
      </div>
      {group.memberships.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {group.memberships.map((membership) => {
            const idol = membership.idol;

            return (
              <Link
                className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-rose-400/50 hover:bg-zinc-800"
                href={`/idols/${idol.slug}`}
                key={membership.id}
              >
                <Avatar className="size-16">
                  {idol.profileImageUrl ? <AvatarImage src={idol.profileImageUrl} alt={idol.stageName} /> : null}
                  <AvatarFallback>{idol.stageName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-white group-hover:text-rose-300">{idol.stageName}</h3>
                    {membership.isLeader ? <Badge variant="default">Leader</Badge> : null}
                  </div>
                  <p className="mt-1 truncate text-sm text-zinc-400">{membership.position ?? "Member"}</p>
                  <Badge className="mt-2" variant={membership.status === "ACTIVE" ? "success" : "muted"}>
                    {membership.status === "ACTIVE" ? "Aktif" : "Mantan anggota"}
                  </Badge>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-zinc-500">Belum ada data anggota.</p>
      )}
    </section>
  );
}
