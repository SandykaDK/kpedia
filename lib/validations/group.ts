import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(2, "Slug minimal 2 karakter")
  .max(80, "Slug maksimal 80 karakter")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug harus menggunakan format kebab-case");

const optionalDateSchema = z.coerce.date().optional().nullable();

const optionalUrlSchema = z.string().trim().url("URL tidak valid").optional().nullable();

export const createGroupSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(1, "Nama grup wajib diisi").max(160),
  koreanName: z.string().trim().max(160).optional().nullable(),
  type: z.enum(["MAIN_GROUP", "SUB_UNIT", "PROJECT_GROUP", "BAND", "OTHER"]).default("MAIN_GROUP"),
  debutDate: optionalDateSchema,
  isActive: z.boolean().default(true),
  agencyId: z.string().cuid("Agency ID tidak valid").optional().nullable(),
  profileUrl: optionalUrlSchema,
  profileImageUrl: optionalUrlSchema,
  bannerImageUrl: optionalUrlSchema,
  generation: z.coerce.number().int().min(1).max(10).optional().nullable(),
  disbandDate: optionalDateSchema,
  parentGroupId: z.string().cuid().optional().nullable(),
});

export const updateGroupSchema = createGroupSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, "Minimal satu field harus diubah");

export type CreateGroupInput = z.input<typeof createGroupSchema>;
export type UpdateGroupInput = z.input<typeof updateGroupSchema>;
