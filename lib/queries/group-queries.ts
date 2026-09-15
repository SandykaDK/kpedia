import "server-only";

import { prisma } from "@/lib/prisma";

export async function getGroupBySlug(slug: string) {
  return prisma.group.findUnique({
    where: { slug },
    include: {
      agency: true,
      memberships: {
        include: {
          idol: {
            include: {
              agency: true,
              albums: { include: { songs: true } },
            },
          },
        },
        orderBy: [{ status: "asc" }, { joinedAt: "asc" }, { idol: { stageName: "asc" } }],
      },
      subUnits: {
        include: { agency: true },
        orderBy: { name: "asc" },
      },
      albums: {
        include: { songs: true },
        orderBy: { releaseDate: "desc" },
      },
    },
  });
}
