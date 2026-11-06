import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border border-accentPrimary/30 bg-accentPrimary/10 text-accentPrimary shadow-[0_0_12px_rgba(var(--accent-rgb),0.15)]",
        secondary:
          "border border-white/10 bg-white/[0.05] text-slate-300",
        destructive:
          "border border-rose-500/30 bg-rose-500/10 text-rose-400",
        outline:
          "border border-white/15 text-slate-400",
        emerald:
          "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
        amber:
          "border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
        rose:
          "border border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]",
        cyan:
          "border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]",
        violet:
          "border border-violet-500/30 bg-violet-500/10 text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.15)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
