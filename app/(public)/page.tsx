import { ArrowRight, HeartHandshake } from "lucide-react";
import Link from "next/link";

import { FeaturedIdols } from "@/components/home/featured-idols";
import { HeroSection } from "@/components/home/hero-section";
import { RecentUpdatesFeed } from "@/components/home/recent-updates-feed";
import { StatsOverview } from "@/components/home/stats-overview";
import { TrendingGroups } from "@/components/home/trending-groups";
import {
  getFeaturedIdols,
  getHomeStats,
  getRecentWikiUpdates,
  getTrendingGroups,
} from "@/lib/queries/home-queries";

export default async function HomePage() {
  const [stats, featuredIdols, trendingGroups, recentUpdates] = await Promise.all([
    getHomeStats(),
    getFeaturedIdols(),
    getTrendingGroups(),
    getRecentWikiUpdates(),
  ]);

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-[#09090b] dark:text-zinc-100">
      <div className="mx-auto max-w-[1440px] space-y-20 px-5 py-6 sm:px-8 lg:px-12 lg:py-8">
        <HeroSection />
        <StatsOverview stats={stats} />
        <FeaturedIdols idols={featuredIdols} />
        <TrendingGroups groups={trendingGroups} />
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <RecentUpdatesFeed updates={recentUpdates} />
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-600 via-violet-600 to-indigo-700 p-7 text-white shadow-xl shadow-fuchsia-500/20 sm:p-9">
            <div className="absolute -right-12 -top-12 size-48 rounded-full border-[24px] border-white/10" />
            <HeartHandshake className="relative size-8 text-fuchsia-100" />
            <h2 className="relative mt-8 max-w-sm text-3xl font-semibold tracking-tight">
              Make the archive better.
            </h2>
            <p className="relative mt-3 max-w-sm text-sm leading-6 text-fuchsia-100">
              Jelajahi profil idol, grup, agensi, dan rilisan musik dalam arsip KPedia.
            </p>
            <Link
              className="relative mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-violet-700 transition hover:scale-[1.02]"
              href="/search"
            >
              Jelajahi arsip <ArrowRight className="size-4" />
            </Link>
          </section>
        </div>
        <footer className="flex flex-col justify-between gap-3 border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-white/10 sm:flex-row">
          <span>KPedia · A community-built K-Pop encyclopedia</span>
          <span>Built for curious fans.</span>
        </footer>
      </div>
    </main>
  );
}
