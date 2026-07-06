import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import { GlassCard } from "../components/Common";
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

export const PracticeView: React.FC = () => {
  const { state, markPracticeProblemSolved, curriculum, confirmAction } = useAppState();
  
  // Flatten all problems from default DSA topics
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

  // List of all unique tags from problems for filtering
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    allProblems.forEach(p => {
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach((t: string) => tags.add(t));
      }
    });
    return Array.from(tags).sort();
  }, [allProblems]);

  // State definitions
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeQuestion, setActiveQuestion] = useState<any | null>(null);

  // Active question AI details
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Timer states
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<any>(null);

  // Solved details check
  const solvedRecord = state.practiceProblemsSolved || {};
  
  // Today's solved logic helper
  const getTodayString = () => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  };

  const todaySolvedList = React.useMemo(() => {
    const todayStr = getTodayString();
    return Object.entries(solvedRecord).filter(([_, info]: any) => {
      return info.timestamp.startsWith(todayStr);
    }).map(([id, _]) => {
      return allProblems.find(p => p.id === id);
    }).filter(Boolean);
  }, [solvedRecord, allProblems]);

  // Handle active question selection and AI load
  useEffect(() => {
    if (activeQuestion) {
      // Start loading dynamic description
      loadAiProblemStatement(activeQuestion);
      // Reset timer
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

  // Active timer loop
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
      setAiError("NVIDIA API Key not found. Please set your API Key in Settings to get dynamic AI problem descriptions.");
      return;
    }
    setLoadingAi(true);
    setAiError(null);
    setAiDescription(null);

    try {
      const prompt = `Generate a comprehensive and robust DSA coding problem description for: "${problem.name}".
Difficulty: ${problem.difficulty}.
Context Topic: ${problem.topicName}.
Associated Tags: ${problem.tags ? problem.tags.join(", ") : "None"}.

You MUST strictly follow this exact structure and return the description in beautiful, direct Markdown format. Do not use conversational openings, meta-text, or general intros. Go straight to the markdown response.

Structure:
# ${problem.name}

## 1. Problem Statement & Explanation
Provide a detailed explanation of the problem, the core objective, and any necessary context or patterns.

## 2. Examples
Provide exactly 2 detailed examples. Each example must clearly specify:
- **Input**: The input variables and their values.
- **Output**: The expected output value.
- **Explanation**: A step-by-step trace explaining why the given input yields this output.

## 3. Constraints
Provide precise constraints including:
- Parameter bounds (e.g., array size, string length, range of values).
- Expected optimal Time Complexity.
- Expected optimal Space Complexity.

## 4. Topics Utilized
List the primary DSA topics and sub-topics utilized in this question. Format them as short inline code pills (e.g., \`Array\`, \`Hash Table\`, \`Two Pointers\`).

## 5. Additional Notes & Gotchas
Provide key observations, potential corner cases (e.g., empty inputs, negative numbers, overflow), or optimization hints.`;

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
      setAiError(err.message || "Failed to generate problem statement dynamically. You can still solve it on the platform.");
    } finally {
      setLoadingAi(false);
    }
  };

  // Format stopwatch output
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  // Filtered problems list
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

  // Solve button redirection URL
  const getSolveUrl = (problem: any) => {
    if (problem.url) return problem.url;
    // Fallback search Google
    return `https://www.google.com/search?q=${encodeURIComponent(problem.name + " " + (problem.source || "LeetCode") + " practice")}`;
  };

  const handleBack = () => {
    if (timeElapsed > 0 || timerRunning) {
      confirmAction({
        title: "Abort Practice?",
        message: "You have started the timer for practice. Do you want to abort practice of this question or continue the practice and stay on this page?",
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
    // Return back to main grid
    setActiveQuestion(null);
  };

  // Helper stats calculation
  const totalSolvedCount = Object.keys(solvedRecord).length;
  const totalPracticeXp = totalSolvedCount * 50;

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!activeQuestion ? (
          // ----------------------------------------------------
          // GRID / LISTING VIEW
          // ----------------------------------------------------
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Header section with Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <GlassCard className="p-5 flex items-center justify-between border-white/[0.04] bg-white/[0.01]">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Total Solved</span>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{totalSolvedCount}</h3>
                </div>
                <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                  <Trophy className="w-5 h-5" />
                </div>
              </GlassCard>

              <GlassCard className="p-5 flex items-center justify-between border-white/[0.04] bg-white/[0.01]">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Today's Solves</span>
                  <h3 className="text-2xl font-bold text-emerald-400 tracking-tight">{todaySolvedList.length}</h3>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
              </GlassCard>

              <GlassCard className="p-5 flex items-center justify-between border-white/[0.04] bg-white/[0.01]">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Practice XP</span>
                  <h3 className="text-2xl font-bold text-amber-400 tracking-tight">+{totalPracticeXp}</h3>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
              </GlassCard>

              <GlassCard className="p-5 flex items-center justify-between border-white/[0.04] bg-white/[0.01]">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Today's Target</span>
                  <h3 className="text-base font-bold text-slate-300">
                    {todaySolvedList.length >= 3 ? "Target Met! 🎉" : `${todaySolvedList.length} / 3 solved`}
                  </h3>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <ListTodo className="w-5 h-5" />
                </div>
              </GlassCard>
            </div>

            {/* Today's Solved Items Panel */}
            {todaySolvedList.length > 0 && (
              <GlassCard className="p-4 border-emerald-500/10 bg-emerald-950/[0.01] rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Today's Solved List</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {todaySolvedList.map((prob: any) => (
                    <div
                      key={prob.id}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{prob.name}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Search and Filters */}
            <GlassCard className="p-4 border-white/[0.04] bg-white/[0.005] rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search input */}
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search problem name or tags..."
                  className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none placeholder-slate-600 transition-colors"
                />
              </div>

              {/* Filters list */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                {/* Status Filter */}
                <div className="relative shrink-0">
                  <select
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value)}
                    className="bg-black/40 border border-white/[0.08] rounded-xl py-2 pl-3 pr-8 text-xs text-white focus:outline-none cursor-pointer appearance-none"
                  >
                    <option value="All">All Status</option>
                    <option value="Solved">Solved</option>
                    <option value="Unsolved">Unsolved</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                </div>

                {/* Difficulty Filter */}
                <div className="relative shrink-0">
                  <select
                    value={selectedDifficulty}
                    onChange={e => setSelectedDifficulty(e.target.value)}
                    className="bg-black/40 border border-white/[0.08] rounded-xl py-2 pl-3 pr-8 text-xs text-white focus:outline-none cursor-pointer appearance-none"
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                </div>

                {/* Tag Filter */}
                <div className="relative shrink-0">
                  <select
                    value={selectedTag}
                    onChange={e => setSelectedTag(e.target.value)}
                    className="bg-black/40 border border-white/[0.08] rounded-xl py-2 pl-3 pr-8 text-xs text-white focus:outline-none cursor-pointer appearance-none max-w-[150px]"
                  >
                    <option value="All">All Tags</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </GlassCard>

            {/* List container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProblems.map((prob: any) => {
                const isSolved = !!solvedRecord[prob.id];
                const solveTimeStr = isSolved ? formatTime(solvedRecord[prob.id].duration) : null;
                
                let diffStyle = "text-blue-400 bg-blue-500/10 border-blue-500/20";
                if (prob.difficulty === "Medium") diffStyle = "text-amber-400 bg-amber-500/10 border-amber-500/20";
                if (prob.difficulty === "Hard") diffStyle = "text-rose-400 bg-rose-500/10 border-rose-500/20";

                return (
                  <GlassCard
                    key={prob.id}
                    className={`p-5 flex flex-col justify-between hover:border-white/[0.08] transition-all relative overflow-hidden group ${
                      isSolved ? "bg-emerald-950/[0.005] border-emerald-500/5 hover:border-emerald-500/10" : ""
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        {/* Title and stats */}
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${diffStyle}`}>
                              {prob.difficulty}
                            </span>
                            <span className="text-[9px] font-bold font-mono text-slate-500 uppercase">
                              {prob.topicName}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                            {prob.name}
                          </h4>
                        </div>

                        {/* Status Check badge */}
                        {isSolved && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            {solveTimeStr && <span className="font-mono text-[9px] text-slate-500 font-normal">({solveTimeStr})</span>}
                          </div>
                        )}
                      </div>

                      {/* Display tags list */}
                      {prob.tags && prob.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {prob.tags.slice(0, 3).map((tag: string) => (
                            <span key={tag} className="text-[9px] font-semibold text-slate-400 bg-white/[0.03] border border-white/[0.04] px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-5 pt-3 border-t border-white/[0.03]">
                      <span className="text-[9px] font-mono text-slate-500">
                        {prob.source || "LeetCode"}
                      </span>
                      <button
                        onClick={() => setActiveQuestion(prob)}
                        className="px-3.5 py-1.5 bg-accentPrimary/10 border border-accentPrimary/20 hover:bg-accentPrimary/20 text-accentPrimary rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Start Practice
                      </button>
                    </div>
                  </GlassCard>
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
          // ----------------------------------------------------
          // QUESTION DETAIL & STOPWATCH VIEW
          // ----------------------------------------------------
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Sidebar / Left Column with Stopwatch Timer */}
            <div className="lg:col-span-1 space-y-6">
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Arena
              </button>

              {/* Timer GlassCard */}
              <GlassCard className="p-6 border-white/[0.06] bg-gradient-to-b from-slate-900/40 to-slate-950/60 rounded-2xl flex flex-col items-center text-center space-y-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">Active Practice Timer</span>
                  <div className={`text-4xl font-extrabold font-mono tracking-wider ${timerRunning ? "text-accentPrimary animate-pulse" : "text-white"}`}>
                    {formatTime(timeElapsed)}
                  </div>
                </div>

                {/* Timer Control buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      timerRunning
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                    }`}
                  >
                    {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={() => {
                      setTimerRunning(false);
                      setTimeElapsed(0);
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 text-slate-400 border border-white/[0.06] hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Redirect solve and Complete actions */}
                <div className="w-full space-y-3 pt-3 border-t border-white/[0.04]">
                  <a
                    href={getSolveUrl(activeQuestion)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex justify-center items-center gap-2 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-xs font-bold text-white tracking-wide uppercase transition-all"
                  >
                    <span>Solve on {activeQuestion.source || "LeetCode"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={handleMarkAsSolved}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-xs font-bold text-white tracking-wide uppercase shadow-lg shadow-emerald-500/10 transition-all cursor-pointer"
                  >
                    Mark as Solved (+50 XP)
                  </button>
                </div>
              </GlassCard>

              {/* Tips panel */}
              <GlassCard className="p-4 border-white/[0.04] bg-white/[0.01]">
                <div className="flex gap-2 items-start text-xs leading-relaxed text-slate-400">
                  <AlertCircle className="w-4 h-4 shrink-0 text-accentPrimary mt-0.5" />
                  <p>
                    Solving questions here tracks your active timer and awards practice XP. Solves won't affect your DSA Tracker roadmap completion progress.
                  </p>
                </div>
              </GlassCard>
            </div>

            {/* AI-Generated problem description panel */}
            <div className="lg:col-span-2 space-y-4">
              <GlassCard className="p-6 border-white/[0.06] rounded-2xl min-h-[400px]">
                <div className="flex justify-between items-center border-b border-white/[0.06] pb-4 mb-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">AI Interactive Description</span>
                    <h3 className="text-lg font-bold text-white">{activeQuestion.name}</h3>
                  </div>
                  <div className="px-2.5 py-1 bg-accentPrimary/10 border border-accentPrimary/20 rounded-md text-[9px] font-mono font-bold text-accentPrimary tracking-wider uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accentPrimary" /> Dynamic NIM Model
                  </div>
                </div>

                {/* Content display */}
                {loadingAi ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 select-none">
                    <div className="relative">
                      <div className="w-10 h-10 border-2 border-accentPrimary/20 border-t-accentPrimary rounded-full animate-spin" />
                      <Sparkles className="w-4 h-4 text-accentPrimary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest animate-pulse">Generating coding prompt...</span>
                  </div>
                ) : aiError ? (
                  <div className="p-4 bg-red-500/5 border border-red-500/20 text-red-400 text-xs rounded-xl space-y-3">
                    <div className="flex gap-2 items-start">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>{aiError}</p>
                    </div>
                    <button
                      onClick={() => loadAiProblemStatement(activeQuestion)}
                      className="px-3.5 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg text-[10px] font-bold text-white transition-colors cursor-pointer"
                    >
                      Retry Load
                    </button>
                  </div>
                ) : aiDescription ? (
                  <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed space-y-4">
                    <MarkdownRenderer content={aiDescription} />
                  </div>
                ) : (
                  <div className="text-center py-20 text-slate-500 text-xs">No description loaded.</div>
                )}
              </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
