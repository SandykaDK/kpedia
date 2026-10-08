"use client";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

import { deleteGroup } from "@/actions/group-actions";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

export function GroupRowActions({ id, name }: { id: string; name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Link
          aria-label="Edit"
          className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2 text-blue-400 transition-all hover:scale-105 hover:bg-blue-500/20"
          href={`/admin/groups/${id}/edit`}
          title="Edit"
        >
          <PencilSquareIcon className="h-4 w-4" />
        </Link>
        <button
          aria-label="Delete"
          className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-400 transition-all hover:scale-105 hover:bg-rose-500/20"
          onClick={() => setIsOpen(true)}
          title="Delete"
          type="button"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
      <DeleteConfirmDialog
        isLoading={isPending}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() =>
          startTransition(async () => {
            const result = await deleteGroup(id);
            if (result.success) {
              toast.success("Data berhasil dihapus!");
              setIsOpen(false);
            } else toast.error(result.error || "Gagal menghapus data.");
          })
        }
        title={`Hapus ${name}?`}
      />
    </>
  );
}
