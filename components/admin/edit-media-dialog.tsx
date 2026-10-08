"use client";

import { useState, useTransition } from "react";
import { toast } from "react-toastify";

import { updateMediaEmbed } from "@/actions/media-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export type MediaTargetType = "IDOL" | "GROUP" | "ALBUM" | "SONG";

export type MediaTarget = {
  id: string;
  name: string;
  type: MediaTargetType;
};

export type EditableMediaEmbed = {
  id: string;
  entityType: MediaTargetType;
  entityId: string;
  provider: "YOUTUBE" | "SPOTIFY";
  url: string;
  title: string | null;
};

export function EditMediaDialog({
  embed,
  targets,
  open,
  onOpenChange,
}: {
  embed: EditableMediaEmbed;
  targets: MediaTarget[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [targetType, setTargetType] = useState<MediaTargetType>(embed.entityType);
  const [targetId, setTargetId] = useState(embed.entityId);
  const [provider, setProvider] = useState<EditableMediaEmbed["provider"]>(embed.provider);
  const [url, setUrl] = useState(embed.url);
  const [title, setTitle] = useState(embed.title ?? "");

  const availableTargets = targets.filter((target) => target.type === targetType);

  function changeTargetType(value: MediaTargetType) {
    setTargetType(value);
    const firstTarget = targets.find((target) => target.type === value);
    setTargetId(firstTarget?.id ?? "");
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateMediaEmbed(embed.id, {
        targetType,
        targetId,
        provider,
        url,
        title: title.trim() || null,
      });
      if (result.success) {
        toast.success("Media berhasil diperbarui!");
        onOpenChange(false);
      } else {
        toast.error(result.error || "Gagal memperbarui media.");
      }
    });
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit media embed</DialogTitle>
          <DialogDescription>Perbarui target, provider, URL, atau judul media.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 p-6" onSubmit={submit}>
          <label className="text-sm text-zinc-400">
            Tipe target
            <select
              className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white"
              onChange={(event) => changeTargetType(event.target.value as MediaTargetType)}
              value={targetType}
            >
              <option value="IDOL">IDOL</option>
              <option value="GROUP">GROUP</option>
              <option value="ALBUM">ALBUM</option>
              <option value="SONG">SONG</option>
            </select>
          </label>
          <label className="text-sm text-zinc-400">
            Target
            <select
              className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white"
              onChange={(event) => setTargetId(event.target.value)}
              required
              value={targetId}
            >
              {availableTargets.map((target) => (
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
              onChange={(event) =>
                setProvider(event.target.value as EditableMediaEmbed["provider"])
              }
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
              onChange={(event) => setUrl(event.target.value)}
              required
              type="url"
              value={url}
            />
          </label>
          <label className="text-sm text-zinc-400">
            Judul
            <Input
              className="mt-2"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              disabled={pending}
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Batal
            </Button>
            <Button disabled={pending || !targetId} type="submit">
              {pending ? "Menyimpan..." : "Simpan perubahan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
