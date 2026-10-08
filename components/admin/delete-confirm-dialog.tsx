"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type DeleteConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  isLoading?: boolean;
};

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
  isLoading = false,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog
      onOpenChange={(open) => {
        if (!open && !isLoading) onClose();
      }}
      open={isOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-amber-500/10 p-2 text-amber-400">
              <ExclamationTriangleIcon className="size-6" />
            </div>
            <div>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="rounded-lg border border-slate-700 bg-transparent px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
            disabled={isLoading}
            onClick={onClose}
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
          >
            {isLoading ? "Menghapus..." : "Ya, Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
