import Link from "next/link";

import { AdminFilterBar } from "@/components/admin/admin-filter-bar";
import { DataTablePagination } from "@/components/admin/data-table-pagination";
import { getAdminIdols } from "@/lib/queries/admin-queries";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { IdolRowActions } from "@/components/admin/idol-row-actions";

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function AdminIdolsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    agencyId?: string | string[];
    groupId?: string | string[];
    status?: string | string[];
    page?: string | string[];
    limit?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const q = firstParam(params.q) ?? "";
  const agencyId = firstParam(params.agencyId) ?? "";
  const groupId = firstParam(params.groupId) ?? "";
  const status = firstParam(params.status) ?? "";
  const page = positiveInteger(firstParam(params.page), 1);
  const limitValue = positiveInteger(firstParam(params.limit), 10);
  const limit = [10, 20, 50].includes(limitValue) ? limitValue : 10;
  const [idols, agencies, groups] = await Promise.all([
    getAdminIdols({ q, agencyId, groupId, status, page, limit }),
    prisma.agency.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.group.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

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
      <AdminFilterBar
        filters={[
          {
            key: "agencyId",
            label: "Agency",
            placeholder: "All agencies",
            options: agencies.map((agency) => ({ value: agency.id, label: agency.name })),
          },
          {
            key: "groupId",
            label: "Group",
            placeholder: "All groups",
            options: groups.map((group) => ({ value: group.id, label: group.name })),
          },
          {
            key: "status",
            label: "Status",
            placeholder: "All statuses",
            options: ["ACTIVE", "INACTIVE", "MILITARY", "HIATUS"].map((value) => ({
              value,
              label: value,
            })),
          },
        ]}
        searchLabel="Search idols"
        searchPlaceholder="Search name or stage name..."
      />
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
            {idols.data.map((idol) => (
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
        {!idols.data.length ? (
          <p className="p-10 text-center text-zinc-500">No idols found.</p>
        ) : null}
      </div>
      <DataTablePagination
        limit={idols.limit}
        page={idols.page}
        totalCount={idols.totalCount}
        totalPages={idols.totalPages}
      />
    </main>
  );
}
