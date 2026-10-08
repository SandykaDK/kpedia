"use client";

import { LogOut, ShieldCheck } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserMenuUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

export function UserMenu({ user }: { user: UserMenuUser }) {
  const displayName = user.name?.trim() || user.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();
  const canAccessAdmin = user.role === "ADMIN" || user.role === "MODERATOR";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Buka menu profil"
        className="flex size-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 p-0 transition hover:border-fuchsia-400"
      >
        <Avatar className="size-9 border-0">
          <AvatarImage alt={displayName} src={user.image ?? ""} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-3 py-3">
          <p className="truncate text-sm font-medium text-white">{displayName}</p>
          <p className="truncate text-xs text-zinc-500">{user.email ?? ""}</p>
          <p className="mt-1 text-[11px] uppercase tracking-wider text-fuchsia-300">
            {user.role ?? "USER"}
          </p>
        </div>
        <DropdownMenuSeparator />
        {canAccessAdmin ? (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <ShieldCheck className="size-4 text-zinc-400" />
              Panel Admin
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void signOut({ callbackUrl: "/" })}>
          <LogOut className="size-4 text-zinc-400" />
          Keluar / Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
