import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-accentPrimary text-black font-bold shadow-lg shadow-accentPrimary/25 hover:bg-accentPrimary/90 hover:shadow-accentPrimary/40 hover:-translate-y-0.5",
        destructive:
          "bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25 hover:border-rose-500/50",
        outline:
          "border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 text-slate-200",
        secondary:
          "bg-white/[0.06] border border-white/10 text-white hover:bg-white/[0.12] hover:border-white/20",
        ghost:
          "text-slate-400 hover:text-white hover:bg-white/[0.06]",
        link:
          "text-accentPrimary underline-offset-4 hover:underline",
        cyber:
          "relative overflow-hidden border border-accentPrimary/40 bg-accentPrimary/10 text-accentPrimary shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)] hover:bg-accentPrimary hover:text-black hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)]",
        glass:
          "bg-[#0f0f13]/70 backdrop-blur-xl border border-white/[0.08] text-slate-200 hover:border-white/20 hover:bg-white/[0.06] shadow-md",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-[11px]",
        lg: "h-11 rounded-xl px-6 text-sm font-bold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
