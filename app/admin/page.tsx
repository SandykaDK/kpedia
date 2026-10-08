import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="p-6 text-zinc-100 sm:p-10">
      <p className="text-xs uppercase tracking-[0.2em] text-rose-400">Control room</p>
      <h1 className="mt-2 text-4xl font-semibold">Admin dashboard</h1>
      <p className="mt-3 max-w-xl text-zinc-500">
        Kelola data utama KPedia secara langsung melalui navigasi CMS.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium" href="/admin/idols">
          Kelola Idol
        </Link>
        <Link className="rounded-lg border border-zinc-700 px-4 py-2 text-sm" href="/admin/groups">
          Kelola Group
        </Link>
      </div>
    </main>
  );
}
