import { MediaForm } from "@/components/admin/media-form";
import { prisma } from "@/lib/prisma";
export default async function AdminMediaPage() {
  const [idols, groups, albums, embeds] = await Promise.all([
    prisma.idol.findMany({ select: { id: true, stageName: true } }),
    prisma.group.findMany({ select: { id: true, name: true } }),
    prisma.album.findMany({ select: { id: true, title: true } }),
    prisma.mediaEmbed.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
  ]);
  const entities = [
    ...idols.map((item) => ({ id: item.id, name: item.stageName, type: "IDOL" as const })),
    ...groups.map((item) => ({ id: item.id, name: item.name, type: "GROUP" as const })),
    ...albums.map((item) => ({ id: item.id, name: item.title, type: "ALBUM" as const })),
  ];
  return (
    <main className="p-6 text-zinc-100 sm:p-10">
      <h1 className="text-3xl font-semibold">Media Embeds</h1>
      <p className="mt-2 text-zinc-500">Tempel URL YouTube MV atau Spotify track/album.</p>
      <div className="mt-8">
        <MediaForm entities={entities} />
      </div>
      <h2 className="mt-12 text-xl font-semibold">Recent embeds</h2>
      <div className="mt-4 space-y-3">
        {embeds.map((embed) => (
          <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-4" key={embed.id}>
            <p className="font-medium">{embed.title ?? embed.externalId}</p>
            <p className="mt-1 text-sm text-zinc-500">
              {embed.provider} · {embed.url}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
