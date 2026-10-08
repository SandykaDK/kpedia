import Link from "next/link";
import { AdminFilterBar } from "@/components/admin/admin-filter-bar";
import { AlbumRowActions } from "@/components/admin/album-row-actions";
import { getAdminAlbums } from "@/lib/queries/admin-queries";
import { prisma } from "@/lib/prisma";

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminAlbumsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    type?: string | string[];
    groupId?: string | string[];
    idolId?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const [albums, groups, idols] = await Promise.all([
    getAdminAlbums({
      q: firstParam(params.q),
      type: firstParam(params.type),
      groupId: firstParam(params.groupId),
      idolId: firstParam(params.idolId),
    }),
    prisma.group.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.idol.findMany({ orderBy: { stageName: "asc" }, select: { id: true, stageName: true } }),
  ]);
  const songIds = albums.flatMap((album) => album.songs.map((song) => song.id));
  const songEmbeds = songIds.length
    ? await prisma.mediaEmbed.findMany({
        where: { entityType: "SONG", entityId: { in: songIds } },
        orderBy: { createdAt: "asc" },
      })
    : [];
  const mediaBySong = new Map<string, string>();
  for (const embed of songEmbeds) {
    if (!mediaBySong.has(embed.entityId)) mediaBySong.set(embed.entityId, embed.url);
  }

  return (
    <main className="p-6 text-zinc-100 sm:p-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-rose-400">Music</p>
          <h1 className="mt-2 text-3xl font-semibold">Albums</h1>
        </div>
        <Link
          className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium"
          href="/admin/albums/new"
        >
          + New album
        </Link>
      </div>
      <AdminFilterBar
        filters={[
          {
            key: "type",
            label: "Album type",
            placeholder: "All album types",
            options: [
              "SINGLE",
              "EP",
              "MINI_ALBUM",
              "FULL_ALBUM",
              "REPACKAGE",
              "OST",
              "COMPILATION",
              "LIVE",
              "OTHER",
            ].map((value) => ({ value, label: value.replaceAll("_", " ") })),
          },
          {
            key: "groupId",
            label: "Group",
            placeholder: "All groups",
            options: groups.map((group) => ({ value: group.id, label: group.name })),
          },
          {
            key: "idolId",
            label: "Idol",
            placeholder: "All idols",
            options: idols.map((idol) => ({ value: idol.id, label: idol.stageName })),
          },
        ]}
        searchLabel="Search albums"
        searchPlaceholder="Search album title..."
      />
      <div className="mt-8 space-y-4">
        {albums.map((album) => (
          <article
            className="flex flex-col justify-between gap-5 rounded-xl border border-zinc-800 bg-zinc-900 p-5 sm:flex-row sm:items-center"
            key={album.id}
          >
            <div className="min-w-0">
              <h2 className="font-medium">{album.title}</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {album.group?.name ?? album.idol?.stageName ?? "Unlinked"} · {album.type}
                {album.releaseDate ? ` · ${album.releaseDate.toISOString().slice(0, 10)}` : ""}
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                {album._count.songs} songs
                {album.coverImageUrl ? " · Cover tersedia" : ""}
              </p>
            </div>
            <AlbumRowActions
              album={{
                id: album.id,
                title: album.title,
                type: album.type,
                releaseDate: album.releaseDate?.toISOString().slice(0, 10) ?? null,
                coverImageUrl: album.coverImageUrl,
                groupName: album.group?.name ?? null,
                idolName: album.idol?.stageName ?? null,
              }}
              songs={album.songs.map((song) => ({
                id: song.id,
                title: song.title,
                trackNumber: song.trackNumber,
                duration: song.duration,
                isTitleTrack: song.isTitleTrack,
                lyrics: song.lyrics,
                mediaUrl: mediaBySong.get(song.id) ?? null,
              }))}
            />
          </article>
        ))}
      </div>
    </main>
  );
}
