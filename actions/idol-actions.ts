"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canEditWiki } from "@/lib/permissions";
import { createIdolSchema, updateIdolSchema } from "@/lib/validations/idol";
import type { ActionResponse } from "@/types/action";

function validationError(error: ZodError): ActionResponse<never> {
  return {
    success: false,
    error: "Data yang dikirim tidak valid.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

function toSnapshot(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

async function getAuthorizedUser() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return null;
  }

  const user = await prisma.user.findUnique({ where: { email } });

  return user && canEditWiki(user) ? user : null;
}

export async function createIdol(input: unknown): Promise<ActionResponse<{ id: string; slug: string }>> {
  const user = await getAuthorizedUser();

  if (!user) {
    return { success: false, error: "Anda tidak memiliki izin untuk mengubah data wiki." };
  }

  const parsed = createIdolSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const idol = await tx.idol.create({ data: parsed.data });

      await tx.revisionHistory.create({
        data: {
          entityType: "IDOL",
          entityId: idol.id,
          revisionNo: 1,
          action: "CREATE",
          snapshot: toSnapshot(idol),
          changedById: user.id,
        },
      });

      return idol;
    });

    revalidatePath("/idols");
    revalidatePath(`/idols/${result.slug}`);

    return { success: true, data: { id: result.id, slug: result.slug } };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, error: "Slug idol sudah digunakan." };
    }

    console.error("createIdol failed", error);
    return { success: false, error: "Gagal membuat data idol." };
  }
}

export async function updateIdol(id: string, input: unknown): Promise<ActionResponse<{ id: string; slug: string }>> {
  const user = await getAuthorizedUser();

  if (!user) {
    return { success: false, error: "Anda tidak memiliki izin untuk mengubah data wiki." };
  }

  const parsed = updateIdolSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.idol.findUnique({ where: { id } });

      if (!current) {
        throw new Error("IDOL_NOT_FOUND");
      }

      const idol = await tx.idol.update({
        where: { id },
        data: parsed.data,
      });

      const latest = await tx.revisionHistory.findFirst({
        where: { entityType: "IDOL", entityId: id },
        orderBy: { revisionNo: "desc" },
        select: { revisionNo: true },
      });

      await tx.revisionHistory.create({
        data: {
          entityType: "IDOL",
          entityId: idol.id,
          revisionNo: (latest?.revisionNo ?? 0) + 1,
          action: "UPDATE",
          snapshot: toSnapshot(idol),
          changedById: user.id,
        },
      });

      return idol;
    });

    revalidatePath("/idols");
    revalidatePath(`/idols/${result.slug}`);

    return { success: true, data: { id: result.id, slug: result.slug } };
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "IDOL_NOT_FOUND") {
      return { success: false, error: "Idol tidak ditemukan." };
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, error: "Slug idol sudah digunakan." };
    }

    console.error("updateIdol failed", error);
    return { success: false, error: "Gagal memperbarui data idol." };
  }
}

export async function deleteIdol(id: string): Promise<ActionResponse<{ id: string }>> {
  const user = await getAuthorizedUser();

  if (!user) {
    return { success: false, error: "Anda tidak memiliki izin untuk mengubah data wiki." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const current = await tx.idol.findUnique({ where: { id } });

      if (!current) {
        throw new Error("IDOL_NOT_FOUND");
      }

      const latest = await tx.revisionHistory.findFirst({
        where: { entityType: "IDOL", entityId: id },
        orderBy: { revisionNo: "desc" },
        select: { revisionNo: true },
      });

      await tx.revisionHistory.create({
        data: {
          entityType: "IDOL",
          entityId: id,
          revisionNo: (latest?.revisionNo ?? 0) + 1,
          action: "DELETE",
          snapshot: toSnapshot(current),
          changedById: user.id,
        },
      });

      await tx.idol.delete({ where: { id } });
    });

    revalidatePath("/idols");
    return { success: true, data: { id } };
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "IDOL_NOT_FOUND") {
      return { success: false, error: "Idol tidak ditemukan." };
    }

    console.error("deleteIdol failed", error);
    return { success: false, error: "Gagal menghapus data idol." };
  }
}
