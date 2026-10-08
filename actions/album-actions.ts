"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { canEditWiki } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { updateAlbumSchema } from "@/lib/validations/discography";
import type { ActionResponse } from "@/types/action";

async function editor() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  return user && canEditWiki(user) ? user : null;
}

export async function updateAlbum(
  id: string,
  input: unknown,
): Promise<ActionResponse<{ id: string }>> {
  if (!(await editor())) return { success: false, error: "Tidak memiliki izin." };

  const parsed = updateAlbumSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      error: "Data album tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };

  try {
    const album = await prisma.album.update({
      where: { id },
      data: parsed.data,
      select: { id: true },
    });
    revalidatePath("/admin/albums");
    return { success: true, data: { id: album.id } };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
      return { success: false, error: "Album tidak ditemukan." };
    console.error("updateAlbum failed", error);
    return { success: false, error: "Gagal memperbarui album." };
  }
}

export async function deleteAlbum(id: string): Promise<ActionResponse<{ id: string }>> {
  if (!(await editor())) return { success: false, error: "Tidak memiliki izin." };

  try {
    const deleted = await prisma.$transaction(async (tx) => {
      const album = await tx.album.findUnique({
        where: { id },
        select: { songs: { select: { id: true } } },
      });
      if (!album) return false;

      const songIds = album.songs.map((song) => song.id);
      if (songIds.length) {
        await tx.mediaEmbed.deleteMany({
          where: { entityType: "SONG", entityId: { in: songIds } },
        });
        await tx.song.deleteMany({ where: { id: { in: songIds } } });
      }
      await tx.mediaEmbed.deleteMany({ where: { entityType: "ALBUM", entityId: id } });
      await tx.album.delete({ where: { id } });
      return true;
    });
    if (!deleted) return { success: false, error: "Album tidak ditemukan." };
    revalidatePath("/admin/albums");
    return { success: true, data: { id } };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
      return { success: false, error: "Album tidak ditemukan." };
    console.error("deleteAlbum failed", error);
    return { success: false, error: "Gagal menghapus album." };
  }
}
