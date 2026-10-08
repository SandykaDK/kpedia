import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

export function Avatar({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex size-28 shrink-0 overflow-hidden rounded-full border-4 border-zinc-800 bg-zinc-900",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarImage({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

export function AvatarFallback({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex size-full items-center justify-center bg-rose-500/15 text-2xl font-semibold text-rose-300",
        className,
      )}
      {...props}
    />
  );
}
