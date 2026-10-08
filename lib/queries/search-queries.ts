import "server-only";

import { prisma } from "@/lib/prisma";
import {
  SEARCH_GENERATIONS,
  SEARCH_STATUSES,
  SEARCH_TYPES,
  type SearchStatus,
  type SearchType,
} from "@/lib/queries/search-constants";
export type SearchParams = {
  q?: string | string[];
  type?: string | string[];
  generation?: string | string[];
  status?: string | string[];
  page?: string | string[];
  limit?: string | string[];
};

type SearchResult =
  | {
      type: "IDOL";
      id: string;
      slug: string;
      name: string;
      secondary: string | null;
      imageUrl: string | null;
      status: SearchStatus | "UNKNOWN";
      generation: number | null;
    }
  | {
      type: "GROUP";
      id: string;
      slug: string;
      name: string;
      secondary: string | null;
      imageUrl: string | null;
      status: "ACTIVE" | "INACTIVE";
      generation: number | null;
    }
  | {
      type: "AGENCY";
      id: string;
      slug: string;
      name: string;
      secondary: string | null;
      imageUrl: string | null;
      status: null;
      generation: null;
    }
  | {
      type: "ALBUM";
      id: string;
      slug: string;
      name: string;
      secondary: string | null;
      imageUrl: string | null;
      status: null;
      generation: null;
    };

export type SearchResults = {
  results: {
    idols: Extract<SearchResult, { type: "IDOL" }>[];
    groups: Extract<SearchResult, { type: "GROUP" }>[];
    agencies: Extract<SearchResult, { type: "AGENCY" }>[];
    albums: Extract<SearchResult, { type: "ALBUM" }>[];
  };
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
  query: { q: string; type: SearchType; generation: number | null; status: SearchStatus | null };
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePage(value: string | string[] | undefined, fallback: number) {
  const parsed = Number.parseInt(first(value) ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function searchEntities(params: SearchParams = {}): Promise<SearchResults> {
  const q = first(params.q)?.trim() ?? "";
  const rawType = first(params.type);
  const type = SEARCH_TYPES.includes(rawType as SearchType) ? (rawType as SearchType) : "ALL";
  const parsedGeneration = Number.parseInt(first(params.generation) ?? "", 10);
  const generation = SEARCH_GENERATIONS.includes(
    parsedGeneration as (typeof SEARCH_GENERATIONS)[number],
  )
    ? parsedGeneration
    : null;
  const rawStatus = first(params.status);
  const status = SEARCH_STATUSES.includes(rawStatus as SearchStatus)
    ? (rawStatus as SearchStatus)
    : null;
  const page = parsePage(params.page, 1);
  const limit = Math.min(48, Math.max(6, parsePage(params.limit, 12)));
  const text = q ? { contains: q, mode: "insensitive" as const } : undefined;

  const idolWhere = {
    ...(text
      ? { OR: [{ stageName: text }, { legalName: text }, { koreanName: text }, { slug: text }] }
      : {}),
    ...(generation ? { generation } : {}),
    ...(status ? { status } : {}),
  };
  const groupWhere = {
    ...(text ? { OR: [{ name: text }, { koreanName: text }, { slug: text }] } : {}),
    ...(generation ? { generation } : {}),
    ...(status ? { isActive: status === "ACTIVE" } : {}),
  };
  const agencyWhere = text ? { OR: [{ name: text }, { koreanName: text }, { slug: text }] } : {};
  const albumWhere = text ? { OR: [{ title: text }, { slug: text }] } : {};
  const take = limit;
  const skip = (page - 1) * limit;
  const include = type === "ALL";
  const [idols, groups, agencies, albums, idolCount, groupCount, agencyCount, albumCount] =
    await Promise.all([
      include || type === "IDOL"
        ? prisma.idol.findMany({
            where: idolWhere,
            include: { agency: true },
            orderBy: { stageName: "asc" },
            skip,
            take,
          })
        : prisma.idol.findMany({ where: { id: "__none__" }, take: 0 }),
      include || type === "GROUP"
        ? prisma.group.findMany({
            where: groupWhere,
            include: { agency: true },
            orderBy: { name: "asc" },
            skip,
            take,
          })
        : prisma.group.findMany({ where: { id: "__none__" }, take: 0 }),
      include || type === "AGENCY"
        ? prisma.agency.findMany({ where: agencyWhere, orderBy: { name: "asc" }, skip, take })
        : prisma.agency.findMany({ where: { id: "__none__" }, take: 0 }),
      prisma.album.findMany({
        where: include || type === "ALBUM" ? albumWhere : { id: "__none__" },
        include: { group: true, idol: true },
        orderBy: { title: "asc" },
        skip,
        take,
      }),
      include || type === "IDOL" ? prisma.idol.count({ where: idolWhere }) : Promise.resolve(0),
      include || type === "GROUP" ? prisma.group.count({ where: groupWhere }) : Promise.resolve(0),
      include || type === "AGENCY"
        ? prisma.agency.count({ where: agencyWhere })
        : Promise.resolve(0),
      include || type === "ALBUM" ? prisma.album.count({ where: albumWhere }) : Promise.resolve(0),
    ]);

  const result = {
    idols: idols.map((idol) => ({
      type: "IDOL" as const,
      id: idol.id,
      slug: idol.slug,
      name: idol.stageName,
      secondary: idol.koreanName ?? idol.legalName,
      imageUrl: idol.profileImageUrl,
      status: idol.status,
      generation: idol.generation,
    })),
    groups: groups.map((group) => ({
      type: "GROUP" as const,
      id: group.id,
      slug: group.slug,
      name: group.name,
      secondary: group.koreanName,
      imageUrl: group.profileImageUrl,
      status: group.isActive ? ("ACTIVE" as const) : ("INACTIVE" as const),
      generation: group.generation,
    })),
    agencies: agencies.map((agency) => ({
      type: "AGENCY" as const,
      id: agency.id,
      slug: agency.slug,
      name: agency.name,
      secondary: agency.koreanName,
      imageUrl: null,
      status: null,
      generation: null,
    })),
    albums: albums.map((album) => ({
      type: "ALBUM" as const,
      id: album.id,
      slug: album.slug,
      name: album.title,
      secondary: album.group?.name ?? album.idol?.stageName ?? null,
      imageUrl: null,
      status: null,
      generation: null,
    })),
  };
  const totalCount = idolCount + groupCount + agencyCount + albumCount;

  return {
    results: result,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / limit)),
    page,
    limit,
    query: { q, type, generation, status },
  };
}
