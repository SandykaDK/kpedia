import type { getMediaEmbeds } from "@/lib/queries/media-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { YoutubePlayer } from "@/components/media/youtube-player";
import { SpotifyPlayer } from "@/components/media/spotify-player";

type MediaEmbed = Awaited<ReturnType<typeof getMediaEmbeds>>[number];

export function MediaEmbedGrid({ embeds }: { embeds: MediaEmbed[] }) {
  if (!embeds.length) return null;
  return <section className="space-y-5"><div><p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-400">Watch & listen</p><h2 className="mt-1 text-2xl font-semibold text-white">Media</h2></div><div className="grid gap-5 lg:grid-cols-2">{embeds.map((embed) => <Card className="overflow-hidden" key={embed.id}><CardHeader><CardTitle>{embed.title ?? (embed.provider === "YOUTUBE" ? "YouTube video" : "Spotify track")}</CardTitle></CardHeader><CardContent className="p-0">{embed.provider === "YOUTUBE" ? <div className="relative aspect-video"><YoutubePlayer embedUrl={embed.url} thumbnailUrl={embed.thumbnailUrl} title={embed.title} /></div> : <SpotifyPlayer embedUrl={embed.url} title={embed.title} />}</CardContent></Card>)}</div></section>;
}
