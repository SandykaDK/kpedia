import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 text-center text-zinc-100">
      <div className="max-w-md">
        <p className="text-7xl font-bold text-rose-400">404</p>
        <h1 className="mt-5 text-3xl font-semibold text-white">Stage ini belum ditemukan</h1>
        <p className="mt-3 leading-7 text-zinc-500">
          Halaman yang Anda cari belum masuk ke ensiklopedia KPedia.
        </p>
        <Link
          className="mt-7 inline-flex h-10 items-center justify-center rounded-lg bg-rose-500 px-4 text-sm font-medium text-white hover:bg-rose-400"
          href="/"
        >
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
