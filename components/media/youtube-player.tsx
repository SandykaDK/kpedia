"use client";

import { useState } from "react";
import Image from "next/image";

export function YoutubePlayer({
  embedUrl,
  thumbnailUrl,
  title,
}: {
  embedUrl: string;
  thumbnailUrl?: string | null;
  title?: string | null;
}) {
  const [active, setActive] = useState(false);
  if (active)
    return (
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 size-full"
        loading="lazy"
        src={`${embedUrl}?autoplay=1`}
        title={title ?? "YouTube video"}
      />
    );
  return (
    <button
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-zinc-900 text-left"
      onClick={() => setActive(true)}
      type="button"
    >
      {thumbnailUrl ? (
        <Image
          alt=""
          className="object-cover opacity-70"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          src={thumbnailUrl}
          unoptimized
        />
      ) : null}
      <span className="relative rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg">
        Putar video
      </span>
    </button>
  );
}
