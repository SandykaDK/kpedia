import type { getIdolBySlug } from "@/lib/queries/idol-queries";

import { Badge } from "@/components/ui/badge";

type Idol = NonNullable<Awaited<ReturnType<typeof getIdolBySlug>>>;

export function IdolGroupMemberships({ idol }: { idol: Idol }) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-400">Relasi karier</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">Group membership</h2>
      </div>
      {idol.memberships.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {idol.memberships.map((membership) => (
            <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-5" key={membership.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-white">{membership.group.name}</h3>
                  <p className="mt-1 text-sm text-zinc-500">{membership.group.koreanName ?? ""}</p>
                </div>
                {membership.isLeader ? <Badge variant="default">Leader</Badge> : null}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant={membership.status === "ACTIVE" ? "success" : "muted"}>
                  {membership.status === "ACTIVE" ? "Anggota aktif" : "Mantan anggota"}
                </Badge>
                {membership.position ? <Badge variant="secondary">{membership.position}</Badge> : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-zinc-500">Belum ada data membership.</p>
      )}
    </section>
  );
}
