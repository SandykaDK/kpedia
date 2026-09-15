import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { EditDiffViewer, type JsonValue } from "@/components/moderation/edit-diff-viewer";
import { ReviewActions } from "@/components/moderation/review-actions";
import { Badge } from "@/components/ui/badge";
import { canModerate } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getEditRequestById } from "@/lib/queries/moderation-queries";

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || !canModerate(user)) redirect("/");
  const { id } = await params;
  const detail = await getEditRequestById(id);
  if (!detail) notFound();
  const current = JSON.parse(JSON.stringify(detail.currentSnapshot)) as JsonValue | null;
  const proposed = JSON.parse(JSON.stringify(detail.request.payload)) as JsonValue;

  return <main className="min-h-screen bg-zinc-950 px-5 py-8 text-zinc-100 sm:px-8 sm:py-12"><div className="mx-auto max-w-5xl space-y-8"><Link className="text-sm text-zinc-500 hover:text-white" href="/admin/edits">← Kembali ke edit queue</Link><header><div className="flex flex-wrap items-center gap-3"><h1 className="text-3xl font-semibold text-white">Review {detail.request.targetType}</h1><Badge variant={detail.request.status === "PENDING" ? "default" : detail.request.status === "APPROVED" ? "success" : "muted"}>{detail.request.status}</Badge></div><p className="mt-2 text-zinc-500">Operasi {detail.request.operation} · {detail.request.targetId}</p></header><section className="grid gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5 sm:grid-cols-3"><div><p className="text-xs uppercase tracking-wider text-zinc-500">Pengaju</p><p className="mt-1 text-sm text-white">{detail.request.requester.name ?? "Tanpa nama"}</p><p className="text-xs text-zinc-500">{detail.request.requester.email}</p></div><div><p className="text-xs uppercase tracking-wider text-zinc-500">Dikirim</p><p className="mt-1 text-sm text-zinc-300">{new Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(detail.request.createdAt)}</p></div><div><p className="text-xs uppercase tracking-wider text-zinc-500">Alasan</p><p className="mt-1 text-sm leading-6 text-zinc-300">{detail.request.reason}</p></div></section><section className="space-y-4"><h2 className="text-xl font-semibold text-white">Perbandingan perubahan</h2><EditDiffViewer current={current} proposed={proposed} /></section>{detail.request.status === "PENDING" ? <section className="flex justify-end border-t border-zinc-800 pt-6"><ReviewActions requestId={detail.request.id} /></section> : detail.request.reviewNote ? <p className="border-t border-zinc-800 pt-6 text-sm text-zinc-400">Catatan reviewer: {detail.request.reviewNote}</p> : null}</div></main>;
}
