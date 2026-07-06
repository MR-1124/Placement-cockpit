import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import { GlassCard } from "../components/Common";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { nvidiaFetch } from "../lib/nvidiaApi";
import { APTITUDE_CATEGORIES, generateMockQuestions } from "../data/aptitudeData";
import type { AptitudeTopic, AptitudeQuestion } from "../data/aptitudeData";
import {
  Award,
  Clock,
  TrendingUp,
  Search,
  BookOpen,
  ArrowLeft,
  Sparkles,
  Trophy,
  Play,
  Bookmark,
  Flag
} from "lucide-react";

export const AptitudeView: React.FC = () => {
  const { state, markAptitudeTopicCompleted, submitAptitudeQuiz } = useAppState();

  // Screen modes: "dashboard" | "overview" | "quiz" | "summary"
  const [screenMode, setScreenMode] = useState<"dashboard" | "overview" | "quiz" | "summary">("dashboard");
  const [selectedTopic, setSelectedTopic] = useState<AptitudeTopic | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("All");

  // Dynamic AI overview states
  const [aiOverview, setAiOverview] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Quiz States
  const [quizQuestions, setQuizQuestions] = useState<AptitudeQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});
  const [questionStatuses, setQuestionStatuses] = useState<Record<number, "correct" | "incorrect" | "unattempted">>({});
  const [quizTimeSpent, setQuizTimeSpent] = useState(0);
  const [quizTimerActive, setQuizTimerActive] = useState(false);
  const quizTimerRef = useRef<any>(null);

  // Stats calculation
  const quizHistory = state.aptitudeQuizHistory || [];
  const topicProgress = state.aptitudeTopicProgress || {};

  const metrics = React.useMemo(() => {
    let totalAttempts = quizHistory.length;
    let totalCorrect = 0;
    let totalQuestions = 0;
    let totalTime = 0;

    quizHistory.forEach(attempt => {
      totalCorrect += attempt.correctCount;
      totalQuestions += attempt.totalCount;
      totalTime += attempt.timeSpent;
    });

    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    
    let completedCount = 0;
    Object.values(topicProgress).forEach((prog: any) => {
      if (prog.completed) completedCount++;
    });

    return {
      accuracy,
      totalTime,
      completedCount,
      totalAttempts
    };
  }, [quizHistory, topicProgress]);

  // Active timer for Quiz
  useEffect(() => {
    if (quizTimerActive) {
      quizTimerRef.current = setInterval(() => {
        setQuizTimeSpent(prev => prev + 1);
      }, 1000);
    } else {
      if (quizTimerRef.current) clearInterval(quizTimerRef.current);
    }
    return () => {
      if (quizTimerRef.current) clearInterval(quizTimerRef.current);
    };
  }, [quizTimerActive]);

  // Load AI dynamic overview textbook contents
  const loadTopicOverview = async (topic: AptitudeTopic) => {
    if (!state.sessionNvidiaKey) {
      setAiError("NVIDIA API Key not found. Please set your API Key in Settings to get dynamic AI textbook overviews.");
      return;
    }
    setLoadingAi(true);
    setAiError(null);
    setAiOverview(null);

    try {
      const prompt = `Write a comprehensive, textbook-style detailed summary and overview for the Aptitude Topic: "${topic.name}".
Subtopics covered: ${topic.subtopics.join(", ")}.

Provide:
1. Introduction & Core Concept Explanation.
2. Crucial Formulas & Equations (clearly structured).
3. Speed-solving Techniques, Shortcuts, and Mental Math Hacks.
4. Step-by-Step Solved Textbook Example.
5. Common Gotchas and Exam Tips.

Return the explanation in clean, highly readable Markdown format. Do not use conversational openings or general chat preambles.`;

      const response = await nvidiaFetch({
        apiKey: state.sessionNvidiaKey,
        modelName: state.settings.nvidiaModelName || "meta/llama-3.1-70b-instruct",
        messages: [
          { role: "system", content: "You are a professional quantitative aptitude and logical reasoning textbook writer." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      });

      if (!response.ok) throw new Error("API call failed.");
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        setAiOverview(content);
      } else {
        throw new Error("Empty response from AI model.");
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Failed to generate topic overview. You can still proceed directly to the practice room.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSelectTopic = (topic: AptitudeTopic) => {
    setSelectedTopic(topic);
    setScreenMode("overview");
    loadTopicOverview(topic);
  };

  const startQuiz = () => {
    if (!selectedTopic) return;
    const questions = generateMockQuestions(selectedTopic.name);
    setQuizQuestions(questions);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setCheckedQuestions({});
    setRevealedQuestions({});
    setQuizTimeSpent(0);
    
    // Initialize unattempted statuses
    const initialStatuses: Record<number, "correct" | "incorrect" | "unattempted"> = {};
    questions.forEach((_, idx) => {
      initialStatuses[idx] = "unattempted";
    });
    setQuestionStatuses(initialStatuses);
    
    setQuizTimerActive(true);
    setScreenMode("quiz");
  };

  const handleSelectOption = (optionKey: "A" | "B" | "C" | "D") => {
    if (checkedQuestions[currentQuestionIdx] || revealedQuestions[currentQuestionIdx]) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: optionKey
    }));
  };

  const handleCheckAnswer = () => {
    const activeQ = quizQuestions[currentQuestionIdx];
    const selected = selectedAnswers[currentQuestionIdx];
    if (!selected) return;

    setCheckedQuestions(prev => ({ ...prev, [currentQuestionIdx]: true }));
    
    const isCorrect = selected === activeQ.correctOption;
    setQuestionStatuses(prev => ({
      ...prev,
      [currentQuestionIdx]: isCorrect ? "correct" : "incorrect"
    }));
  };

  const handleRevealAnswer = () => {
    setRevealedQuestions(prev => ({ ...prev, [currentQuestionIdx]: true }));
    setQuestionStatuses(prev => ({
      ...prev,
      [currentQuestionIdx]: "correct" // Mark correct for completion maps if revealed
    }));
  };

  const completeQuiz = () => {
    if (!selectedTopic) return;
    setQuizTimerActive(false);

    let correctCount = 0;
    const answersRecord: Record<number, { selected: string; correct: boolean }> = {};

    quizQuestions.forEach((q, idx) => {
      const selected = selectedAnswers[idx] || "";
      const isCorrect = selected === q.correctOption;
      if (isCorrect) correctCount++;
      answersRecord[idx] = {
        selected,
        correct: isCorrect
      };
    });

    submitAptitudeQuiz(
      selectedTopic.id,
      correctCount,
      quizQuestions.length,
      quizTimeSpent,
      answersRecord
    );

    // Also mark topic as completed if score is at least 70%
    if (correctCount / quizQuestions.length >= 0.7) {
      markAptitudeTopicCompleted(selectedTopic.id);
    }

    setScreenMode("summary");
  };

  const formatDuration = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainingSecs = secs % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m ${remainingSecs}s`;
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  // Filter topics
  const filteredCategories = React.useMemo(() => {
    return APTITUDE_CATEGORIES.map(cat => {
      if (selectedCategoryId !== "All" && cat.id !== selectedCategoryId) {
        return null;
      }
      const matchingTopics = cat.topics.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subtopics.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      if (matchingTopics.length === 0) return null;
      return {
        ...cat,
        topics: matchingTopics
      };
    }).filter(Boolean);
  }, [searchQuery, selectedCategoryId]);

  const activeQuestion = quizQuestions[currentQuestionIdx];
  const totalCorrectInQuiz = quizQuestions.filter((_, idx) => questionStatuses[idx] === "correct").length;

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        
        {/* SCREEN A: LIBRARY DASHBOARD */}
        {screenMode === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Aptitude Metrics Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <GlassCard className="p-5 flex items-center justify-between border-white/[0.04]">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Topics Mastered</span>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{metrics.completedCount}</h3>
                </div>
                <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                  <Award className="w-5 h-5" />
                </div>
              </GlassCard>

              <GlassCard className="p-5 flex items-center justify-between border-white/[0.04]">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Practice Accuracy</span>
                  <h3 className="text-2xl font-bold text-emerald-400 tracking-tight">{metrics.accuracy}%</h3>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </GlassCard>

              <GlassCard className="p-5 flex items-center justify-between border-white/[0.04]">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Practice Time</span>
                  <h3 className="text-2xl font-bold text-amber-400 tracking-tight">{formatDuration(metrics.totalTime)}</h3>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
              </GlassCard>

              <GlassCard className="p-5 flex items-center justify-between border-white/[0.04]">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Quizzes Attempted</span>
                  <h3 className="text-2xl font-bold text-blue-400 tracking-tight">{metrics.totalAttempts}</h3>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <BookOpen className="w-5 h-5" />
                </div>
              </GlassCard>
            </div>

            {/* Filters panel */}
            <GlassCard className="p-4 border-white/[0.04] bg-white/[0.005] rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search topic name or subtopics..."
                  className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none placeholder-slate-600 transition-colors"
                />
              </div>

              <div className="flex gap-2 bg-white/[0.02] border border-white/[0.06] p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                <button
                  onClick={() => setSelectedCategoryId("All")}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategoryId === "All" ? "bg-white/[0.08] text-white" : "text-slate-500 hover:text-slate-350"
                  }`}
                >
                  All Categories
                </button>
                {APTITUDE_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategoryId === cat.id ? "bg-white/[0.08] text-white" : "text-slate-500 hover:text-slate-350"
                    }`}
                  >
                    {cat.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Categories and Topics list */}
            <div className="space-y-8">
              {filteredCategories.map((cat: any) => (
                <div key={cat.id} className="space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-300 font-mono uppercase tracking-wider border-l-2 border-accentPrimary pl-2.5">
                    {cat.name}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cat.topics.map((topic: AptitudeTopic) => {
                      const progress = topicProgress[topic.id];
                      const isCompleted = progress?.completed;
                      const hasBestScore = progress?.bestScore !== undefined;

                      return (
                        <GlassCard
                          key={topic.id}
                          className={`p-5 flex flex-col justify-between hover:border-white/[0.08] transition-all cursor-pointer group ${
                            isCompleted ? "border-emerald-500/10 bg-emerald-950/[0.005]" : ""
                          }`}
                          onClick={() => handleSelectTopic(topic)}
                        >
                          <div className="space-y-3">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                                {topic.name}
                              </h4>
                              {isCompleted && (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                                  Done
                                </span>
                              )}
                            </div>

                            {/* Subtopics listing */}
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                              {topic.subtopics.join(", ")}
                            </p>
                          </div>

                          <div className="flex justify-between items-center mt-5 pt-3 border-t border-white/[0.03]">
                            <span className="text-[9px] font-mono text-slate-500">
                              {topic.subtopics.length} subtopics
                            </span>
                            {hasBestScore && (
                              <span className="text-[9px] font-bold text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/15">
                                Best: {progress.bestScore} correct
                              </span>
                            )}
                          </div>
                        </GlassCard>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SCREEN B: TEXTBOOK OVERVIEW */}
        {screenMode === "overview" && selectedTopic && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Top row */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setScreenMode("dashboard")}
                className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Library
              </button>

              <button
                onClick={startQuiz}
                className="px-5 py-2 bg-accentPrimary hover:bg-accentPrimary/90 rounded-xl text-xs font-bold text-white uppercase tracking-wider shadow-lg shadow-accentPrimary/15 transition-all cursor-pointer flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Start Practice Room
              </button>
            </div>

            {/* AI Explanation / Textbook display */}
            <GlassCard className="p-6 border-white/[0.06] min-h-[400px]">
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-4 mb-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Textbook Article</span>
                  <h3 className="text-lg font-bold text-white">{selectedTopic.name}</h3>
                </div>
                <div className="px-2.5 py-1 bg-accentPrimary/10 border border-accentPrimary/20 rounded-md text-[9px] font-mono font-bold text-accentPrimary tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accentPrimary" /> Dynamic AI Summarizer
                </div>
              </div>

              {loadingAi ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                  <div className="relative">
                    <div className="w-10 h-10 border-2 border-accentPrimary/20 border-t-accentPrimary rounded-full animate-spin" />
                    <Sparkles className="w-4 h-4 text-accentPrimary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest animate-pulse">Generating Textbook...</span>
                </div>
              ) : aiError ? (
                <div className="p-4 bg-red-500/5 border border-red-500/20 text-red-400 text-xs rounded-xl space-y-3">
                  <p>{aiError}</p>
                  <button
                    onClick={() => loadTopicOverview(selectedTopic)}
                    className="px-3.5 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg text-[10px] font-bold text-white transition-colors cursor-pointer"
                  >
                    Retry Load
                  </button>
                </div>
              ) : aiOverview ? (
                <div className="prose prose-invert max-w-none text-xs text-slate-350 leading-relaxed space-y-4">
                  <MarkdownRenderer content={aiOverview} />
                </div>
              ) : (
                <div className="text-center py-20 text-slate-500 text-xs">No article summary found.</div>
              )}
            </GlassCard>
          </motion.div>
        )}

        {/* SCREEN C: PRACTICE ROOM (QUIZ VIEW) */}
        {screenMode === "quiz" && selectedTopic && activeQuestion && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            {/* Main Quiz Frame */}
            <div className="lg:col-span-3 space-y-5">
              
              {/* Quiz Header Row */}
              <div className="flex justify-between items-center bg-black/40 border border-white/[0.06] p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setQuizTimerActive(false);
                      setScreenMode("overview");
                    }}
                    className="p-2 bg-white/[0.02] border border-white/[0.06] rounded-lg hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                      {selectedTopic.name.toLowerCase()} Practice Room
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Untimed learning mode • Instant feedback
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block font-bold">Solved in Topic</span>
                  <span className="text-xs font-bold text-white font-mono">
                    {totalCorrectInQuiz} / {quizQuestions.length}
                  </span>
                </div>
              </div>

              {/* Progress Bar indicator */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider">
                  <span>Question {currentQuestionIdx + 1} of {quizQuestions.length}</span>
                  <span>{Math.round(((currentQuestionIdx + 1) / quizQuestions.length) * 100)}% Complete</span>
                </div>
                <div className="h-1.5 bg-white/[0.04] border border-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accentPrimary transition-all duration-300"
                    style={{ width: `${((currentQuestionIdx + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Active question panel */}
              <GlassCard className="p-6 border-white/[0.06] rounded-2xl space-y-5 relative">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[8px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                    {activeQuestion.difficulty}
                  </span>
                  <div className="flex items-center gap-2 text-slate-500">
                    <button className="p-1 hover:text-white transition-colors cursor-pointer">
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:text-white transition-colors cursor-pointer">
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Statement */}
                <h4 className="text-sm font-semibold text-slate-200 leading-relaxed">
                  {activeQuestion.text}
                </h4>

                {/* Options cards A, B, C, D */}
                <div className="space-y-3 pt-2">
                  {activeQuestion.options.map(opt => {
                    const isSelected = selectedAnswers[currentQuestionIdx] === opt.key;
                    const isChecked = checkedQuestions[currentQuestionIdx];
                    const isRevealed = revealedQuestions[currentQuestionIdx];
                    const isCorrect = opt.key === activeQuestion.correctOption;

                    let optStyle = "bg-black/30 border-white/[0.06] text-slate-350 hover:bg-white/[0.02]";
                    if (isSelected) {
                      optStyle = "bg-accentPrimary/5 border-accentPrimary/40 text-accentPrimary";
                    }
                    if (isChecked || isRevealed) {
                      if (isCorrect) {
                        optStyle = "bg-emerald-500/10 border-emerald-500/40 text-emerald-400";
                      } else if (isSelected) {
                        optStyle = "bg-rose-500/10 border-rose-500/40 text-rose-400";
                      }
                    }

                    return (
                      <div
                        key={opt.key}
                        onClick={() => handleSelectOption(opt.key)}
                        className={`p-4 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${optStyle}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[10px] font-bold font-mono">
                          {opt.key}
                        </span>
                        <span className="text-xs font-semibold">{opt.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Check & Reveal Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCheckAnswer}
                      disabled={!selectedAnswers[currentQuestionIdx] || checkedQuestions[currentQuestionIdx] || revealedQuestions[currentQuestionIdx]}
                      className="px-4 py-2 bg-accentPrimary/10 border border-accentPrimary/20 hover:bg-accentPrimary/20 disabled:opacity-30 text-accentPrimary rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Check Answer
                    </button>
                    <button
                      onClick={handleRevealAnswer}
                      disabled={revealedQuestions[currentQuestionIdx]}
                      className="px-4 py-2 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] disabled:opacity-30 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      Reveal Answer
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                      disabled={currentQuestionIdx === 0}
                      className="px-3.5 py-2 bg-black/40 border border-white/[0.08] hover:bg-black/60 hover:border-white/[0.15] disabled:opacity-20 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      &lt; Prev
                    </button>
                    {currentQuestionIdx < quizQuestions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIdx(prev => Math.min(quizQuestions.length - 1, prev + 1))}
                        className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Next &gt;
                      </button>
                    ) : (
                      <button
                        onClick={completeQuiz}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Complete Practice
                      </button>
                    )}
                  </div>
                </div>

                {/* Explanation text */}
                {(checkedQuestions[currentQuestionIdx] || revealedQuestions[currentQuestionIdx]) && (
                  <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl text-xs text-slate-400 space-y-1.5 leading-relaxed">
                    <div className="font-bold text-slate-200">Solution Explanation:</div>
                    <p>{activeQuestion.explanation}</p>
                  </div>
                )}
              </GlassCard>

              {/* Debug / Info metadata footer */}
              <div className="flex flex-wrap gap-4 text-[9px] font-mono text-slate-600 bg-white/[0.005] p-3 border border-white/[0.04] rounded-xl justify-between">
                <span>Question ID: {activeQuestion.id}</span>
                <span>Options ID: {activeQuestion.id}-options</span>
                <span>Answer ID: {activeQuestion.id}-answer</span>
                <span>Explanation ID: {activeQuestion.id}-expl</span>
              </div>
            </div>

            {/* Right Column: Progress Map Matrix */}
            <div className="lg:col-span-1 space-y-6">
              {/* Timer metrics */}
              <GlassCard className="p-5 flex flex-col items-center text-center space-y-3">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Session Timer</span>
                <h4 className="text-3xl font-extrabold text-white font-mono tracking-wider">{formatTimer(quizTimeSpent)}</h4>
              </GlassCard>

              {/* Topic Progress Map grid */}
              <GlassCard className="p-5 space-y-4">
                <div className="border-b border-white/[0.06] pb-3">
                  <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    Topic Progress Map
                  </h4>
                </div>

                {/* Grid container */}
                <div className="grid grid-cols-5 gap-2.5">
                  {quizQuestions.map((_, idx) => {
                    const status = questionStatuses[idx];
                    let indicatorStyle = "bg-white/[0.02] border-white/[0.06] text-slate-500 hover:border-white/[0.12] hover:text-white";
                    if (status === "correct") {
                      indicatorStyle = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20";
                    } else if (status === "incorrect") {
                      indicatorStyle = "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20";
                    } else if (idx === currentQuestionIdx) {
                      indicatorStyle = "bg-accentPrimary/5 border-accentPrimary/40 text-accentPrimary";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIdx(idx)}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono text-xs font-bold transition-all cursor-pointer ${indicatorStyle}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Key indicators */}
                <div className="flex gap-4 pt-3 border-t border-white/[0.06] text-[10px] font-semibold text-slate-500 select-none">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                    <span>Solved</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/40" />
                    <span>Incorrect</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/[0.02] border border-white/[0.06]" />
                    <span>Unattempted</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {/* SCREEN D: SUMMARY SCREEN */}
        {screenMode === "summary" && selectedTopic && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="max-w-md mx-auto"
          >
            <GlassCard className="p-6 border-white/[0.06] rounded-2xl text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Trophy className="w-8 h-8" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">Quiz Completed</span>
                <h3 className="text-xl font-bold text-white">{selectedTopic.name} Room</h3>
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-2 gap-4 bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl text-center">
                <div className="space-y-1 border-r border-white/[0.06]">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Correct Rate</span>
                  <span className="text-lg font-bold text-white font-mono">
                    {totalCorrectInQuiz} / {quizQuestions.length}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Time Spent</span>
                  <span className="text-lg font-bold text-white font-mono">
                    {formatTimer(quizTimeSpent)}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                <button
                  onClick={() => setScreenMode("dashboard")}
                  className="w-full py-2.5 bg-accentPrimary hover:bg-accentPrimary/90 rounded-xl text-xs font-bold text-white uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Return to Library
                </button>
                <button
                  onClick={startQuiz}
                  className="w-full py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
