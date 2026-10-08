"use client";
import { useTransition } from "react";
import { toast } from "react-toastify";
import { addTimelineEvent } from "@/actions/timeline-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
export function TimelineForm({
  entities,
}: {
  entities: { id: string; name: string; type: "IDOL" | "GROUP" | "ALBUM" }[];
}) {
  const [pending, startTransition] = useTransition();
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await addTimelineEvent({
        entityType: data.get("entityType"),
        entityId: data.get("entityId"),
        category: data.get("category"),
        title: data.get("title"),
        description: data.get("description"),
        eventDate: data.get("eventDate"),
        sourceUrl: data.get("sourceUrl") || null,
      });
      if (result.success) toast.success("Event timeline berhasil disimpan.");
      else toast.error(result.error || "Gagal menyimpan event timeline.");
    });
  }
  return (
    <form className="grid max-w-3xl gap-5 sm:grid-cols-2" onSubmit={submit}>
      <label className="text-sm text-zinc-400">
        Target
        <select
          className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white"
          name="entityId"
        >
          {entities.map((item) => (
            <option key={`${item.type}-${item.id}`} value={item.id}>
              {item.type} · {item.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm text-zinc-400">
        Entity type
        <select
          className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white"
          name="entityType"
        >
          <option>IDOL</option>
          <option>GROUP</option>
          <option>ALBUM</option>
        </select>
      </label>
      <label className="text-sm text-zinc-400">
        Kategori
        <select
          className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white"
          name="category"
        >
          <option>DEBUT</option>
          <option>COMEBACK</option>
          <option>AWARD</option>
          <option>CONCERT</option>
          <option>MILITARY</option>
          <option>OTHER</option>
        </select>
      </label>
      <label className="text-sm text-zinc-400">
        Tanggal
        <Input className="mt-2" name="eventDate" required type="date" />
      </label>
      <label className="text-sm text-zinc-400 sm:col-span-2">
        Judul
        <Input className="mt-2" name="title" required />
      </label>
      <label className="text-sm text-zinc-400 sm:col-span-2">
        Deskripsi
        <Textarea className="mt-2" name="description" />
      </label>
      <label className="text-sm text-zinc-400 sm:col-span-2">
        Source URL
        <Input className="mt-2" name="sourceUrl" type="url" />
      </label>
      <div className="flex items-center gap-3">
        <Button disabled={pending} type="submit">
          {pending ? "Menyimpan..." : "Simpan event"}
        </Button>
      </div>
    </form>
  );
}
