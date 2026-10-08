"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { canEditWiki } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { normalizeMediaUrl } from "@/lib/utils/media-embed";
import { isAllowedMediaUrl } from "@/lib/utils/media-validator";
import { addMediaEmbedSchema } from "@/lib/validations/media";
import type { ActionResponse } from "@/types/action";

const updateMediaEmbedSchema = addMediaEmbedSchema
  .omit({ entityType: true, entityId: true })
  .extend({
    targetType: addMediaEmbedSchema.shape.entityType,
    targetId: addMediaEmbedSchema.shape.entityId,
  });

async function editor() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  return user && canEditWiki(user) ? user : null;
}

function entityPath(entityType: string, entityId: string) {
  switch (entityType) {
    case "IDOL":
      return `/idols/${entityId}`;
    case "GROUP":
      return `/groups/${entityId}`;
    default:
      return null;
  }
}

export async function addMediaEmbed(input: unknown): Promise<ActionResponse<{ id: string }>> {
  const user = await editor();
  if (!user) return { success: false, error: "Anda tidak memiliki izin mengubah data wiki." };
  const parsed = addMediaEmbedSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      error: "Data media tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  if (!isAllowedMediaUrl(parsed.data.url, parsed.data.provider)) {
    return {
      success: false,
      error: "URL media harus berasal dari domain resmi YouTube atau Spotify.",
    };
  }
  const source = new URL(parsed.data.url);
  const media = normalizeMediaUrl(parsed.data.provider, source);
  if (!media)
    return {
      success: false,
      error: `URL ${parsed.data.provider === "YOUTUBE" ? "YouTube" : "Spotify"} tidak valid.`,
    };
  try {
    const embed = await prisma.mediaEmbed.create({ data: { ...parsed.data, ...media } });
    revalidatePath("/admin/media");
    const path = entityPath(parsed.data.entityType, parsed.data.entityId);
    if (path) revalidatePath(path);
    return { success: true, data: { id: embed.id } };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
      return { success: false, error: "Embed media tersebut sudah terdaftar." };
    console.error("addMediaEmbed failed", error);
    return { success: false, error: "Gagal menambahkan media embed." };
  }
}

export async function updateMediaEmbed(
  id: string,
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  const user = await editor();
  if (!user) return { success: false, error: "Anda tidak memiliki izin mengubah data wiki." };

  const parsed = updateMediaEmbedSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      error: "Data media tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  if (!isAllowedMediaUrl(parsed.data.url, parsed.data.provider))
    return {
      success: false,
      error: "URL media harus berasal dari domain resmi YouTube atau Spotify.",
    };

  const media = normalizeMediaUrl(parsed.data.provider, new URL(parsed.data.url));
  if (!media)
    return {
      success: false,
      error: `URL ${parsed.data.provider === "YOUTUBE" ? "YouTube" : "Spotify"} tidak valid.`,
    };

  try {
    const existing = await prisma.mediaEmbed.findUnique({
      where: { id },
      select: { entityType: true, entityId: true },
    });
    if (!existing) return { success: false, error: "Media embed tidak ditemukan." };

    const embed = await prisma.mediaEmbed.update({
      where: { id },
      data: {
        entityType: parsed.data.targetType,
        entityId: parsed.data.targetId,
        provider: parsed.data.provider,
        url: media.url,
        externalId: media.externalId,
        thumbnailUrl: media.thumbnailUrl,
        title: parsed.data.title?.trim() || null,
      },
    });
    revalidatePath("/admin/media");
    const oldPath = entityPath(existing.entityType, existing.entityId);
    const newPath = entityPath(embed.entityType, embed.entityId);
    if (oldPath) revalidatePath(oldPath);
    if (newPath && newPath !== oldPath) revalidatePath(newPath);
    return { success: true, data: { id: embed.id } };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
      return { success: false, error: "Embed media tersebut sudah terdaftar." };
    console.error("updateMediaEmbed failed", error);
    return { success: false, error: "Gagal memperbarui media embed." };
  }
}

export async function deleteMediaEmbed(id: string): Promise<ActionResponse<{ id: string }>> {
  const user = await editor();
  if (!user) return { success: false, error: "Anda tidak memiliki izin mengubah data wiki." };

  try {
    const embed = await prisma.mediaEmbed.delete({
      where: { id },
      select: { id: true, entityType: true, entityId: true },
    });
    revalidatePath("/admin/media");
    const path = entityPath(embed.entityType, embed.entityId);
    if (path) revalidatePath(path);
    return { success: true, data: { id: embed.id } };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
      return { success: false, error: "Media embed tidak ditemukan." };
    console.error("deleteMediaEmbed failed", error);
    return { success: false, error: "Gagal menghapus media embed." };
  }
}
