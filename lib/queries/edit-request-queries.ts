import "server-only";

import { prisma } from "@/lib/prisma";

export type EditRequestListParams = { page?: number; limit?: number; status?: string };

const statuses = ["PENDING", "APPROVED", "REJECTED", "CANCELLED"] as const;

export async function getUserEditRequests(userId: string, params: EditRequestListParams = {}) {
  const page = Math.max(1, Math.floor(params.page ?? 1));
  const limit = Math.min(50, Math.max(1, Math.floor(params.limit ?? 10)));
  const status = statuses.includes(params.status as (typeof statuses)[number]) ? params.status as (typeof statuses)[number] : undefined;
  const where = { requesterId: userId, ...(status ? { status } : {}) };
  const [items, total] = await prisma.$transaction([
    prisma.wikiEditRequest.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    prisma.wikiEditRequest.count({ where }),
  ]);
  return { items, pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } };
}
