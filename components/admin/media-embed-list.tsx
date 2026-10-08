"use client";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

import { deleteMediaEmbed } from "@/actions/media-actions";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import {
  EditMediaDialog,
  type EditableMediaEmbed,
  type MediaTarget,
} from "@/components/admin/edit-media-dialog";
import { Button } from "@/components/ui/button";

type MediaEmbedListItem = EditableMediaEmbed & {
  externalId: string;
};

export function MediaEmbedList({
  embeds,
  targets,
}: {
  embeds: MediaEmbedListItem[];
  targets: MediaTarget[];
}) {
  const [editing, setEditing] = useState<MediaEmbedListItem | null>(null);
  const [deleting, setDeleting] = useState<MediaEmbedListItem | null>(null);
  const [pending, startTransition] = useTransition();
  const targetNames = new Map(
    targets.map((target) => [`${target.type}:${target.id}`, target.name]),
  );

  function confirmDelete() {
    if (!deleting) return;

    startTransition(async () => {
      const result = await deleteMediaEmbed(deleting.id);
      if (result.success) {
        toast.success("Media berhasil dihapus!");
        setDeleting(null);
      } else {
        toast.error(result.error || "Gagal menghapus media.");
      }
    });
  }

  if (!embeds.length) {
    return (
      <p className="rounded-xl border border-zinc-800 p-6 text-sm text-zinc-500">
        Belum ada media embed.
      </p>
    );
  }

  return (
    <>
      <div className="mt-4 space-y-3">
        {embeds.map((embed) => (
          <article
            className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4"
            key={embed.id}
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{embed.title ?? embed.externalId}</p>
              <p className="mt-1 truncate text-sm text-zinc-500">
                {embed.provider} ·{" "}
                {targetNames.get(`${embed.entityType}:${embed.entityId}`) ?? embed.entityId}
              </p>
              <a
                className="mt-1 block truncate text-xs text-zinc-600 hover:text-zinc-400"
                href={embed.url}
                rel="noreferrer"
                target="_blank"
              >
                {embed.url}
              </a>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                aria-label="Edit media"
                className="border border-blue-500/20 bg-blue-500/10 p-2 text-blue-400 hover:bg-blue-500/20"
                onClick={() => setEditing(embed)}
                title="Edit media"
                type="button"
                variant="outline"
              >
                <PencilSquareIcon className="size-4" />
              </Button>
              <Button
                aria-label="Hapus media"
                className="border border-rose-500/20 bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500/20"
                onClick={() => setDeleting(embed)}
                title="Hapus media"
                type="button"
                variant="outline"
              >
                <TrashIcon className="size-4" />
              </Button>
            </div>
          </article>
        ))}
      </div>
      {editing ? (
        <EditMediaDialog
          embed={editing}
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
          open
          targets={targets}
        />
      ) : null}
      <DeleteConfirmDialog
        description="Media embed ini akan dihapus secara permanen."
        isLoading={pending}
        isOpen={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title={`Hapus ${deleting?.title ?? "media embed"}?`}
      />
    </>
  );
}
