import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GroupHero } from "@/components/groups/group-hero";
import { GroupMembers } from "@/components/groups/group-members";
import { SubUnitList } from "@/components/groups/sub-unit-list";
import { SubmitEditDialog } from "@/components/moderation/submit-edit-dialog";
import { CareerTimeline } from "@/components/timeline/career-timeline";
import { MediaEmbedGrid } from "@/components/media/media-embed-grid";
import { getGroupBySlug } from "@/lib/queries/group-queries";
import { getMediaEmbeds } from "@/lib/queries/media-queries";
import { getTimelineEvents } from "@/lib/queries/timeline-queries";

type GroupPageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: Date | null) {
  return date
    ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date)
    : "Belum tersedia";
}

export async function generateMetadata({ params }: GroupPageProps): Promise<Metadata> {
  const { slug } = await params;
  const group = await getGroupBySlug(slug);

  if (!group) {
    return { title: "Grup tidak ditemukan | KPedia" };
  }

  const description = `Profil ${group.name}${group.koreanName ? ` (${group.koreanName})` : ""} di KPedia.`;

  return {
    title: `${group.name} | KPedia`,
    description,
    openGraph: {
      title: `${group.name} | KPedia`,
      description,
      type: "website",
    },
  };
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { slug } = await params;
  const group = await getGroupBySlug(slug);

  if (!group) {
    notFound();
  }

  const [timelineEvents, mediaEmbeds] = await Promise.all([
    getTimelineEvents("GROUP", group.id),
    getMediaEmbeds("GROUP", group.id),
  ]);

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-8 text-zinc-100 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-10">
        <nav className="text-sm text-zinc-500" aria-label="Breadcrumb">KPedia / Group / {group.name}</nav>
        <GroupHero group={group} />
        <div className="flex justify-end"><SubmitEditDialog targetId={group.id} targetType="GROUP" /></div>
        <GroupMembers group={group} />
        <SubUnitList group={group} />
        <CareerTimeline events={timelineEvents} />
        <MediaEmbedGrid embeds={mediaEmbeds} />
        <section className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-400">Music</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Discography</h2>
          </div>
          {group.albums.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {group.albums.map((album) => (
                <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-5" key={album.id}>
                  <h3 className="font-medium text-white">{album.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{album.type} · {formatDate(album.releaseDate)}</p>
                  <p className="mt-4 text-sm text-zinc-500">{album.songs.length} lagu</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500">Belum ada data album.</p>
          )}
        </section>
      </div>
    </main>
  );
}
