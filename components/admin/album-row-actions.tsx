"use client";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

import { deleteAlbum } from "@/actions/album-actions";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { EditAlbumDialog, type EditableAlbum } from "@/components/admin/edit-album-dialog";
import { SongManagerDialog, type SongManagerSong } from "@/components/admin/song-manager-dialog";
import { Button } from "@/components/ui/button";

export function AlbumRowActions({
  album,
  songs,
}: {
  album: EditableAlbum & { groupName: string | null; idolName: string | null };
  songs: SongManagerSong[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirmDelete() {
    startTransition(async () => {
      const result = await deleteAlbum(album.id);
      if (!result.success) {
        toast.error(result.error || "Gagal menghapus album.");
        return;
      }
      toast.success("Album berhasil dihapus!");
      setConfirmingDelete(false);
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
        <SongManagerDialog albumId={album.id} albumTitle={album.title} songs={songs} />
        <Button
          aria-label={`Edit album ${album.title}`}
          className="border-blue-500/20 bg-blue-500/10 p-2 text-blue-400 hover:bg-blue-500/20"
          onClick={() => setEditing(true)}
          title="Edit album"
          type="button"
          variant="outline"
        >
          <PencilSquareIcon className="size-4" />
        </Button>
        <Button
          aria-label={`Hapus album ${album.title}`}
          className="border-rose-500/20 bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500/20"
          onClick={() => setConfirmingDelete(true)}
          title="Hapus album"
          type="button"
          variant="outline"
        >
          <TrashIcon className="size-4" />
        </Button>
      </div>
      {editing ? <EditAlbumDialog album={album} onOpenChange={setEditing} open={editing} /> : null}
      <DeleteConfirmDialog
        description="Album, seluruh lagu di dalamnya, dan media embed terkait akan dihapus permanen."
        isLoading={pending}
        isOpen={confirmingDelete}
        onClose={() => setConfirmingDelete(false)}
        onConfirm={confirmDelete}
        title={`Hapus album ${album.title}?`}
      />
    </>
  );
}
