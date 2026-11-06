import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import { SpotlightCard, MetricBadge, ShimmerSkeleton } from "../components/Common";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { nvidiaFetch } from "../lib/nvidiaApi";
import {
  Search,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  Trophy,
  Flame,
  Award,
  ListTodo,
  AlertCircle
} from "lucide-react";
import confetti from "canvas-confetti";

export const PracticeView: React.FC = () => {
  const { state, markPracticeProblemSolved, curriculum, confirmAction } = useAppState();
  
  const allProblems = React.useMemo(() => {
    const flat: any[] = [];
    const seenIds = new Set();
    
    curriculum.DEFAULT_DSA_TOPICS.forEach((topic: any) => {
      topic.problems.forEach((prob: any) => {
        if (!seenIds.has(prob.id)) {
          seenIds.add(prob.id);
          flat.push({
            ...prob,
            topicName: topic.name,
            topicId: topic.id
          });
        }
      });
    });
    return flat;
  }, [curriculum.DEFAULT_DSA_TOPICS]);

  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    allProblems.forEach(p => {
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach((t: string) => tags.add(t));
      }
    });
    return Array.from(tags).sort();
  }, [allProblems]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeQuestion, setActiveQuestion] = useState<any | null>(null);

  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<any>(null);

  const solvedRecord = state.practiceProblemsSolved || {};
  
  const getTodayString = () => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  };

  const todaySolvedList = React.useMemo(() => {
    const todayStr = getTodayString();
    return Object.entries(solvedRecord).filter(([_, info]: any) => {
      return info.timestamp?.startsWith(todayStr);
    }).map(([id, _]) => {
      return allProblems.find(p => p.id === id);
    }).filter(Boolean);
  }, [solvedRecord, allProblems]);

  useEffect(() => {
    if (activeQuestion) {
      loadAiProblemStatement(activeQuestion);
      setTimeElapsed(0);
      setTimerRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setAiDescription(null);
      setAiError(null);
      setTimerRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [activeQuestion]);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const loadAiProblemStatement = async (problem: any) => {
    if (!state.sessionNvidiaKey) {
      setAiError("NVIDIA API Key not found. Please configure your key in Settings to activate AI problem breakdown.");
      return;
    }
    setLoadingAi(true);
    setAiError(null);
    setAiDescription(null);

    try {
      const prompt = `Generate a comprehensive but concise and structured DSA coding problem description for: "${problem.name}".
Difficulty: ${problem.difficulty}.
Context Topic: ${problem.topicName}.
Associated Tags: ${problem.tags ? problem.tags.join(", ") : "None"}.

You MUST strictly follow this exact structure and return the description in beautiful, direct Markdown format. Do not use conversational openings, meta-text, or general intros. Go straight to the markdown response. Keep it concise, crisp, and clean (under 300 words total).

Structure:
# ${problem.name}

## 1. Problem Statement & Explanation
Provide a clear, brief explanation of the problem, the core objective, and any necessary context or patterns. (Limit to 3-4 sentences maximum).

## 2. Examples
Provide exactly 2 clean, minimal examples. Each example must clearly specify:
- **Input**: The input variables and their values.
- **Output**: The expected output value.
- **Explanation**: A short 1-2 sentence trace.

## 3. Constraints
Provide precise constraints including:
- Parameter bounds (e.g., array size, range of values).
- Expected optimal Time Complexity.
- Expected optimal Space Complexity.

## 4. Topics Utilized
List the primary DSA topics and sub-topics utilized in this question. Format them as short inline code pills (e.g., \`Array\`, \`Hash Table\`, \`Two Pointers\`).

## 5. Additional Notes & Gotchas
Provide key observations, potential corner cases, or optimization hints in bullet points (limit to 3 bullet points max).`;

      const response = await nvidiaFetch({
        apiKey: state.sessionNvidiaKey,
        modelName: state.settings.nvidiaModelName || "meta/llama-3.1-70b-instruct",
        messages: [
          { role: "system", content: "You are an expert DSA coding instructor. You provide clear, exact, standard coding problem descriptions in Markdown." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      });

      if (!response.ok) throw new Error("API call failed.");
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        setAiDescription(content);
      } else {
        throw new Error("Empty response from AI model.");
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Failed to generate problem statement dynamically.");
    } finally {
      setLoadingAi(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const filteredProblems = React.useMemo(() => {
    return allProblems.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchDiff = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
      const matchTag = selectedTag === "All" || (p.tags && p.tags.includes(selectedTag));
      
      const isSolved = !!solvedRecord[p.id];
      const matchStatus = selectedStatus === "All" || 
                         (selectedStatus === "Solved" && isSolved) || 
                         (selectedStatus === "Unsolved" && !isSolved);
      
      return matchSearch && matchDiff && matchTag && matchStatus;
    });
  }, [allProblems, searchQuery, selectedDifficulty, selectedTag, selectedStatus, solvedRecord]);

  const getSolveUrl = (problem: any) => {
    if (problem.url) return problem.url;
    return `https://www.google.com/search?q=${encodeURIComponent(problem.name + " " + (problem.source || "LeetCode") + " practice")}`;
  };

  const handleBack = () => {
    if (timeElapsed > 0 || timerRunning) {
      confirmAction({
        title: "Abort Practice?",
        message: "Your active practice session is running. Do you want to abort or continue practicing?",
        confirmText: "Abort Practice",
        cancelText: "Continue Practice",
        severity: "warning",
        onConfirm: () => {
          setActiveQuestion(null);
        }
      });
    } else {
      setActiveQuestion(null);
    }
  };

  const handleMarkAsSolved = () => {
    if (!activeQuestion) return;
    markPracticeProblemSolved(activeQuestion.id, timeElapsed);
    setTimerRunning(false);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#10b981", "#8b5cf6", "#f59e0b"]
    });
    setActiveQuestion(null);
  };

  const totalSolvedCount = Object.keys(solvedRecord).length;
  const totalPracticeXp = totalSolvedCount * 50;

  return (
    <div className="space-y-8 pb-12">
      <AnimatePresence mode="wait">
        {!activeQuestion ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="space-y-8"
          >
            {/* Header Telemetry Banner */}
            <SpotlightCard className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-accentPrimary font-bold bg-accentPrimary/10 border border-accentPrimary/25 px-2.5 py-0.5 rounded-md">
                      Live Problem Arena
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">• Timed Assessment Drills</span>
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white">
                    Coding Practice Arena
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                    Practice problems with dynamic AI breakdowns, active stopwatch tracking, and instant XP reward telemetry.
                  </p>
                </div>
              </div>
            </SpotlightCard>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SpotlightCard className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Total Solved</span>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{totalSolvedCount}</h3>
                </div>
                <div className="p-3 rounded-xl bg-accentPrimary/15 border border-accentPrimary/30 text-accentPrimary">
                  <Trophy className="w-5 h-5" />
                </div>
              </SpotlightCard>

              <SpotlightCard className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Today's Solves</span>
                  <h3 className="text-2xl font-bold text-emerald-400 tracking-tight">{todaySolvedList.length}</h3>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
              </SpotlightCard>

              <SpotlightCard className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Practice XP</span>
                  <h3 className="text-2xl font-bold text-amber-400 tracking-tight">+{totalPracticeXp}</h3>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
              </SpotlightCard>

              <SpotlightCard className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Today's Target</span>
                  <h3 className="text-sm font-bold text-slate-200">
                    {todaySolvedList.length >= 3 ? "Daily Goal Met! 🎉" : `${todaySolvedList.length} / 3 Completed`}
                  </h3>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
                  <ListTodo className="w-5 h-5" />
                </div>
              </SpotlightCard>
            </div>

            {/* Today's Solved Items Panel */}
            {todaySolvedList.length > 0 && (
              <SpotlightCard className="p-5 border-emerald-500/20 bg-emerald-950/[0.02]">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Today's Solved Stream</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {todaySolvedList.map((prob: any) => (
                    <div
                      key={prob.id}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold flex items-center gap-2"
                    >
                      <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      <span>{prob.name}</span>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            )}

            {/* Search and Filters */}
            <SpotlightCard className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search problem title or tags..."
                  className="w-full bg-darkCard/60 border border-white/[0.08] focus:border-accentPrimary rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                {/* Status */}
                <div className="relative shrink-0">
                  <select
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value)}
                    className="bg-darkCard border border-white/[0.08] rounded-xl py-2 pl-3 pr-8 text-xs text-white focus:outline-none cursor-pointer appearance-none font-mono"
                  >
                    <option value="All">All Status</option>
                    <option value="Solved">Solved</option>
                    <option value="Unsolved">Unsolved</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>

                {/* Difficulty */}
                <div className="relative shrink-0">
                  <select
                    value={selectedDifficulty}
                    onChange={e => setSelectedDifficulty(e.target.value)}
                    className="bg-darkCard border border-white/[0.08] rounded-xl py-2 pl-3 pr-8 text-xs text-white focus:outline-none cursor-pointer appearance-none font-mono"
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>

                {/* Tag */}
                <div className="relative shrink-0">
                  <select
                    value={selectedTag}
                    onChange={e => setSelectedTag(e.target.value)}
                    className="bg-darkCard border border-white/[0.08] rounded-xl py-2 pl-3 pr-8 text-xs text-white focus:outline-none cursor-pointer appearance-none max-w-[150px] font-mono"
                  >
                    <option value="All">All Tags</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </SpotlightCard>

            {/* Problem Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProblems.map((prob: any) => {
                const isSolved = !!solvedRecord[prob.id];
                const solveTimeStr = isSolved ? formatTime(solvedRecord[prob.id].duration) : null;
                
                let diffVariant: "emerald" | "amber" | "rose" = "emerald";
                if (prob.difficulty === "Medium") diffVariant = "amber";
                if (prob.difficulty === "Hard") diffVariant = "rose";

                return (
                  <SpotlightCard
                    key={prob.id}
                    className={`p-5 flex flex-col justify-between transition-all group ${
                      isSolved ? "border-emerald-500/20 bg-emerald-950/[0.02]" : ""
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <MetricBadge label="Diff" value={prob.difficulty} variant={diffVariant} className="py-0.5 text-[9px]" />
                            <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">
                              {prob.topicName}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                            {prob.name}
                          </h4>
                        </div>

                        {isSolved && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 font-mono">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            {solveTimeStr && <span>{solveTimeStr}</span>}
                          </div>
                        )}
                      </div>

                      {prob.tags && prob.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {prob.tags.slice(0, 3).map((tag: string) => (
                            <span key={tag} className="text-[9px] font-mono text-slate-400 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-md">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-5 pt-3 border-t border-white/[0.05]">
                      <span className="text-[10px] font-mono text-slate-500">
                        {prob.source || "LeetCode"}
                      </span>
                      <button
                        onClick={() => setActiveQuestion(prob)}
                        className="px-3.5 py-1.5 bg-accentPrimary/15 hover:bg-accentPrimary/25 border border-accentPrimary/30 text-accentPrimary rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider transition-all cursor-pointer hover:scale-105 active:scale-95"
                      >
                        Start Practice
                      </button>
                    </div>
                  </SpotlightCard>
                );
              })}

              {filteredProblems.length === 0 && (
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-slate-600" />
                  <p className="text-slate-400 text-xs">No questions found matching your filter selections.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* Active Question & Timer Detail View */
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Stopwatch Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Arena
              </button>

              <SpotlightCard className="p-6 flex flex-col items-center text-center space-y-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold block">
                    Session Stopwatch
                  </span>
                  <div className={`text-4xl font-extrabold font-mono tracking-wider ${timerRunning ? "text-accentPrimary animate-pulse" : "text-white"}`}>
                    {formatTime(timeElapsed)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      timerRunning
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    }`}
                  >
                    {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={() => {
                      setTimerRunning(false);
                      setTimeElapsed(0);
                    }}
                    className="w-11 h-11 rounded-xl flex items-center justify-center bg-darkCard text-slate-400 border border-white/[0.08] hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-full space-y-3 pt-3 border-t border-white/[0.06]">
                  <a
                    href={getSolveUrl(activeQuestion)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex justify-center items-center gap-2 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl text-xs font-mono font-bold text-white tracking-wide uppercase transition-all"
                  >
                    <span>Solve on {activeQuestion.source || "LeetCode"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={handleMarkAsSolved}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-mono font-bold tracking-wide uppercase shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                  >
                    Mark as Solved (+50 XP)
                  </button>
                </div>
              </SpotlightCard>
            </div>

            {/* AI Breakdown Center Panel */}
            <div className="lg:col-span-2 space-y-4">
              <SpotlightCard className="p-6 min-h-[400px]">
                <div className="flex justify-between items-center border-b border-white/[0.06] pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Interactive Problem Breakdown</span>
                    <h3 className="text-lg font-bold text-white">{activeQuestion.name}</h3>
                  </div>
                  <div className="px-2.5 py-1 bg-accentPrimary/10 border border-accentPrimary/25 rounded-lg text-[9px] font-mono font-bold text-accentPrimary tracking-wider uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accentPrimary" /> NVIDIA NIM
                  </div>
                </div>

                {loadingAi ? (
                  <div className="space-y-4 py-6">
                    <ShimmerSkeleton height="28px" width="60%" />
                    <ShimmerSkeleton height="16px" width="90%" />
                    <ShimmerSkeleton height="16px" width="80%" />
                    <ShimmerSkeleton height="100px" width="100%" />
                  </div>
                ) : aiError ? (
                  <div className="p-4 bg-rose-500/5 border border-rose-500/20 text-rose-300 text-xs rounded-xl space-y-3">
                    <div className="flex gap-2 items-start">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                      <p>{aiError}</p>
                    </div>
                    <button
                      onClick={() => loadAiProblemStatement(activeQuestion)}
                      className="px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      Retry Generation
                    </button>
                  </div>
                ) : aiDescription ? (
                  <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed space-y-4">
                    <MarkdownRenderer content={aiDescription} />
                  </div>
                ) : (
                  <div className="text-center py-20 text-slate-500 text-xs">No problem details available.</div>
                )}
              </SpotlightCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
