"use client";

import { ArrowRight, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const popularSearches = ["Red Velvet", "Seulgi", "SM Entertainment"];

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
  }

  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 px-6 py-16 shadow-2xl shadow-fuchsia-950/20 sm:px-10 sm:py-24 lg:px-16">
      <div className="pointer-events-none absolute -left-24 -top-32 -z-10 size-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 right-0 -z-10 size-[32rem] rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(244,63,94,0.16),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.14),transparent_50%)]" />
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md">
          <Sparkles className="size-3.5 text-fuchsia-300" /> The K-Pop knowledge universe
        </div>
        <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
          Every story has a{" "}
          <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
            stage.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
          Explore the people, groups, music, and moments that shape K-Pop. One living encyclopedia,
          built by fans and contributors.
        </p>
        <form
          className="mx-auto mt-9 flex max-w-2xl items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.08] p-2 shadow-2xl shadow-fuchsia-950/30 backdrop-blur-md"
          onSubmit={submit}
        >
          <Search className="ml-3 size-5 shrink-0 text-zinc-500" />
          <input
            className="h-12 min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-zinc-500"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search an idol, group, agency, or album"
            value={query}
          />
          <button
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-zinc-950 shadow-lg shadow-white/10 transition hover:scale-[1.02] hover:bg-fuchsia-100"
            type="submit"
          >
            Search <ArrowRight className="size-4" />
          </button>
        </form>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {popularSearches.map((item) => (
            <Link
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-400 transition hover:border-fuchsia-400/50 hover:text-fuchsia-200"
              href={`/search?q=${encodeURIComponent(item)}`}
              key={item}
            >
              #{item.replaceAll(" ", "_")}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
