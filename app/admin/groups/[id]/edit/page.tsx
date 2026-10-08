import { notFound } from "next/navigation";
import { GroupForm } from "@/components/admin/group-form";
import {
  getAdminAgencies,
  getAdminGroupOptions,
  getAdminIdolOptions,
} from "@/lib/queries/admin-queries";
import { prisma } from "@/lib/prisma";
export default async function EditGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [group, agencies, groups, idols] = await Promise.all([
    prisma.group.findUnique({ where: { id } }),
    getAdminAgencies(),
    getAdminGroupOptions(),
    getAdminIdolOptions(),
  ]);
  if (!group) notFound();
  return (
    <main className="p-6 text-zinc-100 sm:p-10">
      <h1 className="text-3xl font-semibold">Edit {group.name}</h1>
      <div className="mt-8">
        <GroupForm
          agencies={agencies.map(({ id: agencyId, name }) => ({ id: agencyId, name }))}
          groups={groups
            .filter((item) => item.id !== id)
            .map(({ id: groupId, name }) => ({ id: groupId, name }))}
          idols={idols.map(({ id: idolId, stageName }) => ({ id: idolId, stageName }))}
          initial={{
            ...group,
            debutDate: group.debutDate?.toISOString().slice(0, 10),
            disbandDate: group.disbandDate?.toISOString().slice(0, 10),
          }}
        />
      </div>
    </main>
  );
}
