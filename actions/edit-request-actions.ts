"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { submitEditRequestSchema } from "@/lib/validations/edit-request";
import type { ActionResponse } from "@/types/action";

function fieldError(error: ZodError): ActionResponse<never> {
  return { success: false, error: "Data pengajuan tidak valid.", fieldErrors: error.flatten().fieldErrors };
}

function toJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

async function currentUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  return prisma.user.findUnique({ where: { email: session.user.email } });
}

export async function submitWikiEditRequest(input: unknown): Promise<ActionResponse<{ id: string }>> {
  const user = await currentUser();
  if (!user) return { success: false, error: "Anda harus login untuk mengajukan perubahan." };

  const parsed = submitEditRequestSchema.safeParse(input);
  if (!parsed.success) return fieldError(parsed.error);

  try {
    const request = await prisma.wikiEditRequest.create({
      data: {
        ...parsed.data,
        payload: toJsonValue(parsed.data.payload),
        requesterId: user.id,
        status: "PENDING",
      },
      select: { id: true },
    });

    revalidatePath("/dashboard/contributions");
    return { success: true, data: request };
  } catch (error: unknown) {
    console.error("submitWikiEditRequest failed", error);
    return { success: false, error: "Gagal menyimpan usulan perubahan." };
  }
}

export async function cancelWikiEditRequest(requestId: string): Promise<ActionResponse<{ id: string }>> {
  const user = await currentUser();
  if (!user) return { success: false, error: "Anda harus login untuk membatalkan usulan." };
  if (!requestId.trim()) return { success: false, error: "Request ID tidak valid." };

  try {
    const result = await prisma.wikiEditRequest.updateMany({
      where: { id: requestId, requesterId: user.id, status: "PENDING" },
      data: { status: "CANCELLED" },
    });
    if (result.count === 0) return { success: false, error: "Usulan tidak ditemukan atau sudah diproses." };
    revalidatePath("/dashboard/contributions");
    return { success: true, data: { id: requestId } };
  } catch (error: unknown) {
    console.error("cancelWikiEditRequest failed", error);
    return { success: false, error: "Gagal membatalkan usulan perubahan." };
  }
}
