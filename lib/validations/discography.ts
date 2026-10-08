import { z } from "zod";
export const createAlbumSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1).max(180),
  type: z.enum([
    "SINGLE",
    "EP",
    "MINI_ALBUM",
    "FULL_ALBUM",
    "REPACKAGE",
    "OST",
    "COMPILATION",
    "LIVE",
    "OTHER",
  ]),
  releaseDate: z.coerce.date().optional().nullable(),
  groupId: z.string().cuid().optional().nullable(),
  idolId: z.string().cuid().optional().nullable(),
});
export const createSongSchema = z.object({
  albumId: z.string().cuid(),
  title: z.string().trim().min(1).max(180),
  trackNumber: z.coerce.number().int().positive().optional().nullable(),
  isTitleTrack: z.boolean().default(false),
  credits: z
    .array(
      z.object({
        idolId: z.string().cuid(),
        role: z.enum([
          "VOCAL",
          "RAP",
          "COMPOSER",
          "LYRICIST",
          "PRODUCER",
          "ARRANGER",
          "FEATURED_ARTIST",
          "OTHER",
        ]),
      }),
    )
    .default([]),
});
