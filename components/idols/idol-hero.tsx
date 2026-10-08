import type { getIdolBySlug } from "@/lib/queries/idol-queries";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Idol = NonNullable<Awaited<ReturnType<typeof getIdolBySlug>>>;

const statusLabels: Record<Idol["status"], string> = {
  ACTIVE: "Aktif",
  INACTIVE: "Tidak aktif",
  MILITARY: "Wajib militer",
  HIATUS: "Hiatus",
  UNKNOWN: "Belum diketahui",
};

export function IdolHero({ idol }: { idol: Idol }) {
  const initials = idol.stageName.slice(0, 2).toUpperCase();

  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-rose-950/10 sm:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 via-orange-300 to-amber-200" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
        <Avatar className="size-32 sm:size-40">
          {idol.profileImageUrl ? (
            <AvatarImage src={idol.profileImageUrl} alt={idol.stageName} />
          ) : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={idol.status === "ACTIVE" ? "success" : "muted"}>
              {statusLabels[idol.status]}
            </Badge>
            {idol.generation ? <Badge variant="outline">Generasi {idol.generation}</Badge> : null}
          </div>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {idol.stageName}
            </h1>
            <p className="mt-1 text-xl text-zinc-400">
              {idol.koreanName ?? "Nama Korea belum tersedia"}
            </p>
          </div>
          <p className="text-sm text-zinc-400">
            Agensi saat ini:{" "}
            <span className="font-medium text-zinc-200">{idol.agency?.name ?? "Independen"}</span>
          </p>
        </div>
      </div>
      {idol.slug === "seulgi" ? (
        <p className="mt-4 text-xs text-zinc-500">
          Foto oleh{" "}
          <a
            className="underline underline-offset-2 hover:text-zinc-300"
            href="https://www.youtube.com/channel/UCY9QGuU9mBLBp_OCRNKeVSw"
            rel="noreferrer"
            target="_blank"
          >
            티비텐
          </a>
          {" · "}
          <a
            className="underline underline-offset-2 hover:text-zinc-300"
            href="https://commons.wikimedia.org/wiki/File:Kang_Seulgi_LONGCHAMP_2024.jpg"
            rel="noreferrer"
            target="_blank"
          >
            Wikimedia Commons
          </a>
          {" · "}
          <a
            className="underline underline-offset-2 hover:text-zinc-300"
            href="https://creativecommons.org/licenses/by/3.0/"
            rel="noreferrer"
            target="_blank"
          >
            CC BY 3.0
          </a>
        </p>
      ) : null}
    </section>
  );
}
