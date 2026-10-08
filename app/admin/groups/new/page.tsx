import { GroupForm } from "@/components/admin/group-form";
import { getAdminAgencies, getAdminGroups, getAdminIdols } from "@/lib/queries/admin-queries";
export default async function NewGroupPage() {
  const [agencies, groups, idols] = await Promise.all([
    getAdminAgencies(),
    getAdminGroups(),
    getAdminIdols(),
  ]);
  return (
    <main className="p-6 text-zinc-100 sm:p-10">
      <h1 className="text-3xl font-semibold">New group</h1>
      <p className="mt-2 text-zinc-500">Buat group dan susun line-up anggotanya.</p>
      <div className="mt-8">
        <GroupForm
          agencies={agencies.map(({ id, name }) => ({ id, name }))}
          groups={groups.map(({ id, name }) => ({ id, name }))}
          idols={idols.map(({ id, stageName }) => ({ id, stageName }))}
        />
      </div>
    </main>
  );
}
