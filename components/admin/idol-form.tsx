"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { toast } from "react-toastify";

import { createIdol, updateIdol } from "@/actions/idol-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createIdolSchema, type CreateIdolInput } from "@/lib/validations/idol";
import { formatDateForInput } from "@/lib/utils/date";

type IdolFormValues = Omit<CreateIdolInput, "birthDate" | "debutDate"> & {
  birthDate: string;
  debutDate: string;
};

type IdolInitialValues = Partial<IdolFormValues> & { id?: string };

type IdolFormProps = {
  initial?: IdolInitialValues;
  agencies?: { id: string; name: string }[];
};

function toServerDate(value: unknown): string | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date
    ? value
    : typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${value}T00:00:00.000Z`)
      : new Date(String(value));

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function IdolForm({ initial, agencies = [] }: IdolFormProps) {
  const form = useForm<IdolFormValues>({
    resolver: zodResolver(createIdolSchema) as never,
    defaultValues: {
      slug: "",
      stageName: "",
      legalName: "",
      koreanName: "",
      gender: "UNKNOWN",
      status: "ACTIVE",
      agencyId: "",
      profileUrl: "",
      profileImageUrl: "",
      biography: "",
      birthPlace: "",
      nationality: "",
      generation: undefined,
      ...initial,
      birthDate: formatDateForInput(initial?.birthDate),
      debutDate: formatDateForInput(initial?.debutDate),
    },
  });
  const [pending, startTransition] = useTransition();

  const submit = form.handleSubmit((values) => {
    startTransition(async () => {
      const payload: CreateIdolInput = {
        ...values,
        birthDate: toServerDate(values.birthDate),
        debutDate: toServerDate(values.debutDate),
        agencyId: values.agencyId || null,
      };
      const result = initial?.id
        ? await updateIdol(initial.id, payload)
        : await createIdol(payload);

      if (result.success) {
        toast.success("Data berhasil disimpan!");
      } else {
        toast.error(result.error || "Gagal menyimpan data.");
      }
      if (!result.success && result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, errors]) => {
          form.setError(field as keyof IdolFormValues, { message: errors?.[0] });
        });
      }
    });
  });

  return (
    <form className="grid max-w-3xl gap-5" onSubmit={submit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm text-zinc-400">Slug<Input {...form.register("slug")} className="mt-2" /></label>
        <label className="text-sm text-zinc-400">Stage name<Input {...form.register("stageName")} className="mt-2" /></label>
        <label className="text-sm text-zinc-400">Nama asli<Input {...form.register("legalName")} className="mt-2" /></label>
        <label className="text-sm text-zinc-400">Nama Korea<Input {...form.register("koreanName")} className="mt-2" /></label>
        <label className="text-sm text-zinc-400">Gender<select {...form.register("gender")} className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white"><option value="UNKNOWN">Unknown</option><option value="FEMALE">Female</option><option value="MALE">Male</option><option value="NON_BINARY">Non-binary</option><option value="OTHER">Other</option></select></label>
        <label className="text-sm text-zinc-400">Status<select {...form.register("status")} className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white"><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="MILITARY">Military</option><option value="HIATUS">Hiatus</option><option value="UNKNOWN">Unknown</option></select></label>
        <label className="text-sm text-zinc-400">Tanggal lahir<Input className="mt-2 cursor-pointer" {...form.register("birthDate", { onChange: (event) => form.setValue("birthDate", event.target.value, { shouldDirty: true, shouldValidate: true }) })} onClick={(event) => event.currentTarget.showPicker?.()} type="date" /></label>
        <label className="text-sm text-zinc-400">Tanggal debut<Input className="mt-2 cursor-pointer" {...form.register("debutDate", { onChange: (event) => form.setValue("debutDate", event.target.value, { shouldDirty: true, shouldValidate: true }) })} onClick={(event) => event.currentTarget.showPicker?.()} type="date" /></label>
        <label className="text-sm text-zinc-400">Agensi<select {...form.register("agencyId")} className="mt-2 h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white"><option value="">Independen</option>{agencies.map((agency) => <option key={agency.id} value={agency.id}>{agency.name}</option>)}</select></label>
        <label className="text-sm text-zinc-400">Generasi<Input {...form.register("generation", { valueAsNumber: true })} className="mt-2" type="number" /></label>
        <label className="text-sm text-zinc-400">Tempat lahir<Input {...form.register("birthPlace")} className="mt-2" /></label>
        <label className="text-sm text-zinc-400">Kebangsaan<Input {...form.register("nationality")} className="mt-2" /></label>
      </div>
      <label className="text-sm text-zinc-400">Biografi<Textarea {...form.register("biography")} className="mt-2" /></label>
      <div className="flex items-center gap-3"><Button disabled={pending} type="submit">{pending ? "Menyimpan..." : "Simpan idol"}</Button></div>
    </form>
  );
}
