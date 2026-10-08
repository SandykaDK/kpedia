import { Prisma, TimelineCategory, TimelineEntityType } from "@prisma/client";

import { AdminFilterBar } from "@/components/admin/admin-filter-bar";
import { TimelineForm } from "@/components/admin/timeline-form";
import { prisma } from "@/lib/prisma";

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isEnumValue<T extends string>(
  values: readonly T[],
  value: string | undefined,
): value is T {
  return value !== undefined && values.some((item) => item === value);
}

export default async function AdminTimelinePage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    entityType?: string | string[];
    category?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const query = firstParam(params.q)?.trim();
  const entityType = firstParam(params.entityType);
  const category = firstParam(params.category);
  const conditions: Prisma.TimelineEventWhereInput[] = [];
  if (query) {
    conditions.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { entityId: { contains: query, mode: "insensitive" } },
      ],
    });
  }
  if (isEnumValue(Object.values(TimelineEntityType), entityType)) {
    conditions.push({ entityType });
  }
  if (isEnumValue(Object.values(TimelineCategory), category)) {
    conditions.push({ category });
  }

  const [idols, groups, albums, events] = await Promise.all([
    prisma.idol.findMany({ select: { id: true, stageName: true } }),
    prisma.group.findMany({ select: { id: true, name: true } }),
    prisma.album.findMany({ select: { id: true, title: true } }),
    prisma.timelineEvent.findMany({
      where: conditions.length ? { AND: conditions } : undefined,
      orderBy: { eventDate: "desc" },
      take: 50,
    }),
  ]);
  const entities = [
    ...idols.map((item) => ({ id: item.id, name: item.stageName, type: "IDOL" as const })),
    ...groups.map((item) => ({ id: item.id, name: item.name, type: "GROUP" as const })),
    ...albums.map((item) => ({ id: item.id, name: item.title, type: "ALBUM" as const })),
  ];
  return (
    <main className="p-6 text-zinc-100 sm:p-10">
      <h1 className="text-3xl font-semibold">Timeline Events</h1>
      <div className="mt-8">
        <TimelineForm entities={entities} />
      </div>
      <AdminFilterBar
        className="mt-8"
        filters={[
          {
            key: "entityType",
            label: "Entity type",
            placeholder: "All entity types",
            options: Object.values(TimelineEntityType).map((value) => ({
              value,
              label: value,
            })),
          },
          {
            key: "category",
            label: "Category",
            placeholder: "All categories",
            options: Object.values(TimelineCategory).map((value) => ({
              value,
              label: value,
            })),
          },
        ]}
        searchLabel="Search timeline events"
        searchPlaceholder="Search event title or description..."
      />
      <h2 className="mt-12 text-xl font-semibold">Recent events</h2>
      <div className="mt-4 space-y-3">
        {events.map((event) => (
          <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-4" key={event.id}>
            <p className="font-medium">{event.title}</p>
            <p className="mt-1 text-sm text-zinc-500">
              {event.entityType} · {event.category} · {event.eventDate.toISOString().slice(0, 10)}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
