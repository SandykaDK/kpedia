import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return <main className="min-h-screen bg-zinc-950 px-5 py-12 sm:px-8"><div className="mx-auto max-w-5xl space-y-8"><Skeleton className="h-4 w-32" /><Skeleton className="h-48 w-full rounded-2xl" /><div className="grid gap-5 sm:grid-cols-3"><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /></div><Skeleton className="h-56 w-full rounded-xl" /></div></main>;
}
