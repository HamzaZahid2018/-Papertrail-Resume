import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label className="text-xs font-semibold text-slate-500 block uppercase tracking-wider select-none">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={twMerge(
            clsx(
              "w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-slate-50/50 hover:bg-slate-50",
              {
                "border-slate-200 focus:border-brand-500 focus:ring-brand-500/20": !error,
                "border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50/10": error,
              }
            ),
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-500 font-medium tracking-wide">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span className="text-xs text-slate-400">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
