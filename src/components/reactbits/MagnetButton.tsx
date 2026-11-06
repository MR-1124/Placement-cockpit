import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface MagnetButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  magnetStrength?: number;
  className?: string;
}

export const MagnetButton: React.FC<MagnetButtonProps> = ({
  children,
  magnetStrength = 0.3,
  className = "",
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = (clientX - centerX) * magnetStrength;
    const deltaY = (clientY - centerY) * magnetStrength;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={onClick}
      className={cn(
        "cursor-pointer inline-flex items-center justify-center font-semibold rounded-xl transition-colors active:scale-95",
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};
