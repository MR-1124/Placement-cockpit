import { motion } from "framer-motion";
import React, { useState } from "react";
import { useAppState } from "../context/AppStateContext";
import { GlassCard, ProgressBar } from "../components/Common";
import {
  Search,
  BookOpen,
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
  Plus
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
  // Bug #6 fix: separate show-all-levels toggle.
  // When searching or filtering by difficulty, we override the mastery level filter
  // so users don't get silently empty results when two orthogonal filters conflict.
  const [showAllLevels, setShowAllLevels] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    "arrays-hashing": true,
    "two-pointers": true
  });
  
  // Note Modal local state
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
    // Bug #6 fix: the mastery level filter (matchesLevel) is a default study-mode filter.
    // It is automatically bypassed when:
    //   - user has typed a search query (they want to find ANY matching problem)
    //   - user has selected a specific difficulty (orthogonal filter dimension)
    //   - user explicitly toggled showAllLevels
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
    // Flatten all currently filtered problems
    const allFilteredProblems = filteredTopics.flatMap(topic => 
      topic.problems.map(prob => ({ ...prob, topicId: topic.id }))
    );
    
    // Fallback to all problems if filtered list is empty
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-slate-500">Practice Board</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">DSA Learning Tracker</h1>
            <p className="text-sm text-slate-400 mt-1">
              Build problem-solving velocity. Track LeetCode classic lists, log mistakes, and schedule spaced revisions.
            </p>
          </div>
          <button
            onClick={handleRandomProblem}
            className="flex items-center gap-2 px-4 py-2 bg-accentPrimary/10 border border-accentPrimary/30 text-accentPrimary hover:bg-accentPrimary hover:text-black hover:shadow-[0_0_15px_rgba(var(--color-accent-primary),0.4)] rounded-xl text-sm font-bold transition-all shrink-0 active:scale-95 cursor-pointer"
          >
            <Dices className="w-4 h-4" />
            <span>Random Problem</span>
          </button>
        </div>

      {/* Smart DSA Recommendation Engine (Fix 90) */}
      {recommendedProblem && (
         <div className="bg-gradient-to-r from-accentPrimary/10 to-transparent border border-accentPrimary/30 shadow-[0_0_20px_rgba(var(--color-accent-primary),0.1)] p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden group">
           <div>
             <span className="text-[10px] font-mono text-accentPrimary uppercase font-bold flex items-center gap-1.5 mb-1"><Award className="w-3.5 h-3.5" /> Recommended Next Step</span>
             <h2 className="text-sm font-bold text-white tracking-wide">{recommendedProblem.problem.name}</h2>
             <p className="text-xs text-slate-400 mt-1">Focus Area: <span className="text-slate-300 font-bold">{recommendedProblem.topic.name}</span></p>
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
             className="px-5 py-2.5 bg-accentPrimary hover:bg-accentPrimary/90 text-black rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(var(--color-accent-primary),0.4)] hover:scale-[1.02] active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer w-full sm:w-auto justify-center relative z-10"
           >
             <span>Solve Now</span>
           </button>
         </div>
      )}

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search problems, Leetcode titles..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-black/60 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentPrimary transition-colors shadow-inner"
          />
        </div>

        <div className="flex gap-1 bg-white/[0.02] border border-white/[0.04] p-1 rounded-xl w-full sm:w-auto">
          {["All", "Easy", "Medium", "Hard"].map(diff => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                difficultyFilter === diff
                  ? "bg-white/[0.08] text-white shadow-sm border border-white/[0.04]"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02] border border-transparent"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Bug #6 fix: explicit "Show All Levels" toggle visible when in default browse mode */}
        {searchQuery === "" && difficultyFilter === "All" && (
          <button
            onClick={() => setShowAllLevels(v => !v)}
            title={showAllLevels ? "Currently showing all difficulty levels. Click to filter by your mastery level." : "Currently filtered to your mastery level per topic. Click to show all levels."}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold border transition-all whitespace-nowrap ${
              showAllLevels
                ? "bg-accentPrimary/10 border-accentPrimary/30 text-accentPrimary"
                : "bg-white/[0.02] border-white/[0.04] text-slate-500 hover:text-slate-300"
            }`}
          >
            {showAllLevels ? "All Levels" : "Mastery Level"}
          </button>
        )}
      </div>

      {/* Topics Expansion Panel */}
      <div className="space-y-4">
        {filteredTopics.map(topic => {
          const isExpanded = !!expandedTopics[topic.id];
          const progress = getTopicProgress(topic.id, topic.mastery);
          
          const rawTopic = state.dsaTopics.find(t => t.id === topic.id);
          const levelProblemsCount = rawTopic ? rawTopic.problems.filter(p => p.level === topic.mastery).length : 0;
          const levelCompletedCount = rawTopic ? rawTopic.problems.filter(p => p.level === topic.mastery && p.isCompleted).length : 0;

          return (
            <GlassCard
              key={topic.id}
              className={`p-0 overflow-hidden border transition-all ${
                isExpanded ? "border-white/[0.08]" : "border-white/[0.04]"
              }`}
            >
              {/* Header block click to toggle */}
              <div
                onClick={() =>
                  setExpandedTopics(prev => ({ ...prev, [topic.id]: !prev[topic.id] }))
                }
                className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer hover:bg-white/[0.02] transition-all select-none relative group/header"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/header:opacity-10 transition-opacity pointer-events-none">
                  <BookOpen className="w-24 h-24 text-accentPrimary" />
                </div>
                <div className="space-y-1 flex-1 relative z-10">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white leading-none">{topic.name}</h3>
                    <span className="text-[10px] font-mono text-slate-500">
                      ({levelCompletedCount}/{levelProblemsCount} solved)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-xl leading-normal">{topic.description}</p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end relative z-10">
                  {/* Mastery Dropdown inside card */}
                  <div
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-xs text-slate-400 font-mono"
                  >
                    <Award className="w-3.5 h-3.5 text-slate-500" />
                    <select
                      value={topic.mastery}
                      onChange={e =>
                        updateDsaMastery(topic.id, e.target.value as any)
                      }
                      className="bg-transparent border border-white/[0.06] rounded px-1.5 py-0.5 text-xs text-slate-300 outline-none focus:border-accentPrimary"
                    >
                      <option value="Beginner" className="bg-darkBg">Beginner</option>
                      <option value="Intermediate" className="bg-darkBg">Intermediate</option>
                      <option value="Master" className="bg-darkBg">Master</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-24 hidden sm:block">
                      <ProgressBar percentage={progress} height={4} colorClass="bg-violet-500" />
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-400 w-8 text-right">
                      {progress}%
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Problems table body */}
              {isExpanded && (
                <div className="border-t border-white/[0.06] overflow-x-auto">
                  {topic.problems.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
                        <Search className="w-6 h-6 text-slate-500" />
                      </div>
                      <h3 className="text-slate-300 font-bold mb-1">No Problems Found</h3>
                      <p className="text-xs text-slate-500 italic mb-4">No problems match the current filter search.</p>
                      <button onClick={() => { setSearchQuery(""); setDifficultyFilter("All"); setShowAllLevels(true); }} className="px-4 py-2 bg-white/[0.05] text-slate-300 rounded-lg text-xs font-bold hover:bg-white/[0.1] transition-colors cursor-pointer">Clear Filters</button>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-white/[0.06] text-[10px] uppercase font-mono tracking-wider text-slate-500">
                          <th className="py-3 px-5 w-12 text-center">Status</th>
                          <th className="py-3 px-3">Problem Name</th>
                          <th className="py-3 px-3 w-24">Difficulty</th>
                          <th className="py-3 px-3 w-24 text-center">Attempts</th>
                          <th className="py-3 px-3 w-36">Spaced Revision</th>
                          <th className="py-3 px-3 w-24 text-center">Weak Spot</th>
                          <th className="py-3 px-3 w-16 text-center">Notes</th>
                          <th className="py-3 px-5 w-20 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {topic.problems.map(problem => {
                          const hasNotes = !!problem.notes.trim();

                          return (
                            <tr
                              key={problem.id}
                              className={`text-xs hover:bg-white/[0.03] transition-colors cursor-default ${
                                problem.isCompleted ? "text-slate-400 bg-white/[0.005]" : "text-slate-200"
                              }`}
                            >
                              {/* Status Checkbox */}
                              <td className="py-3 px-5 text-center">
                                <button
                                  onClick={() => toggleDsaProblem(topic.id, problem.id)}
                                  className={`p-1 rounded transition-colors ${
                                    problem.isCompleted ? "text-violet-500" : "text-slate-600 hover:text-slate-400"
                                  }`}
                                >
                                  {problem.isCompleted ? (
                                    <CheckSquare className="w-4 h-4" />
                                  ) : (
                                    <div className="w-4 h-4 rounded border border-white/[0.1] hover:border-slate-500" />
                                  )}
                                </button>
                              </td>

                              {/* Problem Name & Code Link */}
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1.5">
                                  <span className={`font-medium ${problem.isCompleted ? "line-through opacity-70" : ""}`}>
                                    {problem.name}
                                  </span>
                                  <a
                                    href={problem.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-600 hover:text-accentPrimary transition-colors"
                                    title="Open problem link"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                                {(problem.timeComplexity || problem.spaceComplexity) && (
                                  <div className="flex gap-1.5 mt-0.5">
                                    {problem.timeComplexity && (
                                      <span className="text-[9px] font-mono bg-white/[0.02] border border-white/[0.04] text-slate-500 px-1 rounded">
                                        T: {problem.timeComplexity}
                                      </span>
                                    )}
                                    {problem.spaceComplexity && (
                                      <span className="text-[9px] font-mono bg-white/[0.02] border border-white/[0.04] text-slate-500 px-1 rounded">
                                        S: {problem.spaceComplexity}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </td>

                              {/* Difficulty */}
                              <td className="py-3 px-3">
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${
                                    problem.difficulty === "Easy"
                                      ? "bg-emerald-500/10 text-emerald-400"
                                      : problem.difficulty === "Medium"
                                      ? "bg-amber-500/10 text-amber-400"
                                      : "bg-rose-500/10 text-rose-400"
                                  }`}
                                >
                                  {problem.difficulty}
                                </span>
                              </td>

                              {/* Attempts Tracker */}
                              <td className="py-3 px-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <span className="text-xs font-mono font-bold text-slate-300">
                                    {(problem as any).submissions || 0}
                                  </span>
                                  <button
                                    onClick={() => incrementDsaSubmissions(topic.id, problem.id)}
                                    className="p-1 rounded bg-white/[0.02] border border-white/[0.04] text-slate-400 hover:bg-white/[0.06] hover:text-white transition-all cursor-pointer"
                                    title="Log another attempt/submission"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>

                              {/* Spaced repetition scheduler dropdown */}
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-slate-500" />
                                  <select
                                    disabled={!problem.isCompleted}
                                    value={problem.revisionInterval || 0}
                                    onChange={e =>
                                      scheduleRevision(
                                        topic.id,
                                        problem.id,
                                        parseInt(e.target.value)
                                      )
                                    }
                                    className="bg-transparent border border-white/[0.04] text-[10px] text-slate-400 outline-none rounded p-0.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                  >
                                    <option value={0} className="bg-darkBg">Not Queued</option>
                                    <option value={1} className="bg-darkBg">1 Day Interval</option>
                                    <option value={3} className="bg-darkBg">3 Days Interval</option>
                                    <option value={7} className="bg-darkBg">7 Days Interval</option>
                                    <option value={14} className="bg-darkBg">14 Days Interval</option>
                                    <option value={30} className="bg-darkBg">30 Days Interval</option>
                                  </select>
                                </div>
                              </td>

                              {/* IsWeak Bookmark toggle */}
                              <td className="py-3 px-3 text-center">
                                <button
                                  onClick={() => toggleDsaWeak(topic.id, problem.id)}
                                  className={`p-1 rounded transition-colors ${
                                    problem.isWeak ? "text-rose-500" : "text-slate-600 hover:text-slate-400"
                                  }`}
                                  title="Mark as weak problem"
                                >
                                  {problem.isWeak ? (
                                    <AlertTriangle className="w-4 h-4" />
                                  ) : (
                                    <Bookmark className="w-4 h-4" />
                                  )}
                                </button>
                              </td>

                              {/* Notes button */}
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
                                  className={`p-1 rounded transition-colors ${
                                    hasNotes ? "text-amber-500" : "text-slate-600 hover:text-slate-400"
                                  }`}
                                  title="Edit problem notes"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              </td>

                              {/* Quick solution checklist links */}
                              <td className="py-3 px-5 text-center">
                                <a
                                  href={`https://www.youtube.com/results?search_query=neetcode+${encodeURIComponent(
                                    problem.name
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-slate-500 hover:text-accentPrimary font-mono transition-colors"
                                >
                                  Neetcode Video
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
            </GlassCard>
          );
        })}
      </div>

      {/* Local Notes Editing Modal Overlay */}
      {activeEditProblem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <GlassCard className="w-full max-w-lg space-y-4 border border-white/[0.08] shadow-2xl bg-darkCard/95 p-6">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Problem Workspace Notes</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{activeEditProblem.problemName}</h3>
              </div>
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setActiveEditProblem(null);
                }}
                className="text-slate-500 hover:text-slate-300 text-xs font-mono border border-white/[0.06] px-2 py-0.5 rounded cursor-pointer"
              >
                ESC
              </button>
            </div>

            {/* Stopwatch Widget */}
            <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Practice Clock</span>
                <span className={`text-xl font-bold font-mono ${timerSeconds < 300 ? "text-rose-500 animate-pulse" : "text-white"}`}>
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
                  className="bg-white/[0.02] border border-white/[0.06] text-slate-400 rounded-lg px-2 py-1.5 text-xs cursor-pointer focus:outline-none focus:border-accentPrimary disabled:opacity-50 font-semibold h-[28px]"
                >
                  <option value={900} className="bg-darkBg">15 Min</option>
                  <option value={1800} className="bg-darkBg">30 Min</option>
                  <option value={2700} className="bg-darkBg">45 Min</option>
                  <option value={3600} className="bg-darkBg">60 Min</option>
                </select>
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    timerRunning 
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20" 
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                  }`}
                >
                  {timerRunning ? "Pause" : "Start"}
                </button>
                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerSeconds(timerDuration);
                  }}
                  className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] text-slate-400 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Big-O Complexity Input */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Time Complexity (e.g. O(N))</label>
                <input
                  type="text"
                  value={activeEditProblem.timeComplexity}
                  onChange={e =>
                    setActiveEditProblem(prev => (prev ? { ...prev, timeComplexity: e.target.value } : null))
                  }
                  placeholder="e.g. O(N log N)"
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-accentPrimary font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Space Complexity (e.g. O(1))</label>
                <input
                  type="text"
                  value={activeEditProblem.spaceComplexity}
                  onChange={e =>
                    setActiveEditProblem(prev => (prev ? { ...prev, spaceComplexity: e.target.value } : null))
                  }
                  placeholder="e.g. O(N)"
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-accentPrimary font-mono"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Notes & Concept Mapping</span>
              <button
                onClick={() => setPreviewNotes(!previewNotes)}
                className="text-[10px] font-mono bg-white/[0.04] border border-white/[0.08] text-slate-300 px-2 py-1 rounded cursor-pointer hover:bg-white/[0.1] transition-colors"
              >
                {previewNotes ? "Edit" : "Preview Markdown"}
              </button>
            </div>
            {previewNotes ? (
              <div className="w-full h-44 bg-white/[0.01] border border-white/[0.06] rounded-xl p-3 text-xs text-slate-200 overflow-y-auto font-sans leading-relaxed break-words">
                <MarkdownRenderer content={activeEditProblem.notes || "_No notes yet._"} />
              </div>
            ) : (
              <textarea
                value={activeEditProblem.notes}
                onChange={e =>
                  setActiveEditProblem(prev => (prev ? { ...prev, notes: e.target.value } : null))
                }
                placeholder="Write core insights, time complexity, corner test cases or recursive code steps..."
                className="w-full h-44 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 text-xs text-slate-300 font-mono placeholder-slate-700 focus:outline-none focus:border-accentPrimary resize-none"
              />
            )}

            <div className="flex justify-end gap-3 text-xs pt-2">
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setActiveEditProblem(null);
                }}
                className="bg-white/[0.02] border border-white/[0.04] px-4 py-2 rounded-lg text-slate-400 font-medium hover:bg-white/[0.04] transition-colors cursor-pointer"
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
                className="bg-accentPrimary hover:bg-accentPrimary/90 text-black px-4 py-2 rounded-xl font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(var(--color-accent-primary),0.3)] hover:scale-[1.02] active:scale-95"
              >
                Save Notes
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </motion.div>
  );
};
