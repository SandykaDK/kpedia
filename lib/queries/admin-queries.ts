import "server-only";

import { AlbumType, IdolStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type AdminIdolFilters = {
  q?: string;
  agencyId?: string;
  groupId?: string;
  status?: string;
};

export type AdminPagination = {
  page?: number;
  limit?: number;
};

export type AdminPaginatedResult<T> = {
  data: T[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
};

const adminPageSizes = [10, 20, 50] as const;

function normalizePagination({ page = 1, limit = 10 }: AdminPagination) {
  const normalizedPage = Number.isSafeInteger(page) && page > 0 ? page : 1;
  const normalizedLimit = adminPageSizes.find((size) => size === limit) ?? 10;
  return { page: normalizedPage, limit: normalizedLimit };
}

const adminIdolStatuses = [
  IdolStatus.ACTIVE,
  IdolStatus.INACTIVE,
  IdolStatus.MILITARY,
  IdolStatus.HIATUS,
] as const;

function isAdminIdolStatus(value: string | undefined): value is (typeof adminIdolStatuses)[number] {
  return adminIdolStatuses.some((status) => status === value);
}

function getAdminIdolWhere(filters: AdminIdolFilters) {
  const value = filters.q?.trim();
  const conditions: Prisma.IdolWhereInput[] = [];

  if (value) {
    conditions.push({
      OR: [
        { stageName: { contains: value, mode: "insensitive" } },
        { legalName: { contains: value, mode: "insensitive" } },
        { koreanName: { contains: value, mode: "insensitive" } },
        { slug: { contains: value, mode: "insensitive" } },
      ],
    });
  }
  if (filters.agencyId) {
    conditions.push({ agency: { is: { id: filters.agencyId } } });
  }
  if (filters.groupId) {
    conditions.push({ memberships: { some: { groupId: filters.groupId } } });
  }
  if (isAdminIdolStatus(filters.status)) {
    conditions.push({ status: filters.status });
  }

  return conditions.length ? { AND: conditions } : undefined;
}

const adminIdolInclude = { agency: true, memberships: { include: { group: true } } } satisfies
  Prisma.IdolInclude;

export function getAdminIdolOptions() {
  return prisma.idol.findMany({
    include: adminIdolInclude,
    orderBy: { stageName: "asc" },
  });
}

export async function getAdminIdols(
  filters: AdminIdolFilters & AdminPagination = {},
): Promise<AdminPaginatedResult<Prisma.IdolGetPayload<{ include: typeof adminIdolInclude }>>> {
  const where = getAdminIdolWhere(filters);
  const { page, limit } = normalizePagination(filters);

  return prisma.$transaction(async (transaction) => {
    const totalCount = await transaction.idol.count({ where });
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = totalPages === 0 ? 1 : Math.min(page, totalPages);
    const data = await transaction.idol.findMany({
      where,
      skip: (currentPage - 1) * limit,
      take: limit,
      include: adminIdolInclude,
      orderBy: { stageName: "asc" },
    });

    return { data, totalCount, totalPages, page: currentPage, limit };
  });
}

export type AdminGroupFilters = {
  q?: string;
};

function getAdminGroupWhere(filters: AdminGroupFilters) {
  const value = (filters.q ?? "").trim();
  return value
    ? {
        OR: [
          { name: { contains: value, mode: "insensitive" as const } },
          { slug: { contains: value, mode: "insensitive" as const } },
        ],
      }
    : undefined;
}

const adminGroupInclude = { agency: true, _count: { select: { memberships: true } } } satisfies
  Prisma.GroupInclude;

export function getAdminGroupOptions() {
  return prisma.group.findMany({
    include: adminGroupInclude,
    orderBy: { name: "asc" },
  });
}

export async function getAdminGroups(
  filters: AdminGroupFilters & AdminPagination = {},
): Promise<AdminPaginatedResult<Prisma.GroupGetPayload<{ include: typeof adminGroupInclude }>>> {
  const where = getAdminGroupWhere(filters);
  const { page, limit } = normalizePagination(filters);

  return prisma.$transaction(async (transaction) => {
    const totalCount = await transaction.group.count({ where });
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = totalPages === 0 ? 1 : Math.min(page, totalPages);
    const data = await transaction.group.findMany({
      where,
      skip: (currentPage - 1) * limit,
      take: limit,
      include: adminGroupInclude,
      orderBy: { name: "asc" },
    });

    return { data, totalCount, totalPages, page: currentPage, limit };
  });
}

export function getAdminAgencies() {
  return prisma.agency.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { idols: true, groups: true } } },
  });
}

export type AdminAlbumFilters = {
  q?: string;
  type?: string;
  groupId?: string;
  idolId?: string;
};

const adminAlbumTypes = [
  AlbumType.SINGLE,
  AlbumType.EP,
  AlbumType.MINI_ALBUM,
  AlbumType.FULL_ALBUM,
  AlbumType.REPACKAGE,
  AlbumType.OST,
  AlbumType.COMPILATION,
  AlbumType.LIVE,
  AlbumType.OTHER,
] as const;

function isAdminAlbumType(value: string | undefined): value is (typeof adminAlbumTypes)[number] {
  return adminAlbumTypes.some((type) => type === value);
}

export function getAdminAlbums(filters: AdminAlbumFilters = {}) {
  const conditions: Prisma.AlbumWhereInput[] = [];
  const value = filters.q?.trim();

  if (value) {
    conditions.push({
      OR: [
        { title: { contains: value, mode: "insensitive" } },
        { slug: { contains: value, mode: "insensitive" } },
      ],
    });
  }
  if (isAdminAlbumType(filters.type)) {
    conditions.push({ type: filters.type });
  }
  if (filters.groupId) conditions.push({ groupId: filters.groupId });
  if (filters.idolId) conditions.push({ idolId: filters.idolId });

  return prisma.album.findMany({
    where: conditions.length ? { AND: conditions } : undefined,
    orderBy: { releaseDate: "desc" },
    include: {
      group: true,
      idol: true,
      songs: { orderBy: [{ trackNumber: "asc" }, { title: "asc" }] },
      _count: { select: { songs: true } },
    },
  });
}

export async function getAdminMediaEmbeds(
  where: Prisma.MediaEmbedWhereInput | undefined,
  pagination: AdminPagination = {},
): Promise<AdminPaginatedResult<Prisma.MediaEmbedGetPayload<{}>>> {
  const { page, limit } = normalizePagination(pagination);

  return prisma.$transaction(async (transaction) => {
    const totalCount = await transaction.mediaEmbed.count({ where });
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = totalPages === 0 ? 1 : Math.min(page, totalPages);
    const data = await transaction.mediaEmbed.findMany({
      where,
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return { data, totalCount, totalPages, page: currentPage, limit };
  });
}
