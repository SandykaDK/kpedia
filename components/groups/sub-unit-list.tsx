import Link from "next/link";
import type { getGroupBySlug } from "@/lib/queries/group-queries";

import { Badge } from "@/components/ui/badge";

type Group = NonNullable<Awaited<ReturnType<typeof getGroupBySlug>>>;

export function SubUnitList({ group }: { group: Group }) {
  if (!group.subUnits.length) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-400">
          Related groups
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-white">Sub-units</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {group.subUnits.map((subUnit) => (
          <Link
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-rose-400/50 hover:bg-zinc-800"
            href={`/groups/${subUnit.slug}`}
            key={subUnit.id}
          >
            <span>
              <span className="block font-medium text-white">{subUnit.name}</span>
              <span className="mt-1 block text-sm text-zinc-500">
                {subUnit.koreanName ?? subUnit.agency?.name ?? "Sub-unit"}
              </span>
            </span>
            <Badge variant={subUnit.isActive ? "success" : "muted"}>
              {subUnit.isActive ? "Aktif" : "Tidak aktif"}
            </Badge>
          </Link>
        ))}
      </div>
    </section>
  );
}
