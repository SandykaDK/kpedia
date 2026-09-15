import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { IdolGroupMemberships } from "@/components/idols/idol-group-memberships";
import { IdolHero } from "@/components/idols/idol-hero";
import { IdolOverview } from "@/components/idols/idol-overview";
import { SubmitEditDialog } from "@/components/moderation/submit-edit-dialog";
import { CareerTimeline } from "@/components/timeline/career-timeline";
import { MediaEmbedGrid } from "@/components/media/media-embed-grid";
import { getIdolBySlug } from "@/lib/queries/idol-queries";
import { getMediaEmbeds } from "@/lib/queries/media-queries";
import { getTimelineEvents } from "@/lib/queries/timeline-queries";

type IdolPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: IdolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const idol = await getIdolBySlug(slug);

  if (!idol) {
    return { title: "Idol tidak ditemukan | KPedia" };
  }

  const description = idol.biography ?? `Profil ${idol.stageName} di KPedia.`;
  const image = `/api/og/idols/${encodeURIComponent(idol.slug)}`;

  return {
    title: `${idol.stageName} | KPedia`,
    description,
    openGraph: {
      title: `${idol.stageName} | KPedia`,
      description,
      type: "profile",
      images: [{ url: image, width: 1200, height: 630, alt: `Profil ${idol.stageName}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${idol.stageName} | KPedia`,
      description,
      images: [image],
    },
  };
}

export default async function IdolPage({ params }: IdolPageProps) {
  const { slug } = await params;
  const idol = await getIdolBySlug(slug);

  if (!idol) {
    notFound();
  }

  const [timelineEvents, mediaEmbeds] = await Promise.all([
    getTimelineEvents("IDOL", idol.id),
    getMediaEmbeds("IDOL", idol.id),
  ]);

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-8 text-zinc-100 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-10">
        <nav className="text-sm text-zinc-500" aria-label="Breadcrumb">KPedia / Idol / {idol.stageName}</nav>
        <IdolHero idol={idol} />
        <div className="flex justify-end"><SubmitEditDialog targetId={idol.id} targetType="IDOL" /></div>
        <IdolOverview idol={idol} />
        <IdolGroupMemberships idol={idol} />
        <CareerTimeline events={timelineEvents} />
        <MediaEmbedGrid embeds={mediaEmbeds} />
      </div>
    </main>
  );
}
