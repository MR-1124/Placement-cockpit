import React, { useState } from "react";
import { useAppState } from "../context/AppStateContext";
import { GlassCard, ProgressBar } from "../components/Common";
import { ALL_PLANS } from "../data/curriculum";
import type { WeekPlan } from "../data/curriculum";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Lock,
  Search,
  CheckSquare,
  Zap,
  Code2
} from "lucide-react";

export const RoadmapView: React.FC = () => {
  const { state, toggleWeek, toggleDsaProblem, updateDevSkill } = useAppState();
  
  const primaryPlanId = state.primaryPlanId || "16-week-mastery";
  const primaryPlan = ALL_PLANS.find(p => p.id === primaryPlanId) || ALL_PLANS[0];
  const roadmapWeeks = primaryPlan.roadmap;

  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({
    "week-1": true // default first week open
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activePhaseFilter, setActivePhaseFilter] = useState<string>("All");
  const [activeDiffTabs, setActiveDiffTabs] = useState<Record<string, "Easy" | "Medium" | "Hard">>({});

  const toggleExpand = (weekId: string) => {
    setExpandedWeeks(prev => ({ ...prev, [weekId]: !prev[weekId] }));
  };

  const getDifficultyCounts = (week: WeekPlan) => {
    let easy = 0;
    let medium = 0;
    let hard = 0;

    if (week.dsaProblems && week.dsaProblems.length > 0) {
      week.dsaProblems.forEach(probId => {
        let problem = null;
        for (const topic of state.dsaTopics) {
          const p = topic.problems.find(x => x.id === probId);
          if (p) {
            problem = p;
            break;
          }
        }
        if (problem) {
          if (problem.difficulty === "Easy") easy++;
          else if (problem.difficulty === "Medium") medium++;
          else if (problem.difficulty === "Hard") hard++;
        }
      });
    }
    return { easy, medium, hard };
  };

  const getWeekStatus = (week: WeekPlan, index: number) => {
    if (state.completedWeeks.includes(week.id)) return "completed";
    
    // An active week is the first uncompleted week
    const firstUncompletedIndex = roadmapWeeks.findIndex(
      w => !state.completedWeeks.includes(w.id)
    );
    if (index === firstUncompletedIndex || (firstUncompletedIndex === -1 && index === 0)) {
      return "active";
    }
    
    if (index > firstUncompletedIndex && firstUncompletedIndex !== -1) {
      return "locked";
    }
    return "not-started";
  };

  // Filter week plans
  const filteredWeeks = roadmapWeeks.filter(week => {
    const matchesSearch =
      week.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      week.focus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      week.goals.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPhase = activePhaseFilter === "All" || week.phase === activePhaseFilter;

    return matchesSearch && matchesPhase;
  });

  // Calculate detailed progress for each week based on its subtasks
  const getWeekProgress = (week: WeekPlan) => {
    let totalItems = 0;
    let completedItems = 0;

    // Count DSA problems for this week
    if (week.dsaProblems && week.dsaProblems.length > 0) {
      week.dsaProblems.forEach(probId => {
        let problem = null;
        for (const topic of state.dsaTopics) {
          const p = topic.problems.find(x => x.id === probId);
          if (p) {
            problem = p;
            break;
          }
        }
        if (problem) {
          totalItems++;
          if (problem.isCompleted) completedItems++;
        }
      });
    } else {
      week.dsaTopics.forEach(topicId => {
        const topic = state.dsaTopics.find(t => t.id === topicId);
        if (topic) {
          totalItems += topic.problems.length;
          completedItems += topic.problems.filter(p => p.isCompleted).length;
        }
      });
    }

    // Count Dev skill states (learned + practiced + built + deployed + revised = 5 actions per skill)
    week.devSkills.forEach(skillId => {
      let foundSkill = null;
      for (const cat of state.devCategories) {
        const sk = cat.skills.find(s => s.id === skillId);
        if (sk) {
          foundSkill = sk;
          break;
        }
      }
      if (foundSkill) {
        totalItems += 5;
        if (foundSkill.learned) completedItems++;
        if (foundSkill.practiced) completedItems++;
        if (foundSkill.built) completedItems++;
        if (foundSkill.deployed) completedItems++;
        if (foundSkill.revised) completedItems++;
      }
    });

    if (totalItems === 0) return 0;
    return Math.round((completedItems / totalItems) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-500">Timeline Curriculum</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">{primaryPlan.title} Roadmap</h1>
          <p className="text-sm text-slate-400 mt-1">
            {primaryPlan.description}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search weeks, target goals, topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentPrimary"
          />
        </div>

        {/* Phase Filter Button Hub */}
        <div className="flex gap-1 bg-white/[0.02] border border-white/[0.04] p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {["All", "Foundation", "Core Mastery", "Advanced Topics", "Placement Ready"].map(phase => (
            <button
              key={phase}
              onClick={() => setActivePhaseFilter(phase)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activePhaseFilter === phase
                  ? "bg-white/[0.06] text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {phase}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative border-l border-white/[0.06] ml-4 pl-6 md:ml-6 md:pl-8 space-y-6">
        {filteredWeeks.map((week, idx) => {
          const status = getWeekStatus(week, idx);
          const isExpanded = !!expandedWeeks[week.id];
          const progress = getWeekProgress(week);
          const isChecked = state.completedWeeks.includes(week.id);

          // Node styling
          let nodeColor = "bg-slate-900 border-white/[0.1] text-slate-500";
          let borderGlow = "border-white/[0.04]";
          let weekTitleColor = "text-slate-300";

          if (status === "completed") {
            nodeColor = "bg-accentPrimary text-white border-accentPrimary";
            borderGlow = "border-accentPrimary/20";
            weekTitleColor = "text-slate-300";
          } else if (status === "active") {
            nodeColor = "bg-accentPrimary/20 border-accentPrimary text-accentPrimary";
            borderGlow = "border-accentPrimary/40 glow-active";
            weekTitleColor = "text-white font-semibold";
          } else if (status === "locked") {
            nodeColor = "bg-slate-900 border-white/[0.04] text-slate-600";
            borderGlow = "border-white/[0.02] opacity-60";
            weekTitleColor = "text-slate-600";
          }

          return (
            <div key={week.id} className="relative group">
              {/* Timeline Indicator Dot */}
              <div
                className={`absolute -left-[35px] md:-left-[43px] top-1.5 w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-mono font-bold z-10 transition-all ${nodeColor}`}
              >
                {status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : status === "locked" ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  idx + 1
                )}
              </div>

              {/* Card Container */}
              <GlassCard
                className={`transition-all duration-300 border-l-2 p-5 ${borderGlow} ${
                  status === "active" ? "border-l-accentPrimary" : "border-l-white/[0.06]"
                } ${status === "locked" ? "pointer-events-none opacity-60" : ""}`}
              >
                {/* Card Header clickable to expand */}
                <div
                  onClick={() => toggleExpand(week.id)}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        {week.phase} Phase
                      </span>
                      {status === "active" && (
                        <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded border border-accentPrimary/20 bg-accentPrimary/5 text-accentPrimary animate-pulse">
                          Current Focus
                        </span>
                      )}
                    </div>
                    <h3 className={`text-base font-bold ${weekTitleColor}`}>{week.title}</h3>
                    <p className="text-xs text-slate-400">
                      Focus: <span className="text-slate-300">{week.focus}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{week.estimatedTime}</span>
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

                {/* Expanded Details section */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-white/[0.06] space-y-5">
                    {/* Goals checklist */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                          Learning Milestones
                        </h4>
                        <ul className="space-y-1.5">
                          {week.goals.map((goal, i) => (
                            <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                              <span className="text-accentPrimary mt-1">•</span>
                              <span>{goal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] text-xs">
                          <span className="font-mono text-slate-500 block mb-0.5">Project Target</span>
                          <span className="text-slate-300 font-medium">{week.projectMilestone}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] text-xs">
                          <span className="font-mono text-slate-500 block mb-0.5">Revision Focus</span>
                          <span className="text-slate-300 font-medium">{week.revisionFocus}</span>
                        </div>
                      </div>
                    </div>

                    {/* Integrated DSA problems & Full Stack checklist */}
                    <div className="space-y-4 pt-2">
                      {/* DSA Problem checklist */}
                      {week.dsaTopics.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.04] pb-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                              <Code2 className="w-4 h-4 text-slate-500" /> Allocated DSA Problems
                            </h4>
                            
                            {/* Difficulty tab switcher */}
                            {week.dsaProblems && week.dsaProblems.length > 0 && (() => {
                              const counts = getDifficultyCounts(week);
                              const currentTab = activeDiffTabs[week.id] || "Easy";
                              return (
                                <div className="flex gap-1 bg-white/[0.02] border border-white/[0.06] p-0.5 rounded-lg">
                                  {[
                                    { key: "Easy", count: counts.easy, activeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" },
                                    { key: "Medium", count: counts.medium, activeClass: "bg-amber-500/10 text-amber-400 border-amber-500/25" },
                                    { key: "Hard", count: counts.hard, activeClass: "bg-rose-500/10 text-rose-400 border-rose-500/25" }
                                  ].map(t => (
                                    <button
                                      key={t.key}
                                      onClick={() => setActiveDiffTabs(prev => ({ ...prev, [week.id]: t.key as any }))}
                                      className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono uppercase transition-all cursor-pointer border ${
                                        currentTab === t.key
                                          ? t.activeClass
                                          : "bg-transparent border-transparent text-slate-500 hover:text-slate-350"
                                      }`}
                                    >
                                      {t.key} <span className="opacity-70 font-sans ml-0.5">({t.count})</span>
                                    </button>
                                  ))}
                                </div>
                              );
                            })()}
                          </div>
 
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {week.dsaProblems && week.dsaProblems.length > 0 ? (
                              (() => {
                                const currentTab = activeDiffTabs[week.id] || "Easy";
                                const problems = week.dsaProblems.map(probId => {
                                  let topic = null;
                                  let problem = null;
                                  for (const t of state.dsaTopics) {
                                    const p = t.problems.find(x => x.id === probId);
                                    if (p) {
                                      topic = t;
                                      problem = p;
                                      break;
                                    }
                                  }
                                  return { topic, problem };
                                }).filter(item => item.topic && item.problem && item.problem.difficulty === currentTab);
 
                                if (problems.length === 0) {
                                  return (
                                    <div className="col-span-2 p-4 text-center text-xs text-slate-500 italic font-mono bg-white/[0.01] border border-white/[0.04] rounded-lg">
                                      No {currentTab.toLowerCase()} difficulty problems allocated for this week.
                                    </div>
                                  );
                                }
 
                                return problems.map(({ topic, problem }) => {
                                  if (!topic || !problem) return null;
                                  return (
                                    <div
                                      key={problem.id}
                                      onClick={() => toggleDsaProblem(topic.id, problem.id)}
                                      className={`flex justify-between items-center p-2.5 rounded-lg border transition-all cursor-pointer select-none ${
                                        problem.isCompleted
                                          ? "bg-violet-500/5 border-violet-500/20 text-white"
                                          : "bg-white/[0.01] border-white/[0.04] text-slate-400 hover:bg-white/[0.02]"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <input
                                          type="checkbox"
                                          checked={problem.isCompleted}
                                          onChange={() => {}}
                                          className="accent-violet-500 rounded flex-shrink-0 cursor-pointer"
                                        />
                                        <span className="text-xs font-medium truncate">{problem.name}</span>
                                      </div>
                                      <span
                                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase flex-shrink-0 ${
                                          problem.difficulty === "Easy"
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : problem.difficulty === "Medium"
                                            ? "bg-amber-500/10 text-amber-400"
                                            : "bg-rose-500/10 text-rose-400"
                                        }`}
                                      >
                                        {problem.difficulty}
                                      </span>
                                    </div>
                                  );
                                });
                              })()
                            ) : (
                              week.dsaTopics.map(topicId => {
                                const topic = state.dsaTopics.find(t => t.id === topicId);
                                if (!topic) return null;
                                return topic.problems.map(problem => (
                                  <div
                                    key={problem.id}
                                    onClick={() => toggleDsaProblem(topic.id, problem.id)}
                                    className={`flex justify-between items-center p-2.5 rounded-lg border transition-all cursor-pointer select-none ${
                                      problem.isCompleted
                                        ? "bg-violet-500/5 border-violet-500/20 text-white"
                                        : "bg-white/[0.01] border-white/[0.04] text-slate-400 hover:bg-white/[0.02]"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <input
                                        type="checkbox"
                                        checked={problem.isCompleted}
                                        onChange={() => {}}
                                        className="accent-violet-500 rounded flex-shrink-0 cursor-pointer"
                                      />
                                      <span className="text-xs font-medium truncate">{problem.name}</span>
                                    </div>
                                    <span
                                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase flex-shrink-0 ${
                                        problem.difficulty === "Easy"
                                          ? "bg-emerald-500/10 text-emerald-400"
                                          : problem.difficulty === "Medium"
                                          ? "bg-amber-500/10 text-amber-400"
                                          : "bg-rose-500/10 text-rose-400"
                                      }`}
                                    >
                                      {problem.difficulty}
                                    </span>
                                  </div>
                                ));
                              })
                            )}
                          </div>
                        </div>
                      )}

                      {/* Dev Skill list */}
                      {week.devSkills.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                            <Zap className="w-4 h-4 text-slate-500" /> Core Dev Skill Matrix
                          </h4>
                          <div className="space-y-2">
                            {week.devSkills.map(skillId => {
                              let skill: any = null;
                              state.devCategories.forEach(cat => {
                                const sk = cat.skills.find(s => s.id === skillId);
                                if (sk) skill = sk;
                              });
                              if (!skill) return null;
                              return (
                                <div
                                  key={skillId}
                                  className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.01] flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                                >
                                  <div>
                                    <span className="text-xs font-semibold text-slate-300 block">{skill.name}</span>
                                    <span className="text-[10px] text-slate-500 leading-normal">{skill.description}</span>
                                  </div>
                                  
                                  {/* Grid of matrix checkbox triggers */}
                                  <div className="flex flex-wrap gap-1">
                                    {[
                                      { key: "learned", label: "Learned" },
                                      { key: "practiced", label: "Practiced" },
                                      { key: "built", label: "Built" },
                                      { key: "deployed", label: "Deployed" },
                                      { key: "revised", label: "Revised" }
                                    ].map(action => {
                                      const checked = (skill as any)[action.key];
                                      return (
                                        <button
                                          key={action.key}
                                          onClick={() => updateDevSkill(skillId, action.key as any)}
                                          className={`text-[9px] font-mono px-2 py-1 rounded transition-all border ${
                                            checked
                                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                              : "bg-white/[0.01] border-white/[0.04] text-slate-500 hover:text-slate-400"
                                          }`}
                                        >
                                          {action.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Complete Week Toggle */}
                    <div className="flex justify-end pt-3 border-t border-white/[0.04]">
                      <button
                        onClick={() => {
                          if (!isChecked && progress < 100) {
                            const confirmMark = window.confirm(
                              "You have not completed all items for this week. Are you sure you want to mark it as completed?"
                            );
                            if (!confirmMark) return;
                          }
                          toggleWeek(week.id);
                        }}
                        className={`flex items-center gap-1.5 text-xs px-3.5 py-1.8 rounded-lg font-bold border transition-all ${
                          isChecked
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-accentPrimary text-white border-accentPrimary hover:bg-accentPrimary/90"
                        }`}
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>{isChecked ? "Week Logged as Complete" : "Mark Week Completed"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>
          );
        })}
      </div>
    </div>
  );
};
