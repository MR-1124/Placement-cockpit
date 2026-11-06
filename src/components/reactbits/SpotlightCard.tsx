import React, { useRef } from "react";
import { cn } from "../../lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlightColor?: string;
  glow?: boolean;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className,
  spotlightColor = "rgba(var(--accent-rgb), 0.14)",
  glow = false,
  ...props
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    divRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    divRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f0f13]/80 backdrop-blur-xl transition-all duration-300",
        "before:pointer-events-none before:absolute before:-inset-px before:rounded-2xl before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
        "before:bg-[radial-gradient(600px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),var(--spotlight-color),transparent_40%)]",
        glow && "shadow-[0_0_25px_rgba(var(--accent-rgb),0.15)] border-accentPrimary/30",
        className
      )}
      style={{ "--spotlight-color": spotlightColor } as React.CSSProperties}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};
