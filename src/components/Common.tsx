import React from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  glow = false,
  onClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      className={`glass-panel glass-panel-hover rounded-xl p-6 ${glow ? "glow-active" : ""} ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  subLabel?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  label = "",
  subLabel = ""
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-white/[0.04]"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-accentPrimary"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold font-mono tracking-tight text-white">{percentage}%</span>
        {label && <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">{label}</span>}
      </div>
      {subLabel && <span className="mt-2 text-xs text-slate-400 font-medium">{subLabel}</span>}
    </div>
  );
};

interface ProgressBarProps {
  percentage: number;
  height?: number;
  className?: string;
  showText?: boolean;
  colorClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  height = 6,
  className = "",
  showText = false,
  colorClass = "bg-accentPrimary"
}) => {
  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center mb-1 text-xs font-mono">
          <span className="text-slate-400">Progress</span>
          <span className="text-white font-bold">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className="w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.02]"
        style={{ height }}
      >
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};
