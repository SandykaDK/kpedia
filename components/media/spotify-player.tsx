"use client";

import { useState } from "react";

export function SpotifyPlayer({ embedUrl, title }: { embedUrl: string; title?: string | null }) {
  const [active, setActive] = useState(false);
  if (active) return <iframe allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" className="h-20 w-full" loading="lazy" src={embedUrl} title={title ?? "Spotify player"} />;
  return <button className="flex h-20 w-full items-center justify-between bg-gradient-to-r from-emerald-950 to-zinc-900 px-5 text-left" onClick={() => setActive(true)} type="button"><span><span className="block text-xs uppercase tracking-wider text-emerald-400">Spotify</span><span className="mt-1 block truncate text-sm font-medium text-white">{title ?? "Dengarkan di Spotify"}</span></span><span className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-zinc-950">Putar</span></button>;
}
