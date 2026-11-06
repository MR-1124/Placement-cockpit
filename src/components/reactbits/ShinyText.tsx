import React from "react";
import { cn } from "../../lib/utils";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4,
  className,
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent bg-gradient-to-r from-slate-200 via-white to-slate-400 bg-[length:200%_100%]",
        !disabled && "animate-shiny-text",
        className
      )}
      style={{ animationDuration }}
    >
      {text}
    </span>
  );
};
