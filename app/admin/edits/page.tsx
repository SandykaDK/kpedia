import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { canModerate } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getPendingEditRequests, type ModerationParams } from "@/lib/queries/moderation-queries";

type PageProps = { searchParams: Promise<{ status?: string; targetType?: string; page?: string }> };
const statuses = ["PENDING", "APPROVED", "REJECTED", "CANCELLED"];
const targets = ["IDOL", "GROUP", "AGENCY", "ALBUM", "SONG"];

export default async function ModerationQueuePage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || !canModerate(user)) redirect("/");
  const query = await searchParams;
  const params: ModerationParams = { status: query.status, targetType: query.targetType, page: Number(query.page) || 1, limit: 20 };
  const { items, pagination } = await getPendingEditRequests(params);

  return <main className="min-h-screen bg-zinc-950 px-5 py-8 text-zinc-100 sm:px-8 sm:py-12"><div className="mx-auto max-w-6xl space-y-8"><header><p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-400">Moderation</p><h1 className="mt-2 text-4xl font-semibold text-white">Edit queue</h1><p className="mt-2 text-zinc-500">Tinjau kontribusi komunitas sebelum masuk ke data wiki.</p></header><form className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:flex-row" method="get"><select className="h-10 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-white" defaultValue={query.status ?? "PENDING"} name="status"><option value="">Semua status</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select><select className="h-10 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-white" defaultValue={query.targetType ?? ""} name="targetType"><option value="">Semua target</option>{targets.map((target) => <option key={target} value={target}>{target}</option>)}</select><button className="h-10 rounded-lg bg-rose-500 px-4 text-sm font-medium text-white hover:bg-rose-400" type="submit">Terapkan filter</button></form><section className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"><Table><TableHeader><TableRow><TableHead>Target</TableHead><TableHead>Operasi</TableHead><TableHead>Pengaju</TableHead><TableHead>Status</TableHead><TableHead>Dikirim</TableHead><TableHead /></TableRow></TableHeader><TableBody>{items.length ? items.map((item) => <TableRow key={item.id}><TableCell><p className="font-medium text-white">{item.targetType}</p><p className="mt-1 max-w-40 truncate text-xs text-zinc-500">{item.targetId}</p></TableCell><TableCell>{item.operation}</TableCell><TableCell><p>{item.requester.name ?? "Tanpa nama"}</p><p className="text-xs text-zinc-500">{item.requester.email}</p></TableCell><TableCell><Badge variant={item.status === "PENDING" ? "default" : item.status === "APPROVED" ? "success" : "muted"}>{item.status}</Badge></TableCell><TableCell className="whitespace-nowrap text-zinc-500">{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(item.createdAt)}</TableCell><TableCell><Link className="text-sm font-medium text-rose-300 hover:text-rose-200" href={`/admin/edits/${item.id}`}>Review</Link></TableCell></TableRow>) : <TableRow><TableCell className="py-16 text-center" colSpan={6}>Tidak ada usulan pada filter ini.</TableCell></TableRow>}</TableBody></Table></section><p className="text-sm text-zinc-500">{pagination.total} usulan · halaman {pagination.page} dari {pagination.totalPages}</p></div></main>;
}
