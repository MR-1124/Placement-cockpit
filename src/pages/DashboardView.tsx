import React, { useState } from "react";
import { useAppState } from "../context/AppStateContext";
import type { DailyHabitState } from "../context/AppStateContext";
import { GlassCard, ProgressRing, ProgressBar } from "../components/Common";
import {
  Flame,
  Award,
  BookOpen,
  Code2,
  Zap,
  Activity,
  Terminal,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { ALL_PLANS } from "../data/curriculum";

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  const {
    state,
    overallCompletion,
    dsaCompletion,
    devCompletion,
    aiDependencyScore,
    readinessScore,
    projectCount,
    toggleHabit,
    addCustomTask,
    toggleCustomTask,
    deleteCustomTask,
    level,
    levelTitle
  } = useAppState();

  const [newTaskName, setNewTaskName] = useState("");
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{ date: string; week: number; day: number; habitsCompleted: number } | null>(null);
  const [showReadinessExplainer, setShowReadinessExplainer] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const primaryPlanId = state.primaryPlanId || "16-week-mastery";
  const primaryPlan = ALL_PLANS.find(p => p.id === primaryPlanId) || ALL_PLANS[0];
  const weekPlans = primaryPlan.roadmap;
  const currentWeekIndex = Math.min(
    weekPlans.length - 1,
    Math.floor(state.completedWeeks.length)
  );
  const currentWeek = weekPlans[currentWeekIndex] || weekPlans[0];

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskName.trim()) {
      addCustomTask(newTaskName.trim());
      setNewTaskName("");
    }
  };

  // Determine current day of week index for consistency map (columns: durationWeeks, rows: 7 days)
  // Let's draw a grid of durationWeeks x 7 days
  const renderHeatmap = () => {
    // Generate grid items
    const cells = [];
    const weekPlans = primaryPlan.roadmap;
    const durationWeeks = primaryPlan.durationWeeks;
    
    // Check completion level for each day
    // We map days from 1 to durationWeeks * 7 days
    for (let dayOffset = 0; dayOffset < durationWeeks * 7; dayOffset++) {
      const weekIndex = Math.floor(dayOffset / 7);
      const dayIndex = dayOffset % 7;
      
      // Calculate a pseudo date for this cell (for mapping history)
      // We offsets days back from today for visualization
      const dateOffset = new Date();
      dateOffset.setDate(dateOffset.getDate() - ((durationWeeks - 1) * 7 + 6 - dayOffset));
      const dateStr = dateOffset.toISOString().split("T")[0];
      
      // Check habits completed on that day
      let completionIntensity = 0; // 0 to 4
      
      if (dateStr === today) {
        const completedHabits = Object.values(state.dailyHabits).filter(Boolean).length;
        completionIntensity = Math.min(4, Math.ceil(completedHabits / 1.5));
      } else {
        const historyMatch = state.habitHistory.find(h => h.date === dateStr);
        if (historyMatch) {
          completionIntensity = Math.min(4, Math.ceil(historyMatch.habitsCompleted / 1.5));
        }
      }

      // If week is completed, give it a baseline color
      const isWeekCompleted = state.completedWeeks.includes(weekPlans[weekIndex]?.id);
      
      let colorClass = "bg-white/[0.02] border-white/[0.02]";
      if (completionIntensity === 1) colorClass = "bg-accentPrimary/20 border-accentPrimary/10";
      else if (completionIntensity === 2) colorClass = "bg-accentPrimary/40 border-accentPrimary/20";
      else if (completionIntensity === 3) colorClass = "bg-accentPrimary/60 border-accentPrimary/30";
      else if (completionIntensity === 4) colorClass = "bg-accentPrimary/80 border-accentPrimary/40";
      else if (isWeekCompleted) colorClass = "bg-slate-800/40 border-slate-700/20";

      cells.push(
        <div
          key={dayOffset}
          onClick={() => {
            const habitsCount = dateStr === today 
              ? Object.values(state.dailyHabits).filter(Boolean).length
              : (state.habitHistory.find(h => h.date === dateStr)?.habitsCompleted || 0);
            setSelectedHeatmapCell({
              date: dateStr,
              week: weekIndex + 1,
              day: dayIndex + 1,
              habitsCompleted: habitsCount
            });
          }}
          title={`Week ${weekIndex + 1}, Day ${dayIndex + 1}: ${
            dateStr === today ? "Today" : dateStr
          } (${completionIntensity} habits completed) - Click to inspect`}
          className={`w-3.5 h-3.5 rounded-sm border cursor-pointer hover:scale-110 active:scale-95 transition-all ${colorClass}`}
        />
      );
    }

    return (
      <div className="flex flex-col gap-2 overflow-x-auto pb-2">
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[340px]">
          {cells}
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono px-1">
          <span>Week 1 (Start)</span>
          <div className="flex items-center gap-1">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-white/[0.02] border border-white/[0.02]" />
            <div className="w-2.5 h-2.5 rounded-sm bg-accentPrimary/20 border border-accentPrimary/10" />
            <div className="w-2.5 h-2.5 rounded-sm bg-accentPrimary/50 border border-accentPrimary/20" />
            <div className="w-2.5 h-2.5 rounded-sm bg-accentPrimary/80 border border-accentPrimary/40" />
            <span>More</span>
          </div>
          <span>Week {durationWeeks} (Interviews)</span>
        </div>
      </div>
    );
  };

  const getAiZone = (score: number) => {
    if (score < 25) return { name: "Healthy", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" };
    if (score < 50) return { name: "Caution", color: "text-amber-400 border-amber-500/20 bg-amber-500/5" };
    return { name: "Risky", color: "text-rose-400 border-rose-500/20 bg-rose-500/5" };
  };

  const aiZone = getAiZone(aiDependencyScore);

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-500">Operating System</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">Placement Cockpit</h1>
          <p className="text-sm text-slate-400 mt-1">
            Student workspace for placement prep. Track metrics, manage habits, and log concepts.
          </p>
        </div>
        
        {/* Streak & Active Info */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="glass-panel rounded-lg px-4 py-2 flex items-center gap-2.5 border border-white/[0.06]">
            <Award className="w-5 h-5 text-accentPrimary" />
            <div>
              <div className="text-sm font-bold text-white leading-none">Lvl {level}</div>
              <div className="text-[9px] text-accentPrimary font-semibold font-mono tracking-wider mt-0.5">{levelTitle}</div>
            </div>
          </div>

          <div className="glass-panel rounded-lg px-4 py-2 flex items-center gap-2.5 border border-white/[0.06]">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500/20 animate-pulse" />
            <div>
              <div className="text-lg font-bold font-mono text-white leading-none">{state.streak}</div>
              <div className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Day Streak</div>
            </div>
          </div>
          
          <div className="glass-panel rounded-lg px-4 py-2 flex items-center gap-2.5 border border-white/[0.06]">
            <Activity className="w-5 h-5 text-accentPrimary" />
            <div>
              <div className="text-lg font-bold font-mono text-white leading-none">
                {Object.values(state.dailyHabits).filter(Boolean).length}/6
              </div>
              <div className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Habits Today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Circular Readiness Score */}
        <GlassCard className="flex flex-col items-center justify-center py-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3">
            <button 
              onClick={() => setShowReadinessExplainer(true)}
              className="text-slate-500 hover:text-accentPrimary transition-colors text-[9px] font-mono border border-white/[0.06] rounded px-1.5 py-0.5 bg-white/[0.02] cursor-pointer"
              title="Explain readiness formula"
            >
              Formula
            </button>
          </div>
          <ProgressRing
            percentage={readinessScore}
            size={140}
            strokeWidth={10}
            label="Ready"
            subLabel="Placement Readiness Score"
          />
          <p className="text-xs text-slate-500 font-mono mt-4 text-center max-w-[200px]">
            Weighted average of DSA, dev, project checkmarks, and AI dependency levels.
          </p>
        </GlassCard>

        {/* Progress Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:col-span-2 gap-6">
          <GlassCard className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-300">Syllabus Completion</span>
                <BookOpen className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-3xl font-extrabold text-white font-mono">{overallCompletion}%</span>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                {state.completedWeeks.length} of {weekPlans.length} Weeks completed
              </p>
            </div>
            <div className="mt-4">
              <ProgressBar percentage={overallCompletion} />
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-300">DSA Proficiency</span>
                <Code2 className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-3xl font-extrabold text-white font-mono">{dsaCompletion}%</span>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                {state.dsaTopics.reduce((acc, t) => acc + t.problems.filter(p => p.isCompleted).length, 0)} Solved Problems
              </p>
            </div>
            <div className="mt-4">
              <ProgressBar percentage={dsaCompletion} colorClass="bg-violet-500" />
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-300">Full Stack Skills</span>
                <Zap className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-3xl font-extrabold text-white font-mono">{devCompletion}%</span>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                {projectCount} projects added to stack
              </p>
            </div>
            <div className="mt-4">
              <ProgressBar percentage={devCompletion} colorClass="bg-emerald-500" />
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-300">AI Dependency</span>
                <Terminal className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono">{aiDependencyScore}%</span>
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${aiZone.color}`}>
                  {aiZone.name}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Goal: Keep below 20% dependency
              </p>
            </div>
            <div className="mt-4">
              <ProgressBar percentage={aiDependencyScore} colorClass="bg-rose-500" />
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Week Focus Bar */}
      <GlassCard className="border-l-4 border-l-accentPrimary">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-accentPrimary font-semibold tracking-wider">
              Current Week Goal
            </span>
            <h3 className="text-lg font-bold text-white leading-tight">{currentWeek.title}</h3>
            <p className="text-sm text-slate-400">
              Focus: <span className="text-slate-300 font-medium">{currentWeek.focus}</span>
            </p>
          </div>
          <button
            onClick={() => setActiveTab("roadmap")}
            className="flex items-center gap-1.5 text-xs text-accentPrimary font-semibold hover:underline bg-white/[0.02] border border-white/[0.04] px-3 py-1.5 rounded-lg"
          >
            Review Week Plan <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </GlassCard>

      {/* Double Column details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Habits & Custom tasks */}
        <GlassCard className="space-y-6">
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-slate-400" /> Daily Preparations
            </h3>
            <span className="text-xs font-mono text-slate-500">Reset at midnight</span>
          </div>

          {/* Habits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(
              [
                { key: "solveDsa", label: "Solve DSA Problems", desc: "2 Problems minimum" },
                { key: "reviseOld", label: "Revise Old Concepts", desc: "Spaced repetition" },
                { key: "buildFeature", label: "Build Feature Manually", desc: "Write without copying" },
                { key: "avoidAi", label: "Strict Low-AI Coding", desc: "Manual attempts first" },
                { key: "pushGithub", label: "Push progress to Git", desc: "Maintain green dots" },
                { key: "readDoc", label: "Read Docs / Textbooks", desc: "No summaries, raw text" }
              ] as { key: keyof DailyHabitState; label: string; desc: string }[]
            ).map(habit => {
              const checked = state.dailyHabits[habit.key];
              return (
                <div
                  key={habit.key}
                  onClick={() => toggleHabit(habit.key)}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none ${
                    checked
                      ? "bg-accentPrimary/5 border-accentPrimary/20 text-white"
                      : "bg-white/[0.01] border-white/[0.04] text-slate-400 hover:bg-white/[0.02]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {}}
                    className="mt-0.5 accent-accentPrimary rounded cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-semibold">{habit.label}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{habit.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Tasks section */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase font-mono tracking-wider">
              Today's Task Checklist
            </h4>
            
            <form onSubmit={handleAddCustomTask} className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom task (e.g. DBMS schema study)..."
                value={newTaskName}
                onChange={e => setNewTaskName(e.target.value)}
                className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentPrimary"
              />
              <button
                type="submit"
                className="bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.06] rounded-lg px-3 text-xs font-semibold transition-colors"
              >
                Add
              </button>
            </form>

            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {state.customTasks.length === 0 ? (
                <p className="text-[11px] text-slate-600 font-mono italic">No custom tasks scheduled for today.</p>
              ) : (
                state.customTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex justify-between items-center bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.04] p-2 rounded-md transition-all group"
                  >
                    <div
                      onClick={() => toggleCustomTask(task.id)}
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => {}}
                        className="accent-accentPrimary rounded cursor-pointer"
                      />
                      <span
                        className={`text-xs ${
                          task.isCompleted ? "line-through text-slate-600" : "text-slate-300"
                        }`}
                      >
                        {task.name}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteCustomTask(task.id)}
                      className="text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2Icon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </GlassCard>

        {/* Right Column: Heatmap & Alerts */}
        <div className="space-y-6">
          
          {/* Consistency Heatmap Card */}
          <GlassCard className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-400" /> Prep Consistency Grid
              </h3>
              <span className="text-[10px] font-mono text-slate-500 uppercase">{primaryPlan.title}</span>
            </div>
            {renderHeatmap()}
            <p className="text-[11px] text-slate-500 font-mono leading-relaxed mt-2">
              Each grid column represents a roadmap week (Sunday-Saturday rows). Bright cells indicate a high number of habits ticked on that day. Complete your weeks to keep the momentum going!
            </p>
          </GlassCard>

          {/* AI Dependency Warn / Encourage Box */}
          <GlassCard className={`p-4 rounded-xl border flex gap-3 ${
            aiDependencyScore > 50
              ? "border-rose-500/20 bg-rose-500/5 text-rose-300"
              : aiDependencyScore > 25
              ? "border-amber-500/20 bg-amber-500/5 text-amber-300"
              : "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
          }`}>
            {aiDependencyScore > 40 ? (
              <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5 text-rose-500" />
            ) : (
              <Zap className="w-6 h-6 flex-shrink-0 mt-0.5 text-emerald-500" />
            )}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase font-mono tracking-wider">
                {aiDependencyScore > 50
                  ? "Discipline Warning: High AI Dependence"
                  : aiDependencyScore > 25
                  ? "Caution: AI reliance is drifting up"
                  : "Excellent: Independent Coding Zone"}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {aiDependencyScore > 50
                  ? "Your coding is highly AI-driven. Remember: 'If you cannot rebuild it from scratch, you do not own the code.' Limit your queries and try solving for at least 20 minutes first."
                  : aiDependencyScore > 25
                  ? "Keep check on copying snippets directly. Force yourself to type out solution lines manually and explain the time/space complexities out loud."
                  : "You are maintaining high code ownership. Solving problems independently compiles muscle memory for coding rounds."}
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
      {/* Selected Heatmap Cell Modal */}
      {selectedHeatmapCell && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <GlassCard className="w-full max-w-md space-y-4 border border-white/[0.08] shadow-2xl bg-darkCard/95 p-6 relative">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Day Consistency Inspector</span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {selectedHeatmapCell.date === today ? `Today (${selectedHeatmapCell.date})` : selectedHeatmapCell.date}
                </h3>
              </div>
              <button
                onClick={() => setSelectedHeatmapCell(null)}
                className="text-slate-500 hover:text-slate-300 text-xs font-mono border border-white/[0.06] px-2 py-0.5 rounded cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg flex items-center justify-between">
                <span className="text-slate-400 font-medium">Habits Ticked Off:</span>
                <span className="text-white font-bold font-mono text-sm">{selectedHeatmapCell.habitsCompleted} / 6</span>
              </div>

              {/* Solved Problems List */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">DSA Solves on this Day</span>
                {(() => {
                  const solved = state.dsaTopics.flatMap(topic =>
                    topic.problems.filter(prob => prob.isCompleted && prob.lastSolved === selectedHeatmapCell.date).map(prob => ({
                      ...prob,
                      topicName: topic.name
                    }))
                  );
                  if (solved.length === 0) {
                    return (
                      <div className="p-3 text-center text-slate-600 font-mono italic bg-white/[0.005] border border-white/[0.04] rounded-lg">
                        No DSA problems marked solved on this date.
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {solved.map(p => (
                        <div key={p.id} className="flex justify-between items-center bg-white/[0.02] border border-white/[0.04] p-2 rounded-lg">
                          <div>
                            <span className="font-semibold text-slate-200">{p.name}</span>
                            <span className="text-[9px] text-slate-500 font-mono block">{p.topicName}</span>
                          </div>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                            p.difficulty === "Hard"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : p.difficulty === "Medium"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}>
                            {p.difficulty}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Readiness Explainer Modal */}
      {showReadinessExplainer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <GlassCard className="w-full max-w-md space-y-4 border border-white/[0.08] shadow-2xl bg-darkCard/95 p-6 relative">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Index Computation</span>
                <h3 className="text-sm font-bold text-white mt-0.5">Readiness Score Mechanics</h3>
              </div>
              <button
                onClick={() => setShowReadinessExplainer(false)}
                className="text-slate-500 hover:text-slate-300 text-xs font-mono border border-white/[0.06] px-2 py-0.5 rounded cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-slate-300">
              <p>
                Your <strong>Placement Readiness Index</strong> tracks overall technical standing for coding assessments and interviews.
              </p>
              
              <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg space-y-2 font-mono text-[10px]">
                <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                  <span className="text-slate-400">1. DSA Completion</span>
                  <span className="text-white font-bold">35% Weight</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                  <span className="text-slate-400">2. Full Stack Skills Matrix</span>
                  <span className="text-white font-bold">30% Weight</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                  <span className="text-slate-400">3. Projects Completion</span>
                  <span className="text-white font-bold">25% Weight</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                  <span className="text-slate-400">4. Preparation Streak (capped)</span>
                  <span className="text-white font-bold">10% Weight</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">5. AI Dependency Score</span>
                  <span className="text-rose-400 font-bold">Penalty (up to -15%)</span>
                </div>
              </div>

              <div className="border-t border-white/[0.06] pt-3 text-[11px] text-slate-400 italic">
                💡 <strong>Strategy:</strong> High AI usage directly reduces your readiness percentage. Focus on typing out logic, keeping active streaks, and completing project pitch checklists to boost score.
              </div>
            </div>
          </GlassCard>
        </div>
      )}

    </div>
  );
};

// Trash icon definition
const Trash2Icon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);
