"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { canModerate } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import type { ActionResponse } from "@/types/action";

type TargetType = "IDOL" | "GROUP" | "AGENCY" | "ALBUM" | "SONG";
type Operation = "CREATE" | "UPDATE" | "DELETE";
type JsonRecord = Record<string, unknown>;

function toRecord(value: Prisma.JsonValue): JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as JsonRecord : {};
}

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function scalarData(payload: JsonRecord, allowed: readonly string[]) {
  return Object.fromEntries(Object.entries(payload).filter(([key, value]) => allowed.includes(key) && value !== undefined));
}

function normalizeDates(data: JsonRecord, fields: readonly string[]) {
  for (const field of fields) {
    if (typeof data[field] === "string") data[field] = new Date(data[field] as string);
  }
  return data;
}

async function authorizedModerator() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  return user && canModerate(user) ? user : null;
}

async function mutateTarget(tx: Prisma.TransactionClient, targetType: TargetType, targetId: string, operation: Operation, payload: Prisma.JsonValue) {
  const input = normalizeDates(scalarData(toRecord(payload), [
    "slug", "stageName", "legalName", "koreanName", "gender", "status", "debutDate", "agencyId", "profileUrl", "profileImageUrl", "biography", "birthPlace", "nationality", "generation", "name", "type", "disbandDate", "isActive", "parentGroupId", "websiteUrl", "description", "title", "releaseDate", "groupId", "idolId", "trackNumber", "isTitleTrack",
  ]), ["birthDate", "debutDate", "disbandDate", "releaseDate"]);

  if (operation === "DELETE") {
    switch (targetType) {
      case "IDOL": return tx.idol.delete({ where: { id: targetId } });
      case "GROUP": return tx.group.delete({ where: { id: targetId } });
      case "AGENCY": return tx.agency.delete({ where: { id: targetId } });
      case "ALBUM": return tx.album.delete({ where: { id: targetId } });
      case "SONG": return tx.song.delete({ where: { id: targetId } });
    }
  }

  if (operation === "CREATE") {
    switch (targetType) {
      case "IDOL": return tx.idol.create({ data: input as Prisma.IdolCreateInput });
      case "GROUP": return tx.group.create({ data: input as Prisma.GroupCreateInput });
      case "AGENCY": return tx.agency.create({ data: input as Prisma.AgencyCreateInput });
      case "ALBUM": return tx.album.create({ data: input as Prisma.AlbumCreateInput });
      case "SONG": return tx.song.create({ data: input as Prisma.SongCreateInput });
    }
  }

  switch (targetType) {
    case "IDOL": return tx.idol.update({ where: { id: targetId }, data: input as Prisma.IdolUncheckedUpdateInput });
    case "GROUP": return tx.group.update({ where: { id: targetId }, data: input as Prisma.GroupUncheckedUpdateInput });
    case "AGENCY": return tx.agency.update({ where: { id: targetId }, data: input as Prisma.AgencyUncheckedUpdateInput });
    case "ALBUM": return tx.album.update({ where: { id: targetId }, data: input as Prisma.AlbumUncheckedUpdateInput });
    case "SONG": return tx.song.update({ where: { id: targetId }, data: input as Prisma.SongUncheckedUpdateInput });
  }
}

function revalidateTarget(targetType: TargetType, value: unknown) {
  const record = value as { slug?: string } | null;
  if (!record?.slug) return;
  const route = targetType === "IDOL" ? "idols" : targetType === "GROUP" ? "groups" : targetType.toLowerCase() + "s";
  revalidatePath(`/${route}/${record.slug}`);
}

export async function approveWikiEditRequest(requestId: string, reviewNote?: string): Promise<ActionResponse<{ id: string }>> {
  const reviewer = await authorizedModerator();
  if (!reviewer) return { success: false, error: "Anda tidak memiliki izin moderasi." };
  if (!requestId.trim()) return { success: false, error: "Request ID tidak valid." };

  try {
    const result = await prisma.$transaction(async (tx) => {
      const request = await tx.wikiEditRequest.findUnique({ where: { id: requestId } });
      if (!request || request.status !== "PENDING") throw new Error("REQUEST_NOT_PENDING");
      const before = request.targetType === "IDOL" ? await tx.idol.findUnique({ where: { id: request.targetId } }) : request.targetType === "GROUP" ? await tx.group.findUnique({ where: { id: request.targetId } }) : request.targetType === "AGENCY" ? await tx.agency.findUnique({ where: { id: request.targetId } }) : request.targetType === "ALBUM" ? await tx.album.findUnique({ where: { id: request.targetId } }) : await tx.song.findUnique({ where: { id: request.targetId } });
      const after = await mutateTarget(tx, request.targetType, request.targetId, request.operation, request.payload);
      await tx.wikiEditRequest.update({ where: { id: request.id }, data: { status: "APPROVED", reviewerId: reviewer.id, reviewNote: reviewNote?.trim() || null, reviewedAt: new Date() } });
      const afterRecord = after as { id?: string; slug?: string } | null;
      const entityId = afterRecord?.id ?? request.targetId;
      const latest = await tx.revisionHistory.findFirst({ where: { entityType: request.targetType, entityId }, orderBy: { revisionNo: "desc" }, select: { revisionNo: true } });
      await tx.revisionHistory.create({ data: { entityType: request.targetType, entityId, revisionNo: (latest?.revisionNo ?? 0) + 1, action: request.operation, previousSnapshot: toJson(before), snapshot: toJson(after), changeNote: reviewNote?.trim() || null, changedById: reviewer.id } });
      return { after, targetType: request.targetType };
    });
    revalidateTarget(result.targetType, result.after);
    revalidatePath("/admin/edits");
    return { success: true, data: { id: requestId } };
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "REQUEST_NOT_PENDING") return { success: false, error: "Usulan tidak ditemukan atau sudah diproses." };
    console.error("approveWikiEditRequest failed", error);
    return { success: false, error: "Gagal menyetujui usulan." };
  }
}

export async function rejectWikiEditRequest(requestId: string, reviewNote: string): Promise<ActionResponse<{ id: string }>> {
  const reviewer = await authorizedModerator();
  if (!reviewer) return { success: false, error: "Anda tidak memiliki izin moderasi." };
  if (reviewNote.trim().length < 10) return { success: false, error: "Alasan penolakan minimal 10 karakter." };
  const result = await prisma.wikiEditRequest.updateMany({ where: { id: requestId, status: "PENDING" }, data: { status: "REJECTED", reviewerId: reviewer.id, reviewNote: reviewNote.trim(), reviewedAt: new Date() } });
  if (!result.count) return { success: false, error: "Usulan tidak ditemukan atau sudah diproses." };
  revalidatePath("/admin/edits");
  return { success: true, data: { id: requestId } };
}
