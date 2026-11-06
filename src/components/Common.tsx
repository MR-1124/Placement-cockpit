import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  spotlight?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  glow = false,
  spotlight = true,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotlight || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      whileHover={onClick ? { y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      className={`${spotlight ? "spotlight-card" : "glass-panel"} p-6 sm:p-8 rounded-2xl relative overflow-hidden transition-all duration-300 ${
        glow ? "glow-active" : ""
      } ${
        onClick
          ? "cursor-pointer hover:border-white/[0.18] hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.7)]"
          : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const SpotlightCard: React.FC<GlassCardProps> = (props) => {
  return <GlassCard {...props} spotlight={true} />;
};

interface ShimmerSkeletonProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  rounded?: string;
}

export const ShimmerSkeleton: React.FC<ShimmerSkeletonProps> = ({
  className = "",
  height = "1rem",
  width = "100%",
  rounded = "rounded-lg"
}) => {
  return (
    <div
      className={`shimmer-skeleton ${rounded} ${className}`}
      style={{ height, width }}
    />
  );
};

interface MetricBadgeProps {
  label: string;
  value: string | number;
  variant?: "emerald" | "amber" | "rose" | "violet" | "blue" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({
  label,
  value,
  variant = "violet",
  icon,
  className = ""
}) => {
  const variantClasses = {
    emerald: "neon-pill-emerald",
    amber: "neon-pill-amber",
    rose: "neon-pill-rose",
    violet: "neon-pill-violet",
    blue: "neon-pill-blue",
    neutral: "bg-white/[0.04] border border-white/[0.08] text-slate-300"
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold tracking-wide ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="text-slate-400 font-normal uppercase text-[10px] tracking-wider">
        {label}:
      </span>
      <span className="font-bold">{value}</span>
    </div>
  );
};

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  subLabel?: string;
  colorClass?: string;
  glow?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  label = "",
  subLabel = "",
  colorClass = "text-accentPrimary",
  glow = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-white/[0.06]"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`stroke-current ${colorClass}`}
          style={glow ? { filter: "drop-shadow(0 0 6px currentColor)" } : undefined}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-2xl font-bold font-mono tracking-tight text-white drop-shadow-sm">
          {Math.round(percentage)}%
        </span>
        {label && (
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold">
            {label}
          </span>
        )}
      </div>
      {subLabel && (
        <span className="mt-2 text-xs text-slate-400 font-medium">{subLabel}</span>
      )}
    </div>
  );
};

interface ProgressBarProps {
  percentage: number;
  height?: number;
  className?: string;
  showText?: boolean;
  label?: string;
  colorClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  height = 6,
  className = "",
  showText = false,
  label = "Progress",
  colorClass = "bg-accentPrimary"
}) => {
  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-mono">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider">{label}</span>
          <span className="text-white font-bold">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className="w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.05] p-[1px]"
        style={{ height: height + 2 }}
      >
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
};

export const AnimatedCounter: React.FC<{ value: number; duration?: number }> = ({
  value,
  duration = 1
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const start = 0;
    const end = value;
    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const totalSteps = 40;
    const stepTime = (duration * 1000) / totalSteps;
    const stepIncrement = (end - start) / totalSteps;

    let current = start;
    const timer = setInterval(() => {
      current += stepIncrement;
      if ((stepIncrement > 0 && current >= end) || (stepIncrement < 0 && current <= end)) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span className="font-mono">{displayValue.toLocaleString()}</span>;
};
