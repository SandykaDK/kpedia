"use client";

import { useTransition } from "react";

import { cancelWikiEditRequest } from "@/actions/edit-request-actions";
import { Button } from "@/components/ui/button";

export function CancelEditRequestButton({ requestId }: { requestId: string }) {
  const [isPending, startTransition] = useTransition();
  return <Button disabled={isPending} onClick={() => startTransition(() => void cancelWikiEditRequest(requestId))} type="button" variant="outline">{isPending ? "Membatalkan..." : "Batalkan"}</Button>;
}
