import Link from "next/link";
import { getAdminAlbums } from "@/lib/queries/admin-queries";
export default async function AdminAlbumsPage() {
  const albums = await getAdminAlbums();
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
      <div className="mt-8 space-y-4">
        {albums.map((album) => (
          <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-5" key={album.id}>
            <div className="flex justify-between gap-4">
              <div>
                <h2 className="font-medium">{album.title}</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {album.group?.name ?? album.idol?.stageName ?? "Unlinked"} · {album.type}
                </p>
              </div>
              <span className="text-sm text-zinc-500">{album._count.songs} songs</span>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
