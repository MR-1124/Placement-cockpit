import { useState, useMemo } from "react";
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
  CheckCircle2,
  Code2,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const PlansView: React.FC = () => {
  const state = useAppState(s => s.state);
  const followPlan = useAppState(s => s.followPlan);
  const pausePlan = useAppState(s => s.pausePlan);
  const unfollowPlan = useAppState(s => s.unfollowPlan);
  const setPrimaryPlan = useAppState(s => s.setPrimaryPlan);
  const toggleDsaProblem = useAppState(s => s.toggleDsaProblem);
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
  
  // Detailed view tab: "timeline" or "problems"
  const [detailedViewTab, setDetailedViewTab] = useState<"timeline" | "problems">("timeline");
  const [planProblemDifficultyTab, setPlanProblemDifficultyTab] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [problemSearchQuery, setProblemSearchQuery] = useState("");
  const [weekProblemTabs, setWeekProblemTabs] = useState<Record<string, "All" | "Easy" | "Medium" | "Hard">>({});

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

  const selectedPlan = ALL_PLANS.find(p => p.id === selectedPlanId);
  const followedSelectedPlan = selectedPlan ? getFollowedPlan(selectedPlan.id) : null;
  const isSelectedPrimary = selectedPlan ? (primaryPlanId === selectedPlan.id) : false;

  // Extract all DSA problems belonging to the selected plan
  const planAllProblems = useMemo(() => {
    if (!selectedPlan) return [];
    const problemsMap = new Map<string, { problem: any; topicId: string; topicName: string; weekTitle: string }>();

    selectedPlan.segments.forEach(segment => {
      segment.modules?.forEach(mod => {
        if (mod.type === "dsa" && mod.targetIds) {
          mod.targetIds.forEach(topicId => {
            const topic = state.dsaTopics.find(t => t.id === topicId);
            if (topic) {
              topic.problems.forEach(problem => {
                if (!problemsMap.has(problem.id)) {
                  problemsMap.set(problem.id, {
                    problem,
                    topicId: topic.id,
                    topicName: topic.name,
                    weekTitle: segment.title
                  });
                }
              });
            }
          });
        }
      });
    });

    return Array.from(problemsMap.values());
  }, [selectedPlan, state.dsaTopics]);

  const easyPlanProblems = useMemo(() => planAllProblems.filter(p => p.problem.difficulty === "Easy"), [planAllProblems]);
  const mediumPlanProblems = useMemo(() => planAllProblems.filter(p => p.problem.difficulty === "Medium"), [planAllProblems]);
  const hardPlanProblems = useMemo(() => planAllProblems.filter(p => p.problem.difficulty === "Hard"), [planAllProblems]);

  const easyPlanSolved = easyPlanProblems.filter(p => p.problem.isCompleted).length;
  const mediumPlanSolved = mediumPlanProblems.filter(p => p.problem.isCompleted).length;
  const hardPlanSolved = hardPlanProblems.filter(p => p.problem.isCompleted).length;
  const totalPlanSolved = planAllProblems.filter(p => p.problem.isCompleted).length;

  const filteredPlanProblems = useMemo(() => {
    let list = planAllProblems;
    if (planProblemDifficultyTab === "Easy") list = easyPlanProblems;
    else if (planProblemDifficultyTab === "Medium") list = mediumPlanProblems;
    else if (planProblemDifficultyTab === "Hard") list = hardPlanProblems;

    if (!problemSearchQuery.trim()) return list;
    const q = problemSearchQuery.toLowerCase();
    return list.filter(p => 
      p.problem.name.toLowerCase().includes(q) ||
      p.topicName.toLowerCase().includes(q) ||
      p.weekTitle.toLowerCase().includes(q)
    );
  }, [planAllProblems, easyPlanProblems, mediumPlanProblems, hardPlanProblems, planProblemDifficultyTab, problemSearchQuery]);

  return (
    <div className="space-y-8 pb-12">
      {!selectedPlan ? (
        /* Plan Catalog View */
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-accentPrimary">Curriculum Selection Engine</span>
              <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">Study Plans & Roadmaps</h1>
              <p className="text-sm text-slate-400 mt-1">
                Choose a structured curriculum tailored for your target placement interview timelines.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400 bg-white/[0.02] border border-white/[0.06] px-3.5 py-2 rounded-xl">
                Enrolled: <strong className="text-white">{userPlans.length}</strong> Plans
              </span>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="space-y-4 bg-white/[0.01] border border-white/[0.04] p-4 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search */}
              <div className="md:col-span-4 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text"
                  placeholder="Search plans, topics, tags..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="md:col-span-3 flex bg-black/40 border border-white/[0.06] p-1 rounded-xl">
                {(["All", "Mastery", "Placement", "Sprint"] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`flex-1 py-1 text-[10px] font-mono font-bold rounded-lg transition-all ${
                      categoryFilter === cat ? "bg-accentPrimary text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Difficulty Filter */}
              <div className="md:col-span-3 flex bg-black/40 border border-white/[0.06] p-1 rounded-xl overflow-x-auto">
                {(["All", "Easy", "Medium", "Hard", "Extreme"] as const).map(diff => (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    className={`flex-1 py-1 px-1.5 text-[10px] font-mono font-bold rounded-lg whitespace-nowrap transition-all ${
                      difficultyFilter === diff ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>

              {/* Duration Filter */}
              <div className="md:col-span-1 relative">
                <select
                  value={durationFilter}
                  onChange={e => setDurationFilter(e.target.value as any)}
                  className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none transition-colors appearance-none cursor-pointer"
                  title="Filter by Duration"
                >
                  <option value="All" className="bg-[#0f0f14] text-white">All Durations</option>
                  <option value="<6" className="bg-[#0f0f14] text-white">&lt; 6 Weeks</option>
                  <option value="6-12" className="bg-[#0f0f14] text-white">6-12 Weeks</option>
                  <option value=">12" className="bg-[#0f0f14] text-white">&gt; 12 Weeks</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="md:col-span-1 relative">
                <ArrowUpDown className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-xl pl-7 pr-2 py-2 text-xs text-white focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="default" className="bg-[#0f0f14] text-white">Default</option>
                  <option value="shortest" className="bg-[#0f0f14] text-white">Shortest</option>
                  <option value="longest" className="bg-[#0f0f14] text-white">Longest</option>
                  <option value="easiest" className="bg-[#0f0f14] text-white">Easiest</option>
                  <option value="hardest" className="bg-[#0f0f14] text-white">Hardest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map(plan => {
              const isPrimary = primaryPlanId === plan.id;
              const followed = getFollowedPlan(plan.id);
              const completion = getPlanCompletion(plan);

              return (
                <GlassCard 
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`cursor-pointer transition-all duration-300 hover:-translate-y-1 group relative flex flex-col justify-between p-6 border ${
                    isPrimary 
                      ? "border-accentPrimary/40 shadow-[0_0_30px_rgba(var(--accent-rgb),0.1)]" 
                      : "border-white/[0.06] hover:border-white/20"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-md">
                        {plan.category}
                      </span>
                      {isPrimary && (
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-accentPrimary bg-accentPrimary/10 border border-accentPrimary/30 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-accentPrimary" /> Primary
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-accentPrimary transition-colors tracking-tight">
                        {plan.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="text-[10px] font-mono text-slate-400 bg-black/40 border border-white/[0.05] px-2 py-1 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3 text-accentPrimary" /> {plan.duration} {plan.durationType}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded border ${
                        plan.difficulty === 'Extreme' ? 'text-rose-400 border-rose-500/20 bg-rose-500/5' :
                        plan.difficulty === 'Hard' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' :
                        'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
                      }`}>
                        {plan.difficulty}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-black/40 border border-white/[0.05] px-2 py-1 rounded flex items-center gap-1">
                        <Activity className="w-3 h-3 text-accentPrimary" /> {plan.estimatedHoursPerDay}/d
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.06] space-y-3">
                    {followed ? (
                      <div>
                        <div className="flex justify-between text-[10px] font-mono mb-1.5">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-accentPrimary font-bold">{completion}%</span>
                        </div>
                        <div className="w-full bg-black/60 rounded-full h-1.5 overflow-hidden border border-white/[0.05]">
                          <div 
                            className="bg-accentPrimary h-full rounded-full transition-all duration-500" 
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-slate-400 group-hover:text-white transition-colors">
                        <span>View Curriculum Roadmap</span>
                        <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      ) : (
        /* Detailed Plan View */
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 relative">
          <button 
            onClick={() => setSelectedPlanId(null)}
            className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-2 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.05] border border-transparent hover:border-white/[0.05]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Plans Catalog
          </button>

          {/* Hero Section */}
          <GlassCard className="relative overflow-hidden p-8 border border-white/[0.08] shadow-2xl bg-gradient-to-br from-darkCard to-black/90 rounded-3xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accentPrimary opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">{selectedPlan.title}</h1>
                  {isSelectedPrimary && (
                    <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-accentPrimary/20 text-accentPrimary border border-accentPrimary/30 shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]">
                      <Star className="w-3.5 h-3.5 fill-accentPrimary" /> Primary
                    </span>
                  )}
                </div>
                
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                  {selectedPlan.description}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4 flex items-center gap-3 shadow-inner">
                    <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center border border-white/[0.05]">
                      <Clock className="w-5 h-5 text-accentPrimary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Duration</p>
                      <p className="text-sm font-bold text-white">{selectedPlan.duration} {selectedPlan.durationType}</p>
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
              <div className="w-full lg:w-80 bg-darkCard/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl flex flex-col gap-4 sticky top-4">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-accentPrimary" /> Plan Status
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
                      <p className="text-[10px] text-center mt-3 text-slate-400 font-mono">
                        {followedSelectedPlan.completedSegments.length} out of {selectedPlan.segments.length} segments complete
                      </p>
                    </div>

                    {!isSelectedPrimary && (
                      <button
                        onClick={() => setPrimaryPlan(selectedPlan.id)}
                        className="w-full py-3 bg-accentPrimary hover:bg-accentPrimary/90 active:scale-[0.98] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] cursor-pointer"
                      >
                        <Star className="w-4 h-4 fill-white" /> Set As Primary Plan
                      </button>
                    )}
                    
                    <button
                      onClick={() => pausePlan(selectedPlan.id)}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {followedSelectedPlan.paused ? (
                        <>
                          <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" /> Resume Tracking
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
                        className="mt-2 text-xs font-mono text-rose-400/70 hover:text-rose-400 flex items-center justify-center gap-1 transition-colors underline underline-offset-2 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Unfollow Plan
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => followPlan(selectedPlan.id)}
                    className="w-full py-4 bg-accentPrimary hover:bg-accentPrimary/90 active:scale-[0.98] text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)] cursor-pointer"
                  >
                    <Plus className="w-5 h-5" /> Enroll in Plan
                  </button>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Difficulty Statistics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-black/30 border border-white/[0.06] rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">Total Problems</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-white">{planAllProblems.length}</span>
                <span className="text-xs font-mono text-accentPrimary font-bold">{totalPlanSolved} Solved</span>
              </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider">Easy Problems</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-white">{easyPlanProblems.length}</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">{easyPlanSolved} Solved</span>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">Medium Problems</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-white">{mediumPlanProblems.length}</span>
                <span className="text-xs font-mono text-amber-400 font-bold">{mediumPlanSolved} Solved</span>
              </div>
            </div>

            <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase text-rose-400 font-bold tracking-wider">Hard Problems</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-white">{hardPlanProblems.length}</span>
                <span className="text-xs font-mono text-rose-400 font-bold">{hardPlanSolved} Solved</span>
              </div>
            </div>
          </div>

          {/* View Mode Tabs: Timeline vs Categorized Problem Explorer */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/[0.06] pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDetailedViewTab("timeline")}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  detailedViewTab === "timeline"
                    ? "bg-accentPrimary text-white shadow-md"
                    : "bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-white"
                }`}
              >
                <BookOpen className="w-4 h-4" /> Curriculum Timeline ({selectedPlan.segments.length} Weeks)
              </button>

              <button
                onClick={() => setDetailedViewTab("problems")}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  detailedViewTab === "problems"
                    ? "bg-accentPrimary text-white shadow-md"
                    : "bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-white"
                }`}
              >
                <Code2 className="w-4 h-4" /> Categorized Problem Explorer ({planAllProblems.length})
              </button>
            </div>
          </div>

          {/* View Content */}
          {detailedViewTab === "problems" ? (
            /* Categorized Problem Vault View */
            <div className="space-y-6">
              {/* Difficulty Tabs & Search Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-black/30 border border-white/[0.06] p-3 rounded-2xl">
                {/* Categorized Difficulty Tabs */}
                <div className="flex items-center gap-1 bg-black/40 border border-white/[0.06] p-1 rounded-xl overflow-x-auto">
                  <button
                    onClick={() => setPlanProblemDifficultyTab("All")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      planProblemDifficultyTab === "All"
                        ? "bg-accentPrimary text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    All Problems ({totalPlanSolved}/{planAllProblems.length})
                  </button>

                  <button
                    onClick={() => setPlanProblemDifficultyTab("Easy")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      planProblemDifficultyTab === "Easy"
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "text-emerald-400/80 hover:text-emerald-400"
                    }`}
                  >
                    Easy ({easyPlanSolved}/{easyPlanProblems.length})
                  </button>

                  <button
                    onClick={() => setPlanProblemDifficultyTab("Medium")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      planProblemDifficultyTab === "Medium"
                        ? "bg-amber-500 text-white shadow-sm"
                        : "text-amber-400/80 hover:text-amber-400"
                    }`}
                  >
                    Medium ({mediumPlanSolved}/{mediumPlanProblems.length})
                  </button>

                  <button
                    onClick={() => setPlanProblemDifficultyTab("Hard")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      planProblemDifficultyTab === "Hard"
                        ? "bg-rose-500 text-white shadow-sm"
                        : "text-rose-400/80 hover:text-rose-400"
                    }`}
                  >
                    Hard ({hardPlanSolved}/{hardPlanProblems.length})
                  </button>
                </div>

                {/* Problem Search */}
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by problem name or topic..."
                    value={problemSearchQuery}
                    onChange={e => setProblemSearchQuery(e.target.value)}
                    className="w-full bg-black/50 border border-white/[0.08] focus:border-accentPrimary rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Problems Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredPlanProblems.map(({ problem, topicId, topicName, weekTitle }) => (
                  <div
                    key={problem.id}
                    onClick={() => toggleDsaProblem(topicId, problem.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:scale-[1.01] select-none flex flex-col justify-between gap-3 ${
                      problem.isCompleted
                        ? "bg-emerald-500/10 border-emerald-500/30 text-white shadow-sm"
                        : "bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.04] hover:border-white/10"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold truncate">
                          {weekTitle} • {topicName}
                        </span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase shrink-0 ${
                            problem.difficulty === "Easy"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : problem.difficulty === "Medium"
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={problem.isCompleted || false}
                          onChange={() => {}}
                          className="accent-emerald-500 rounded flex-shrink-0 cursor-pointer w-4 h-4"
                        />
                        <span className={`text-xs font-bold leading-tight ${problem.isCompleted ? "line-through text-slate-400" : "text-white"}`}>
                          {problem.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[10px] font-mono text-slate-400">
                      <span>{problem.isCompleted ? "Solved" : "Unsolved"}</span>
                      {problem.url && (
                        <a
                          href={problem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-slate-400 hover:text-accentPrimary transition-colors"
                        >
                          <span>Solve on LeetCode</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredPlanProblems.length === 0 && (
                <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/[0.06] text-center text-xs text-slate-400">
                  No problems matched the selected difficulty tab or search query.
                </div>
              )}
            </div>
          ) : (
            /* Timeline Syllabus View */
            <div className="space-y-6 relative ml-4 pt-2">
              <div className="absolute top-0 bottom-0 left-[15px] w-px bg-gradient-to-b from-accentPrimary/50 via-white/10 to-transparent" />

              {selectedPlan.segments.map((week, idx) => {
                const isExpanded = expandedWeeks[week.id] !== false;
                const isCompleted = followedSelectedPlan?.completedSegments.includes(week.id);
                const currentWeekDifficultyTab = weekProblemTabs[week.id] || "All";

                // Collect DSA problems for this week
                const weekDsaProblems: { problem: any; topicId: string }[] = [];
                week.modules?.forEach(mod => {
                  if (mod.type === "dsa" && mod.targetIds) {
                    mod.targetIds.forEach(topicId => {
                      const topic = state.dsaTopics.find(t => t.id === topicId);
                      if (topic) {
                        topic.problems.forEach(problem => {
                          weekDsaProblems.push({ problem, topicId: topic.id });
                        });
                      }
                    });
                  }
                });

                const weekEasy = weekDsaProblems.filter(p => p.problem.difficulty === "Easy");
                const weekMed = weekDsaProblems.filter(p => p.problem.difficulty === "Medium");
                const weekHard = weekDsaProblems.filter(p => p.problem.difficulty === "Hard");

                const weekFilteredProblems = currentWeekDifficultyTab === "All"
                  ? weekDsaProblems
                  : weekDsaProblems.filter(p => p.problem.difficulty === currentWeekDifficultyTab);

                return (
                  <div key={week.id} className="relative pl-12 group">
                    <div className={`absolute left-0 top-6 w-8 h-8 -ml-4 rounded-full flex items-center justify-center font-bold text-[10px] z-10 transition-all shadow-lg ${
                      isCompleted 
                        ? 'bg-emerald-500 border-2 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                        : 'bg-darkCard border-2 border-accentPrimary text-accentPrimary shadow-[0_0_10px_rgba(var(--accent-rgb),0.3)] group-hover:scale-110'
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
                        <div className="flex items-center gap-4 text-slate-400 shrink-0">
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
                            <div className="p-6 space-y-8">
                              {/* Goals Section */}
                              <div>
                                <h5 className="text-xs font-bold text-accentPrimary uppercase tracking-wider mb-4 flex items-center gap-2">
                                  <Target className="w-4 h-4" /> Weekly Goals & Focus
                                </h5>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {week.goals.map((goal, i) => (
                                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2.5 bg-white/[0.01] border border-white/[0.04] p-2.5 rounded-xl">
                                      <span className="text-accentPrimary mt-0.5 flex-shrink-0">✦</span>
                                      <span className="leading-relaxed">{goal}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* DSA Categorized Weekly Problem Set */}
                              {weekDsaProblems.length > 0 && (
                                <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                                      <Code2 className="w-4 h-4 text-emerald-400" /> Weekly Problems Categorized
                                    </h5>

                                    {/* Week Difficulty Tabs */}
                                    <div className="flex items-center gap-1 bg-black/40 border border-white/[0.06] p-1 rounded-lg">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setWeekProblemTabs(prev => ({ ...prev, [week.id]: "All" }));
                                        }}
                                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                          currentWeekDifficultyTab === "All"
                                            ? "bg-accentPrimary text-white shadow-sm"
                                            : "text-slate-400 hover:text-white"
                                        }`}
                                      >
                                        All ({weekDsaProblems.length})
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setWeekProblemTabs(prev => ({ ...prev, [week.id]: "Easy" }));
                                        }}
                                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                          currentWeekDifficultyTab === "Easy"
                                            ? "bg-emerald-500 text-white shadow-sm"
                                            : "text-emerald-400/80 hover:text-emerald-400"
                                        }`}
                                      >
                                        Easy ({weekEasy.length})
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setWeekProblemTabs(prev => ({ ...prev, [week.id]: "Medium" }));
                                        }}
                                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                          currentWeekDifficultyTab === "Medium"
                                            ? "bg-amber-500 text-white shadow-sm"
                                            : "text-amber-400/80 hover:text-amber-400"
                                        }`}
                                      >
                                        Med ({weekMed.length})
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setWeekProblemTabs(prev => ({ ...prev, [week.id]: "Hard" }));
                                        }}
                                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                          currentWeekDifficultyTab === "Hard"
                                            ? "bg-rose-500 text-white shadow-sm"
                                            : "text-rose-400/80 hover:text-rose-400"
                                        }`}
                                      >
                                        Hard ({weekHard.length})
                                      </button>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {weekFilteredProblems.map(({ problem, topicId }) => (
                                      <div
                                        key={problem.id}
                                        onClick={() => toggleDsaProblem(topicId, problem.id)}
                                        className={`flex justify-between items-center p-2.5 rounded-xl border transition-all cursor-pointer hover:scale-[1.01] select-none ${
                                          problem.isCompleted
                                            ? "bg-emerald-500/10 border-emerald-500/30 text-white shadow-sm"
                                            : "bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.04]"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                          <input
                                            type="checkbox"
                                            checked={problem.isCompleted || false}
                                            onChange={() => {}}
                                            className="accent-emerald-500 rounded flex-shrink-0 cursor-pointer w-3.5 h-3.5"
                                          />
                                          <span className={`text-xs font-semibold truncate ${problem.isCompleted ? "line-through text-slate-400" : "text-white"}`}>
                                            {problem.name}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                                          {problem.url && (
                                            <a
                                              href={problem.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              onClick={(e) => e.stopPropagation()}
                                              className="p-1 text-slate-500 hover:text-accentPrimary transition-colors"
                                            >
                                              <ExternalLink className="w-3 h-3" />
                                            </a>
                                          )}
                                          <span
                                            className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                                              problem.difficulty === "Easy"
                                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                                : problem.difficulty === "Medium"
                                                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                                : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                            }`}
                                          >
                                            {problem.difficulty}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Technical Targets & Non-DSA Modules */}
                              {week.modules && week.modules.length > 0 && (
                                <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                                  <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                                    Full Curriculum Modules
                                  </h5>
                                  <div className="space-y-4">
                                    {week.modules.map((mod: any, mIdx: number) => (
                                      <div key={mIdx} className="space-y-2">
                                        <div className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                                          {mod.title}
                                        </div>
                                        {mod.type === "project" || mod.type === "reading" ? (
                                          <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-inner">
                                            <p className="text-xs text-slate-200">{mod.description}</p>
                                            {mod.customContent && <p className="text-[11px] text-slate-400 mt-2">{mod.customContent}</p>}
                                          </div>
                                        ) : (
                                          <div className="flex flex-wrap items-start gap-1.5">
                                            {mod.targetIds?.map((targetId: string) => (
                                              <span key={targetId} className={`text-[10px] px-2.5 py-1 rounded-lg font-mono font-bold shadow-sm border ${mod.type === 'dsa' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : mod.type === 'aptitude' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : mod.type === 'core' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' : 'bg-violet-500/10 text-violet-300 border-violet-500/20'}`}>
                                                {targetId.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </GlassCard>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
