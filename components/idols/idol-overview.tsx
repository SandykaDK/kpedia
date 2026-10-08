import type { getIdolBySlug } from "@/lib/queries/idol-queries";

type Idol = NonNullable<Awaited<ReturnType<typeof getIdolBySlug>>>;

function formatDate(date: Date | null) {
  return date
    ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(
        date,
      )
    : "Belum tersedia";
}

export function IdolOverview({ idol }: { idol: Idol }) {
  const details = [
    ["Nama asli", idol.legalName],
    ["Tempat lahir", idol.birthPlace],
    ["Tanggal lahir", formatDate(idol.birthDate)],
    ["Kebangsaan", idol.nationality],
    ["Tanggal debut", formatDate(idol.debutDate)],
  ] as const;

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-400">Tentang idol</p>
        <h2 className="text-2xl font-semibold text-white">Ringkasan</h2>
        <p className="max-w-prose leading-7 text-zinc-400">
          {idol.biography ?? "Biografi idol ini belum tersedia."}
        </p>
      </div>
      <dl className="divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-900 px-5">
        {details.map(([label, value]) => (
          <div className="grid grid-cols-[minmax(7rem,0.7fr)_1fr] gap-4 py-3 text-sm" key={label}>
            <dt className="text-zinc-500">{label}</dt>
            <dd className="text-zinc-200">{value || "Belum tersedia"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
