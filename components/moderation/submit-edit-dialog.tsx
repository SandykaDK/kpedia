"use client";

import { FormEvent, useState, useTransition } from "react";

import { submitWikiEditRequest } from "@/actions/edit-request-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type EditTargetType = "IDOL" | "GROUP" | "AGENCY" | "ALBUM" | "SONG";

type SubmitEditDialogProps = {
  targetId: string;
  targetType: EditTargetType;
};

export function SubmitEditDialog({ targetId, targetType }: SubmitEditDialogProps) {
  const [operation, setOperation] = useState<"CREATE" | "UPDATE" | "DELETE">("UPDATE");
  const [payload, setPayload] = useState('{\n  "field": "new value"\n}');
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    let parsedPayload: Record<string, unknown>;

    try {
      const value: unknown = JSON.parse(payload);
      if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("Payload harus berupa object JSON.");
      parsedPayload = value as Record<string, unknown>;
    } catch {
      setMessage("Payload harus berupa JSON object yang valid.");
      return;
    }

    startTransition(async () => {
      const response = await submitWikiEditRequest({ targetType, targetId, operation, payload: parsedPayload, reason });
      if (!response.success) {
        setMessage(response.error);
        return;
      }
      setMessage("Usulan berhasil dikirim untuk ditinjau.");
      setPayload('{\n  "field": "new value"\n}');
      setReason("");
    });
  }

  return <Dialog>
    <DialogTrigger asChild><Button type="button">Usulkan Perubahan</Button></DialogTrigger>
    <DialogContent>
      <DialogHeader><DialogTitle>Usulkan Perubahan</DialogTitle><DialogDescription>Usulan akan ditinjau moderator.</DialogDescription></DialogHeader>
      <form className="space-y-5 px-6 py-5" onSubmit={submit}>
        <div className="grid grid-cols-2 gap-3"><label className="text-sm text-zinc-400">Entitas<Input readOnly value={targetType} /></label><label className="text-sm text-zinc-400">Operasi<select className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-white" onChange={(event) => setOperation(event.target.value as typeof operation)} value={operation}><option value="UPDATE">Update</option><option value="CREATE">Create</option><option value="DELETE">Delete</option></select></label></div>
        <label className="block text-sm text-zinc-400">Target ID<Input readOnly value={targetId} /></label>
        <label className="block text-sm text-zinc-400">Payload JSON<Textarea className="mt-2 font-mono" onChange={(event) => setPayload(event.target.value)} value={payload} /></label>
        <label className="block text-sm text-zinc-400">Alasan perubahan<Textarea className="mt-2" minLength={10} onChange={(event) => setReason(event.target.value)} placeholder="Sertakan sumber atau alasan perubahan..." required value={reason} /></label>
        {message ? <p className="text-sm text-rose-300">{message}</p> : null}
        <div className="flex justify-end gap-3"><DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose><Button disabled={isPending} type="submit">{isPending ? "Mengirim..." : "Kirim usulan"}</Button></div>
      </form>
    </DialogContent>
  </Dialog>;
}
