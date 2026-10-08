import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "default",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" }) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-rose-500 text-white hover:bg-rose-400",
        variant === "outline" && "border border-zinc-700 text-zinc-200 hover:bg-zinc-800",
        variant === "ghost" && "text-zinc-400 hover:bg-zinc-800 hover:text-white",
        className,
      )}
      {...props}
    />
  );
}
