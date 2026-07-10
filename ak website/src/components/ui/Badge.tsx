import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "accent";
}

export function Badge({ className = "", variant = "primary", ...props }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center px-4 py-1 text-xs font-bold rounded-full tracking-widest uppercase transition-all duration-300";

  const variants = {
    primary: "bg-slate-100 text-slate-800 border border-slate-200/50",
    secondary: "bg-white text-slate-700 border border-slate-100 shadow-sm",
    accent:
      "bg-rose-50 text-rose-600 border border-rose-100 shadow-[0_2px_10px_rgba(225,29,72,0.06)]",
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
