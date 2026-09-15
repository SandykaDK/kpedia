import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "outline" | "success" | "muted";

const variantClasses: Record<BadgeVariant, string> = {
  default: "border-transparent bg-rose-500 text-white",
  secondary: "border-transparent bg-zinc-800 text-zinc-200",
  outline: "border-zinc-700 bg-transparent text-zinc-300",
  success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  muted: "border-zinc-700 bg-zinc-900 text-zinc-400",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLDivElement> & { variant?: BadgeVariant }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
