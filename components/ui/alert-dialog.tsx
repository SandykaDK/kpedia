"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogCancel = AlertDialogPrimitive.Cancel;
export const AlertDialogAction = AlertDialogPrimitive.Action;

export function AlertDialogContent({ className, ...props }: ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>) {
  return <AlertDialogPrimitive.Portal><AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" /><AlertDialogPrimitive.Content className={cn("fixed left-1/2 top-1/2 z-50 w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-800 bg-slate-950 p-6 text-slate-50 shadow-2xl", className)} {...props} /></AlertDialogPrimitive.Portal>;
}

export function AlertDialogHeader({ className, ...props }: ComponentPropsWithoutRef<"div">) { return <div className={cn("space-y-2", className)} {...props} />; }
export function AlertDialogFooter({ className, ...props }: ComponentPropsWithoutRef<"div">) { return <div className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />; }
export function AlertDialogTitle({ className, ...props }: ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>) { return <AlertDialogPrimitive.Title className={cn("text-lg font-semibold", className)} {...props} />; }
export function AlertDialogDescription({ className, ...props }: ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>) { return <AlertDialogPrimitive.Description className={cn("text-sm leading-6 text-slate-400", className)} {...props} />; }
