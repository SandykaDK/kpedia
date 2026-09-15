"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { canEditWiki } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { addTimelineEventSchema } from "@/lib/validations/timeline";
import type { ActionResponse } from "@/types/action";

async function editor() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  return user && canEditWiki(user) ? user : null;
}

export async function addTimelineEvent(input: unknown): Promise<ActionResponse<{ id: string }>> {
  const user = await editor();
  if (!user) return { success: false, error: "Anda tidak memiliki izin mengubah data wiki." };
  const parsed = addTimelineEventSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Data timeline tidak valid.", fieldErrors: parsed.error.flatten().fieldErrors };
  try {
    const event = await prisma.timelineEvent.create({ data: parsed.data });
    revalidatePath(parsed.data.entityType === "IDOL" ? `/idols/${parsed.data.entityId}` : `/groups/${parsed.data.entityId}`);
    return { success: true, data: { id: event.id } };
  } catch (error: unknown) {
    console.error("addTimelineEvent failed", error);
    return { success: false, error: "Gagal menambahkan timeline event." };
  }
}
