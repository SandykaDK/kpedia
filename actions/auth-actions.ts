"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import type { ActionResponse } from "@/types/action";

export async function loginAction(_previousState: ActionResponse<undefined>, formData: FormData): Promise<ActionResponse<undefined>> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return { success: false, error: "Email dan password wajib diisi." };
  }

  try {
    await signIn("credentials", {
      email: email.trim(),
      password,
      redirectTo: "/dashboard/contributions",
    });
    return { success: true, data: undefined };
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return { success: false, error: "Email atau password tidak valid." };
    }

    throw error;
  }
}
