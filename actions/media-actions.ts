"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { canEditWiki } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { isAllowedMediaUrl } from "@/lib/utils/media-validator";
import { addMediaEmbedSchema } from "@/lib/validations/media";
import type { ActionResponse } from "@/types/action";

function youtubeId(url: URL) {
  if (url.hostname === "youtu.be") return url.pathname.slice(1).split("/")[0];
  if (url.hostname.includes("youtube.com"))
    return url.searchParams.get("v") ?? url.pathname.split("/").filter(Boolean).at(-1) ?? null;
  return null;
}

function spotifyParts(url: URL) {
  const parts = url.pathname.split("/").filter(Boolean);
  const index = parts.findIndex((part) => ["track", "album", "playlist", "episode"].includes(part));
  return index >= 0 && parts[index + 1] ? { type: parts[index], id: parts[index + 1] } : null;
}

async function editor() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  return user && canEditWiki(user) ? user : null;
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
  const media =
    parsed.data.provider === "YOUTUBE"
      ? (() => {
          const id = youtubeId(source);
          return id
            ? {
                externalId: id,
                url: `https://www.youtube.com/embed/${id}`,
                thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
              }
            : null;
        })()
      : (() => {
          const parts = spotifyParts(source);
          return parts
            ? {
                externalId: parts.id,
                url: `https://open.spotify.com/embed/${parts.type}/${parts.id}`,
                thumbnailUrl: null,
              }
            : null;
        })();
  if (!media)
    return {
      success: false,
      error: `URL ${parsed.data.provider === "YOUTUBE" ? "YouTube" : "Spotify"} tidak valid.`,
    };
  try {
    const embed = await prisma.mediaEmbed.create({ data: { ...parsed.data, ...media } });
    revalidatePath(
      parsed.data.entityType === "IDOL"
        ? `/idols/${parsed.data.entityId}`
        : `/groups/${parsed.data.entityId}`,
    );
    return { success: true, data: { id: embed.id } };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
      return { success: false, error: "Embed media tersebut sudah terdaftar." };
    console.error("addMediaEmbed failed", error);
    return { success: false, error: "Gagal menambahkan media embed." };
  }
}
