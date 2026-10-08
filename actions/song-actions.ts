"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { canEditWiki } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { normalizeMediaUrl, mediaProviderFromUrl } from "@/lib/utils/media-embed";
import { isAllowedMediaUrl } from "@/lib/utils/media-validator";
import { createSongSchema, updateSongSchema } from "@/lib/validations/discography";
import type { ActionResponse } from "@/types/action";

async function editor() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  return user && canEditWiki(user) ? user : null;
}

async function synchronizeSongMedia(
  tx: Prisma.TransactionClient,
  song: { id: string; title: string },
  mediaUrl: string | null,
) {
  const existing = await tx.mediaEmbed.findFirst({
    where: { entityType: "SONG", entityId: song.id },
    orderBy: { createdAt: "asc" },
  });

  if (!mediaUrl) {
    await tx.mediaEmbed.deleteMany({ where: { entityType: "SONG", entityId: song.id } });
    return;
  }

  const provider = mediaProviderFromUrl(mediaUrl);
  if (!provider || !isAllowedMediaUrl(mediaUrl, provider)) throw new Error("MEDIA_URL_NOT_ALLOWED");

  const media = normalizeMediaUrl(provider, new URL(mediaUrl));
  if (!media) throw new Error("MEDIA_URL_INVALID");

  const data = {
    entityType: "SONG" as const,
    entityId: song.id,
    provider,
    externalId: media.externalId,
    url: media.url,
    title: song.title,
    thumbnailUrl: media.thumbnailUrl,
  };

  await tx.mediaEmbed.deleteMany({
    where: {
      entityType: "SONG",
      entityId: song.id,
      ...(existing ? { id: { not: existing.id } } : {}),
    },
  });

  if (existing) {
    await tx.mediaEmbed.update({ where: { id: existing.id }, data });
  } else {
    await tx.mediaEmbed.create({ data });
  }
}

function revalidateAlbumAndSongPages(albumId: string | null) {
  revalidatePath("/admin/albums");
  if (albumId) revalidatePath(`/admin/albums/${albumId}`);
}

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message === "MEDIA_URL_NOT_ALLOWED")
    return "URL media harus berasal dari domain resmi YouTube atau Spotify.";
  if (error instanceof Error && error.message === "MEDIA_URL_INVALID")
    return "URL YouTube atau Spotify tidak valid.";
  return fallback;
}

export async function createSong(input: unknown): Promise<ActionResponse<{ id: string }>> {
  if (!(await editor())) return { success: false, error: "Tidak memiliki izin." };

  const parsed = createSongSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      error: "Data lagu tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };

  if (parsed.data.mediaUrl) {
    const provider = mediaProviderFromUrl(parsed.data.mediaUrl);
    if (!provider || !isAllowedMediaUrl(parsed.data.mediaUrl, provider))
      return {
        success: false,
        error: "URL media harus berasal dari domain resmi YouTube atau Spotify.",
      };
    if (!normalizeMediaUrl(provider, new URL(parsed.data.mediaUrl)))
      return { success: false, error: "URL YouTube atau Spotify tidak valid." };
  }

  try {
    const song = await prisma.$transaction(async (tx) => {
      const created = await tx.song.create({
        data: {
          albumId: parsed.data.albumId,
          title: parsed.data.title,
          trackNumber: parsed.data.trackNumber,
          duration: parsed.data.duration,
          isTitleTrack: parsed.data.isTitleTrack,
          lyrics: parsed.data.lyrics,
        },
      });
      if (parsed.data.mediaUrl) await synchronizeSongMedia(tx, created, parsed.data.mediaUrl);
      return created;
    });
    revalidateAlbumAndSongPages(song.albumId);
    return { success: true, data: { id: song.id } };
  } catch (error: unknown) {
    console.error("createSong failed", error);
    return {
      success: false,
      error: errorMessage(error, "Gagal membuat lagu."),
    };
  }
}

export async function updateSong(
  id: string,
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  if (!(await editor())) return { success: false, error: "Tidak memiliki izin." };

  const parsed = updateSongSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      error: "Data lagu tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };

  if (parsed.data.mediaUrl) {
    const provider = mediaProviderFromUrl(parsed.data.mediaUrl);
    if (!provider || !isAllowedMediaUrl(parsed.data.mediaUrl, provider))
      return {
        success: false,
        error: "URL media harus berasal dari domain resmi YouTube atau Spotify.",
      };
    if (!normalizeMediaUrl(provider, new URL(parsed.data.mediaUrl)))
      return { success: false, error: "URL YouTube atau Spotify tidak valid." };
  }

  try {
    const song = await prisma.$transaction(async (tx) => {
      const previous = await tx.song.findUnique({
        where: { id },
        select: { id: true, title: true, albumId: true },
      });
      if (!previous) return null;

      const { mediaUrl, ...songData } = parsed.data;
      const updated = await tx.song.update({
        where: { id },
        data: songData,
      });
      if (mediaUrl !== undefined) await synchronizeSongMedia(tx, updated, mediaUrl || null);
      return { ...updated, previousAlbumId: previous.albumId };
    });
    if (!song) return { success: false, error: "Lagu tidak ditemukan." };
    revalidateAlbumAndSongPages(song.previousAlbumId);
    revalidateAlbumAndSongPages(song.albumId);
    return { success: true, data: { id: song.id } };
  } catch (error: unknown) {
    console.error("updateSong failed", error);
    return {
      success: false,
      error: errorMessage(error, "Gagal memperbarui lagu."),
    };
  }
}

export async function deleteSong(id: string): Promise<ActionResponse<{ id: string }>> {
  if (!(await editor())) return { success: false, error: "Tidak memiliki izin." };

  try {
    const song = await prisma.$transaction(async (tx) => {
      const existing = await tx.song.findUnique({
        where: { id },
        select: { id: true, albumId: true },
      });
      if (!existing) return null;
      await tx.mediaEmbed.deleteMany({ where: { entityType: "SONG", entityId: id } });
      await tx.song.delete({ where: { id } });
      return existing;
    });
    if (!song) return { success: false, error: "Lagu tidak ditemukan." };
    revalidateAlbumAndSongPages(song.albumId);
    return { success: true, data: { id } };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
      return { success: false, error: "Lagu tidak ditemukan." };
    console.error("deleteSong failed", error);
    return { success: false, error: "Gagal menghapus lagu." };
  }
}
