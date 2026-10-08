"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("KPedia application error", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 text-center text-zinc-100">
      <div className="max-w-md">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose-400">KPedia error</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Ada gangguan di panggung</h1>
        <p className="mt-3 leading-7 text-zinc-500">
          Terjadi kesalahan saat memuat halaman. Silakan coba lagi.
        </p>
        <Button className="mt-7" onClick={() => reset()}>
          Coba Lagi
        </Button>
      </div>
    </main>
  );
}
