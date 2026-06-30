import React, { useState } from "react";
import { useAppState } from "../context/AppStateContext";
import type { PlanSegment } from "../data/curriculum";
import { LayoutRegistry } from "../components/plan-layouts/LayoutRegistry";
import { Search } from "lucide-react";

export const RoadmapView: React.FC = () => {
  const { state, curriculum, togglePlanWeek } = useAppState();
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activePhaseFilter, setActivePhaseFilter] = useState<string>("All");

  const primaryPlan = (state.userPlans || []).find((p: any) => p.primary) || (state.userPlans || [])[0];
  const fullPlan = curriculum.ALL_PLANS.find((p: any) => p.id === primaryPlan?.planId);

  if (!primaryPlan || !fullPlan) {
    return <div className="text-slate-400 p-8 text-center">Loading plan engine...</div>;
  }

  const segments = fullPlan.segments || [];

  const toggleExpand = (segmentId: string) => {
    setExpandedWeeks(prev => ({ ...prev, [segmentId]: !prev[segmentId] }));
  };

  const getSegmentStatus = (segment: PlanSegment, index: number) => {
    const completedSegs = primaryPlan.completedSegments || [];
    // BUG-C2 fix: guard completedSegments against undefined before .includes()
    if (completedSegs.includes(segment.id)) return "completed";
    
    const firstUncompletedIndex = segments.findIndex(
      (s: PlanSegment) => !completedSegs.includes(s.id)
    );
    if (index === firstUncompletedIndex || (firstUncompletedIndex === -1 && index === 0)) {
      return "active";
    }
    
    if (index > firstUncompletedIndex && firstUncompletedIndex !== -1) {
      return "locked";
    }
    return "not-started";
  };

  const filteredSegments = segments.filter((segment: PlanSegment) => {
    const matchesSearch =
      segment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      segment.focus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      segment.goals.some((g: string) => g.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPhase = activePhaseFilter === "All" || segment.phase === activePhaseFilter;

    return matchesSearch && matchesPhase;
  });

  const getSegmentProgress = (segment: PlanSegment) => {
    let totalItems = 0;
    let completedItems = 0;

    segment.modules?.forEach(mod => {
      if (mod.type === "dsa" && mod.targetIds) {
        mod.targetIds.forEach(topicId => {
          const topic = state.dsaTopics.find(t => t.id === topicId);
          if (topic) {
            totalItems += topic.problems.length;
            completedItems += topic.problems.filter(p => p.isCompleted).length;
          }
        });
      } else if (mod.type === "dev" && mod.targetIds) {
        mod.targetIds.forEach(skillId => {
          let foundSkill = null;
          for (const cat of state.devCategories) {
            const sk = cat.skills.find(s => s.id === skillId);
            if (sk) {
              foundSkill = sk;
              break;
            }
          }
          if (foundSkill) {
            totalItems += 2;
            if (foundSkill.learned) completedItems++;
            if (foundSkill.built) completedItems++;
          }
        });
      }
    });

    if (totalItems === 0) return (primaryPlan.completedSegments || []).includes(segment.id) ? 100 : 0;
    return Math.round((completedItems / totalItems) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-500">Plan Curriculum Engine</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">{fullPlan.title} Tracker</h1>
          <p className="text-sm text-slate-400 mt-1">
            {fullPlan.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search segments, target goals, topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-black/60 shadow-inner border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accentPrimary transition-colors"
          />
        </div>

        <div className="flex gap-1 bg-white/[0.02] border border-white/[0.04] p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {["All", "Foundation", "Core Mastery", "Advanced Topics", "Placement Ready"].map(phase => (
            <button
              key={phase}
              onClick={() => setActivePhaseFilter(phase)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activePhaseFilter === phase
                  ? "bg-white/[0.08] text-white shadow-sm border border-white/[0.04]"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02] border border-transparent"
              }`}
            >
              {phase}
            </button>
          ))}
        </div>
      </div>

      <LayoutRegistry
        layoutType={fullPlan.layoutType}
        segmentType={fullPlan.segmentType}
        segments={segments}
        filteredSegments={filteredSegments}
        primaryPlan={primaryPlan}
        getSegmentStatus={getSegmentStatus}
        getSegmentProgress={getSegmentProgress}
        toggleExpand={toggleExpand}
        expandedWeeks={expandedWeeks}
        togglePlanWeek={togglePlanWeek}
      />
    </div>
  );
};
