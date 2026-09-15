import { z } from "zod";

export const addMediaEmbedSchema = z.object({
  entityType: z.enum(["IDOL", "GROUP", "ALBUM", "SONG"]),
  entityId: z.string().min(1),
  provider: z.enum(["YOUTUBE", "SPOTIFY"]),
  url: z.string().url(),
  title: z.string().trim().max(180).optional().nullable(),
});

export type AddMediaEmbedInput = z.input<typeof addMediaEmbedSchema>;
