import type { MediaProvider } from "@prisma/client";

export type NormalizedMedia = {
  externalId: string;
  url: string;
  thumbnailUrl: string | null;
};

export function normalizeMediaUrl(provider: MediaProvider, source: URL): NormalizedMedia | null {
  if (provider === "YOUTUBE") {
    const id =
      source.hostname === "youtu.be"
        ? source.pathname.slice(1).split("/")[0]
        : (source.searchParams.get("v") ??
          source.pathname.split("/").filter(Boolean).at(-1) ??
          null);
    return id
      ? {
          externalId: id,
          url: `https://www.youtube.com/embed/${id}`,
          thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        }
      : null;
  }

  const parts = source.pathname.split("/").filter(Boolean);
  const index = parts.findIndex((part) => ["track", "album", "playlist", "episode"].includes(part));
  const id = index >= 0 ? parts[index + 1] : undefined;
  return id
    ? {
        externalId: id,
        url: `https://open.spotify.com/embed/${parts[index]}/${id}`,
        thumbnailUrl: null,
      }
    : null;
}

export function mediaProviderFromUrl(value: string): MediaProvider | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(url.hostname))
      return "YOUTUBE";
    if (url.hostname === "open.spotify.com") return "SPOTIFY";
    return null;
  } catch {
    return null;
  }
}
