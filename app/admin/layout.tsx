import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { canModerate } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login?callbackUrl=/admin");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });
  if (!user || !canModerate(user)) redirect("/");
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 lg:flex-row">
      <AdminSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
