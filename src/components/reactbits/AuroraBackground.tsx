import React from "react";
import { cn } from "../../lib/utils";

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden bg-[#09090b] transition-bg",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={cn(
            "filter blur-[80px] opacity-25 pointer-events-none absolute -inset-[10px]",
            "[--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]",
            "[--aurora:repeating-linear-gradient(100deg,var(--accent-color)_10%,#3b82f6_15%,var(--accent-color)_20%,#06b6d4_25%,#8b5cf6_30%)]",
            "[background-image:var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%]",
            "animate-aurora"
          )}
        />
      </div>
      {children}
    </div>
  );
};
