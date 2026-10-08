"use client";

import { useState } from "react";
import type { getTimelineEvents } from "@/lib/queries/timeline-queries";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type TimelineEvent = Awaited<ReturnType<typeof getTimelineEvents>>[number];
const categories = ["ALL", "DEBUT", "COMEBACK", "AWARD", "CONCERT", "MILITARY"] as const;

export function CareerTimeline({ events }: { events: TimelineEvent[] }) {
  const [year, setYear] = useState("ALL");
  const [category, setCategory] = useState<(typeof categories)[number]>("ALL");
  const [newestFirst, setNewestFirst] = useState(false);
  const years = Array.from(new Set(events.map((event) => event.eventDate.getFullYear()))).sort(
    (a, b) => b - a,
  );
  const filtered = events
    .filter(
      (event) =>
        (year === "ALL" || event.eventDate.getFullYear() === Number(year)) &&
        (category === "ALL" || event.category === category),
    )
    .toSorted((a, b) =>
      newestFirst
        ? b.eventDate.getTime() - a.eventDate.getTime()
        : a.eventDate.getTime() - b.eventDate.getTime(),
    );

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-400">Career</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Timeline</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            aria-label="Filter tahun"
            className="h-9 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-200"
            onChange={(event) => setYear(event.target.value)}
            value={year}
          >
            <option value="ALL">Semua tahun</option>
            {years.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            aria-label="Urutan timeline"
            className="h-9 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-200"
            onChange={(event) => setNewestFirst(event.target.value === "newest")}
            value={newestFirst ? "newest" : "oldest"}
          >
            <option value="oldest">Terlama</option>
            <option value="newest">Terbaru</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            className={`rounded-full border px-3 py-1.5 text-xs transition ${category === item ? "border-rose-400 bg-rose-400/10 text-rose-300" : "border-zinc-800 text-zinc-500 hover:border-zinc-600"}`}
            key={item}
            onClick={() => setCategory(item)}
            type="button"
          >
            {item === "ALL" ? "Semua" : item}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="relative ml-3 border-l border-zinc-800 pl-7">
          {filtered.map((event) => (
            <article className="relative pb-7 last:pb-0" key={event.id}>
              <span className="absolute -left-[2.05rem] top-1.5 size-3 rounded-full border-2 border-zinc-950 bg-rose-400 shadow-[0_0_0_4px_rgba(251,113,133,0.12)] transition-transform hover:scale-125" />
              <Card className="p-5 transition-colors hover:border-rose-400/40">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <time className="text-xs text-zinc-500">
                    {new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(event.eventDate)}
                  </time>
                  <Badge variant="outline">{event.category}</Badge>
                </div>
                <h3 className="mt-3 font-medium text-white">{event.title}</h3>
                {event.description ? (
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{event.description}</p>
                ) : null}
                {event.sourceUrl ? (
                  <a
                    className="mt-3 inline-block text-xs text-rose-300 hover:text-rose-200"
                    href={event.sourceUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Lihat sumber ↗
                  </a>
                ) : null}
              </Card>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-zinc-800 px-5 py-10 text-center text-sm text-zinc-500">
          Belum ada event pada filter ini.
        </p>
      )}
    </section>
  );
}
