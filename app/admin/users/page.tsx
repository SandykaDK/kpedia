import { Prisma, UserRole, UserStatus } from "@prisma/client";

import { AdminFilterBar } from "@/components/admin/admin-filter-bar";
import { prisma } from "@/lib/prisma";

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isEnumValue<T extends string>(
  values: readonly T[],
  value: string | undefined,
): value is T {
  return value !== undefined && values.some((item) => item === value);
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    role?: string | string[];
    status?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const query = firstParam(params.q)?.trim();
  const role = firstParam(params.role);
  const status = firstParam(params.status);
  const conditions: Prisma.UserWhereInput[] = [];
  if (query) {
    conditions.push({
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    });
  }
  if (isEnumValue(Object.values(UserRole), role)) {
    conditions.push({ role });
  }
  if (isEnumValue(Object.values(UserStatus), status)) {
    conditions.push({ status });
  }

  const users = await prisma.user.findMany({
    where: conditions.length ? { AND: conditions } : undefined,
    select: { id: true, name: true, email: true, role: true, status: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <main className="p-6 text-zinc-100 sm:p-10">
      <h1 className="text-3xl font-semibold">Users</h1>
      <AdminFilterBar
        filters={[
          {
            key: "role",
            label: "Role",
            placeholder: "All roles",
            options: Object.values(UserRole).map((value) => ({ value, label: value })),
          },
          {
            key: "status",
            label: "Status",
            placeholder: "All statuses",
            options: Object.values(UserStatus).map((value) => ({ value, label: value })),
          },
        ]}
        searchLabel="Search users"
        searchPlaceholder="Search user name or email..."
      />
      <div className="mt-8 overflow-auto rounded-xl border border-zinc-800 bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 text-xs uppercase text-zinc-500">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-4">{user.name ?? "-"}</td>
                <td className="p-4 text-zinc-400">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
