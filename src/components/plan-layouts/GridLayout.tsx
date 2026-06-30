import React from "react";
import { GlassCard, ProgressBar } from "../Common";
import { ModuleRenderer } from "../ModuleRenderer";
import type { PlanSegment } from "../../data/curriculum";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  CheckSquare,
} from "lucide-react";

interface GridLayoutProps {
  segmentType?: string;
  filteredSegments: PlanSegment[];
  primaryPlan: any;
  getSegmentStatus: (segment: PlanSegment, index: number) => string;
  getSegmentProgress: (segment: PlanSegment) => number;
  toggleExpand: (segmentId: string) => void;
  expandedWeeks: Record<string, boolean>;
  togglePlanWeek: (planId: string, segmentId: string) => void;
}

export const GridLayout: React.FC<GridLayoutProps> = ({
  filteredSegments,
  primaryPlan,
  getSegmentStatus,
  getSegmentProgress,
  toggleExpand,
  expandedWeeks,
  togglePlanWeek
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {filteredSegments.map((segment: PlanSegment, idx: number) => {
        const status = getSegmentStatus(segment, idx);
        const isExpanded = expandedWeeks[segment.id] !== false; // expanded by default
        const progress = getSegmentProgress(segment);
        const isChecked = primaryPlan.completedSegments.includes(segment.id);

        let borderGlow = "border-white/[0.04]";
        let titleColor = "text-slate-300";

        if (status === "completed") {
          borderGlow = "border-accentPrimary/20 shadow-[0_0_15px_rgba(var(--color-accent-primary),0.1)]";
          titleColor = "text-slate-300";
        } else if (status === "active") {
          borderGlow = "border-accentPrimary/50 glow-active shadow-[0_0_20px_rgba(var(--color-accent-primary),0.2)]";
          titleColor = "text-white font-semibold";
        } else if (status === "locked") {
          borderGlow = "border-white/[0.02] opacity-60";
          titleColor = "text-slate-600";
        }

        return (
          <GlassCard
            key={segment.id}
            className={`transition-all duration-300 p-5 ${borderGlow} ${status === "locked" ? "pointer-events-none opacity-60" : ""}`}
          >
            <div
              onClick={() => toggleExpand(segment.id)}
              className="flex flex-col justify-between gap-3 cursor-pointer select-none h-full"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {status === "active" && (
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded border border-accentPrimary/20 bg-accentPrimary/5 text-accentPrimary animate-pulse">
                        Current Focus
                      </span>
                    )}
                    {status === "completed" && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{segment.estimatedTime}</span>
                  </div>
                </div>
                <h3 className={`text-xl font-bold ${titleColor}`}>{segment.title}</h3>
                <p className="text-xs text-slate-400">
                  {segment.focus}
                </p>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                   <span className="text-[10px] text-slate-500 font-mono">Progress</span>
                   <span className="text-xs font-bold text-accentPrimary">{progress}%</span>
                </div>
                <ProgressBar percentage={progress} height={6} />
              </div>

              <div className="flex justify-center mt-2 text-slate-500">
                 {isExpanded ? (
                   <ChevronUp className="w-4 h-4 text-slate-500" />
                 ) : (
                   <ChevronDown className="w-4 h-4 text-slate-500" />
                 )}
              </div>
            </div>

            {isExpanded && (
              <div className="mt-5 pt-5 border-t border-white/[0.06] space-y-5">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                    Milestones
                  </h4>
                  <ul className="space-y-1.5">
                    {segment.goals.map((goal: string, i: number) => (
                      <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                        <span className="text-accentPrimary mt-1">•</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6 pt-4">
                  {segment.modules?.map((mod: any, mIdx: number) => (
                    <ModuleRenderer key={mIdx} module={mod} segmentId={segment.id} />
                  ))}
                </div>

                <div className="pt-4 mt-6 border-t border-white/[0.04] flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlanWeek(primaryPlan.planId, segment.id);
                    }}
                    className={`flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg font-bold border transition-all w-full justify-center ${
                      isChecked
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-accentPrimary text-black font-bold shadow-[0_0_15px_rgba(var(--color-accent-primary),0.4)] hover:scale-[1.02] active:scale-95 border-transparent"
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>{isChecked ? "Segment Logged as Complete" : "Mark Segment Completed"}</span>
                  </button>
                </div>
              </div>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
};
