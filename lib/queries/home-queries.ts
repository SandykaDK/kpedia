import "server-only";

import { prisma } from "@/lib/prisma";

export async function getHomeStats() {
  const [idols, groups, agencies, approvedContributions] = await prisma.$transaction([
    prisma.idol.count(),
    prisma.group.count(),
    prisma.agency.count(),
    prisma.wikiEditRequest.count({ where: { status: "APPROVED" } }),
  ]);

  return { idols, groups, agencies, approvedContributions };
}

export async function getFeaturedIdols(limit = 6) {
  return prisma.idol.findMany({
    take: Math.min(12, Math.max(1, limit)),
    include: { agency: true, memberships: { include: { group: true }, orderBy: { joinedAt: "asc" } } },
    orderBy: [{ updatedAt: "desc" }, { stageName: "asc" }],
  });
}

export async function getTrendingGroups(limit = 4) {
  return prisma.group.findMany({
    where: { isActive: true },
    take: Math.min(8, Math.max(1, limit)),
    include: { agency: true, _count: { select: { memberships: true } } },
    orderBy: [{ memberships: { _count: "desc" } }, { updatedAt: "desc" }],
  });
}

export async function getRecentWikiUpdates(limit = 5) {
  return prisma.wikiEditRequest.findMany({
    where: { status: "APPROVED" },
    take: Math.min(10, Math.max(1, limit)),
    include: { requester: { select: { name: true, email: true } } },
    orderBy: { reviewedAt: "desc" },
  });
}
