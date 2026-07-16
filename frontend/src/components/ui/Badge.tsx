import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = ({ className, variant = "neutral", children, ...props }: BadgeProps) => {
  const baseStyles = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold select-none border";

  const variants: Record<BadgeVariant, string> = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    danger: "bg-rose-50 text-rose-700 border-rose-100",
    info: "bg-blue-50 text-blue-700 border-blue-100",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={twMerge(clsx(baseStyles, variants[variant], className))}
      {...props}
    >
      {children}
    </span>
  );
};
