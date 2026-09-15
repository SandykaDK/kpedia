import { z } from "zod";

export const addTimelineEventSchema = z.object({
  entityType: z.enum(["IDOL", "GROUP", "ALBUM", "SONG"]),
  entityId: z.string().min(1),
  category: z.enum(["DEBUT", "COMEBACK", "AWARD", "CONCERT", "MILITARY", "OTHER"]).default("OTHER"),
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().max(2000).optional().nullable(),
  eventDate: z.coerce.date(),
  sourceUrl: z.string().url().optional().nullable(),
});

export type AddTimelineEventInput = z.input<typeof addTimelineEventSchema>;
