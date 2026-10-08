"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

import { addMediaEmbed } from "@/actions/media-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { MediaTarget, MediaTargetType } from "@/components/admin/edit-media-dialog";

const targetTypes: MediaTargetType[] = ["IDOL", "GROUP", "ALBUM", "SONG"];

export function AddMediaDialog({ targets }: { targets: MediaTarget[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<MediaTargetType>("IDOL");
  const [targetId, setTargetId] = useState("");
  const [provider, setProvider] = useState<"YOUTUBE" | "SPOTIFY">("YOUTUBE");
  const [pending, startTransition] = useTransition();
  const filteredTargets = targets.filter((target) => target.type === selectedType);

  function changeType(type: MediaTargetType) {
    setSelectedType(type);
    setTargetId("");
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await addMediaEmbed({
        entityType: selectedType,
        entityId: targetId,
        provider,
        url: form.get("url"),
        title: form.get("title") || null,
      });
      if (!result.success) {
        toast.error(result.error || "Gagal menambahkan media embed.");
        return;
      }

      toast.success("Media embed berhasil ditambahkan!");
      setOpen(false);
      setTargetId("");
      router.refresh();
    });
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} type="button">
        <PlusIcon className="mr-2 size-4" />
        Tambah Media
      </Button>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah media embed</DialogTitle>
            <DialogDescription>
              Tambahkan tautan YouTube atau Spotify ke Idol, Grup, Album, atau Lagu.
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-4 p-6" onSubmit={submit}>
            <label className="text-sm text-zinc-400">
              Tipe target
              <select
                className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white"
                onChange={(event) => changeType(event.target.value as MediaTargetType)}
                value={selectedType}
              >
                {targetTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-zinc-400">
              Target
              <select
                className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white"
                disabled={!filteredTargets.length}
                onChange={(event) => setTargetId(event.target.value)}
                required
                value={targetId}
              >
                <option value="" disabled>
                  {filteredTargets.length ? "Pilih target" : "Tidak ada target untuk tipe ini"}
                </option>
                {filteredTargets.map((target) => (
                  <option key={target.id} value={target.id}>
                    {target.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-zinc-400">
              Provider
              <select
                className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white"
                onChange={(event) => setProvider(event.target.value as "YOUTUBE" | "SPOTIFY")}
                value={provider}
              >
                <option value="YOUTUBE">YouTube</option>
                <option value="SPOTIFY">Spotify</option>
              </select>
            </label>
            <label className="text-sm text-zinc-400">
              URL
              <Input
                className="mt-2"
                name="url"
                placeholder="https://youtu.be/... atau Spotify URL"
                required
                type="url"
              />
            </label>
            <label className="text-sm text-zinc-400">
              Judul
              <Input className="mt-2" name="title" />
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                disabled={pending}
                onClick={() => setOpen(false)}
                type="button"
                variant="outline"
              >
                Batal
              </Button>
              <Button disabled={pending || !targetId} type="submit">
                {pending ? "Menyimpan..." : "Simpan media"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
