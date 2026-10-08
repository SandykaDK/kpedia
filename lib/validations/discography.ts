import { z } from "zod";

const optionalDateSchema = z.preprocess(
  (value) => (value === "" || value === null ? null : value),
  z.coerce.date().nullable(),
);
const optionalPositiveIntSchema = z.preprocess(
  (value) => (value === "" || value === null ? null : value),
  z.coerce.number().int().positive().nullable(),
);

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
  releaseDate: optionalDateSchema.optional(),
  coverImageUrl: z.string().trim().url().optional().nullable(),
  groupId: z.string().cuid().optional().nullable(),
  idolId: z.string().cuid().optional().nullable(),
});
export const createSongSchema = z.object({
  albumId: z.string().cuid(),
  title: z.string().trim().min(1).max(180),
  trackNumber: optionalPositiveIntSchema.optional(),
  duration: optionalPositiveIntSchema.optional(),
  isTitleTrack: z.boolean().default(false),
  lyrics: z.string().max(100000).optional().nullable(),
  mediaUrl: z.string().trim().url().optional().nullable(),
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

export const updateAlbumSchema = createAlbumSchema
  .pick({ title: true, type: true, releaseDate: true, coverImageUrl: true })
  .partial()
  .refine((value) => Object.keys(value).length > 0, "Minimal satu field harus diubah");

export const updateSongSchema = createSongSchema
  .omit({ credits: true })
  .partial()
  .refine((value) => Object.keys(value).length > 0, "Minimal satu field harus diubah");
