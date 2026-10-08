"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { createGroup, setGroupMembership, updateGroup } from "@/actions/group-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createGroupSchema, type CreateGroupInput } from "@/lib/validations/group";

type Member = {
  idolId: string;
  position?: string;
  status: "ACTIVE" | "FORMER" | "HIATUS";
  isLeader: boolean;
};
type Values = CreateGroupInput & { members: Member[] };

export function GroupForm({
  agencies,
  groups,
  idols,
  initial,
}: {
  agencies: { id: string; name: string }[];
  groups: { id: string; name: string }[];
  idols: { id: string; stageName: string }[];
  initial?: Partial<CreateGroupInput> & { id?: string };
}) {
  const form = useForm<Values>({
    resolver: zodResolver(createGroupSchema) as never,
    defaultValues: { type: "MAIN_GROUP", isActive: true, members: [], ...initial },
  });
  const members = useFieldArray({ control: form.control, name: "members" });
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const submit = form.handleSubmit((values) =>
    startTransition(async () => {
      const result = initial?.id
        ? await updateGroup(initial.id, values)
        : await createGroup(values);
      if (!result.success) {
        setMessage(result.error);
        return;
      }
      for (const member of values.members)
        await setGroupMembership({ ...member, groupId: result.data.id });
      setMessage("Group dan anggota berhasil disimpan.");
      if (!initial?.id) form.reset({ type: "MAIN_GROUP", isActive: true, members: [] });
    }),
  );
  return (
    <form className="max-w-4xl space-y-6" onSubmit={submit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm text-zinc-400">
          Slug
          <Input {...form.register("slug")} className="mt-2" />
        </label>
        <label className="text-sm text-zinc-400">
          Nama group
          <Input {...form.register("name")} className="mt-2" />
        </label>
        <label className="text-sm text-zinc-400">
          Nama Korea
          <Input {...form.register("koreanName")} className="mt-2" />
        </label>
        <label className="text-sm text-zinc-400">
          Tipe
          <select
            {...form.register("type")}
            className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white"
          >
            <option value="MAIN_GROUP">Main group</option>
            <option value="SUB_UNIT">Sub-unit</option>
            <option value="PROJECT_GROUP">Project group</option>
            <option value="BAND">Band</option>
          </select>
        </label>
        <label className="text-sm text-zinc-400">
          Agensi
          <select
            {...form.register("agencyId")}
            className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white"
          >
            <option value="">Independen</option>
            {agencies.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-zinc-400">
          Parent sub-unit
          <select
            {...form.register("parentGroupId")}
            className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white"
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
          Generasi
          <Input
            {...form.register("generation", { valueAsNumber: true })}
            className="mt-2"
            type="number"
          />
        </label>
        <label className="text-sm text-zinc-400">
          Tanggal debut
          <Input {...form.register("debutDate")} className="mt-2" type="date" />
        </label>
      </div>
      <div className="flex items-center gap-3 text-sm text-zinc-400">
        <input
          {...form.register("isActive", {
            setValueAs: (value) => value === "true" || value === true,
          })}
          defaultChecked
          type="checkbox"
        />{" "}
        Group aktif
      </div>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-white">Anggota</h2>
          <Button
            onClick={() =>
              members.append({ idolId: idols[0]?.id ?? "", status: "ACTIVE", isLeader: false })
            }
            type="button"
            variant="outline"
          >
            + Tambah anggota
          </Button>
        </div>
        {members.fields.map((field, index) => (
          <div
            className="grid gap-3 rounded-xl border border-zinc-800 p-4 sm:grid-cols-[1fr_1fr_1fr_auto]"
            key={field.id}
          >
            <select
              {...form.register(`members.${index}.idolId`)}
              className="h-10 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-white"
            >
              {idols.map((idol) => (
                <option key={idol.id} value={idol.id}>
                  {idol.stageName}
                </option>
              ))}
            </select>
            <Input {...form.register(`members.${index}.position`)} placeholder="Position / role" />
            <select
              {...form.register(`members.${index}.status`)}
              className="h-10 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-white"
            >
              <option value="ACTIVE">Active</option>
              <option value="FORMER">Former</option>
              <option value="HIATUS">Hiatus</option>
            </select>
            <Button onClick={() => members.remove(index)} type="button" variant="ghost">
              Remove
            </Button>
            <label className="flex items-center gap-2 text-xs text-zinc-500">
              <input {...form.register(`members.${index}.isLeader`)} type="checkbox" /> Leader
            </label>
          </div>
        ))}
      </section>
      <div className="flex items-center gap-3">
        <Button disabled={pending} type="submit">
          {pending ? "Menyimpan..." : "Simpan group"}
        </Button>
        {message ? <span className="text-sm text-zinc-400">{message}</span> : null}
      </div>
    </form>
  );
}
