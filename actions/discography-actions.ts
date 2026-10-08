"use server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { canEditWiki } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createAlbumSchema, createSongSchema } from "@/lib/validations/discography";
import type { ActionResponse } from "@/types/action";
async function editor() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  return user && canEditWiki(user) ? user : null;
}
export async function createAlbum(
  input: unknown,
): Promise<ActionResponse<{ id: string; slug: string }>> {
  if (!(await editor())) return { success: false, error: "Tidak memiliki izin." };
  const parsed = createAlbumSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      error: "Data album tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  try {
    const album = await prisma.album.create({ data: parsed.data });
    revalidatePath("/admin/albums");
    return { success: true, data: { id: album.id, slug: album.slug } };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
      return { success: false, error: "Slug album sudah digunakan." };
    console.error(error);
    return { success: false, error: "Gagal membuat album." };
  }
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
  try {
    const song = await prisma.$transaction(async (tx) => {
      const created = await tx.song.create({
        data: {
          albumId: parsed.data.albumId,
          title: parsed.data.title,
          trackNumber: parsed.data.trackNumber,
          isTitleTrack: parsed.data.isTitleTrack,
        },
      });
      if (parsed.data.credits.length)
        await tx.credit.createMany({
          data: parsed.data.credits.map((credit) => ({
            songId: created.id,
            idolId: credit.idolId,
            role: credit.role,
          })),
        });
      return created;
    });
    revalidatePath("/admin/albums");
    return { success: true, data: { id: song.id } };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Gagal membuat lagu." };
  }
}
