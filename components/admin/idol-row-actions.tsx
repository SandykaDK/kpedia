"use client";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

import { deleteIdol } from "@/actions/idol-actions";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

export function IdolRowActions({ id, name }: { id: string; name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function confirmDelete() {
    startTransition(async () => {
      const result = await deleteIdol(id);
      if (result.success) {
        toast.success("Data berhasil dihapus!");
        setIsOpen(false);
      } else {
        toast.error(result.error || "Gagal menghapus data.");
      }
    });
  }

  return <><div className="flex items-center justify-end gap-2"><Link aria-label="Edit" className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2 text-blue-400 transition-all hover:scale-105 hover:bg-blue-500/20" href={`/admin/idols/${id}/edit`} title="Edit"><PencilSquareIcon className="h-4 w-4" /></Link><button aria-label="Delete" className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-400 transition-all hover:scale-105 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60" disabled={isPending} onClick={() => setIsOpen(true)} title="Delete" type="button"><TrashIcon className="h-4 w-4" /></button></div><DeleteConfirmDialog description="Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan." isLoading={isPending} isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={confirmDelete} title={`Hapus ${name}?`} /></>;
}
