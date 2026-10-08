"use client";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ListMusic, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

import { createSong, deleteSong, updateSong } from "@/actions/song-actions";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type SongManagerSong = {
  id: string;
  title: string;
  trackNumber: number | null;
  duration: number | null;
  isTitleTrack: boolean;
  lyrics: string | null;
  mediaUrl: string | null;
};

function emptyForm() {
  return {
    title: "",
    trackNumber: "",
    duration: "",
    isTitleTrack: false,
    lyrics: "",
    mediaUrl: "",
  };
}

export function SongManagerDialog({
  albumId,
  albumTitle,
  songs,
}: {
  albumId: string;
  albumTitle: string;
  songs: SongManagerSong[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<SongManagerSong | null>(null);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState(emptyForm);
  const orderedSongs = [...songs].sort(
    (a, b) =>
      (a.trackNumber ?? Number.MAX_SAFE_INTEGER) - (b.trackNumber ?? Number.MAX_SAFE_INTEGER),
  );

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm());
  }

  function editSong(song: SongManagerSong) {
    setEditingId(song.id);
    setForm({
      title: song.title,
      trackNumber: song.trackNumber?.toString() ?? "",
      duration: song.duration?.toString() ?? "",
      isTitleTrack: song.isTitleTrack,
      lyrics: song.lyrics ?? "",
      mediaUrl: song.mediaUrl ?? "",
    });
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const payload = {
        albumId,
        title: form.title,
        trackNumber: form.trackNumber || null,
        duration: form.duration || null,
        isTitleTrack: form.isTitleTrack,
        lyrics: form.lyrics || null,
        mediaUrl: form.mediaUrl.trim() || null,
      };
      const result = editingId ? await updateSong(editingId, payload) : await createSong(payload);

      if (!result.success) {
        toast.error(result.error || "Gagal menyimpan lagu.");
        return;
      }

      toast.success(editingId ? "Lagu berhasil diperbarui!" : "Lagu berhasil ditambahkan!");
      resetForm();
      router.refresh();
    });
  }

  function confirmDelete() {
    if (!deleting) return;
    startTransition(async () => {
      const result = await deleteSong(deleting.id);
      if (!result.success) {
        toast.error(result.error || "Gagal menghapus lagu.");
        return;
      }
      toast.success("Lagu berhasil dihapus!");
      if (editingId === deleting.id) resetForm();
      setDeleting(null);
      router.refresh();
    });
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} type="button" variant="outline">
        <ListMusic className="mr-2 size-4" />
        Kelola Lagu
      </Button>
      <Dialog
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) resetForm();
        }}
        open={open}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kelola lagu · {albumTitle}</DialogTitle>
            <DialogDescription>
              Atur urutan trek, title track, lirik, dan tautan MV/Spotify.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 p-6">
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-white">Daftar trek</h3>
              {orderedSongs.length ? (
                orderedSongs.map((song) => (
                  <article
                    className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3"
                    key={song.id}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {song.trackNumber ? `${song.trackNumber}. ` : ""}
                        {song.title}
                        {song.isTitleTrack ? (
                          <span className="ml-2 text-xs text-rose-400">Title Track</span>
                        ) : null}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {song.duration !== null ? `${song.duration} detik` : "Durasi belum diisi"}
                        {song.mediaUrl ? " · Media terhubung" : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        aria-label={`Edit ${song.title}`}
                        className="border-blue-500/20 bg-blue-500/10 p-2 text-blue-400 hover:bg-blue-500/20"
                        onClick={() => editSong(song)}
                        type="button"
                        variant="outline"
                      >
                        <PencilSquareIcon className="size-4" />
                      </Button>
                      <Button
                        aria-label={`Hapus ${song.title}`}
                        className="border-rose-500/20 bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500/20"
                        onClick={() => setDeleting(song)}
                        type="button"
                        variant="outline"
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  </article>
                ))
              ) : (
                <p className="rounded-lg border border-dashed border-zinc-800 p-4 text-sm text-zinc-500">
                  Belum ada lagu pada album ini.
                </p>
              )}
            </section>
            <form
              className="grid gap-4 border-t border-zinc-800 pt-5 sm:grid-cols-2"
              onSubmit={submit}
            >
              <h3 className="font-semibold text-white sm:col-span-2">
                {editingId ? "Edit lagu" : "Tambah lagu"}
              </h3>
              <label className="text-sm text-zinc-400 sm:col-span-2">
                Judul lagu
                <Input
                  className="mt-2"
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  required
                  value={form.title}
                />
              </label>
              <label className="text-sm text-zinc-400">
                Nomor trek
                <Input
                  className="mt-2"
                  min="1"
                  onChange={(event) => setForm({ ...form, trackNumber: event.target.value })}
                  type="number"
                  value={form.trackNumber}
                />
              </label>
              <label className="text-sm text-zinc-400">
                Durasi (detik)
                <Input
                  className="mt-2"
                  min="1"
                  onChange={(event) => setForm({ ...form, duration: event.target.value })}
                  type="number"
                  value={form.duration}
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-300 sm:col-span-2">
                <input
                  checked={form.isTitleTrack}
                  onChange={(event) => setForm({ ...form, isTitleTrack: event.target.checked })}
                  type="checkbox"
                />
                Title Track
              </label>
              <label className="text-sm text-zinc-400 sm:col-span-2">
                URL YouTube MV / Spotify Track
                <Input
                  className="mt-2"
                  onChange={(event) => setForm({ ...form, mediaUrl: event.target.value })}
                  placeholder="https://youtu.be/... atau https://open.spotify.com/track/..."
                  type="url"
                  value={form.mediaUrl}
                />
              </label>
              <label className="text-sm text-zinc-400 sm:col-span-2">
                Lirik
                <Textarea
                  className="mt-2"
                  onChange={(event) => setForm({ ...form, lyrics: event.target.value })}
                  value={form.lyrics}
                />
              </label>
              <div className="flex gap-2 sm:col-span-2">
                <Button disabled={pending} type="submit">
                  {pending ? "Menyimpan..." : editingId ? "Simpan perubahan" : "Tambah lagu"}
                </Button>
                {editingId ? (
                  <Button disabled={pending} onClick={resetForm} type="button" variant="outline">
                    Batal edit
                  </Button>
                ) : (
                  <Button
                    disabled={pending}
                    onClick={() => setForm(emptyForm())}
                    type="reset"
                    variant="outline"
                  >
                    <PlusIcon className="mr-1 size-4" />
                    Kosongkan
                  </Button>
                )}
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog
        description="Lagu dan media embed yang terhubung dengannya akan dihapus permanen."
        isLoading={pending && deleting !== null}
        isOpen={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title={`Hapus lagu ${deleting?.title ?? ""}?`}
      />
    </>
  );
}
