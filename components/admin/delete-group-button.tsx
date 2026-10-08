"use client";
import { useTransition } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { deleteGroup } from "@/actions/group-actions";
import { Button } from "@/components/ui/button";
export function DeleteGroupButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      aria-label="Delete"
      className="border border-rose-500/20 bg-rose-500/10 p-2 text-rose-400 transition-all hover:scale-105 hover:bg-rose-500/20"
      disabled={pending}
      onClick={() => {
        if (window.confirm("Hapus group ini?"))
          startTransition(async () => {
            const result = await deleteGroup(id);
            if (result.success) toast.success("Data berhasil dihapus.");
            else toast.error(result.error || "Gagal menghapus data.");
          });
      }}
      title="Delete"
      type="button"
      variant="outline"
    >
      <TrashIcon className="h-4 w-4" />
    </Button>
  );
}
