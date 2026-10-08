import { MediaProvider, Prisma, TimelineEntityType } from "@prisma/client";

import { AdminFilterBar } from "@/components/admin/admin-filter-bar";
import { AddMediaDialog } from "@/components/admin/add-media-dialog";
import { DataTablePagination } from "@/components/admin/data-table-pagination";
import { MediaEmbedList } from "@/components/admin/media-embed-list";
import { getAdminMediaEmbeds } from "@/lib/queries/admin-queries";
import { prisma } from "@/lib/prisma";

type MediaSearchParams = {
  q?: string | string[];
  provider?: string | string[];
  type?: string | string[];
  page?: string | string[];
  limit?: string | string[];
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<MediaSearchParams>;
}) {
  const params = await searchParams;
  const query = firstParam(params.q)?.trim();
  const providerValue = firstParam(params.provider);
  const typeValue = firstParam(params.type);
  const page = positiveInteger(firstParam(params.page), 1);
  const limitValue = positiveInteger(firstParam(params.limit), 10);
  const limit = [10, 20, 50].includes(limitValue) ? limitValue : 10;
  const conditions: Prisma.MediaEmbedWhereInput[] = [];

  if (query) {
    conditions.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { url: { contains: query, mode: "insensitive" } },
      ],
    });
  }
  if (providerValue === MediaProvider.YOUTUBE || providerValue === MediaProvider.SPOTIFY) {
    conditions.push({ provider: providerValue });
  }
  if (
    typeValue === TimelineEntityType.IDOL ||
    typeValue === TimelineEntityType.GROUP ||
    typeValue === TimelineEntityType.ALBUM ||
    typeValue === TimelineEntityType.SONG
  ) {
    conditions.push({ entityType: typeValue });
  }

  const [idols, groups, albums, songs, embeds] = await Promise.all([
    prisma.idol.findMany({ select: { id: true, stageName: true } }),
    prisma.group.findMany({ select: { id: true, name: true } }),
    prisma.album.findMany({ select: { id: true, title: true } }),
    prisma.song.findMany({ select: { id: true, title: true } }),
    getAdminMediaEmbeds(conditions.length ? { AND: conditions } : undefined, { page, limit }),
  ]);
  const entities = [
    ...idols.map((item) => ({ id: item.id, name: item.stageName, type: "IDOL" as const })),
    ...groups.map((item) => ({ id: item.id, name: item.name, type: "GROUP" as const })),
    ...albums.map((item) => ({ id: item.id, name: item.title, type: "ALBUM" as const })),
    ...songs.map((item) => ({ id: item.id, name: item.title, type: "SONG" as const })),
  ];
  return (
    <main className="p-6 text-zinc-100 sm:p-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Media Embeds</h1>
          <p className="mt-2 text-zinc-500">Kelola embed YouTube dan Spotify.</p>
        </div>
        <AddMediaDialog targets={entities} />
      </div>
      <AdminFilterBar
        filters={[
          {
            key: "provider",
            label: "Provider",
            placeholder: "All providers",
            options: [
              { value: "YOUTUBE", label: "YouTube" },
              { value: "SPOTIFY", label: "Spotify" },
            ],
          },
          {
            key: "type",
            label: "Target type",
            placeholder: "All target types",
            options: ["IDOL", "GROUP", "ALBUM", "SONG"].map((value) => ({
              value,
              label: value,
            })),
          },
        ]}
        searchLabel="Search media"
        searchPlaceholder="Search media title or URL..."
      />
      <h2 className="mt-8 text-xl font-semibold">Recent embeds</h2>
      <MediaEmbedList embeds={embeds.data} targets={entities} />
      <DataTablePagination
        limit={embeds.limit}
        page={embeds.page}
        totalCount={embeds.totalCount}
        totalPages={embeds.totalPages}
      />
    </main>
  );
}
