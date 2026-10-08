import Link from "next/link";

import { getAdminIdols } from "@/lib/queries/admin-queries";
import { Badge } from "@/components/ui/badge";
import { IdolRowActions } from "@/components/admin/idol-row-actions";

export default async function AdminIdolsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const idols = await getAdminIdols(q);

  return (
    <main className="p-6 text-zinc-100 sm:p-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-rose-400">Catalog</p>
          <h1 className="mt-2 text-3xl font-semibold">Idols</h1>
        </div>
        <Link
          className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium"
          href="/admin/idols/new"
        >
          + New idol
        </Link>
      </div>
      <form className="mt-8 flex gap-2" method="get">
        <input
          className="h-10 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm"
          defaultValue={q}
          name="q"
          placeholder="Search idol..."
        />
        <button className="rounded-lg border border-zinc-700 px-4 text-sm" type="submit">
          Search
        </button>
      </form>
      <div className="mt-5 overflow-auto rounded-xl border border-zinc-800 bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 text-xs uppercase text-zinc-500">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Agency</th>
              <th className="p-4">Groups</th>
              <th className="p-4">Status</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {idols.map((idol) => (
              <tr key={idol.id}>
                <td className="p-4">
                  <p className="font-medium">{idol.stageName}</p>
                  <p className="text-xs text-zinc-500">/{idol.slug}</p>
                </td>
                <td className="p-4 text-zinc-400">{idol.agency?.name ?? "-"}</td>
                <td className="p-4 text-zinc-400">
                  {idol.memberships.map((item) => item.group.name).join(", ") || "-"}
                </td>
                <td className="p-4">
                  <Badge variant={idol.status === "ACTIVE" ? "success" : "muted"}>
                    {idol.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <IdolRowActions id={idol.id} name={idol.stageName} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!idols.length ? <p className="p-10 text-center text-zinc-500">No idols found.</p> : null}
      </div>
    </main>
  );
}
