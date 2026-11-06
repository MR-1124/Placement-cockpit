import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import type { DailyHabitState } from "../context/AppStateContext";
import { SpotlightCard, ProgressRing, ProgressBar, MetricBadge, AnimatedCounter } from "../components/Common";
import {
  Flame,
  BookOpen,
  Code2,
  Zap,
  Activity,
  Terminal,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Play,
  Brain,
  CheckCircle2,
  Calendar,
  X
} from "lucide-react";
import confetti from "canvas-confetti";

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
  const curriculum = useAppState(s => s.curriculum);

  const ALL_PLANS = curriculum.ALL_PLANS;

  const allProblemsFlat = useMemo(() => {
    const flat: any[] = [];
    const seenIds = new Set();
    curriculum.DEFAULT_DSA_TOPICS.forEach((topic: any) => {
      topic.problems.forEach((prob: any) => {
        if (!seenIds.has(prob.id)) {
          seenIds.add(prob.id);
          flat.push(prob);
        }
      });
    });
    return flat;
  }, [curriculum.DEFAULT_DSA_TOPICS]);

  const todaySolvedList = useMemo(() => {
    const solvedRecord = state.practiceProblemsSolved || {};
    const todayStr = new Date().toISOString().split("T")[0];
    return Object.entries(solvedRecord)
      .filter(([_, info]: any) => info.timestamp?.startsWith(todayStr))
      .map(([id, info]: any) => {
        const prob = allProblemsFlat.find(p => p.id === id);
        return prob ? { ...prob, duration: info.duration } : null;
      })
      .filter(Boolean);
  }, [state.practiceProblemsSolved, allProblemsFlat]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

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
  const primaryUserPlan = (state.userPlans || []).find(up => up.planId === primaryPlanId) || (state.userPlans || [])[0];
  const primaryCompletedSegments = primaryUserPlan?.completedSegments || [];
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

  const handleToggleHabitWithFx = (key: keyof DailyHabitState) => {
    const willBeChecked = !state.dailyHabits[key];
    toggleHabit(key);
    
    // If completing the 6th habit, trigger celebratory burst
    if (willBeChecked) {
      const currentCompleted = Object.values(state.dailyHabits).filter(Boolean).length;
      if (currentCompleted + 1 === 6) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ["#8b5cf6", "#10b981", "#f59e0b", "#f43f5e"]
        });
      }
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
      const startDay = startDate.getDay();
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

        let completionIntensity = 0;

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

        const isWeekCompleted = primaryCompletedSegments.includes(weekPlans[weekIndex]?.id);

        let colorClass = "bg-white/[0.03] border-white/[0.04]";
        if (isFuture) {
          colorClass = "bg-white/[0.01] border-white/[0.01] opacity-25 cursor-not-allowed";
        } else if (completionIntensity === 1) {
          colorClass = "bg-accentPrimary/25 border-accentPrimary/20 shadow-[0_0_6px_rgba(var(--accent-rgb),0.15)]";
        } else if (completionIntensity === 2) {
          colorClass = "bg-accentPrimary/50 border-accentPrimary/35 shadow-[0_0_8px_rgba(var(--accent-rgb),0.25)]";
        } else if (completionIntensity === 3) {
          colorClass = "bg-accentPrimary/75 border-accentPrimary/50 shadow-[0_0_12px_rgba(var(--accent-rgb),0.4)]";
        } else if (completionIntensity === 4) {
          colorClass = "bg-accentPrimary border-white/60 shadow-[0_0_16px_rgba(var(--accent-rgb),0.6)]";
        } else if (isWeekCompleted) {
          colorClass = "bg-slate-800/60 border-slate-700/30";
        }

        cells.push(
          <motion.div
            key={dayOffset}
            whileHover={isFuture ? undefined : { scale: 1.25, zIndex: 10 }}
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
            className={`w-3.5 h-3.5 rounded-[4px] border transition-all ${
              isFuture ? "" : "cursor-pointer"
            } ${colorClass}`}
          />
        );
      }
    } else if (heatmapMode === "6months" || heatmapMode === "1year") {
      const weeksCount = heatmapMode === "6months" ? 24 : 53;
      const todayDate = new Date(today);
      const todayDay = todayDate.getDay();
      const endOfWeekOffset = 6 - todayDay;
      const graphEndDate = new Date(todayDate);
      graphEndDate.setDate(graphEndDate.getDate() + endOfWeekOffset);
      
      const totalDays = weeksCount * 7;

      for (let dayOffset = 0; dayOffset < totalDays; dayOffset++) {
        const dateOffset = new Date(graphEndDate);
        dateOffset.setDate(dateOffset.getDate() - (totalDays - 1 - dayOffset));
        const dateStr = dateOffset.toISOString().split("T")[0];

        const isFuture = new Date(dateStr) > new Date(today);

        let completionIntensity = 0;

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

        let colorClass = "bg-white/[0.03] border-white/[0.04]";
        if (isFuture) {
          colorClass = "bg-white/[0.01] border-white/[0.01] opacity-25 cursor-not-allowed";
        } else if (completionIntensity === 1) {
          colorClass = "bg-accentPrimary/25 border-accentPrimary/20";
        } else if (completionIntensity === 2) {
          colorClass = "bg-accentPrimary/50 border-accentPrimary/35";
        } else if (completionIntensity === 3) {
          colorClass = "bg-accentPrimary/75 border-accentPrimary/50";
        } else if (completionIntensity === 4) {
          colorClass = "bg-accentPrimary border-white/60 shadow-[0_0_14px_rgba(var(--accent-rgb),0.5)]";
        }

        cells.push(
          <motion.div
            key={dayOffset}
            whileHover={isFuture ? undefined : { scale: 1.25, zIndex: 10 }}
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
            className={`w-3.5 h-3.5 rounded-[4px] border transition-all ${
              isFuture ? "" : "cursor-pointer"
            } ${colorClass}`}
          />
        );
      }
    } else if (heatmapMode === "month") {
      const [y, m] = selectedMonth.split("-").map(Number);
      const firstDay = new Date(y, m - 1, 1);
      const firstDayOfWeek = firstDay.getDay();
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

        let colorClass = "bg-white/[0.03] border-white/[0.04]";
        if (!isCurrentMonth) {
          colorClass = "bg-transparent border-transparent opacity-10 pointer-events-none";
        } else if (isFuture) {
          colorClass = "bg-white/[0.01] border-white/[0.01] opacity-25 cursor-not-allowed";
        } else if (completionIntensity === 1) {
          colorClass = "bg-accentPrimary/25 border-accentPrimary/20";
        } else if (completionIntensity === 2) {
          colorClass = "bg-accentPrimary/50 border-accentPrimary/35";
        } else if (completionIntensity === 3) {
          colorClass = "bg-accentPrimary/75 border-accentPrimary/50";
        } else if (completionIntensity === 4) {
          colorClass = "bg-accentPrimary border-white/60 shadow-[0_0_14px_rgba(var(--accent-rgb),0.5)]";
        }

        cells.push(
          <motion.div
            key={dayOffset}
            whileHover={!isCurrentMonth || isFuture ? undefined : { scale: 1.25, zIndex: 10 }}
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
            className={`w-3.5 h-3.5 rounded-[4px] border transition-all ${
              isCurrentMonth && !isFuture ? "cursor-pointer" : ""
            } ${colorClass}`}
          />
        );
      }
    }

    return (
      <div className="flex flex-col gap-3 overflow-x-auto pb-2 custom-scrollbar">
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[360px] p-1">
          {cells}
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono px-1">
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
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Less</span>
            <div className="w-2.5 h-2.5 rounded-[2px] bg-white/[0.04] border border-white/[0.04]" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-accentPrimary/25 border border-accentPrimary/20" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-accentPrimary/50 border border-accentPrimary/35" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-accentPrimary/75 border border-accentPrimary/50" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-accentPrimary border-white/60" />
            <span className="text-slate-500">More</span>
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
    if (score < 25) return { name: "Healthy (Independent)", color: "neon-pill-emerald" };
    if (score < 50) return { name: "Caution (Assisted)", color: "neon-pill-amber" };
    return { name: "Risky (Vibe-Coding)", color: "neon-pill-rose" };
  };

  const aiZone = getAiZone(aiDependencyScore);

  const { aiTrendData, maxQueries } = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    const trend = days.map(dateStr => {
      const queries = (state.aiLogs || []).filter(log => log.date === dateStr).length;
      return { date: dateStr, queries };
    });

    const max = Math.max(1, ...trend.map(d => d.queries));
    return { aiTrendData: trend, maxQueries: max };
  }, [state.aiLogs]);

  const upcomingRevisions = useMemo(() => {
    return state.dsaTopics
      .flatMap(topic => topic.problems.map(p => ({ ...p, topicName: topic.name })))
      .filter(p => p.nextRevisionDate)
      .sort((a, b) => new Date(a.nextRevisionDate!).getTime() - new Date(b.nextRevisionDate!).getTime())
      .slice(0, 5);
  }, [state.dsaTopics]);

  const totalDsaSolved = useMemo(() => {
    return state.dsaTopics.reduce((acc, t) => acc + t.problems.filter(p => p.isCompleted).length, 0);
  }, [state.dsaTopics]);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Cockpit Mission Control Hero Banner */}
      <SpotlightCard className="p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accentPrimary font-bold bg-accentPrimary/10 border border-accentPrimary/25 px-2.5 py-0.5 rounded-md shadow-[0_0_10px_rgba(var(--accent-rgb),0.1)]">
                Cybernetic Readiness Engine
              </span>
              <span className="text-[10px] font-mono text-slate-500">• 2026 Cohort</span>
              {state.settings.integrations?.leetcodeUsername && (
                <button
                  onClick={() => setActiveTab("profile")}
                  className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md hover:bg-amber-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                  title="LeetCode Connected"
                >
                  <span>⚡ LC: @{state.settings.integrations.leetcodeUsername}</span>
                </button>
              )}
              {state.settings.integrations?.githubUsername && (
                <button
                  onClick={() => setActiveTab("profile")}
                  className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md hover:bg-emerald-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                  title="GitHub Connected"
                >
                  <span>🐙 GH: @{state.settings.integrations.githubUsername}</span>
                </button>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Engineering Mission Control
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Track algorithm mastery, fullstack architecture milestones, and anti-vibe-coding telemetry to ensure interview readiness.
            </p>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-3">
            {onOpenFocusConfig && (
              <button
                onClick={onOpenFocusConfig}
                className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-accentPrimary/15 hover:bg-accentPrimary/25 border border-accentPrimary/30 text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-[0_0_20px_rgba(var(--accent-rgb),0.15)] hover:shadow-[0_0_25px_rgba(var(--accent-rgb),0.3)] active:scale-95"
              >
                <Zap className="w-4 h-4 text-accentPrimary group-hover:scale-110 transition-transform" />
                <span>Launch Focus Mode</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab("interview")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 hover:text-white text-xs font-mono font-semibold transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Mock Interview</span>
            </button>
          </div>
        </div>
      </SpotlightCard>

      {/* 2. Primary Telemetry Bento Grid (Readiness + 4 Core Metrics) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placement Readiness Telemetry Card */}
        <SpotlightCard className="flex flex-col items-center justify-between p-6 sm:p-8 relative">
          <div className="w-full flex justify-between items-center mb-4">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-accentPrimary" /> Readiness Index
            </span>
            <button
              onClick={() => setShowReadinessExplainer(true)}
              className="text-slate-400 hover:text-white text-[10px] font-mono border border-white/[0.08] hover:border-accentPrimary/40 rounded-lg px-2 py-0.5 bg-white/[0.02] transition-colors cursor-pointer"
            >
              Weights
            </button>
          </div>

          <div className="my-2">
            <ProgressRing
              percentage={readinessScore}
              size={155}
              strokeWidth={12}
              label="Readiness"
              subLabel="Overall Evaluation"
              colorClass={
                readinessScore >= 75
                  ? "text-emerald-400"
                  : readinessScore >= 50
                  ? "text-amber-400"
                  : "text-rose-400"
              }
            />
          </div>

          {/* 4 Weights Micro Progress Bars */}
          <div className="w-full space-y-2 mt-4 pt-4 border-t border-white/[0.06] font-mono text-[10px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">DSA Mastery (35%):</span>
              <span className="text-slate-200 font-bold">{Math.round(dsaCompletion)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Dev Portfolio (30%):</span>
              <span className="text-slate-200 font-bold">{Math.round(devCompletion)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Streak Bonus (10%):</span>
              <span className="text-amber-400 font-bold">🔥 {state.streak}d</span>
            </div>
          </div>
        </SpotlightCard>

        {/* 4 Stat Cards in 2x2 Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Syllabus Progress */}
          <SpotlightCard className="flex flex-col justify-between cursor-pointer" onClick={() => setActiveTab("segments")}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Plan Syllabus</span>
                <BookOpen className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                  <AnimatedCounter value={Math.round(overallCompletion)} />%
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  ({primaryCompletedSegments.length}/{weekPlans.length} {primaryPlan.segmentType || "Weeks"})
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1 font-mono">
                Active: {currentWeek.title}
              </p>
            </div>
            <div className="mt-4">
              <ProgressBar percentage={overallCompletion} colorClass="bg-blue-500" />
            </div>
          </SpotlightCard>

          {/* DSA Problem Solver */}
          <SpotlightCard className="flex flex-col justify-between cursor-pointer" onClick={() => setActiveTab("dsa")}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">DSA Bank</span>
                <Code2 className="w-4 h-4 text-accentPrimary" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                  <AnimatedCounter value={totalDsaSolved} />
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Solved ({Math.round(dsaCompletion)}% Target)
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {allProblemsFlat.length - totalDsaSolved} problems remaining
              </p>
            </div>
            <div className="mt-4">
              <ProgressBar percentage={dsaCompletion} colorClass="bg-accentPrimary" />
            </div>
          </SpotlightCard>

          {/* Full Stack Skills */}
          <SpotlightCard className="flex flex-col justify-between cursor-pointer" onClick={() => setActiveTab("dev")}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Full Stack</span>
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                  <AnimatedCounter value={Math.round(devCompletion)} />%
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Mastery ({projectCount} Projects)
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Frontend, Backend, DB & Systems
              </p>
            </div>
            <div className="mt-4">
              <ProgressBar percentage={devCompletion} colorClass="bg-emerald-500" />
            </div>
          </SpotlightCard>

          {/* AI Dependency */}
          <SpotlightCard className="flex flex-col justify-between cursor-pointer" onClick={() => setActiveTab("ai")}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">AI Autonomy</span>
                <Terminal className="w-4 h-4 text-rose-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                  <AnimatedCounter value={Math.round(aiDependencyScore)} />%
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border uppercase ${aiZone.color}`}>
                  {aiZone.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Goal: Keep &lt;20% for interview fitness
              </p>
            </div>
            <div className="mt-4">
              <ProgressBar percentage={aiDependencyScore} colorClass="bg-rose-500" />
            </div>
          </SpotlightCard>
        </div>
      </div>

      {/* 3. Daily Challenge Banner */}
      {state.dailyChallenge && !state.dailyChallenge.isCompleted && (
        <SpotlightCard className="p-5 border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-accentPrimary/5 to-transparent">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    ⚡ 2× XP Daily Challenge
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    Topic: {state.dailyChallenge.topicName}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  {state.dailyChallenge.problemName}
                </h3>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("practice")}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Solve Challenge (+{state.dailyChallenge.xpBonus} XP)</span>
            </button>
          </div>
        </SpotlightCard>
      )}

      {/* 4. Split Layout: Habits/Tasks & Consistency Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Daily Habits & Custom Tasks */}
        <SpotlightCard className="space-y-6">
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accentPrimary" /> Daily Discipline Protocol
              </h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                {Object.values(state.dailyHabits).filter(Boolean).length} of 6 Completed Today
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Resets Midnight</span>
          </div>

          {/* 6 Habits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: "solveDsa", label: "Solve DSA Problems", desc: "2 Problems minimum" },
              { key: "reviseOld", label: "Revise Old Concepts", desc: "Spaced repetition" },
              { key: "buildFeature", label: "Build Feature Manually", desc: "Write without copying" },
              { key: "avoidAi", label: "Strict Low-AI Coding", desc: "Manual attempts first" },
              { key: "pushGithub", label: "Push progress to Git", desc: "Maintain green dots" },
              { key: "readDoc", label: "Read Docs / Textbooks", desc: "Raw technical text" }
            ].map(habit => {
              const checked = state.dailyHabits[habit.key as keyof DailyHabitState];
              return (
                <div
                  key={habit.key}
                  onClick={() => handleToggleHabitWithFx(habit.key as keyof DailyHabitState)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none relative group overflow-hidden ${
                    checked
                      ? "bg-accentPrimary/10 border-accentPrimary/35 text-white shadow-[0_0_15px_rgba(var(--accent-rgb),0.12)]"
                      : "bg-white/[0.015] border-white/[0.05] text-slate-400 hover:border-white/[0.12] hover:bg-white/[0.03]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {}}
                    className="mt-0.5 w-4 h-4 accent-accentPrimary rounded cursor-pointer transition-transform group-hover:scale-110"
                  />
                  <div>
                    <div className={`text-xs font-bold ${checked ? "text-white" : "text-slate-300"}`}>
                      {habit.label}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{habit.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Tasks Checklist */}
          <div className="space-y-3 pt-3 border-t border-white/[0.06]">
            <h4 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
              Today's Custom Tasks
            </h4>
            
            <form onSubmit={handleAddCustomTask} className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom task (e.g. Redo SQL Joins)..."
                value={newTaskName}
                onChange={e => setNewTaskName(e.target.value)}
                className="flex-1 bg-white/[0.02] border border-white/[0.08] focus:border-accentPrimary rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="bg-accentPrimary/15 hover:bg-accentPrimary/25 text-accentPrimary border border-accentPrimary/30 rounded-xl px-4 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                Add
              </button>
            </form>

            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
              {state.customTasks.length === 0 ? (
                <p className="text-[11px] text-slate-500 font-mono italic">No custom tasks scheduled.</p>
              ) : (
                state.customTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex justify-between items-center bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] p-2.5 rounded-xl transition-all group"
                  >
                    <div
                      onClick={() => toggleCustomTask(task.id)}
                      className="flex items-center gap-2.5 cursor-pointer flex-1"
                    >
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => {}}
                        className="accent-accentPrimary rounded cursor-pointer"
                      />
                      <span className={`text-xs ${task.isCompleted ? "line-through text-slate-500" : "text-slate-200"}`}>
                        {task.name}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteCustomTask(task.id)}
                      className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Weekly Goals Section */}
          <div className="space-y-3 pt-3 border-t border-white/[0.06]">
            <h4 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
              Sprint Goals for the Week
            </h4>
            
            <form onSubmit={handleAddWeeklyGoal} className="flex gap-2">
              <input
                type="text"
                placeholder="Add weekly milestone (e.g. Build Rate Limiter)..."
                value={newGoalText}
                onChange={e => setNewGoalText(e.target.value)}
                className="flex-1 bg-white/[0.02] border border-white/[0.08] focus:border-accentPrimary rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1] rounded-xl px-4 text-xs font-mono font-semibold transition-all cursor-pointer"
              >
                Add
              </button>
            </form>

            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
              {(!state.weeklyGoals || state.weeklyGoals.length === 0) ? (
                <p className="text-[11px] text-slate-500 font-mono italic">No weekly sprint goals set.</p>
              ) : (
                state.weeklyGoals.map(goal => (
                  <div
                    key={goal.id}
                    className="flex justify-between items-center bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] p-2.5 rounded-xl transition-all group"
                  >
                    <div
                      onClick={() => toggleWeeklyGoal(goal.id)}
                      className="flex items-center gap-2.5 cursor-pointer flex-1"
                    >
                      <input
                        type="checkbox"
                        checked={goal.isCompleted}
                        onChange={() => {}}
                        className="accent-accentPrimary rounded cursor-pointer"
                      />
                      <span className={`text-xs ${goal.isCompleted ? "line-through text-slate-500" : "text-slate-200"}`}>
                        {goal.text}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteWeeklyGoal(goal.id)}
                      className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </SpotlightCard>

        {/* Right Column: Heatmap Grid & Practice Stream */}
        <div className="space-y-6">
          {/* Consistency Heatmap Card */}
          <SpotlightCard className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/[0.06] pb-3 gap-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accentPrimary" />
                <h3 className="text-base font-bold text-white">Habit Consistency Matrix</h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex gap-0.5 bg-white/[0.02] border border-white/[0.06] p-0.5 rounded-xl">
                  {(["plan", "6months", "1year", "month"] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setHeatmapMode(mode)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono uppercase transition-all cursor-pointer ${
                        heatmapMode === mode
                          ? "bg-accentPrimary/20 text-accentPrimary border border-accentPrimary/30"
                          : "bg-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {mode === "plan" ? "Roadmap" : mode === "6months" ? "6M" : mode === "1year" ? "1Y" : "Month"}
                    </button>
                  ))}
                </div>

                {heatmapMode === "month" && (
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-darkCard border border-white/[0.08] rounded-lg px-2 py-1 text-[10px] font-mono text-white outline-none focus:border-accentPrimary cursor-pointer"
                  >
                    {getMonthOptions().map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {renderedHeatmap}

            <p className="text-[11px] text-slate-400 font-mono leading-relaxed mt-2">
              Lighter cells indicate higher daily completions. Click any highlighted cell to inspect detailed solves on that date.
            </p>
          </SpotlightCard>

          {/* Today's Practice Stream Card */}
          <SpotlightCard className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-400 animate-pulse" /> Today's Solved Questions
              </h3>
              <button
                onClick={() => setActiveTab("practice")}
                className="text-[10px] font-mono font-bold text-accentPrimary hover:underline flex items-center gap-1 cursor-pointer"
              >
                Practice Arena <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="space-y-2">
              {todaySolvedList.length === 0 ? (
                <p className="text-xs text-slate-500 italic font-mono py-2">
                  No problems solved today yet. Launch Practice Arena to begin!
                </p>
              ) : (
                <div className="space-y-2">
                  {todaySolvedList.map((prob: any) => {
                    let diffVariant: "emerald" | "amber" | "rose" = "emerald";
                    if (prob.difficulty === "Medium") diffVariant = "amber";
                    if (prob.difficulty === "Hard") diffVariant = "rose";
                    return (
                      <div
                        key={prob.id}
                        className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-slate-200 font-semibold truncate max-w-[200px]">{prob.name}</span>
                          <MetricBadge label="Diff" value={prob.difficulty} variant={diffVariant} className="py-0.5 text-[9px]" />
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/[0.06]">
                          {formatTime(prob.duration)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </SpotlightCard>

          {/* AI Trend 7 Days */}
          <SpotlightCard className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
              <TrendingUp className="w-4 h-4 text-accentPrimary" />
              <h3 className="text-sm font-bold text-white">AI Dependency Trend (7 Days)</h3>
            </div>
            <div className="h-28 flex items-end gap-2 px-2 pt-2">
              {aiTrendData.map((data, i) => {
                const heightPercentage = (data.queries / maxQueries) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-black/80 text-white text-[9px] px-2 py-1 rounded transition-opacity font-mono whitespace-nowrap z-10 pointer-events-none">
                      {data.queries} queries
                    </div>
                    <div className="w-full bg-white/[0.02] rounded-md overflow-hidden flex flex-col justify-end h-20 relative">
                      <div
                        className="w-full bg-accentPrimary/50 transition-all group-hover:bg-accentPrimary rounded-t-md"
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
          </SpotlightCard>

          {/* Upcoming Spaced Revisions Card */}
          <SpotlightCard className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accentPrimary" /> Upcoming Spaced Revisions
              </h3>
              <button
                onClick={() => setActiveTab("revision")}
                className="text-[10px] font-mono font-bold text-accentPrimary hover:underline flex items-center gap-1 cursor-pointer"
              >
                Revision Deck <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
              {upcomingRevisions.length === 0 ? (
                <p className="text-xs text-slate-500 font-mono italic py-2">
                  No upcoming spaced repetitions scheduled.
                </p>
              ) : (
                upcomingRevisions.map(p => {
                  const isOverdue = new Date(p.nextRevisionDate!) < new Date(today);
                  return (
                    <div
                      key={p.id}
                      className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] p-2.5 rounded-xl transition-all"
                    >
                      <div>
                        <span className="text-xs font-semibold text-slate-200">{p.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{p.topicName}</span>
                      </div>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-lg border ${
                        isOverdue ? "neon-pill-rose" : "neon-pill-cyan"
                      }`}>
                        {isOverdue ? "Overdue" : p.nextRevisionDate}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </SpotlightCard>
        </div>
      </div>

      {/* Selected Heatmap Cell Modal */}
      {selectedHeatmapCell && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <SpotlightCard className="w-full max-w-md space-y-4 border border-white/[0.12] shadow-2xl bg-darkCard/95 p-6 relative">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Day Inspector</span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {selectedHeatmapCell.date === today ? `Today (${selectedHeatmapCell.date})` : selectedHeatmapCell.date}
                </h3>
              </div>
              <button
                onClick={() => setSelectedHeatmapCell(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg border border-white/[0.08] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl flex items-center justify-between">
                <span className="text-slate-400 font-medium">Habits Completed:</span>
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
                      <div className="p-4 text-center text-slate-500 font-mono italic bg-white/[0.01] border border-white/[0.04] rounded-xl">
                        No DSA problems recorded on this date.
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                      {solved.map(p => (
                        <div key={p.id} className="flex justify-between items-center bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-xl">
                          <div>
                            <span className="font-semibold text-slate-200">{p.name}</span>
                            <span className="text-[9px] text-slate-500 font-mono block">{p.topicName}</span>
                          </div>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-lg border ${
                            p.difficulty === "Hard"
                              ? "neon-pill-rose"
                              : p.difficulty === "Medium"
                              ? "neon-pill-amber"
                              : "neon-pill-emerald"
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
          </SpotlightCard>
        </div>
      )}

      {/* Readiness Explainer Modal */}
      {showReadinessExplainer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <SpotlightCard className="w-full max-w-md space-y-4 border border-white/[0.12] shadow-2xl bg-darkCard/95 p-6 relative">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Readiness Mechanics</span>
                <h3 className="text-sm font-bold text-white mt-0.5">Placement Index Weights</h3>
              </div>
              <button
                onClick={() => setShowReadinessExplainer(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg border border-white/[0.08] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-slate-300">
              <p>
                Your <strong>Placement Readiness Index</strong> computes your holistic technical readiness for technical screenings and interview loops.
              </p>
              
              <div className="bg-white/[0.02] border border-white/[0.04] p-3.5 rounded-xl space-y-2 font-mono text-[10px]">
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
                  <span className="text-slate-400">5. AI Dependency Penalty</span>
                  <span className="text-rose-400 font-bold">Up to -15%</span>
                </div>
              </div>

              <div className="border-t border-white/[0.06] pt-3 text-[11px] text-slate-400 italic">
                💡 High reliance on AI directly reduces your readiness percentage. Solve problems independently, keep your streak alive, and deploy projects to maximize your score.
              </div>
            </div>
          </SpotlightCard>
        </div>
      )}
    </div>
  );
};
