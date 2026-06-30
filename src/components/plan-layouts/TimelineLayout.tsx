import React from "react";
import { GlassCard, ProgressBar } from "../Common";
import { ModuleRenderer } from "../ModuleRenderer";
import type { PlanSegment } from "../../data/curriculum";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Lock,
  CheckSquare,
} from "lucide-react";

interface TimelineLayoutProps {
  segmentType?: string;
  filteredSegments: PlanSegment[];
  primaryPlan: any;
  getSegmentStatus: (segment: PlanSegment, index: number) => string;
  getSegmentProgress: (segment: PlanSegment) => number;
  toggleExpand: (segmentId: string) => void;
  expandedWeeks: Record<string, boolean>;
  togglePlanWeek: (planId: string, segmentId: string) => void;
}

export const TimelineLayout: React.FC<TimelineLayoutProps> = ({
  segmentType,
  filteredSegments,
  primaryPlan,
  getSegmentStatus,
  getSegmentProgress,
  toggleExpand,
  expandedWeeks,
  togglePlanWeek
}) => {
  return (
    <div className="relative border-l border-white/[0.06] ml-4 pl-6 md:ml-6 md:pl-8 space-y-6">
      {filteredSegments.map((segment: PlanSegment, idx: number) => {
        const status = getSegmentStatus(segment, idx);
        const isExpanded = expandedWeeks[segment.id] !== false; // expanded by default
        const progress = getSegmentProgress(segment);
        const isChecked = primaryPlan.completedSegments.includes(segment.id);

        let nodeColor = "bg-slate-900 border-white/[0.1] text-slate-500";
        let borderGlow = "border-white/[0.04]";
        let titleColor = "text-slate-300";

        if (status === "completed") {
          nodeColor = "bg-accentPrimary text-white border-accentPrimary";
          borderGlow = "border-accentPrimary/20";
          titleColor = "text-slate-300";
        } else if (status === "active") {
          nodeColor = "bg-accentPrimary/20 border-accentPrimary text-accentPrimary";
          borderGlow = "border-accentPrimary/40 glow-active";
          titleColor = "text-white font-semibold";
        } else if (status === "locked") {
          nodeColor = "bg-slate-900 border-white/[0.04] text-slate-600";
          borderGlow = "border-white/[0.02] opacity-60";
          titleColor = "text-slate-600";
        }

        const labelMap: Record<string, string> = { week: 'W', day: 'D', phase: 'P', topic: 'T', milestone: 'M' };
        const labelPrefix = segmentType ? labelMap[segmentType] || '' : 'W';

        return (
          <div key={segment.id} className="relative group">
            <div
              className={`absolute -left-[35px] md:-left-[43px] top-1.5 w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-mono font-bold z-10 transition-all ${nodeColor}`}
            >
              {status === "completed" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : status === "locked" ? (
                <Lock className="w-3 h-3" />
              ) : (
                `${labelPrefix}${idx + 1}`
              )}
            </div>

            <GlassCard
              className={`transition-all duration-300 border-l-2 p-5 ${borderGlow} ${
                status === "active" ? "border-l-accentPrimary" : "border-l-white/[0.06]"
              } ${status === "locked" ? "pointer-events-none opacity-60" : ""}`}
            >
              <div
                onClick={() => toggleExpand(segment.id)}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 cursor-pointer select-none"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {segment.phase && (
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        {segment.phase} Phase
                      </span>
                    )}
                    {status === "active" && (
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded border border-accentPrimary/20 bg-accentPrimary/5 text-accentPrimary animate-pulse">
                        Current Focus
                      </span>
                    )}
                  </div>
                  <h3 className={`text-base font-bold ${titleColor}`}>{segment.title}</h3>
                  <p className="text-xs text-slate-400">
                    Focus: <span className="text-slate-300">{segment.focus}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{segment.estimatedTime}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-24 hidden sm:block">
                      <ProgressBar percentage={progress} height={4} />
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-400 w-8 text-right">
                      {progress}%
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-5 pt-5 border-t border-white/[0.06] space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                        Learning Milestones
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
                      className={`flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg font-bold border transition-all ${
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
          </div>
        );
      })}
    </div>
  );
};
