"use client";

import { useActionState } from "react";

import { loginAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState = { success: false, error: "" } as const;

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <label className="block text-sm text-zinc-400">
        Email
        <Input autoComplete="email" className="mt-2" name="email" placeholder="admin@kpedia.local" required type="email" />
      </label>
      <label className="block text-sm text-zinc-400">
        Password
        <Input autoComplete="current-password" className="mt-2" name="password" placeholder="Masukkan password" required type="password" />
      </label>
      {state.error ? <p className="text-sm text-rose-300" role="alert">{state.error}</p> : null}
      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? "Memeriksa..." : "Masuk"}
      </Button>
    </form>
  );
}
