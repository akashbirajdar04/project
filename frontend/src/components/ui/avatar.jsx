import React from "react";
import { cn } from "../../lib/utils";

export function Avatar({ className, children, ...props }) {
  return (
    <div
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarFallback({ className, children, ...props }) {
  return (
    <div
      className={cn("flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 uppercase", className)}
      {...props}
    >
      {children}
    </div>
  );
}
