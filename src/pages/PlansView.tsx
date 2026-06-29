import React, { useState } from "react";
import { useAppState } from "../context/AppStateContext";

import type { Plan } from "../data/curriculum";
import { 
  Search, 
  Clock, 
  Activity, 
  Star, 
  Play, 
  Pause, 
  Plus, 
  Trash2, 
  ArrowUpDown,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const PlansView: React.FC = () => {
  const state = useAppState(s => s.state);
const followPlan = useAppState(s => s.followPlan);
const pausePlan = useAppState(s => s.pausePlan);
const unfollowPlan = useAppState(s => s.unfollowPlan);
const setPrimaryPlan = useAppState(s => s.setPrimaryPlan);
const curriculum = useAppState(s => s.curriculum);
const confirmAction = useAppState(s => s.confirmAction);


  const ALL_PLANS = curriculum.ALL_PLANS;

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"All" | "Mastery" | "Placement" | "Sprint">("All");
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | "Easy" | "Medium" | "Hard" | "Extreme">("All");
  const [durationFilter, setDurationFilter] = useState<"All" | "<6" | "6-12" | ">12">("All");
  const [sortBy, setSortBy] = useState<"default" | "shortest" | "longest" | "easiest" | "hardest">("default");

  const userPlans = state.userPlans || [];
  const primaryPlanId = state.primaryPlanId || "16-week-mastery";

  // Check if user follows a plan
  const getFollowedPlan = (planId: string) => {
    return userPlans.find(up => up.planId === planId);
  };

  // Calculate plan specific completion
  const getPlanCompletion = (plan: Plan) => {
    const followed = getFollowedPlan(plan.id);
    if (!followed || followed.completedWeeks.length === 0) return 0;
    return Math.round((followed.completedWeeks.length / plan.durationWeeks) * 100);
  };

  // Filter and Sort plans
  const filteredPlans = ALL_PLANS.filter(plan => {
    const matchesSearch = 
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === "All" || plan.category === categoryFilter;

    const matchesDifficulty = difficultyFilter === "All" || plan.difficulty === difficultyFilter;

    let matchesDuration = true;
    if (durationFilter === "<6") matchesDuration = plan.durationWeeks < 6;
    else if (durationFilter === "6-12") matchesDuration = plan.durationWeeks >= 6 && plan.durationWeeks <= 12;
    else if (durationFilter === ">12") matchesDuration = plan.durationWeeks > 12;

    return matchesSearch && matchesCategory && matchesDifficulty && matchesDuration;
  }).sort((a, b) => {
    if (sortBy === "shortest") return a.durationWeeks - b.durationWeeks;
    if (sortBy === "longest") return b.durationWeeks - a.durationWeeks;
    
    const diffWeights = { Easy: 1, Medium: 2, Hard: 3, Extreme: 4 };
    if (sortBy === "easiest") return diffWeights[a.difficulty] - diffWeights[b.difficulty];
    if (sortBy === "hardest") return diffWeights[b.difficulty] - diffWeights[a.difficulty];
    
    return 0; // default order
  });

  // Difficulty badge colors
  const getDiffBadgeStyles = (diff: string) => {
    switch (diff) {
      case "Easy": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Medium": return "bg-violet-500/10 text-violet-400 border-violet-500/20";
      case "Hard": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Extreme": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Placement Training Plans</h1>
          <p className="text-slate-400 text-sm mt-1">
            Choose curriculum roadmaps optimized for different durations and target outcomes.
          </p>
        </div>
      </div>

      {/* Filters & Sorting Control Panel */}
      <div className="bg-darkCard/40 border border-white/[0.04] backdrop-blur-md p-6 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-500" />
            </span>
            <input
              type="text"
              placeholder="Search plans by name or focus tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/60 shadow-inner border border-white/[0.08] focus:border-accentPrimary rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="w-full bg-black/60 shadow-inner border border-white/[0.08] focus:border-accentPrimary rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none transition-all cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Mastery">Mastery (Full Term)</option>
              <option value="Placement">Placement (Core)</option>
              <option value="Sprint">Sprint (Crash Course)</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as any)}
              className="w-full bg-black/60 shadow-inner border border-white/[0.08] focus:border-accentPrimary rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none transition-all cursor-pointer"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Extreme">Extreme</option>
            </select>
          </div>

          {/* Sorting Box */}
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-black/60 shadow-inner border border-white/[0.08] focus:border-accentPrimary rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-300 outline-none transition-all cursor-pointer"
              >
                <option value="default">Sort: Default</option>
                <option value="shortest">Sort: Shortest Duration</option>
                <option value="longest">Sort: Longest Duration</option>
                <option value="easiest">Sort: Easiest First</option>
                <option value="hardest">Sort: Hardest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Duration Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.04] text-xs">
          <span className="text-slate-500 mr-2">Duration:</span>
          {["All", "<6", "6-12", ">12"].map((filter) => (
            <button
              key={filter}
              onClick={() => setDurationFilter(filter as any)}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                durationFilter === filter
                  ? "bg-accentPrimary/20 text-accentPrimary border-accentPrimary/30"
                  : "bg-transparent text-slate-400 border-white/[0.06] hover:text-white"
              }`}
            >
              {filter === "All" ? "All Weeks" : filter === "<6" ? "Short (< 6 Weeks)" : filter === "6-12" ? "Mid (6-12 Weeks)" : "Long (> 12 Weeks)"}
            </button>
          ))}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredPlans.map((plan) => {
            const followed = getFollowedPlan(plan.id);
            const isPrimary = primaryPlanId === plan.id;
            const completion = getPlanCompletion(plan);

            return (
              <motion.div
                key={plan.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`relative group bg-darkCard/40 border rounded-2xl backdrop-blur-md flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-white/[0.12] hover:shadow-xl ${
                  isPrimary ? "border-accentPrimary/40 shadow-accentPrimary/5" : "border-white/[0.04]"
                }`}
              >
                {/* Status Badges Overlay */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {isPrimary && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-accentPrimary/20 text-accentPrimary border border-accentPrimary/30 shadow-md">
                      <Star className="w-3 h-3 fill-accentPrimary" /> Primary
                    </span>
                  )}
                  {followed && !isPrimary && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ● Following
                    </span>
                  )}
                  {followed?.paused && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      ⏸ Paused
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-5 flex-1">
                  {/* Card Title & Desc */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-accentPrimary transition-colors pr-20">
                      {plan.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed min-h-[40px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Plan Specs Grid */}
                  <div className="grid grid-cols-2 gap-3.5 bg-slate-950/30 p-3.5 rounded-xl border border-white/[0.02]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Duration</span>
                        <span className="text-xs font-semibold text-slate-200">{plan.durationWeeks} Weeks</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-slate-500" />
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Difficulty</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${getDiffBadgeStyles(plan.difficulty)}`}>
                          {plan.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-3.5 h-3.5 text-slate-500" />
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Daily Time</span>
                        <span className="text-xs font-semibold text-slate-200">{plan.estimatedHoursPerDay}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Syllabus</span>
                        <span className="text-xs font-semibold text-slate-200">{plan.roadmap.length} Weeks</span>
                      </div>
                    </div>
                  </div>

                  {/* Plan Focus Tags */}
                  <div className="flex flex-wrap gap-1.5 min-h-[50px]">
                    {plan.tags.map((tag, idx) => (
                      <span 
                        key={idx} 
                        className="text-[10px] bg-slate-900/60 border border-white/[0.04] text-slate-400 px-2 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Progress Indicator (if followed) */}
                  {followed && (
                    <div className="space-y-2 pt-3 border-t border-white/[0.04]">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-medium">Plan Progress</span>
                        <span className="text-white font-mono font-bold">{completion}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-accentPrimary h-full rounded-full transition-all duration-500" 
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                        <span>{followed.completedWeeks.length} of {plan.durationWeeks} Weeks done</span>
                        {completion === 100 && <span className="text-emerald-400 font-bold">✓ Completed</span>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions Panel */}
                <div className="p-6 bg-slate-950/20 border-t border-white/[0.04] flex flex-col gap-2">
                  {followed ? (
                    <>
                      {/* Already following */}
                      {!isPrimary && (
                        <button
                          onClick={() => setPrimaryPlan(plan.id)}
                          className="w-full py-2 bg-accentPrimary hover:bg-accentPrimary/90 active:scale-[0.98] hover:scale-[1.02] text-black font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(var(--color-accent-primary),0.4)] cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-black" /> Set As Primary
                        </button>
                      )}
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => pausePlan(plan.id)}
                          className="flex-1 py-2 bg-slate-900 border border-white/[0.06] hover:bg-slate-800 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          {followed.paused ? (
                            <>
                              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" /> Resume
                            </>
                          ) : (
                            <>
                              <Pause className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Pause
                            </>
                          )}
                        </button>
                        
                        {plan.id !== "16-week-mastery" && (
                          <button
                            onClick={() => {
                              confirmAction({
                                title: "Unfollow Plan",
                                message: `Are you sure you want to unfollow "${plan.title}"? Your progress on this plan will be deleted.`,
                                confirmText: "Unfollow",
                                cancelText: "Cancel",
                                severity: "danger",
                                onConfirm: () => unfollowPlan(plan.id)
                              });
                            }}
                            className="px-3 py-2 bg-slate-900 border border-white/[0.06] hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400 text-slate-400 font-semibold rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer"
                            title="Unfollow Plan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    /* Not following yet */
                    <button
                      onClick={() => followPlan(plan.id)}
                      className="w-full py-2 bg-slate-900 border border-white/[0.08] hover:bg-slate-800 active:scale-[0.98] hover:scale-[1.02] text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Follow Plan
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
