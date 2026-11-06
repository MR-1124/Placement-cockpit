import React, { useState } from "react";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { useAppState } from "../context/AppStateContext";
import { SpotlightCard } from "../components/Common";
import { motion } from "framer-motion";
import {
  CalendarClock,
  AlertTriangle,
  History,
  ArrowRight,
  ExternalLink,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Check
} from "lucide-react";
import type { DsaProblem, DsaTopic } from "../data/curriculum";

export const RevisionView: React.FC = () => {
  const state = useAppState(s => s.state);
  const scheduleRevision = useAppState(s => s.scheduleRevision);
  const toggleDsaWeak = useAppState(s => s.toggleDsaWeak);

  const now = new Date();
  const todayStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];

  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [approachRevealed, setApproachRevealed] = useState(false);

  const dueToday: { problem: DsaProblem; topic: DsaTopic }[] = [];
  const upcoming: { problem: DsaProblem; topic: DsaTopic }[] = [];
  const weakSpots: { problem: DsaProblem; topic: DsaTopic }[] = [];

  state.dsaTopics.forEach(topic => {
    topic.problems.forEach(problem => {
      if (problem.isWeak) {
        weakSpots.push({ problem, topic });
      }

      if (problem.isCompleted && problem.revisionInterval && problem.revisionInterval > 0 && problem.nextRevisionDate) {
        if (problem.nextRevisionDate <= todayStr) {
          dueToday.push({ problem, topic });
        } else {
          upcoming.push({ problem, topic });
        }
      }
    });
  });

  const handleMarkRevised = (topicId: string, problemId: string, currentInterval: number) => {
    let nextInterval = 3;
    if (currentInterval === 1) nextInterval = 3;
    else if (currentInterval === 3) nextInterval = 7;
    else if (currentInterval === 7) nextInterval = 14;
    else if (currentInterval === 14) nextInterval = 30;
    else if (currentInterval === 30) nextInterval = 30;

    scheduleRevision(topicId, problemId, nextInterval);
  };

  const handleResetInterval = (topicId: string, problemId: string) => {
    scheduleRevision(topicId, problemId, 3);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <SpotlightCard className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accentPrimary font-bold bg-accentPrimary/10 border border-accentPrimary/25 px-2.5 py-0.5 rounded-md">
                Spaced Repetition Protocol
              </span>
              <span className="text-[10px] font-mono text-slate-500">• Ebbinghaus Retention Model</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Algorithm Revision Deck</h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Defeat the forgetting curve through active spaced repetition. Review due problems, track error logs, and cement long-term muscle memory.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 font-mono text-xs font-bold">
              <CalendarClock className="w-4 h-4" />
              <span>{dueToday.length} Due Today</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 font-mono text-xs font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>{weakSpots.length} Flagged</span>
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* Active Recall Study Deck */}
      {dueToday.length > 0 && dueToday[activeCardIndex >= dueToday.length ? 0 : activeCardIndex] && (() => {
        const currentCardIndex = activeCardIndex >= dueToday.length ? 0 : activeCardIndex;
        const currentCard = dueToday[currentCardIndex];
        return (
          <SpotlightCard className="p-6 space-y-4 border-accentPrimary/30 bg-gradient-to-r from-accentPrimary/[0.04] to-transparent">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <div>
                <span className="text-[10px] font-mono text-accentPrimary uppercase font-bold tracking-wider">
                  Active Spaced Review Simulator
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">Problem {currentCardIndex + 1} of {dueToday.length}</h3>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={dueToday.length <= 1}
                  onClick={() => {
                    setApproachRevealed(false);
                    setActiveCardIndex(prev => (prev + 1) % dueToday.length);
                  }}
                  className="text-slate-400 hover:text-white text-xs font-mono border border-white/[0.08] hover:border-accentPrimary/40 px-3 py-1 rounded-xl cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Skip Card &rarr;
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">Topic Category</span>
                  <span className="text-xs font-bold text-slate-200">{currentCard.topic.name}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">Difficulty</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-md font-mono font-bold uppercase tracking-wider border ${
                    currentCard.problem.difficulty === "Easy"
                      ? "neon-pill-emerald"
                      : currentCard.problem.difficulty === "Medium"
                      ? "neon-pill-amber"
                      : "neon-pill-rose"
                  }`}>
                    {currentCard.problem.difficulty}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">Target Complexity</span>
                  <div className="flex gap-1.5 mt-0.5 text-[9px] font-mono">
                    {currentCard.problem.timeComplexity ? (
                      <span className="bg-white/[0.03] border border-white/[0.06] text-slate-300 px-2 py-0.5 rounded-md">
                        Time: {currentCard.problem.timeComplexity}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">No time complexity logged</span>
                    )}
                  </div>
                </div>
              </div>

              {!approachRevealed ? (
                <div className="bg-white/[0.015] border border-white/[0.05] rounded-2xl p-8 text-center space-y-4">
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Recall the optimal algorithmic pattern, corner cases, and time/space constraints for this problem in your mind first.
                  </p>
                  <button
                    onClick={() => setApproachRevealed(true)}
                    className="bg-accentPrimary text-slate-950 text-xs font-mono font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] hover:scale-105 active:scale-95"
                  >
                    Reveal Solution Notes & Approach
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.015] border border-white/[0.08] rounded-2xl p-5 space-y-4"
                >
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">Problem Title</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-base font-bold text-white">{currentCard.problem.name}</span>
                      <a
                        href={currentCard.problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-accentPrimary transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {currentCard.problem.notes.trim() ? (
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1 font-semibold">Your Concept Notes</span>
                      <div className="text-xs text-slate-300 bg-black/40 border border-white/[0.06] p-3.5 rounded-xl leading-relaxed max-h-[160px] overflow-y-auto custom-scrollbar">
                        <MarkdownRenderer content={currentCard.problem.notes} />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 font-mono italic">No notes logged for this problem yet.</p>
                  )}

                  <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
                    <button
                      onClick={() => {
                        handleResetInterval(currentCard.topic.id, currentCard.problem.id);
                        setApproachRevealed(false);
                      }}
                      className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 text-xs px-4 py-2 rounded-xl transition-all font-mono font-bold cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Reset (Forgot)
                    </button>
                    <button
                      onClick={() => {
                        handleMarkRevised(currentCard.topic.id, currentCard.problem.id, currentCard.problem.revisionInterval || 0);
                        setApproachRevealed(false);
                      }}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold px-5 py-2 rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5 inline mr-1" /> Revised (Graduated)
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </SpotlightCard>
        );
      })()}

      {/* Grid structure: Due Today vs Upcoming Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns: Due Today & Weak Spots */}
        <div className="lg:col-span-2 space-y-6 flex-1">
          {/* Due Today Card */}
          <SpotlightCard className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-amber-400" /> Active Reviews Due
              </h3>
              <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2.5 py-0.5 rounded-md font-bold">
                {dueToday.length} Problems
              </span>
            </div>

            <div className="space-y-3">
              {dueToday.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/25">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h4 className="text-white font-bold text-xs">All Caught Up!</h4>
                  <p className="text-xs text-slate-400 font-mono">No problems due for spaced repetition today.</p>
                </div>
              ) : (
                dueToday.map(({ problem, topic }) => (
                  <div
                    key={problem.id}
                    className="p-3.5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">{topic.name}</span>
                        <a
                          href={problem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <span className="text-xs font-semibold text-white">{problem.name}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        <span>Interval: {problem.revisionInterval}d</span>
                        <span>•</span>
                        <span>Due: {problem.nextRevisionDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleResetInterval(topic.id, problem.id)}
                        className="bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-rose-400 border border-white/[0.06] text-[10px] px-2.5 py-1.5 rounded-lg transition-all font-mono cursor-pointer"
                        title="Fail review, reset interval"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => handleMarkRevised(topic.id, problem.id, problem.revisionInterval || 0)}
                        className="bg-accentPrimary/15 hover:bg-accentPrimary/25 text-accentPrimary border border-accentPrimary/30 text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                      >
                        Pass <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SpotlightCard>

          {/* Flagged Mistakes (Weak Spots) */}
          <SpotlightCard className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Error Notebook & Flagged Items
              </h3>
              <span className="text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/25 px-2.5 py-0.5 rounded-md font-bold">
                {weakSpots.length} Flagged
              </span>
            </div>

            <div className="space-y-3">
              {weakSpots.length === 0 ? (
                <div className="py-10 text-center flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.02] flex items-center justify-center border border-white/[0.05]">
                    <CheckCircle2 className="w-5 h-5 text-slate-500" />
                  </div>
                  <p className="text-xs text-slate-400 font-mono">No bookmarked weak spots. Flag difficult questions in DSA Tracker.</p>
                </div>
              ) : (
                weakSpots.map(({ problem, topic }) => (
                  <div
                    key={problem.id}
                    className="p-3.5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 transition-all"
                  >
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase block font-bold">{topic.name}</span>
                      <span className="text-xs font-semibold text-white">{problem.name}</span>
                      {problem.notes.trim() && (
                        <p className="text-[10px] text-amber-400/90 font-mono mt-1 border-l-2 border-amber-500/30 pl-2 leading-relaxed italic">
                          "{problem.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-mono transition-all flex items-center gap-1"
                      >
                        Solve <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => toggleDsaWeak(topic.id, problem.id)}
                        className="bg-white/[0.02] border border-white/[0.06] hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 px-3 py-1.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer"
                      >
                        Unflag
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SpotlightCard>
        </div>

        {/* Right Column: Upcoming Queue & Blueprint */}
        <div className="space-y-6">
          <SpotlightCard className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-accentPrimary" /> Upcoming Retention Queue
            </h3>

            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
              {upcoming.length === 0 ? (
                <div className="py-10 text-center flex flex-col items-center justify-center space-y-1">
                  <p className="text-xs text-slate-500 font-mono italic">No upcoming items scheduled in queue.</p>
                </div>
              ) : (
                upcoming.map(({ problem, topic }) => (
                  <div
                    key={problem.id}
                    className="p-2.5 bg-white/[0.015] border border-white/[0.04] rounded-xl flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 block leading-none mb-0.5">{topic.name}</span>
                      <span className="font-semibold text-slate-200">{problem.name}</span>
                    </div>
                    <div className="text-right text-[10px] font-mono text-slate-400">
                      <div>in {Math.max(1, Math.round((new Date(problem.nextRevisionDate!).getTime() - new Date(todayStr).getTime()) / (24 * 60 * 60 * 1000)))}d</div>
                      <div className="text-[9px] text-slate-500">Interval: {problem.revisionInterval}d</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SpotlightCard>

          <SpotlightCard className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-accentPrimary" /> Retention Blueprint
            </h3>

            <div className="space-y-3 text-xs text-slate-400 font-mono">
              <div className="space-y-2 border-l border-white/[0.08] pl-3 py-1 text-[10px]">
                <div className="flex justify-between">
                  <span>Level 1: Solve</span>
                  <span className="text-white font-bold">3 Days wait</span>
                </div>
                <div className="flex justify-between">
                  <span>Level 2: Revise ✓</span>
                  <span className="text-white font-bold">7 Days wait</span>
                </div>
                <div className="flex justify-between">
                  <span>Level 3: Revise ✓</span>
                  <span className="text-white font-bold">14 Days wait</span>
                </div>
                <div className="flex justify-between">
                  <span>Level 4: Revise ✓</span>
                  <span className="text-white font-bold">30 Days wait</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Level 5: Mastered</span>
                  <span>Long-Term Memory</span>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
};
