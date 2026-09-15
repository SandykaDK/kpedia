"use client";

import { useState, useTransition } from "react";

import { approveWikiEditRequest, rejectWikiEditRequest } from "@/actions/moderation-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function ReviewActions({ requestId }: { requestId: string }) {
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const review = (approve: boolean) => startTransition(async () => { const result = approve ? await approveWikiEditRequest(requestId, note) : await rejectWikiEditRequest(requestId, note); setMessage(result.success ? "Tindakan berhasil diproses." : result.error); });
  return <div className="flex flex-wrap gap-3"><Dialog><DialogTrigger asChild><Button disabled={isPending} variant="outline">Tolak</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Tolak usulan</DialogTitle><DialogDescription>Berikan alasan yang akan dilihat oleh pengaju.</DialogDescription></DialogHeader><div className="space-y-4 px-6 py-5"><Textarea minLength={10} onChange={(event) => setNote(event.target.value)} placeholder="Alasan penolakan..." value={note} /><div className="flex justify-end gap-3"><DialogClose asChild><Button variant="outline">Batal</Button></DialogClose><DialogClose asChild><Button disabled={isPending || note.trim().length < 10} onClick={() => review(false)}>Tolak usulan</Button></DialogClose></div></div></DialogContent></Dialog><Button disabled={isPending} onClick={() => { if (window.confirm("Setujui usulan ini?")) review(true); }}>Setujui</Button>{message ? <p className="basis-full text-sm text-zinc-400">{message}</p> : null}</div>;
}
