import "server-only";

import { prisma } from "@/lib/prisma";

export async function getMediaEmbeds(
  entityType: "IDOL" | "GROUP" | "ALBUM" | "SONG",
  entityId: string,
) {
  return prisma.mediaEmbed.findMany({
    where: { entityType, entityId },
    orderBy: { createdAt: "desc" },
  });
}
