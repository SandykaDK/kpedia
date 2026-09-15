import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/auth";

export const metadata = {
  title: "Login | KPedia",
  description: "Masuk ke KPedia untuk mengelola kontribusi wiki.",
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard/contributions");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 py-12 text-zinc-100">
      <section className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl sm:p-8">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-400">KPedia</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Selamat datang kembali</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">Masuk untuk melihat dan mengelola kontribusi wiki Anda.</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-xs text-zinc-600">Gunakan akun yang dibuat oleh seed database lokal.</p>
      </section>
    </main>
  );
}
