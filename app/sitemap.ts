import type { MetadataRoute } from "next";

import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [idols, groups, albums] = await Promise.all([
    prisma.idol.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.group.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.album.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  return [
    { url: `${env.NEXT_PUBLIC_APP_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${env.NEXT_PUBLIC_APP_URL}/search`, changeFrequency: "daily", priority: 0.8 },
    ...idols.map((idol) => ({ url: `${env.NEXT_PUBLIC_APP_URL}/idols/${idol.slug}`, lastModified: idol.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...groups.map((group) => ({ url: `${env.NEXT_PUBLIC_APP_URL}/groups/${group.slug}`, lastModified: group.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...albums.map((album) => ({ url: `${env.NEXT_PUBLIC_APP_URL}/albums/${album.slug}`, lastModified: album.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
