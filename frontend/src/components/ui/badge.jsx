import React from "react";
import { cn } from "../../lib/utils";

export function Badge({ className, variant = "default", children, ...props }) {
  const variants = {
    default: "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-800",
    secondary: "border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200/80",
    outline: "border-slate-200 text-slate-700 hover:bg-slate-50",
    destructive: "border-transparent bg-rose-50 text-rose-700 border border-rose-200",
    success: "border-transparent bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "border-transparent bg-amber-50 text-amber-700 border border-amber-200",
    info: "border-transparent bg-indigo-50 text-indigo-700 border border-indigo-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
