import { redirect } from "next/navigation";

import { CancelEditRequestButton } from "@/components/moderation/cancel-edit-request-button";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUserEditRequests } from "@/lib/queries/edit-request-queries";

const statusLabels = { PENDING: "Menunggu", APPROVED: "Disetujui", REJECTED: "Ditolak", CANCELLED: "Dibatalkan" } as const;

export default async function ContributionsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true, name: true } });
  if (!user) redirect("/login");
  const { items, pagination } = await getUserEditRequests(user.id);

  return <main className="min-h-screen bg-zinc-950 px-5 py-8 text-zinc-100 sm:px-8 sm:py-12"><div className="mx-auto max-w-5xl space-y-8"><header><p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-400">Dashboard</p><h1 className="mt-2 text-4xl font-semibold text-white">Kontribusi saya</h1><p className="mt-2 text-zinc-500">Pantau usulan perubahan data wiki yang pernah Anda kirim.</p></header><section className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"><div className="hidden grid-cols-[1fr_0.7fr_0.7fr_1fr_auto] gap-4 border-b border-zinc-800 px-5 py-3 text-xs uppercase tracking-wider text-zinc-500 sm:grid"><span>Target</span><span>Operasi</span><span>Status</span><span>Dikirim</span><span /></div>{items.length ? items.map((item) => <article className="grid gap-3 border-b border-zinc-800 px-5 py-5 last:border-0 sm:grid-cols-[1fr_0.7fr_0.7fr_1fr_auto] sm:items-center" key={item.id}><div><p className="font-medium text-white">{item.targetType}</p><p className="mt-1 truncate text-xs text-zinc-500">{item.targetId}</p></div><span className="text-sm text-zinc-400">{item.operation}</span><Badge variant={item.status === "APPROVED" ? "success" : item.status === "PENDING" ? "default" : "muted"}>{statusLabels[item.status]}</Badge><time className="text-sm text-zinc-500" dateTime={item.createdAt.toISOString()}>{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(item.createdAt)}</time>{item.status === "PENDING" ? <CancelEditRequestButton requestId={item.id} /> : <span />}</article>) : <div className="px-5 py-16 text-center text-zinc-500">Belum ada usulan perubahan.</div>}</section><p className="text-sm text-zinc-500">Menampilkan {items.length} dari {pagination.total} usulan.</p></div></main>;
}
