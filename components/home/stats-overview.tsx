import { BookOpen, Building2, CheckCircle2, Users } from "lucide-react";

type Stats = { idols: number; groups: number; agencies: number; approvedContributions: number };

const items = [
  ["Idols indexed", "idols", Users, "text-fuchsia-300"],
  ["Groups tracked", "groups", BookOpen, "text-cyan-300"],
  ["Agencies", "agencies", Building2, "text-amber-300"],
  ["Approved updates", "approvedContributions", CheckCircle2, "text-emerald-300"],
] as const;

export function StatsOverview({ stats }: { stats: Stats }) {
  return <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{items.map(([label, key, Icon, color]) => <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]" key={key}><Icon className={`size-5 ${color}`} /><p className="mt-5 text-sm text-zinc-500 dark:text-zinc-400">{label}</p><p className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">{stats[key]}</p></div>)}</section>;
}
