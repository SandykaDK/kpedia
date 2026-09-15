import { z } from "zod";

export const submitEditRequestSchema = z.object({
  targetType: z.enum(["IDOL", "GROUP", "AGENCY", "ALBUM", "SONG"]),
  targetId: z.string().trim().min(1, "Target ID wajib diisi").max(100),
  operation: z.enum(["CREATE", "UPDATE", "DELETE"]),
  payload: z.record(z.string(), z.unknown()).refine(
    (value) => Object.keys(value).length > 0,
    "Payload perubahan tidak boleh kosong",
  ),
  reason: z.string().trim().min(10, "Alasan minimal 10 karakter").max(2000),
});

export type SubmitEditRequestInput = z.input<typeof submitEditRequestSchema>;
