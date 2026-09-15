import "server-only";

import { prisma } from "@/lib/prisma";

export async function getIdolBySlug(slug: string) {
  return prisma.idol.findUnique({
    where: { slug },
    include: {
      agency: true,
      memberships: {
        include: {
          group: {
            include: {
              agency: true,
              albums: { include: { songs: true, group: true } },
            },
          },
        },
        orderBy: { joinedAt: "asc" },
      },
      albums: {
        include: { songs: true, group: true },
        orderBy: { releaseDate: "desc" },
      },
      credits: {
        include: { song: { include: { album: true } } },
      },
    },
  });
}

export type GetIdolsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function getIdolsParams(params: GetIdolsParams = {}) {
  const page = Math.max(1, Math.floor(params.page ?? 1));
  const limit = Math.min(100, Math.max(1, Math.floor(params.limit ?? 20)));
  const search = params.search?.trim();
  const where = search
    ? {
        OR: [
          { stageName: { contains: search, mode: "insensitive" as const } },
          { legalName: { contains: search, mode: "insensitive" as const } },
          { koreanName: { contains: search, mode: "insensitive" as const } },
          { slug: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const [items, total] = await prisma.$transaction([
    prisma.idol.findMany({
      where,
      include: { agency: true, memberships: { include: { group: true } } },
      orderBy: { stageName: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.idol.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
