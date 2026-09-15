import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi"),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET minimal 32 karakter"),
  SEED_ADMIN_PASSWORD: z.string().min(1).optional(),
  SEED_USER_PASSWORD: z.string().min(1).optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL harus berupa URL valid"),
});

export const serverEnv = serverSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,
  SEED_USER_PASSWORD: process.env.SEED_USER_PASSWORD,
});

export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

export const env = { ...serverEnv, ...clientEnv };
