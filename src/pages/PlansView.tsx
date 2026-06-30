import React, { useState } from "react";
import { useAppState } from "../context/AppStateContext";
import { GlassCard } from "../components/Common";

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
  BookOpen,
  ArrowLeft,
  Calendar,
  Target,
  Rocket,
  ChevronDown,
  ChevronUp,
  CheckCircle2
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
  
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});

  const userPlans = state.userPlans || [];
  const primaryPlanId = state.primaryPlanId || "16-week-mastery";

  // Check if user follows a plan
  const getFollowedPlan = (planId: string) => {
    return userPlans.find(up => up.planId === planId);
  };

  // Calculate plan specific completion
  const getPlanCompletion = (plan: Plan) => {
    const followed = getFollowedPlan(plan.id);
    if (!followed || !followed.completedSegments || followed.completedSegments.length === 0) return 0;
    const totalSegments = plan.segments?.length || plan.duration || 1;
    return Math.min(100, Math.round((followed.completedSegments.length / totalSegments) * 100));
  };

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks(prev => ({ ...prev, [weekId]: !prev[weekId] }));
  };

  const getDurationInWeeks = (plan: Plan) => {
    if (plan.durationType === "Days") return plan.duration / 7;
    if (plan.durationType === "Months") return plan.duration * 4;
    if (plan.durationType === "Phases") {
      if (plan.id === "3-month-crash-course") return 12;
      return plan.duration * 4;
    }
    return plan.duration;
  };

  // Filter and Sort plans
  const filteredPlans = ALL_PLANS.filter(plan => {
    const matchesSearch = 
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === "All" || plan.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === "All" || plan.difficulty === difficultyFilter;

    const durationInWeeks = getDurationInWeeks(plan);
    let matchesDuration = true;
    if (durationFilter === "<6") matchesDuration = durationInWeeks < 6;
    else if (durationFilter === "6-12") matchesDuration = durationInWeeks >= 6 && durationInWeeks <= 12;
    else if (durationFilter === ">12") matchesDuration = durationInWeeks > 12;

    return matchesSearch && matchesCategory && matchesDifficulty && matchesDuration;
  }).sort((a, b) => {
    const durA = getDurationInWeeks(a);
    const durB = getDurationInWeeks(b);
    if (sortBy === "shortest") return durA - durB;
    if (sortBy === "longest") return durB - durA;
    
    const diffWeights = { Easy: 1, Medium: 2, Hard: 3, Extreme: 4 };
    if (sortBy === "easiest") return diffWeights[a.difficulty] - diffWeights[b.difficulty];
    if (sortBy === "hardest") return diffWeights[b.difficulty] - diffWeights[a.difficulty];
    
    return 0;
  });

  const getDiffBadgeStyles = (diff: string) => {
    switch (diff) {
      case "Easy": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Medium": return "bg-violet-500/10 text-violet-400 border-violet-500/20";
      case "Hard": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Extreme": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const selectedPlan = selectedPlanId ? ALL_PLANS.find(p => p.id === selectedPlanId) : null;
  const followedSelectedPlan = selectedPlan ? getFollowedPlan(selectedPlan.id) : null;
  const isSelectedPrimary = selectedPlan ? primaryPlanId === selectedPlan.id : false;

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-24">
      {/* Page Header */}
      {!selectedPlan && (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Placement Training Plans</h1>
              <p className="text-slate-400 text-sm mt-1">
                Choose curriculum segments optimized for different durations and target outcomes.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-darkCard/40 border border-white/[0.04] backdrop-blur-md p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
        </>
      )}

      {/* Main Content Area */}
      {!selectedPlan ? (
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
                  className={`relative group bg-darkCard/40 border rounded-2xl backdrop-blur-md flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-white/[0.12] hover:shadow-[0_0_20px_rgba(var(--color-accent-primary),0.1)] cursor-pointer ${
                    isPrimary ? "border-accentPrimary/40 shadow-[0_0_15px_rgba(var(--color-accent-primary),0.1)]" : "border-white/[0.04]"
                  }`}
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  {/* Status Badges */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
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

                  <div className="p-6 space-y-5 flex-1 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-white group-hover:text-accentPrimary transition-colors pr-20">
                        {plan.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                        {plan.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 bg-black/40 p-3.5 rounded-xl border border-white/[0.04] shadow-inner relative z-10">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <div>
                          <span className="text-[9px] text-slate-500 block uppercase font-mono tracking-wider">Duration</span>
                          <span className="text-xs font-semibold text-slate-200">{plan.duration} Wks</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-slate-500" />
                        <div>
                          <span className="text-[9px] text-slate-500 block uppercase font-mono tracking-wider">Difficulty</span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border block w-fit ${getDiffBadgeStyles(plan.difficulty)}`}>
                            {plan.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tags Container Fix: flex-wrap + items-start */}
                    <div className="flex flex-wrap items-start gap-1.5 relative z-10 pt-2">
                      {plan.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="text-[10px] bg-slate-900/60 border border-white/[0.04] text-slate-300 px-2 py-1 rounded-md shadow-sm h-fit"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {followed && (
                      <div className="space-y-2 pt-4 border-t border-white/[0.04] relative z-10">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-accentPrimary font-bold">{completion}%</span>
                        </div>
                        <div className="w-full bg-black/60 border border-white/[0.05] rounded-full h-1.5 overflow-hidden shadow-inner">
                          <div 
                            className="bg-accentPrimary h-full rounded-full transition-all duration-500 shadow-[0_0_10px_var(--color-accent-primary)]" 
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Detailed View */
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 relative">
          <button 
            onClick={() => setSelectedPlanId(null)}
            className="text-xs font-mono text-slate-500 hover:text-white flex items-center gap-2 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.05] border border-transparent hover:border-white/[0.05]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Plans
          </button>

          {/* Hero Section */}
          <GlassCard className="relative overflow-hidden p-8 border border-white/[0.08] shadow-2xl bg-gradient-to-br from-darkCard to-black/90 rounded-3xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accentPrimary opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{selectedPlan.title}</h1>
                  {isSelectedPrimary && (
                    <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-accentPrimary/20 text-accentPrimary border border-accentPrimary/30 shadow-[0_0_15px_rgba(var(--color-accent-primary),0.3)]">
                      <Star className="w-3.5 h-3.5 fill-accentPrimary" /> Primary
                    </span>
                  )}
                </div>
                
                <p className="text-base text-slate-300 leading-relaxed max-w-3xl">
                  {selectedPlan.description}
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4 flex items-center gap-3 shadow-inner">
                    <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center border border-white/[0.05]">
                      <Clock className="w-5 h-5 text-accentPrimary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Duration</p>
                      <p className="text-sm font-bold text-white">{selectedPlan.duration} Weeks</p>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4 flex items-center gap-3 shadow-inner">
                    <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center border border-white/[0.05]">
                      <Activity className="w-5 h-5 text-accentPrimary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Difficulty</p>
                      <p className={`text-sm font-bold ${selectedPlan.difficulty === 'Extreme' ? 'text-rose-400' : selectedPlan.difficulty === 'Hard' ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {selectedPlan.difficulty}
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4 flex items-center gap-3 shadow-inner">
                    <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center border border-white/[0.05]">
                      <Calendar className="w-5 h-5 text-accentPrimary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Pace</p>
                      <p className="text-sm font-bold text-white">{selectedPlan.estimatedHoursPerDay} / day</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {selectedPlan.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] uppercase tracking-wider font-bold bg-white/5 border border-white/10 text-slate-300 px-3 py-1.5 rounded-lg shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Floating Panel */}
              <div className="w-full lg:w-80 bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl flex flex-col gap-4 sticky top-4">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-accentPrimary" /> Quick Actions
                </h3>
                
                {followedSelectedPlan ? (
                  <>
                    <div className="bg-black/50 p-4 rounded-xl border border-white/[0.05] shadow-inner mb-2">
                      <div className="flex justify-between text-[10px] font-mono mb-2 text-slate-400">
                        <span>Progress</span>
                        <span className="text-accentPrimary font-bold">{getPlanCompletion(selectedPlan)}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/[0.02]">
                        <div 
                          className="bg-accentPrimary h-full rounded-full transition-all duration-500 shadow-[0_0_10px_var(--color-accent-primary)]" 
                          style={{ width: `${getPlanCompletion(selectedPlan)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-center mt-3 text-slate-500 font-mono">
                        {followedSelectedPlan.completedSegments.length} out of {selectedPlan.duration} weeks complete
                      </p>
                    </div>

                    {!isSelectedPrimary && (
                      <button
                        onClick={() => setPrimaryPlan(selectedPlan.id)}
                        className="w-full py-3 bg-accentPrimary hover:bg-accentPrimary/90 active:scale-[0.98] hover:scale-[1.02] text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(var(--color-accent-primary),0.4)]"
                      >
                        <Star className="w-4 h-4 fill-black" /> Set As Primary
                      </button>
                    )}
                    
                    <button
                      onClick={() => pausePlan(selectedPlan.id)}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                    >
                      {followedSelectedPlan.paused ? (
                        <>
                          <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" /> Resume Progress
                        </>
                      ) : (
                        <>
                          <Pause className="w-4 h-4 text-amber-400 fill-amber-400" /> Pause Tracking
                        </>
                      )}
                    </button>

                    {selectedPlan.id !== "16-week-mastery" && (
                      <button
                        onClick={() => {
                          confirmAction({
                            title: "Unfollow Plan",
                            message: `Are you sure you want to unfollow "${selectedPlan.title}"? Your progress on this plan will be deleted.`,
                            confirmText: "Unfollow",
                            cancelText: "Cancel",
                            severity: "danger",
                            onConfirm: () => {
                                unfollowPlan(selectedPlan.id);
                                setSelectedPlanId(null);
                            }
                          });
                        }}
                        className="mt-2 text-xs font-mono text-rose-400/70 hover:text-rose-400 flex items-center justify-center gap-1 transition-colors underline underline-offset-2"
                      >
                        <Trash2 className="w-3 h-3" /> Unfollow Plan
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => followPlan(selectedPlan.id)}
                    className="w-full py-4 bg-accentPrimary hover:bg-accentPrimary/90 active:scale-[0.98] hover:scale-[1.02] text-black font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(var(--color-accent-primary),0.3)]"
                  >
                    <Plus className="w-5 h-5" /> Enroll in Plan
                  </button>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Syllabus Timeline */}
          <div className="pt-6">
            <h3 className="text-2xl font-extrabold text-white mb-8 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-accentPrimary" /> Curriculum Breakdown
            </h3>
            
            <div className="space-y-6 relative ml-4">
              {/* Vertical line connecting nodes */}
              <div className="absolute top-0 bottom-0 left-[15px] w-px bg-gradient-to-b from-accentPrimary/50 via-white/10 to-transparent" />

              {selectedPlan.segments.map((week, idx) => {
                const isExpanded = expandedWeeks[week.id] !== false; // Default true
                const isCompleted = followedSelectedPlan?.completedSegments.includes(week.id);

                return (
                  <div key={week.id} className="relative pl-12 group">
                    {/* Node */}
                    <div className={`absolute left-0 top-6 w-8 h-8 -ml-4 rounded-full flex items-center justify-center font-bold text-[10px] z-10 transition-all shadow-lg ${
                      isCompleted 
                        ? 'bg-emerald-500 border-2 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                        : 'bg-darkCard border-2 border-accentPrimary text-accentPrimary shadow-[0_0_10px_rgba(var(--color-accent-primary),0.3)] group-hover:scale-110'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : `W${idx + 1}`}
                    </div>

                    <GlassCard className={`p-0 overflow-hidden border transition-colors ${isCompleted ? 'border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.05)]' : 'border-white/[0.08]'}`}>
                      <div 
                        onClick={() => toggleWeek(week.id)}
                        className={`p-6 bg-white/[0.01] hover:bg-white/[0.03] flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-colors border-b ${isExpanded ? 'border-white/[0.06]' : 'border-transparent'}`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl font-bold text-white group-hover:text-accentPrimary transition-colors">{week.title}</h4>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-black/50 px-2.5 py-1 rounded-md border border-white/5 shadow-inner">
                              {week.phase}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 max-w-3xl">
                            {week.focus}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500 shrink-0">
                          <span className="text-xs font-mono bg-black/30 px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" /> {week.estimatedTime}
                          </span>
                          <div className="p-2 rounded-full hover:bg-white/10 transition-colors">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-black/30 backdrop-blur-sm"
                          >
                            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                              {/* Goals Section */}
                              <div>
                                <h5 className="text-xs font-bold text-accentPrimary uppercase tracking-wider mb-4 flex items-center gap-2">
                                  <Target className="w-4 h-4" /> Weekly Goals
                                </h5>
                                <ul className="space-y-3">
                                  {week.goals.map((goal, i) => (
                                    <li key={i} className="text-sm text-slate-300 flex items-start gap-3">
                                      <span className="text-accentPrimary/50 mt-1 flex-shrink-0">✦</span>
                                      <span className="leading-relaxed">{goal}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Technical Targets */}
                              <div className="space-y-6">
                                {week.modules && week.modules.length > 0 && (
                                  <div className="space-y-6">
                                    {week.modules.map((mod: any, idx: number) => (
                                      <div key={idx}>
                                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{mod.title}</h5>
                                        {mod.type === "project" || mod.type === "reading" ? (
                                          <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-inner">
                                            <p className="text-sm text-slate-200">{mod.description}</p>
                                            {mod.customContent && <p className="text-xs text-slate-400 mt-2">{mod.customContent}</p>}
                                          </div>
                                        ) : (
                                          <div className="flex flex-wrap items-start gap-2">
                                            {mod.targetIds?.map((targetId: string) => (
                                              <span key={targetId} className={`text-[11px] px-3 py-1.5 rounded-lg font-medium shadow-sm border ${mod.type === 'dsa' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : mod.type === 'aptitude' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : mod.type === 'core' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' : 'bg-violet-500/10 text-violet-300 border-violet-500/20'}`}>
                                                {targetId.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </GlassCard>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
