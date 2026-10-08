import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:pointer-events-none disabled:opacity-50",
        size === "default" && "h-10 px-4",
        size === "sm" && "h-9 px-3",
        variant === "default" && "bg-rose-500 text-white hover:bg-rose-400",
        variant === "outline" && "border border-zinc-700 text-zinc-200 hover:bg-zinc-800",
        variant === "ghost" && "text-zinc-400 hover:bg-zinc-800 hover:text-white",
        className,
      )}
      {...props}
    />
  );
}
