"use client";

import { Badge } from "@/components/ui/badge";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function display(value: JsonValue | undefined) {
  if (value === undefined) return "Tidak ada";
  if (typeof value === "object" && value !== null) return JSON.stringify(value, null, 2);
  return String(value);
}

export function EditDiffViewer({ current, proposed }: { current: JsonValue | null; proposed: JsonValue }) {
  const before = current && typeof current === "object" && !Array.isArray(current) ? current as Record<string, JsonValue> : {};
  const after = proposed && typeof proposed === "object" && !Array.isArray(proposed) ? proposed as Record<string, JsonValue> : {};
  const keys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)]));

  return <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950"><div className="grid grid-cols-2 border-b border-zinc-800"><div className="px-4 py-3 text-sm font-medium text-zinc-400">Before</div><div className="border-l border-zinc-800 px-4 py-3 text-sm font-medium text-emerald-300">After</div></div><div className="divide-y divide-zinc-800">{keys.length ? keys.map((key) => { const changed = display(before[key]) !== display(after[key]); return <div className="grid grid-cols-2" key={key}><div className={`space-y-1 px-4 py-4 ${changed ? "bg-rose-500/5" : ""}`}><p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{key}</p><pre className="whitespace-pre-wrap break-words font-sans text-sm text-zinc-300">{display(before[key])}</pre></div><div className={`space-y-1 border-l border-zinc-800 px-4 py-4 ${changed ? "bg-emerald-500/5" : ""}`}><div className="flex items-center gap-2"><p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{key}</p>{changed ? <Badge variant="success">changed</Badge> : null}</div><pre className="whitespace-pre-wrap break-words font-sans text-sm text-zinc-300">{display(after[key])}</pre></div></div>; }) : <p className="p-6 text-sm text-zinc-500">Tidak ada field untuk dibandingkan.</p>}</div></div>;
}
