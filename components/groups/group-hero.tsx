import type { getGroupBySlug } from "@/lib/queries/group-queries";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Group = NonNullable<Awaited<ReturnType<typeof getGroupBySlug>>>;

const typeLabels: Record<Group["type"], string> = {
  MAIN_GROUP: "Main group",
  SUB_UNIT: "Sub-unit",
  PROJECT_GROUP: "Project group",
  BAND: "Band",
  OTHER: "Group",
};

function formatDate(date: Date | null) {
  return date
    ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date)
    : "Belum tersedia";
}

export function GroupHero({ group }: { group: Group }) {
  const initials = group.name.slice(0, 2).toUpperCase();

  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-rose-950/10 sm:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 via-orange-300 to-amber-200" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
        <Avatar className="size-32 rounded-2xl sm:size-40">
          {group.profileImageUrl ? <AvatarImage src={group.profileImageUrl} alt={group.name} /> : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant={group.isActive ? "success" : "muted"}>
              {group.isActive ? "Aktif" : "Tidak aktif"}
            </Badge>
            <Badge variant="outline">{typeLabels[group.type]}</Badge>
            {group.generation ? <Badge variant="outline">Generasi {group.generation}</Badge> : null}
          </div>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{group.name}</h1>
            <p className="mt-1 text-xl text-zinc-400">{group.koreanName ?? "Nama Korea belum tersedia"}</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
            <span>Debut: <strong className="font-medium text-zinc-200">{formatDate(group.debutDate)}</strong></span>
            {group.disbandDate ? <span>Disband: <strong className="font-medium text-zinc-200">{formatDate(group.disbandDate)}</strong></span> : null}
            <span>Agensi: <strong className="font-medium text-zinc-200">{group.agency?.name ?? "Independen"}</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}
