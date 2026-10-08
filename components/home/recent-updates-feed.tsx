import { History, UserRound } from "lucide-react";
import type { getRecentWikiUpdates } from "@/lib/queries/home-queries";

type Update = Awaited<ReturnType<typeof getRecentWikiUpdates>>[number];

const actionLabels: Record<Update["action"], string> = {
  CREATE: "menambahkan",
  UPDATE: "memperbarui",
  DELETE: "menghapus",
};

function relativeTime(date: Date) {
  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 3600) return `${Math.floor(seconds / 60) || 1} menit yang lalu`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam yang lalu`;
  return `${Math.floor(seconds / 86400)} hari yang lalu`;
}

export function RecentUpdatesFeed({ updates }: { updates: Update[] }) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-500">
          Riwayat data
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-white">
          Perubahan data terbaru
        </h2>
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        {updates.length ? (
          <div className="relative space-y-6 border-l border-zinc-200 pl-6 dark:border-white/10">
            {updates.map((update) => (
              <article className="relative" key={update.id}>
                <span className="absolute -left-[1.92rem] top-1 size-3 rounded-full border-2 border-white bg-amber-400 dark:border-zinc-950" />
                <div className="flex gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-500">
                    <History className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                      <span className="font-medium text-zinc-950 dark:text-white">
                        {update.changedBy?.name ?? "Admin"}
                      </span>{" "}
                      {actionLabels[update.action]}{" "}
                      <span className="font-medium text-fuchsia-500">{update.entityType}</span>
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {update.changeNote ? `${update.changeNote} · ` : ""}
                      {relativeTime(update.createdAt)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 py-8 text-sm text-zinc-500">
            <UserRound className="size-4" /> Belum ada riwayat perubahan.
          </div>
        )}
      </div>
    </section>
  );
}
