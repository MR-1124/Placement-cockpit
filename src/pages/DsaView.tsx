import React, { useState } from "react";
import { useAppState } from "../context/AppStateContext";
import { SpotlightCard, ProgressBar } from "../components/Common";
import {
  Search,
  AlertTriangle,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Edit2,
  Bookmark,
  CheckSquare,
  Award,
  Dices,
  Plus,
  Play,
  Sparkles,
  Code2,
  X
} from "lucide-react";
import { MarkdownRenderer } from "../components/MarkdownRenderer";

export const DsaView: React.FC = () => {
  const state = useAppState(s => s.state);
  const toggleDsaProblem = useAppState(s => s.toggleDsaProblem);
  const updateDsaNotes = useAppState(s => s.updateDsaNotes);
  const toggleDsaWeak = useAppState(s => s.toggleDsaWeak);
  const scheduleRevision = useAppState(s => s.scheduleRevision);
  const updateDsaMastery = useAppState(s => s.updateDsaMastery);
  const updateDsaComplexity = useAppState(s => s.updateDsaComplexity);
  const incrementDsaSubmissions = useAppState(s => s.incrementDsaSubmissions);

  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [showAllLevels, setShowAllLevels] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    "arrays-hashing": true,
    "two-pointers": true
  });
  
  const [activeEditProblem, setActiveEditProblem] = useState<{
    topicId: string;
    problemId: string;
    problemName: string;
    notes: string;
    timeComplexity: string;
    spaceComplexity: string;
  } | null>(null);

  const [previewNotes, setPreviewNotes] = useState(false);
  const [timerDuration, setTimerDuration] = useState(2700);
  const [timerSeconds, setTimerSeconds] = useState(2700);
  const [timerRunning, setTimerRunning] = useState(false);

  React.useEffect(() => {
    let intervalId: any = null;
    if (timerRunning && timerSeconds > 0) {
      intervalId = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timerRunning, timerSeconds]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getTopicProgress = (topicId: string, level: string) => {
    const rawTopic = state.dsaTopics.find(t => t.id === topicId);
    if (!rawTopic) return 0;
    const levelProblems = rawTopic.problems.filter(p => p.level === level);
    const completed = levelProblems.filter(p => p.isCompleted).length;
    if (levelProblems.length === 0) return 0;
    return Math.round((completed / levelProblems.length) * 100);
  };

  const filteredTopics = state.dsaTopics.map(topic => {
    const levelFilterActive = !showAllLevels && searchQuery === "" && difficultyFilter === "All";

    const problems = topic.problems.filter(prob => {
      const matchesSearch = prob.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === "All" || prob.difficulty === difficultyFilter;
      const matchesLevel = !levelFilterActive || prob.level === topic.mastery;
      return matchesSearch && matchesDifficulty && matchesLevel;
    });

    return { ...topic, problems };
  }).filter(topic => topic.problems.length > 0 || (searchQuery === "" && difficultyFilter === "All"));

  const handleRandomProblem = () => {
    const allFilteredProblems = filteredTopics.flatMap(topic => 
      topic.problems.map(prob => ({ ...prob, topicId: topic.id }))
    );
    
    let pool = allFilteredProblems;
    if (pool.length === 0) {
      pool = state.dsaTopics.flatMap(topic => 
        topic.problems.map(prob => ({ ...prob, topicId: topic.id }))
      );
    }
    
    if (pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      const selected = pool[randomIndex];
      setActiveEditProblem({
        topicId: selected.topicId,
        problemId: selected.id,
        problemName: selected.name,
        notes: selected.notes || "",
        timeComplexity: selected.timeComplexity || "",
        spaceComplexity: selected.spaceComplexity || ""
      });
      setPreviewNotes(false);
    }
  };

  let recommendedProblem = null;
  for (const topic of state.dsaTopics) {
    const progress = getTopicProgress(topic.id, topic.mastery);
    if (progress < 100) {
      const levelProblems = topic.problems.filter(p => p.level === topic.mastery);
      const nextProb = levelProblems.find(p => !p.isCompleted);
      if (nextProb) {
        recommendedProblem = { topic, problem: nextProb };
        break;
      }
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Banner */}
      <SpotlightCard className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accentPrimary font-bold bg-accentPrimary/10 border border-accentPrimary/25 px-2.5 py-0.5 rounded-md">
                Algorithm Matrix
              </span>
              <span className="text-[10px] font-mono text-slate-500">• NeetCode 150 & Blind 75</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">DSA Problem Bank</h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Track algorithm mastery, log time/space complexities, and schedule spaced repetition reviews.
            </p>
          </div>

          <button
            onClick={handleRandomProblem}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-accentPrimary/15 hover:bg-accentPrimary/25 border border-accentPrimary/30 text-accentPrimary text-xs font-mono font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(var(--accent-rgb),0.1)] active:scale-95 shrink-0"
          >
            <Dices className="w-4 h-4" />
            <span>Random Problem</span>
          </button>
        </div>
      </SpotlightCard>

      {/* 2. Recommended Next Step */}
      {recommendedProblem && (
        <SpotlightCard className="p-5 border-accentPrimary/25 bg-gradient-to-r from-accentPrimary/10 via-transparent to-transparent">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-accentPrimary/15 border border-accentPrimary/30 flex items-center justify-center text-accentPrimary shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)] shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-accentPrimary uppercase font-bold flex items-center gap-1.5 mb-0.5">
                  <Award className="w-3.5 h-3.5" /> Recommended Next Challenge
                </span>
                <h2 className="text-base font-bold text-white tracking-wide">{recommendedProblem.problem.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Topic: <span className="text-slate-200 font-semibold">{recommendedProblem.topic.name}</span>
                </p>
              </div>
            </div>

            <button 
              onClick={() => {
                setExpandedTopics(prev => ({ ...prev, [recommendedProblem.topic.id]: true }));
                setActiveEditProblem({
                  topicId: recommendedProblem.topic.id,
                  problemId: recommendedProblem.problem.id,
                  problemName: recommendedProblem.problem.name,
                  notes: recommendedProblem.problem.notes || "",
                  timeComplexity: recommendedProblem.problem.timeComplexity || "",
                  spaceComplexity: recommendedProblem.problem.spaceComplexity || ""
                });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accentPrimary text-slate-950 text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)] hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Solve Challenge</span>
            </button>
          </div>
        </SpotlightCard>
      )}

      {/* 3. Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search problems, topics, algorithms..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-darkCard/60 border border-white/[0.08] focus:border-accentPrimary rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex gap-1 bg-white/[0.02] border border-white/[0.06] p-1 rounded-xl w-full sm:w-auto">
          {["All", "Easy", "Medium", "Hard"].map(diff => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                difficultyFilter === diff
                  ? "bg-accentPrimary/20 text-accentPrimary border border-accentPrimary/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {searchQuery === "" && difficultyFilter === "All" && (
          <button
            onClick={() => setShowAllLevels(v => !v)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all whitespace-nowrap cursor-pointer ${
              showAllLevels
                ? "bg-accentPrimary/15 border-accentPrimary/30 text-accentPrimary"
                : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200"
            }`}
          >
            {showAllLevels ? "Showing All Levels" : "Filtered: Mastery Level"}
          </button>
        )}
      </div>

      {/* 4. Topics Panels */}
      <div className="space-y-4">
        {filteredTopics.map(topic => {
          const isExpanded = !!expandedTopics[topic.id];
          const progress = getTopicProgress(topic.id, topic.mastery);
          
          const rawTopic = state.dsaTopics.find(t => t.id === topic.id);
          const levelProblemsCount = rawTopic ? rawTopic.problems.filter(p => p.level === topic.mastery).length : 0;
          const levelCompletedCount = rawTopic ? rawTopic.problems.filter(p => p.level === topic.mastery && p.isCompleted).length : 0;

          return (
            <SpotlightCard
              key={topic.id}
              className={`p-0 overflow-hidden border transition-all ${
                isExpanded ? "border-white/[0.12]" : "border-white/[0.05]"
              }`}
            >
              {/* Header Accordion Bar */}
              <div
                onClick={() => setExpandedTopics(prev => ({ ...prev, [topic.id]: !prev[topic.id] }))}
                className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer hover:bg-white/[0.02] transition-all select-none"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2.5">
                    <Code2 className="w-4 h-4 text-accentPrimary" />
                    <h3 className="text-sm font-bold text-white">{topic.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      ({levelCompletedCount}/{levelProblemsCount} solved)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-xl leading-normal">{topic.description}</p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Mastery Dropdown */}
                  <div
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-xs text-slate-400 font-mono"
                  >
                    <Award className="w-3.5 h-3.5 text-accentPrimary" />
                    <select
                      value={topic.mastery}
                      onChange={e => updateDsaMastery(topic.id, e.target.value as any)}
                      className="bg-darkCard border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-slate-200 outline-none focus:border-accentPrimary cursor-pointer"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Master">Master</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-24 hidden sm:block">
                      <ProgressBar percentage={progress} height={4} colorClass="bg-accentPrimary" />
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-300 w-8 text-right">
                      {progress}%
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Problems Table View */}
              {isExpanded && (
                <div className="border-t border-white/[0.06] overflow-x-auto">
                  {topic.problems.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 text-slate-600 mb-2" />
                      <h4 className="text-slate-300 font-bold text-xs">No Problems Found</h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-1">No questions match current filters.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-white/[0.06] text-[10px] uppercase font-mono tracking-wider text-slate-500 bg-black/20">
                          <th className="py-3 px-4 w-12 text-center">Done</th>
                          <th className="py-3 px-3">Problem Title</th>
                          <th className="py-3 px-3 w-28">Difficulty</th>
                          <th className="py-3 px-3 w-24 text-center">Attempts</th>
                          <th className="py-3 px-3 w-36">Spaced Repetition</th>
                          <th className="py-3 px-3 w-24 text-center">Weak Spot</th>
                          <th className="py-3 px-3 w-16 text-center">Notes</th>
                          <th className="py-3 px-4 w-20 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {topic.problems.map(problem => {
                          const hasNotes = !!problem.notes.trim();
                          let diffClass = "neon-pill-emerald";
                          if (problem.difficulty === "Medium") diffClass = "neon-pill-amber";
                          if (problem.difficulty === "Hard") diffClass = "neon-pill-rose";

                          return (
                            <tr
                              key={problem.id}
                              className={`text-xs hover:bg-white/[0.02] transition-colors ${
                                problem.isCompleted ? "text-slate-400 bg-white/[0.005]" : "text-slate-200"
                              }`}
                            >
                              {/* Status Checkbox */}
                              <td className="py-3 px-4 text-center">
                                <button
                                  onClick={() => toggleDsaProblem(topic.id, problem.id)}
                                  className="p-1 rounded-lg transition-all cursor-pointer"
                                >
                                  {problem.isCompleted ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <div className="w-4 h-4 rounded border border-white/[0.15] hover:border-accentPrimary" />
                                  )}
                                </button>
                              </td>

                              {/* Problem Name & Complexity */}
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1.5">
                                  <span className={`font-semibold ${problem.isCompleted ? "line-through opacity-60" : "text-white"}`}>
                                    {problem.name}
                                  </span>
                                  <a
                                    href={problem.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-500 hover:text-accentPrimary transition-colors"
                                    title="Open problem link"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                                {(problem.timeComplexity || problem.spaceComplexity) && (
                                  <div className="flex gap-1.5 mt-1 font-mono text-[9px]">
                                    {problem.timeComplexity && (
                                      <span className="bg-white/[0.03] border border-white/[0.06] text-slate-400 px-1.5 py-0.5 rounded">
                                        Time: {problem.timeComplexity}
                                      </span>
                                    )}
                                    {problem.spaceComplexity && (
                                      <span className="bg-white/[0.03] border border-white/[0.06] text-slate-400 px-1.5 py-0.5 rounded">
                                        Space: {problem.spaceComplexity}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </td>

                              {/* Difficulty */}
                              <td className="py-3 px-3">
                                <span className={`text-[9px] px-2 py-0.5 rounded-md font-mono font-bold uppercase tracking-wider border ${diffClass}`}>
                                  {problem.difficulty}
                                </span>
                              </td>

                              {/* Attempts */}
                              <td className="py-3 px-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <span className="text-xs font-mono font-bold text-slate-300">
                                    {(problem as any).submissions || 0}
                                  </span>
                                  <button
                                    onClick={() => incrementDsaSubmissions(topic.id, problem.id)}
                                    className="p-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                                    title="Log submission attempt"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>

                              {/* Spaced Repetition */}
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-slate-500" />
                                  <select
                                    disabled={!problem.isCompleted}
                                    value={problem.revisionInterval || 0}
                                    onChange={e =>
                                      scheduleRevision(topic.id, problem.id, parseInt(e.target.value))
                                    }
                                    className="bg-transparent border border-white/[0.06] text-[10px] font-mono text-slate-400 outline-none rounded p-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                  >
                                    <option value={0} className="bg-darkCard">Not Queued</option>
                                    <option value={1} className="bg-darkCard">1 Day Interval</option>
                                    <option value={3} className="bg-darkCard">3 Days Interval</option>
                                    <option value={7} className="bg-darkCard">7 Days Interval</option>
                                    <option value={14} className="bg-darkCard">14 Days Interval</option>
                                    <option value={30} className="bg-darkCard">30 Days Interval</option>
                                  </select>
                                </div>
                              </td>

                              {/* Weak Bookmark */}
                              <td className="py-3 px-3 text-center">
                                <button
                                  onClick={() => toggleDsaWeak(topic.id, problem.id)}
                                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                    problem.isWeak ? "text-rose-400" : "text-slate-600 hover:text-slate-400"
                                  }`}
                                  title="Mark as weak topic"
                                >
                                  {problem.isWeak ? (
                                    <AlertTriangle className="w-4 h-4" />
                                  ) : (
                                    <Bookmark className="w-4 h-4" />
                                  )}
                                </button>
                              </td>

                              {/* Notes */}
                              <td className="py-3 px-3 text-center">
                                <button
                                  onClick={() => {
                                    setTimerSeconds(timerDuration);
                                    setTimerRunning(false);
                                    setPreviewNotes(false);
                                    setActiveEditProblem({
                                      topicId: topic.id,
                                      problemId: problem.id,
                                      problemName: problem.name,
                                      notes: problem.notes,
                                      timeComplexity: problem.timeComplexity || "",
                                      spaceComplexity: problem.spaceComplexity || ""
                                    });
                                  }}
                                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                    hasNotes ? "text-amber-400" : "text-slate-600 hover:text-slate-400"
                                  }`}
                                  title="Edit problem notes"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              </td>

                              {/* Solution Video */}
                              <td className="py-3 px-4 text-center">
                                <a
                                  href={`https://www.youtube.com/results?search_query=neetcode+${encodeURIComponent(
                                    problem.name
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-slate-400 hover:text-accentPrimary font-mono transition-colors"
                                >
                                  Video
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </SpotlightCard>
          );
        })}
      </div>

      {/* 5. Problem Notes Modal */}
      {activeEditProblem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <SpotlightCard className="w-full max-w-lg space-y-4 border border-white/[0.12] shadow-2xl bg-darkCard/95 p-6">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Concept & Notes</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{activeEditProblem.problemName}</h3>
              </div>
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setActiveEditProblem(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg border border-white/[0.08] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stopwatch Widget */}
            <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Practice Clock</span>
                <span className={`text-xl font-bold font-mono ${timerSeconds < 300 ? "text-rose-400 animate-pulse" : "text-white"}`}>
                  {formatTime(timerSeconds)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  disabled={timerRunning}
                  value={timerDuration}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTimerDuration(val);
                    setTimerSeconds(val);
                  }}
                  className="bg-darkCard border border-white/[0.08] text-slate-300 rounded-lg px-2 py-1 text-xs cursor-pointer focus:outline-none focus:border-accentPrimary disabled:opacity-50 font-mono"
                >
                  <option value={900}>15 Min</option>
                  <option value={1800}>30 Min</option>
                  <option value={2700}>45 Min</option>
                  <option value={3600}>60 Min</option>
                </select>
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    timerRunning 
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" 
                      : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {timerRunning ? "Pause" : "Start"}
                </button>
                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerSeconds(timerDuration);
                  }}
                  className="bg-white/[0.03] border border-white/[0.06] text-slate-400 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer hover:text-white"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Complexity Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Time Complexity</label>
                <input
                  type="text"
                  value={activeEditProblem.timeComplexity}
                  onChange={e =>
                    setActiveEditProblem(prev => (prev ? { ...prev, timeComplexity: e.target.value } : null))
                  }
                  placeholder="e.g. O(N log N)"
                  className="w-full bg-white/[0.02] border border-white/[0.08] focus:border-accentPrimary rounded-xl px-3 py-2 text-xs text-slate-200 outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Space Complexity</label>
                <input
                  type="text"
                  value={activeEditProblem.spaceComplexity}
                  onChange={e =>
                    setActiveEditProblem(prev => (prev ? { ...prev, spaceComplexity: e.target.value } : null))
                  }
                  placeholder="e.g. O(1)"
                  className="w-full bg-white/[0.02] border border-white/[0.08] focus:border-accentPrimary rounded-xl px-3 py-2 text-xs text-slate-200 outline-none font-mono"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Notes & Insights</span>
              <button
                onClick={() => setPreviewNotes(!previewNotes)}
                className="text-[10px] font-mono bg-white/[0.04] border border-white/[0.08] text-slate-300 px-2 py-0.5 rounded cursor-pointer hover:bg-white/[0.08]"
              >
                {previewNotes ? "Edit" : "Markdown Preview"}
              </button>
            </div>
            {previewNotes ? (
              <div className="w-full h-44 bg-white/[0.01] border border-white/[0.06] rounded-xl p-3 text-xs text-slate-200 overflow-y-auto leading-relaxed">
                <MarkdownRenderer content={activeEditProblem.notes || "_No notes yet._"} />
              </div>
            ) : (
              <textarea
                value={activeEditProblem.notes}
                onChange={e =>
                  setActiveEditProblem(prev => (prev ? { ...prev, notes: e.target.value } : null))
                }
                placeholder="Write core edge cases, recurrence relations, or tricky pointers..."
                className="w-full h-44 bg-white/[0.02] border border-white/[0.08] focus:border-accentPrimary rounded-xl p-3 text-xs text-slate-300 font-mono placeholder-slate-600 focus:outline-none resize-none"
              />
            )}

            <div className="flex justify-end gap-3 text-xs pt-2">
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setActiveEditProblem(null);
                }}
                className="bg-white/[0.03] border border-white/[0.06] px-4 py-2 rounded-xl text-slate-400 font-medium hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateDsaNotes(
                    activeEditProblem.topicId,
                    activeEditProblem.problemId,
                    activeEditProblem.notes
                  );
                  updateDsaComplexity(
                    activeEditProblem.topicId,
                    activeEditProblem.problemId,
                    activeEditProblem.timeComplexity,
                    activeEditProblem.spaceComplexity
                  );
                  setTimerRunning(false);
                  setActiveEditProblem(null);
                }}
                className="bg-accentPrimary text-slate-950 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)] hover:scale-105 active:scale-95"
              >
                Save Notes
              </button>
            </div>
          </SpotlightCard>
        </div>
      )}
    </div>
  );
};
