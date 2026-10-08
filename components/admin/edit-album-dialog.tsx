"use client";

import { useState, useTransition } from "react";
import { toast } from "react-toastify";

import { updateAlbum } from "@/actions/album-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export type EditableAlbum = {
  id: string;
  title: string;
  type: string;
  releaseDate: string | null;
  coverImageUrl: string | null;
};

const albumTypes = [
  "SINGLE",
  "EP",
  "MINI_ALBUM",
  "FULL_ALBUM",
  "REPACKAGE",
  "OST",
  "COMPILATION",
  "LIVE",
  "OTHER",
] as const;

export function EditAlbumDialog({
  album,
  open,
  onOpenChange,
}: {
  album: EditableAlbum;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [title, setTitle] = useState(album.title);
  const [type, setType] = useState(album.type);
  const [releaseDate, setReleaseDate] = useState(album.releaseDate ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(album.coverImageUrl ?? "");
  const [pending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateAlbum(album.id, {
        title,
        type,
        releaseDate: releaseDate || null,
        coverImageUrl: coverImageUrl.trim() || null,
      });
      if (!result.success) {
        toast.error(result.error || "Gagal memperbarui album.");
        return;
      }

      toast.success("Album berhasil diperbarui!");
      onOpenChange(false);
    });
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit album</DialogTitle>
          <DialogDescription>
            Perbarui judul, tipe, tanggal rilis, atau cover album.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 p-6" onSubmit={submit}>
          <label className="text-sm text-zinc-400">
            Judul
            <Input
              className="mt-2"
              onChange={(event) => setTitle(event.target.value)}
              required
              value={title}
            />
          </label>
          <label className="text-sm text-zinc-400">
            Tipe album
            <select
              className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white"
              onChange={(event) => setType(event.target.value)}
              value={type}
            >
              {albumTypes.map((albumType) => (
                <option key={albumType} value={albumType}>
                  {albumType}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-zinc-400">
            Tanggal rilis
            <Input
              className="mt-2"
              onChange={(event) => setReleaseDate(event.target.value)}
              type="date"
              value={releaseDate}
            />
          </label>
          <label className="text-sm text-zinc-400">
            URL cover album
            <Input
              className="mt-2"
              onChange={(event) => setCoverImageUrl(event.target.value)}
              placeholder="https://..."
              type="url"
              value={coverImageUrl}
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
            <Button disabled={pending} type="submit">
              {pending ? "Menyimpan..." : "Simpan perubahan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
