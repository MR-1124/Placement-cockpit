import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  onClick
}) => {
  return (
    <div
        onClick={onClick}
        className={`glass-panel border border-white/[0.04] rounded-2xl relative overflow-hidden transition-all duration-300 animate-slide-up ${
          onClick ? "cursor-pointer hover:border-white/[0.12] hover:shadow-xl hover:-translate-y-1" : ""
        } ${className}`}
      >
      {children}
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
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  label = "",
  subLabel = "",
  colorClass = "text-accentPrimary"
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
        <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`stroke-current ${colorClass}`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{
              strokeDashoffset: offset,
              transition: "stroke-dashoffset 0.5s ease-out"
            }}
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
        <div
            className={`h-full rounded-full ${colorClass}`}
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%`, transition: "width 0.5s ease-out" }}
          />
      </div>
    </div>
  );
};

