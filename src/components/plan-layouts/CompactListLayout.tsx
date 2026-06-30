import React from "react";
import { ProgressBar } from "../Common";
import type { PlanSegment } from "../../data/curriculum";
import {
  CheckCircle2,
  Lock,
  CheckSquare,
} from "lucide-react";

interface CompactListLayoutProps {
  segmentType?: string;
  filteredSegments: PlanSegment[];
  primaryPlan: any;
  getSegmentStatus: (segment: PlanSegment, index: number) => string;
  getSegmentProgress: (segment: PlanSegment) => number;
  toggleExpand: (segmentId: string) => void;
  expandedWeeks: Record<string, boolean>;
  togglePlanWeek: (planId: string, segmentId: string) => void;
}

export const CompactListLayout: React.FC<CompactListLayoutProps> = ({
  segmentType,
  filteredSegments,
  primaryPlan,
  getSegmentStatus,
  getSegmentProgress,
  togglePlanWeek
}) => {
  return (
    <div className="space-y-2">
      {filteredSegments.map((segment: PlanSegment, idx: number) => {
        const status = getSegmentStatus(segment, idx);
        const progress = getSegmentProgress(segment);
        const isChecked = primaryPlan.completedSegments.includes(segment.id);

        let bgClass = "bg-white/[0.02]";
        let borderClass = "border-white/[0.04]";
        let titleColor = "text-slate-300";

        if (status === "completed") {
          bgClass = "bg-accentPrimary/5";
          borderClass = "border-accentPrimary/20";
          titleColor = "text-slate-300";
        } else if (status === "active") {
          bgClass = "bg-accentPrimary/10";
          borderClass = "border-accentPrimary/50";
          titleColor = "text-white font-semibold";
        } else if (status === "locked") {
          bgClass = "bg-black/40";
          borderClass = "border-white/[0.02]";
          titleColor = "text-slate-600";
        }

        const labelMap: Record<string, string> = { week: 'W', day: 'Day ', phase: 'P', topic: 'Topic ', milestone: 'M' };
        const labelPrefix = segmentType ? labelMap[segmentType] || '' : 'W';

        return (
          <div
            key={segment.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${bgClass} ${borderClass} ${status === "locked" ? "opacity-50 pointer-events-none" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4 text-accentPrimary" />
                ) : status === "locked" ? (
                  <Lock className="w-4 h-4 text-slate-600" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-accentPrimary animate-pulse" />
                )}
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest w-12">
                {labelPrefix}{idx + 1}
              </span>
              <h3 className={`text-sm ${titleColor}`}>{segment.title}</h3>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-16 hidden sm:block">
                <ProgressBar percentage={progress} height={3} />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlanWeek(primaryPlan.planId, segment.id);
                }}
                className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md font-bold border transition-all ${
                  isChecked
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-accentPrimary/10 text-accentPrimary border-accentPrimary/30 hover:bg-accentPrimary hover:text-black"
                }`}
              >
                <CheckSquare className="w-3 h-3" />
                <span>{isChecked ? "Done" : "Mark"}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
