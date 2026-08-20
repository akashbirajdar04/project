import React from "react";
import { cn } from "../../lib/utils";

export const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

    const variants = {
      default: "bg-slate-900 text-slate-50 shadow-sm hover:bg-slate-800/90 hover:shadow",
      primary: "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 hover:shadow",
      secondary: "bg-slate-100 text-slate-900 shadow-xs hover:bg-slate-200/80",
      outline: "border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300",
      ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      destructive: "bg-rose-600 text-white shadow-sm hover:bg-rose-500 hover:shadow",
      success: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-500 hover:shadow",
      link: "text-indigo-600 underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-11 rounded-lg px-6 text-base",
      icon: "h-9 w-9 p-0 flex items-center justify-center",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variants[variant] || variants.default, sizes[size] || sizes.default, className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
