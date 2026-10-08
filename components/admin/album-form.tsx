"use client";
import { useState, useTransition } from "react";
import { createAlbum } from "@/actions/discography-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export function AlbumForm({
  groups,
  idols,
}: {
  groups: { id: string; name: string }[];
  idols: { id: string; stageName: string }[];
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await createAlbum({
        slug: data.get("slug"),
        title: data.get("title"),
        type: data.get("type"),
        releaseDate: data.get("releaseDate") || null,
        groupId: data.get("groupId") || null,
        idolId: data.get("idolId") || null,
      });
      setMessage(result.success ? "Album tersimpan." : result.error);
    });
  }
  return (
    <form className="grid max-w-3xl gap-5 sm:grid-cols-2" onSubmit={submit}>
      <label className="text-sm text-zinc-400">
        Slug
        <Input className="mt-2" name="slug" required />
      </label>
      <label className="text-sm text-zinc-400">
        Judul
        <Input className="mt-2" name="title" required />
      </label>
      <label className="text-sm text-zinc-400">
        Tipe
        <select
          className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white"
          defaultValue="MINI_ALBUM"
          name="type"
        >
          <option>MINI_ALBUM</option>
          <option>FULL_ALBUM</option>
          <option>EP</option>
          <option>SINGLE</option>
          <option>OST</option>
          <option>OTHER</option>
        </select>
      </label>
      <label className="text-sm text-zinc-400">
        Release date
        <Input className="mt-2" name="releaseDate" type="date" />
      </label>
      <label className="text-sm text-zinc-400">
        Group
        <select
          className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white"
          name="groupId"
        >
          <option value="">Tidak ada</option>
          {groups.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm text-zinc-400">
        Solo idol
        <select
          className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white"
          name="idolId"
        >
          <option value="">Tidak ada</option>
          {idols.map((item) => (
            <option key={item.id} value={item.id}>
              {item.stageName}
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-center gap-3 sm:col-span-2">
        <Button disabled={pending} type="submit">
          {pending ? "Menyimpan..." : "Simpan album"}
        </Button>
        <span className="text-sm text-zinc-500">{message}</span>
      </div>
    </form>
  );
}
