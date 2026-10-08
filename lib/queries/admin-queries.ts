import "server-only";

import { prisma } from "@/lib/prisma";

export function getAdminIdols(search = "") {
  const value = search.trim();
  return prisma.idol.findMany({
    where: value
      ? {
          OR: [
            { stageName: { contains: value, mode: "insensitive" } },
            { slug: { contains: value, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { agency: true, memberships: { include: { group: true } } },
    orderBy: { stageName: "asc" },
  });
}

export function getAdminGroups(search = "") {
  const value = search.trim();
  return prisma.group.findMany({
    where: value
      ? {
          OR: [
            { name: { contains: value, mode: "insensitive" } },
            { slug: { contains: value, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { agency: true, _count: { select: { memberships: true } } },
    orderBy: { name: "asc" },
  });
}

export function getAdminAgencies() {
  return prisma.agency.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { idols: true, groups: true } } },
  });
}

export function getAdminAlbums() {
  return prisma.album.findMany({
    orderBy: { releaseDate: "desc" },
    include: { group: true, idol: true, _count: { select: { songs: true } } },
  });
}
