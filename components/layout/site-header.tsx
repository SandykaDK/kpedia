import Link from "next/link";

import { auth } from "@/auth";
import { UserMenu } from "@/components/layout/user-menu";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="flex items-center justify-between">
      <Link className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white" href="/">
        K<span className="text-fuchsia-500">Pedia</span>
      </Link>
      <nav className="flex items-center gap-2 text-sm">
        <Link
          className="hidden px-3 py-2 text-zinc-500 transition hover:text-zinc-950 dark:hover:text-white sm:block"
          href="/search"
        >
          Explore
        </Link>
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <Link
            className="rounded-full border border-fuchsia-400/70 bg-transparent px-4 py-2 font-medium text-fuchsia-400 transition hover:bg-fuchsia-400/10"
            href="/login"
          >
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
