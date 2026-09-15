import "server-only";

import { prisma } from "@/lib/prisma";

const statuses = ["PENDING", "APPROVED", "REJECTED", "CANCELLED"] as const;
const targetTypes = ["IDOL", "GROUP", "AGENCY", "ALBUM", "SONG"] as const;

export type ModerationParams = {
  page?: number;
  limit?: number;
  status?: string;
  targetType?: string;
};

function filters(params: ModerationParams) {
  const status = params.status === undefined
    ? "PENDING"
    : statuses.includes(params.status as (typeof statuses)[number])
      ? params.status as (typeof statuses)[number]
      : undefined;
  const targetType = targetTypes.includes(params.targetType as (typeof targetTypes)[number]) ? params.targetType as (typeof targetTypes)[number] : undefined;
  return { ...(status ? { status } : {}), ...(targetType ? { targetType } : {}) };
}

export async function getPendingEditRequests(params: ModerationParams = {}) {
  const page = Math.max(1, Math.floor(params.page ?? 1));
  const limit = Math.min(50, Math.max(1, Math.floor(params.limit ?? 20)));
  const where = filters(params);
  const [items, total] = await prisma.$transaction([
    prisma.wikiEditRequest.findMany({ where, include: { requester: { select: { id: true, name: true, email: true } }, reviewer: { select: { name: true, email: true } } }, orderBy: { createdAt: "asc" }, skip: (page - 1) * limit, take: limit }),
    prisma.wikiEditRequest.count({ where }),
  ]);
  return { items, pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } };
}

async function currentSnapshot(targetType: (typeof targetTypes)[number], targetId: string) {
  switch (targetType) {
    case "IDOL": return prisma.idol.findUnique({ where: { id: targetId } });
    case "GROUP": return prisma.group.findUnique({ where: { id: targetId } });
    case "AGENCY": return prisma.agency.findUnique({ where: { id: targetId } });
    case "ALBUM": return prisma.album.findUnique({ where: { id: targetId } });
    case "SONG": return prisma.song.findUnique({ where: { id: targetId } });
  }
}

export async function getEditRequestById(id: string) {
  const request = await prisma.wikiEditRequest.findUnique({ where: { id }, include: { requester: { select: { id: true, name: true, email: true } }, reviewer: { select: { name: true, email: true } } } });
  if (!request) return null;
  const targetType = request.targetType as (typeof targetTypes)[number];
  return { request, currentSnapshot: await currentSnapshot(targetType, request.targetId) };
}
