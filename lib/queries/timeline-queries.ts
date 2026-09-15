import "server-only";

import { prisma } from "@/lib/prisma";

export async function getTimelineEvents(entityType: "IDOL" | "GROUP" | "ALBUM" | "SONG", entityId: string) {
  return prisma.timelineEvent.findMany({ where: { entityType, entityId }, orderBy: { eventDate: "asc" } });
}
