import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(2, "Slug minimal 2 karakter")
  .max(80, "Slug maksimal 80 karakter")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug harus menggunakan format kebab-case");

const optionalDateSchema = z.coerce.date().optional().nullable();

const optionalUrlSchema = z.string().trim().url("URL tidak valid").optional().nullable();

export const createIdolSchema = z.object({
  slug: slugSchema,
  stageName: z.string().trim().min(1, "Stage name wajib diisi").max(120),
  legalName: z.string().trim().max(160).optional().nullable(),
  koreanName: z.string().trim().max(160).optional().nullable(),
  gender: z.enum(["FEMALE", "MALE", "NON_BINARY", "OTHER", "UNKNOWN"]).default("UNKNOWN"),
  birthDate: optionalDateSchema,
  status: z.enum(["ACTIVE", "INACTIVE", "MILITARY", "HIATUS", "UNKNOWN"]).default("ACTIVE"),
  debutDate: optionalDateSchema,
  agencyId: z.string().cuid("Agency ID tidak valid").optional().nullable(),
  profileUrl: optionalUrlSchema,
  profileImageUrl: optionalUrlSchema,
  biography: z.string().max(10000).optional().nullable(),
  birthPlace: z.string().max(160).optional().nullable(),
  nationality: z.string().max(100).optional().nullable(),
  generation: z.coerce.number().int().min(1).max(10).optional().nullable(),
});

export const updateIdolSchema = createIdolSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, "Minimal satu field harus diubah");

export type CreateIdolInput = z.input<typeof createIdolSchema>;
export type UpdateIdolInput = z.input<typeof updateIdolSchema>;
