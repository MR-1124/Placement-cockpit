import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
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


interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
  onOpenFocusConfig?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab, onOpenFocusConfig }) => {
  const state = useAppState(s => s.state);
const overallCompletion = useAppState(s => s.overallCompletion);
const dsaCompletion = useAppState(s => s.dsaCompletion);
const devCompletion = useAppState(s => s.devCompletion);
const aiDependencyScore = useAppState(s => s.aiDependencyScore);
const readinessScore = useAppState(s => s.readinessScore);
const projectCount = useAppState(s => s.projectCount);
const toggleHabit = useAppState(s => s.toggleHabit);
const addCustomTask = useAppState(s => s.addCustomTask);
const toggleCustomTask = useAppState(s => s.toggleCustomTask);
const deleteCustomTask = useAppState(s => s.deleteCustomTask);
const addWeeklyGoal = useAppState(s => s.addWeeklyGoal);
const toggleWeeklyGoal = useAppState(s => s.toggleWeeklyGoal);
const deleteWeeklyGoal = useAppState(s => s.deleteWeeklyGoal);
const level = useAppState(s => s.level);
const levelTitle = useAppState(s => s.levelTitle);
const curriculum = useAppState(s => s.curriculum);


  const ALL_PLANS = curriculum.ALL_PLANS;

  const [newTaskName, setNewTaskName] = useState("");
  const [newGoalText, setNewGoalText] = useState("");
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{ date: string; week: number; day: number; habitsCompleted: number } | null>(null);
  const [showReadinessExplainer, setShowReadinessExplainer] = useState(false);
  const [heatmapMode, setHeatmapMode] = useState<"plan" | "6months" | "1year" | "month">("plan");
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
  });

  const today = new Date().toISOString().split("T")[0];
  const primaryPlanId = state.primaryPlanId || "16-week-mastery";
  const primaryPlan = ALL_PLANS.find(p => p.id === primaryPlanId) || ALL_PLANS[0];
  const weekPlans = primaryPlan.segments;
  // BUG-C3 fix: read from primary userPlan's completedSegments (authoritative source)
  // not from legacy state.completedSegments which can be stale or out-of-sync
  const primaryUserPlan = (state.userPlans || []).find(up => up.planId === primaryPlanId) || (state.userPlans || [])[0];
  const primaryCompletedSegments = primaryUserPlan?.completedSegments || state.completedSegments || [];
  const currentWeekIndex = Math.min(
    weekPlans.length - 1,
    primaryCompletedSegments.length
  );
  const currentWeek = weekPlans[currentWeekIndex] || weekPlans[0];

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskName.trim()) {
      addCustomTask(newTaskName.trim());
      setNewTaskName("");
    }
  };

  const handleAddWeeklyGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoalText.trim()) {
      addWeeklyGoal(newGoalText.trim());
      setNewGoalText("");
    }
  };

  const getMonthOptions = () => {
    const options = [];
    const d = new Date();
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(d.getFullYear(), d.getMonth() - i, 1);
      const label = monthDate.toLocaleString("default", { month: "short", year: "numeric" });
      const value = `${monthDate.getFullYear()}-${(monthDate.getMonth() + 1).toString().padStart(2, "0")}`;
      options.push({ value, label });
    }
    return options;
  };

  // Determine current day of week index for consistency map (columns: duration, rows: 7 days)
  // Let's draw a grid of duration x 7 days
  const renderedHeatmap = useMemo(() => {
    const cells = [];
    const weekPlans = primaryPlan.segments;
    const duration = primaryPlan.duration;

    if (heatmapMode === "plan") {
      const activeUserPlan = state.userPlans?.find(up => up.planId === primaryPlanId);
      const earliestStartedAt = state.userPlans && state.userPlans.length > 0
        ? state.userPlans.reduce((earliest, up) => (up.startedAt < earliest ? up.startedAt : earliest), state.userPlans[0].startedAt)
        : null;
      const startDateStr = earliestStartedAt || activeUserPlan?.startedAt || state.lastActiveDate || today;
      const startDate = new Date(startDateStr);
      const startDay = startDate.getDay(); // 0 (Sun) to 6 (Sat)
      const alignmentOffset = startDay;
      const anchorDate = new Date(startDate);
      anchorDate.setDate(anchorDate.getDate() - alignmentOffset);

      for (let dayOffset = 0; dayOffset < duration * 7; dayOffset++) {
        const weekIndex = Math.floor(dayOffset / 7);
        const dayIndex = dayOffset % 7;

        const dateOffset = new Date(anchorDate);
        dateOffset.setDate(dateOffset.getDate() + dayOffset);
        const dateStr = dateOffset.toISOString().split("T")[0];

        const isFuture = new Date(dateStr) > new Date(today);

        // Check habits completed on that day
        let completionIntensity = 0; // 0 to 4

        if (!isFuture) {
          if (dateStr === today) {
            const completedHabits = Object.values(state.dailyHabits).filter(Boolean).length;
            completionIntensity = Math.min(4, Math.ceil(completedHabits / 1.5));
          } else {
            const historyMatch = state.habitHistory.find(h => h.date === dateStr);
            if (historyMatch) {
              completionIntensity = Math.min(4, Math.ceil(historyMatch.habitsCompleted / 1.5));
            }
          }
        }

        // If week is completed, give it a baseline color — use primaryCompletedSegments (BUG-C3 fix)
        const isWeekCompleted = primaryCompletedSegments.includes(weekPlans[weekIndex]?.id);

        let colorClass = "bg-white/[0.02] border-white/[0.02]";
        if (isFuture) {
          colorClass = "bg-white/[0.005] border-white/[0.01] opacity-30 cursor-not-allowed";
        } else if (completionIntensity === 1) {
          colorClass = "bg-accentPrimary/20 border-accentPrimary/10";
        } else if (completionIntensity === 2) {
          colorClass = "bg-accentPrimary/40 border-accentPrimary/20";
        } else if (completionIntensity === 3) {
          colorClass = "bg-accentPrimary/60 border-accentPrimary/30";
        } else if (completionIntensity === 4) {
          colorClass = "bg-accentPrimary/80 border-accentPrimary/40";
        } else if (isWeekCompleted) {
          colorClass = "bg-slate-800/40 border-slate-700/20";
        }

        cells.push(
          <div
            key={dayOffset}
            onClick={() => {
              if (isFuture) return;
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
            title={
              isFuture
                ? `Week ${weekIndex + 1}, Day ${dayIndex + 1} (Future)`
                : `Week ${weekIndex + 1}, Day ${dayIndex + 1}: ${
                    dateStr === today ? "Today" : dateStr
                  } (${completionIntensity} habits completed) - Click to inspect`
            }
            className={`w-3.5 h-3.5 rounded-sm border transition-all ${
              isFuture ? "" : "cursor-pointer hover:scale-110 active:scale-95"
            } ${colorClass}`}
          />
        );
      }
    } else if (heatmapMode === "6months" || heatmapMode === "1year") {
      const weeksCount = heatmapMode === "6months" ? 24 : 53;
      const todayDate = new Date(today);
      const todayDay = todayDate.getDay(); // 0 (Sun) to 6 (Sat)
      const endOfWeekOffset = 6 - todayDay;
      const graphEndDate = new Date(todayDate);
      graphEndDate.setDate(graphEndDate.getDate() + endOfWeekOffset);
      
      const totalDays = weeksCount * 7;

      for (let dayOffset = 0; dayOffset < totalDays; dayOffset++) {
        const dateOffset = new Date(graphEndDate);
        dateOffset.setDate(dateOffset.getDate() - (totalDays - 1 - dayOffset));
        const dateStr = dateOffset.toISOString().split("T")[0];

        const isFuture = new Date(dateStr) > new Date(today);

        // Check habits completed on that day
        let completionIntensity = 0; // 0 to 4

        if (!isFuture) {
          if (dateStr === today) {
            const completedHabits = Object.values(state.dailyHabits).filter(Boolean).length;
            completionIntensity = Math.min(4, Math.ceil(completedHabits / 1.5));
          } else {
            const historyMatch = state.habitHistory.find(h => h.date === dateStr);
            if (historyMatch) {
              completionIntensity = Math.min(4, Math.ceil(historyMatch.habitsCompleted / 1.5));
            }
          }
        }

        let colorClass = "bg-white/[0.02] border-white/[0.02]";
        if (isFuture) {
          colorClass = "bg-white/[0.005] border-white/[0.01] opacity-30 cursor-not-allowed";
        } else if (completionIntensity === 1) {
          colorClass = "bg-accentPrimary/20 border-accentPrimary/10";
        } else if (completionIntensity === 2) {
          colorClass = "bg-accentPrimary/40 border-accentPrimary/20";
        } else if (completionIntensity === 3) {
          colorClass = "bg-accentPrimary/60 border-accentPrimary/30";
        } else if (completionIntensity === 4) {
          colorClass = "bg-accentPrimary/80 border-accentPrimary/40";
        }

        cells.push(
          <div
            key={dayOffset}
            onClick={() => {
              if (isFuture) return;
              const habitsCount = dateStr === today
                ? Object.values(state.dailyHabits).filter(Boolean).length
                : (state.habitHistory.find(h => h.date === dateStr)?.habitsCompleted || 0);
              setSelectedHeatmapCell({
                date: dateStr,
                week: Math.floor(dayOffset / 7) + 1,
                day: (dayOffset % 7) + 1,
                habitsCompleted: habitsCount
              });
            }}
            title={
              isFuture
                ? `${dateStr} (Future)`
                : `${dateStr}: ${
                    dateStr === today ? "Today" : ""
                  } (${completionIntensity} habits completed) - Click to inspect`
            }
            className={`w-3.5 h-3.5 rounded-sm border transition-all ${
              isFuture ? "" : "cursor-pointer hover:scale-110 active:scale-95"
            } ${colorClass}`}
          />
        );
      }
    } else if (heatmapMode === "month") {
      const [y, m] = selectedMonth.split("-").map(Number);
      const firstDay = new Date(y, m - 1, 1);
      const firstDayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
      const lastDay = new Date(y, m, 0);
      const totalDaysInMonth = lastDay.getDate();
      
      const startOffset = firstDayOfWeek;
      const endOffset = 6 - lastDay.getDay();
      const totalDaysToRender = startOffset + totalDaysInMonth + endOffset;

      const startDate = new Date(y, m - 1, 1 - startOffset);

      for (let dayOffset = 0; dayOffset < totalDaysToRender; dayOffset++) {
        const dateOffset = new Date(startDate);
        dateOffset.setDate(dateOffset.getDate() + dayOffset);
        const dateStr = dateOffset.toISOString().split("T")[0];

        const isCurrentMonth = dateOffset.getMonth() === (m - 1);
        const isFuture = new Date(dateStr) > new Date(today);

        let completionIntensity = 0;

        if (isCurrentMonth && !isFuture) {
          if (dateStr === today) {
            const completedHabits = Object.values(state.dailyHabits).filter(Boolean).length;
            completionIntensity = Math.min(4, Math.ceil(completedHabits / 1.5));
          } else {
            const historyMatch = state.habitHistory.find(h => h.date === dateStr);
            if (historyMatch) {
              completionIntensity = Math.min(4, Math.ceil(historyMatch.habitsCompleted / 1.5));
            }
          }
        }

        let colorClass = "bg-white/[0.02] border-white/[0.02]";
        if (!isCurrentMonth) {
          colorClass = "bg-transparent border-transparent opacity-10 pointer-events-none";
        } else if (isFuture) {
          colorClass = "bg-white/[0.005] border-white/[0.01] opacity-30 cursor-not-allowed";
        } else if (completionIntensity === 1) {
          colorClass = "bg-accentPrimary/20 border-accentPrimary/10";
        } else if (completionIntensity === 2) {
          colorClass = "bg-accentPrimary/40 border-accentPrimary/20";
        } else if (completionIntensity === 3) {
          colorClass = "bg-accentPrimary/60 border-accentPrimary/30";
        } else if (completionIntensity === 4) {
          colorClass = "bg-accentPrimary/80 border-accentPrimary/40";
        }

        cells.push(
          <div
            key={dayOffset}
            onClick={() => {
              if (!isCurrentMonth || isFuture) return;
              const habitsCount = dateStr === today
                ? Object.values(state.dailyHabits).filter(Boolean).length
                : (state.habitHistory.find(h => h.date === dateStr)?.habitsCompleted || 0);
              setSelectedHeatmapCell({
                date: dateStr,
                week: Math.floor(dayOffset / 7) + 1,
                day: (dayOffset % 7) + 1,
                habitsCompleted: habitsCount
              });
            }}
            title={
              !isCurrentMonth
                ? ""
                : isFuture
                ? `${dateStr} (Future)`
                : `${dateStr}: ${
                    dateStr === today ? "Today" : ""
                  } (${completionIntensity} habits completed) - Click to inspect`
            }
            className={`w-3.5 h-3.5 rounded-sm border transition-all ${
              isCurrentMonth && !isFuture ? "cursor-pointer hover:scale-110 active:scale-95" : ""
            } ${colorClass}`}
          />
        );
      }
    }

    return (
      <div className="flex flex-col gap-2 overflow-x-auto pb-2">
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[340px]">
          {cells}
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono px-1">
          <span>
            {heatmapMode === "plan" 
              ? "Week 1 (Start)" 
              : heatmapMode === "6months" 
              ? "6 Months Ago" 
              : heatmapMode === "1year"
              ? "1 Year Ago"
              : `${new Date(selectedMonth + "-02").toLocaleString("default", { month: "long" })} Start`
            }
          </span>
          <div className="flex items-center gap-1">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-white/[0.02] border border-white/[0.02]" />
            <div className="w-2.5 h-2.5 rounded-sm bg-accentPrimary/20 border border-accentPrimary/10" />
            <div className="w-2.5 h-2.5 rounded-sm bg-accentPrimary/50 border border-accentPrimary/20" />
            <div className="w-2.5 h-2.5 rounded-sm bg-accentPrimary/80 border border-accentPrimary/40" />
            <span>More</span>
          </div>
          <span>
            {heatmapMode === "plan" 
              ? `Week ${duration} (End)` 
              : heatmapMode === "month"
              ? `${new Date(selectedMonth + "-02").toLocaleString("default", { month: "long" })} End`
              : "Today"
            }
          </span>
        </div>
      </div>
    );
  }, [
    heatmapMode,
    primaryPlan,
    primaryPlanId,
    state.userPlans,
    state.lastActiveDate,
    state.dailyHabits,
    state.habitHistory,
    primaryCompletedSegments,
    selectedMonth,
    today
  ]);

  const getAiZone = (score: number) => {
    if (score < 25) return { name: "Healthy", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" };
    if (score < 50) return { name: "Caution", color: "text-amber-400 border-amber-500/20 bg-amber-500/5" };
    return { name: "Risky", color: "text-rose-400 border-rose-500/20 bg-rose-500/5" };
  };

  const aiZone = getAiZone(aiDependencyScore);

  // AI Dependency Trend (Last 7 Days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const aiTrendData = last7Days.map(dateStr => {
    const queries = state.aiLogs.filter(log => log.date === dateStr).length;
    return { date: dateStr, queries };
  });

  const maxQueries = Math.max(1, ...aiTrendData.map(d => d.queries));

  const upcomingRevisions = state.dsaTopics
    .flatMap(topic => topic.problems.map(p => ({ ...p, topicName: topic.name })))
    .filter(p => p.nextRevisionDate)
    .sort((a, b) => new Date(a.nextRevisionDate!).getTime() - new Date(b.nextRevisionDate!).getTime())
    .slice(0, 5);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
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
          {onOpenFocusConfig && (
            <button
              onClick={onOpenFocusConfig}
              className="glass-panel rounded-lg px-4 py-2 flex items-center gap-2.5 border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/5 text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer shadow-md shadow-cyan-500/5 select-none"
              title="Launch distraction-free focus mode"
            >
              <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/10 animate-pulse" />
              <div className="text-left">
                <div className="text-xs font-bold leading-none">Focus Mode</div>
                <div className="text-[9px] font-mono tracking-wider uppercase opacity-80 mt-0.5">Start Session</div>
              </div>
            </button>
          )}

          <div className="glass-panel rounded-lg px-4 py-2 flex items-center gap-2.5 border border-white/[0.06] shadow-inner group">
            <Award className="w-5 h-5 text-accentPrimary group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-sm font-bold text-white leading-none">Lvl {level}</div>
              <div className="text-[9px] text-accentPrimary font-semibold font-mono tracking-wider mt-0.5">{levelTitle}</div>
            </div>
          </div>

          <div className="glass-panel rounded-lg px-4 py-2 flex items-center gap-2.5 border border-white/[0.06] shadow-[0_0_10px_rgba(245,158,11,0.1)] group">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500/20 group-hover:animate-pulse" />
            <div>
              <div className="text-lg font-bold font-mono text-white leading-none">{state.streak}</div>
              <div className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Day Streak</div>
            </div>
          </div>
          
          <div className="glass-panel rounded-lg px-4 py-2 flex items-center gap-2.5 border border-white/[0.06] group">
            <Activity className="w-5 h-5 text-accentPrimary group-hover:scale-110 transition-transform" />
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
          <GlassCard className="flex flex-col justify-between h-full relative group hover:border-white/[0.1] transition-all overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <BookOpen className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-300">Syllabus Completion</span>
                <BookOpen className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-3xl font-extrabold text-white font-mono">{overallCompletion}%</span>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                {state.completedSegments.length} of {weekPlans.length} Weeks completed
              </p>
            </div>
            <div className="mt-4 relative z-10">
              <ProgressBar percentage={overallCompletion} />
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-between h-full relative group hover:border-white/[0.1] transition-all overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <Code2 className="w-32 h-32 text-violet-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-300">DSA Proficiency</span>
                <Code2 className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-3xl font-extrabold text-white font-mono">{dsaCompletion}%</span>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                {state.dsaTopics.reduce((acc, t) => acc + t.problems.filter(p => p.isCompleted).length, 0)} Solved Problems
              </p>
            </div>
            <div className="mt-4 relative z-10">
              <ProgressBar percentage={dsaCompletion} colorClass="bg-violet-500" />
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-between h-full relative group hover:border-white/[0.1] transition-all overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <Zap className="w-32 h-32 text-emerald-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-300">Full Stack Skills</span>
                <Zap className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-3xl font-extrabold text-white font-mono">{devCompletion}%</span>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                {projectCount} projects added to stack
              </p>
            </div>
            <div className="mt-4 relative z-10">
              <ProgressBar percentage={devCompletion} colorClass="bg-emerald-500" />
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-between h-full relative group hover:border-white/[0.1] transition-all overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <Terminal className="w-32 h-32 text-rose-500" />
            </div>
            <div className="relative z-10">
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
            <div className="mt-4 relative z-10">
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
              Current {primaryPlan.segmentType ? primaryPlan.segmentType.charAt(0).toUpperCase() + primaryPlan.segmentType.slice(1) : "Week"} Goal
            </span>
            <h3 className="text-lg font-bold text-white leading-tight">{currentWeek.title}</h3>
            <p className="text-sm text-slate-400">
              Focus: <span className="text-slate-300 font-medium">{currentWeek.focus}</span>
            </p>
          </div>
          <button
            onClick={() => setActiveTab("segments")}
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
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none overflow-hidden relative group ${
                    checked
                      ? "bg-accentPrimary/10 border-accentPrimary/30 text-white shadow-[0_0_15px_rgba(var(--color-accent-primary),0.15)]"
                      : "bg-black/40 border-white/[0.04] text-slate-400 hover:border-white/[0.1] hover:bg-white/[0.02]"
                  }`}
                >
                  {checked && (
                    <motion.div
                      layoutId={`habit-glow-${habit.key}`}
                      className="absolute inset-0 bg-gradient-to-r from-accentPrimary/0 via-accentPrimary/5 to-accentPrimary/0 pointer-events-none"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    />
                  )}
                  <div className="relative z-10 flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="mt-1 w-4 h-4 accent-accentPrimary rounded-md cursor-pointer transition-transform group-hover:scale-110"
                    />
                    <div>
                      <div className={`text-xs font-bold ${checked ? "text-white" : "text-slate-300"}`}>{habit.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{habit.desc}</div>
                    </div>
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

          {/* Weekly Goals section */}
          <div className="space-y-3 pt-3 border-t border-white/[0.06]">
            <h4 className="text-xs font-semibold text-slate-400 uppercase font-mono tracking-wider">
              Weekly Goals
            </h4>
            
            <form onSubmit={handleAddWeeklyGoal} className="flex gap-2">
              <input
                type="text"
                placeholder="Add weekly goal (e.g. Finish React Native course)..."
                value={newGoalText}
                onChange={e => setNewGoalText(e.target.value)}
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
              {!state.weeklyGoals || state.weeklyGoals.length === 0 ? (
                <p className="text-[11px] text-slate-600 font-mono italic">No weekly goals set.</p>
              ) : (
                state.weeklyGoals.map(goal => (
                  <div
                    key={goal.id}
                    className="flex justify-between items-center bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.04] p-2 rounded-md transition-all group"
                  >
                    <div
                      onClick={() => toggleWeeklyGoal(goal.id)}
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <input
                        type="checkbox"
                        checked={goal.isCompleted}
                        onChange={() => {}}
                        className="accent-accentPrimary rounded cursor-pointer"
                      />
                      <span
                        className={`text-xs ${
                          goal.isCompleted ? "line-through text-slate-600" : "text-slate-300"
                        }`}
                      >
                        {goal.text}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteWeeklyGoal(goal.id)}
                      className="text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2Icon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Next Revision Due section */}
          <div className="space-y-3 pt-3 border-t border-white/[0.06]">
            <h4 className="text-xs font-semibold text-slate-400 uppercase font-mono tracking-wider">
              Next Revision Due
            </h4>
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {upcomingRevisions.length === 0 ? (
                <p className="text-[11px] text-slate-600 font-mono italic">No upcoming revisions scheduled.</p>
              ) : (
                upcomingRevisions.map(p => {
                  const isOverdue = new Date(p.nextRevisionDate!) < new Date(today);
                  return (
                    <div
                      key={p.id}
                      className="flex flex-col bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.04] p-2 rounded-md transition-all group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-semibold text-slate-200">{p.name}</span>
                          <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{p.topicName}</span>
                        </div>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                          isOverdue ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-white/[0.05] text-slate-400 border-white/[0.1]"
                        }`}>
                          {isOverdue ? "Overdue" : p.nextRevisionDate}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </GlassCard>

        {/* Right Column: Heatmap & Alerts */}
        <div className="space-y-6">
          
          {/* Consistency Heatmap Card */}
          <GlassCard className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/[0.06] pb-3 gap-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <h3 className="text-base font-bold text-white">Prep Consistency Grid</h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex gap-0.5 bg-white/[0.02] border border-white/[0.06] p-0.5 rounded-lg">
                  <button
                    onClick={() => setHeatmapMode("plan")}
                    className={`px-2 py-1 rounded text-[10px] font-bold font-mono uppercase transition-all cursor-pointer ${
                      heatmapMode === "plan"
                        ? "bg-white/[0.06] text-white"
                        : "bg-transparent text-slate-500 hover:text-slate-350"
                    }`}
                  >
                    Roadmap
                  </button>
                  <button
                    onClick={() => setHeatmapMode("6months")}
                    className={`px-2 py-1 rounded text-[10px] font-bold font-mono uppercase transition-all cursor-pointer ${
                      heatmapMode === "6months"
                        ? "bg-white/[0.06] text-white"
                        : "bg-transparent text-slate-500 hover:text-slate-350"
                    }`}
                  >
                    6m
                  </button>
                  <button
                    onClick={() => setHeatmapMode("1year")}
                    className={`px-2 py-1 rounded text-[10px] font-bold font-mono uppercase transition-all cursor-pointer ${
                      heatmapMode === "1year"
                        ? "bg-white/[0.06] text-white"
                        : "bg-transparent text-slate-500 hover:text-slate-350"
                    }`}
                  >
                    1y
                  </button>
                  <button
                    onClick={() => setHeatmapMode("month")}
                    className={`px-2 py-1 rounded text-[10px] font-bold font-mono uppercase transition-all cursor-pointer ${
                      heatmapMode === "month"
                        ? "bg-white/[0.06] text-white"
                        : "bg-transparent text-slate-500 hover:text-slate-350"
                    }`}
                  >
                    Monthly
                  </button>
                </div>

                {heatmapMode === "month" && (
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-slate-900 border border-white/[0.08] rounded px-2 py-1 text-[10px] font-mono font-bold text-white outline-none focus:border-accentPrimary cursor-pointer"
                  >
                    {getMonthOptions().map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                <span className="text-[10px] font-mono text-slate-500 uppercase hidden md:inline">{primaryPlan.title}</span>
              </div>
            </div>
             {renderedHeatmap}
            <p className="text-[11px] text-slate-500 font-mono leading-relaxed mt-2">
              {heatmapMode === "plan" 
                ? "Each grid column represents a segments week (Sunday-Saturday rows). Bright cells indicate a high number of habits ticked on that day. Complete your weeks to keep the momentum going!"
                : heatmapMode === "month"
                ? "Showing progress grid for the selected month. Empty cells represent adjacent months' buffer. Click highlighted cells to inspect daily stats."
                : "Calendar view of daily habit checklists. Darker squares denote higher consistency. Inspect any active cell to view detailed solved problems logs."}
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

          {/* AI Trend Chart */}
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-white">AI Dependency Trend (7 Days)</h3>
            </div>
            <div className="h-32 flex items-end gap-2 px-2 pt-2">
              {aiTrendData.map((data, i) => {
                const heightPercentage = (data.queries / maxQueries) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-black/80 text-white text-[9px] px-2 py-1 rounded transition-opacity font-mono whitespace-nowrap z-10 pointer-events-none">
                      {data.queries} queries
                    </div>
                    <div className="w-full bg-white/[0.02] rounded-sm overflow-hidden flex flex-col justify-end h-24 relative">
                      <div
                        className="w-full bg-accentPrimary/40 transition-all group-hover:bg-accentPrimary/60"
                        style={{ height: `${heightPercentage}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {data.date.substring(5).replace("-", "/")}
                    </span>
                  </div>
                );
              })}
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

    </motion.div>
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
