import Link from "next/link";
import { getAdminGroups } from "@/lib/queries/admin-queries";
import { Badge } from "@/components/ui/badge";
import { GroupRowActions } from "@/components/admin/group-row-actions";

export default async function AdminGroupsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const groups = await getAdminGroups(q);
  return (
    <main className="p-6 text-zinc-100 sm:p-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-rose-400">Catalog</p>
          <h1 className="mt-2 text-3xl font-semibold">Groups</h1>
        </div>
        <Link
          className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium"
          href="/admin/groups/new"
        >
          + New group
        </Link>
      </div>
      <form className="mt-8 flex gap-2" method="get">
        <input
          className="h-10 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm"
          defaultValue={q}
          name="q"
          placeholder="Search group..."
        />
        <button className="rounded-lg border border-zinc-700 px-4 text-sm" type="submit">
          Search
        </button>
      </form>
      <div className="mt-5 overflow-auto rounded-xl border border-zinc-800 bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 text-xs uppercase text-zinc-500">
            <tr>
              <th className="p-4">Group</th>
              <th className="p-4">Type</th>
              <th className="p-4">Agency</th>
              <th className="p-4">Members</th>
              <th className="p-4">Status</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {groups.map((group) => (
              <tr key={group.id}>
                <td className="p-4 font-medium">
                  {group.name}
                  <p className="text-xs text-zinc-500">/{group.slug}</p>
                </td>
                <td className="p-4 text-zinc-400">{group.type}</td>
                <td className="p-4 text-zinc-400">{group.agency?.name ?? "-"}</td>
                <td className="p-4 text-zinc-400">{group._count.memberships}</td>
                <td className="p-4">
                  <Badge variant={group.isActive ? "success" : "muted"}>
                    {group.isActive ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </td>
                <td className="p-4">
                  <GroupRowActions id={group.id} name={group.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
