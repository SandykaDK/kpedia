import type { getGroupBySlug } from "@/lib/queries/group-queries";

import Image from "next/image";

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
    ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(
        date,
      )
    : "Belum tersedia";
}

export function GroupHero({ group }: { group: Group }) {
  const backgroundImage = group.bannerImageUrl ?? group.profileImageUrl;

  return (
    <section className="relative mb-8 h-[360px] w-full overflow-hidden rounded-3xl bg-zinc-900 sm:h-[460px]">
      {backgroundImage ? (
        <Image
          alt=""
          className="object-cover object-center"
          fill
          priority
          sizes="(max-width: 640px) 100vw, 1200px"
          src={backgroundImage}
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-rose-950 via-zinc-900 to-zinc-950" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant={group.isActive ? "success" : "muted"}>
            {group.isActive ? "Aktif" : "Tidak aktif"}
          </Badge>
          <Badge className="border-white/20 bg-black/30 text-white" variant="outline">
            {typeLabels[group.type]}
          </Badge>
          {group.generation ? (
            <Badge className="border-white/20 bg-black/30 text-white" variant="outline">
              Generasi {group.generation}
            </Badge>
          ) : null}
        </div>
        <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-md sm:text-7xl">
          {group.name}
        </h1>
        {group.koreanName ? (
          <p className="mt-2 text-2xl font-medium text-white/90">{group.koreanName}</p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
          <span>
            Debut:{" "}
            <strong className="font-semibold text-white">{formatDate(group.debutDate)}</strong>
          </span>
          <span>
            Agensi:{" "}
            <strong className="font-semibold text-white">
              {group.agency?.name ?? "Independen"}
            </strong>
          </span>
          {group.disbandDate ? (
            <span>
              Disband:{" "}
              <strong className="font-semibold text-white">{formatDate(group.disbandDate)}</strong>
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
