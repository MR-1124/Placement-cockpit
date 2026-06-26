import React, { useState } from "react";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { useAppState } from "../context/AppStateContext";
import { GlassCard } from "../components/Common";
import {
  CalendarClock,
  AlertTriangle,
  History,
  ArrowRight,
  ExternalLink,
  Sparkles,
  } from "lucide-react";
import type { DsaProblem, DsaTopic } from "../data/curriculum";

export const RevisionView: React.FC = () => {
  const { state, scheduleRevision, toggleDsaWeak } = useAppState();

  const now = new Date();
  const todayStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];

  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [approachRevealed, setApproachRevealed] = useState(false);

  // Structure lists
  const dueToday: { problem: DsaProblem; topic: DsaTopic }[] = [];
  const upcoming: { problem: DsaProblem; topic: DsaTopic }[] = [];
  const weakSpots: { problem: DsaProblem; topic: DsaTopic }[] = [];

  state.dsaTopics.forEach(topic => {
    topic.problems.forEach(problem => {
      // Weak spot classification (any problem marked as weak)
      if (problem.isWeak) {
        weakSpots.push({ problem, topic });
      }

      // Check revision schedule (must be completed and has interval)
      if (problem.isCompleted && problem.revisionInterval && problem.revisionInterval > 0 && problem.nextRevisionDate) {
        if (problem.nextRevisionDate <= todayStr) {
          dueToday.push({ problem, topic });
        } else {
          upcoming.push({ problem, topic });
        }
      }
    });
  });

  // Handle Leitner system progression: 1 -> 3 -> 7 -> 14 -> 30
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
    scheduleRevision(topicId, problemId, 3); // reset back to Level 1 (3 days)
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-500">Spaced Repetition</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">Revision Planner</h1>
          <p className="text-sm text-slate-400 mt-1">
            Combat the forgetting curve. Solve items due today, manage flagged mistake logs, and graduate topics to long-term memory.
          </p>
        </div>
      </div>

      {/* Active Recall Study Deck */}
      {dueToday.length > 0 && dueToday[activeCardIndex >= dueToday.length ? 0 : activeCardIndex] && (() => {
        const currentCardIndex = activeCardIndex >= dueToday.length ? 0 : activeCardIndex;
        const currentCard = dueToday[currentCardIndex];
        return (
          <GlassCard className="border-l-4 border-l-accentPrimary bg-accentPrimary/[0.005] p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <div>
                <span className="text-[10px] font-mono text-accentPrimary uppercase font-bold tracking-wider">Active Recall Deck</span>
                <h3 className="text-sm font-bold text-white mt-0.5">Flashcard Simulator ({currentCardIndex + 1} of {dueToday.length})</h3>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={dueToday.length <= 1}
                  onClick={() => {
                    setApproachRevealed(false);
                    setActiveCardIndex(prev => (prev + 1) % dueToday.length);
                  }}
                  className="text-slate-500 hover:text-slate-300 text-xs font-mono border border-white/[0.06] px-2 py-0.5 rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Skip Card →
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Topic Category</span>
                  <span className="text-xs font-semibold text-slate-200">{currentCard.topic.name}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Target Constraints</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${
                    currentCard.problem.difficulty === "Easy"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : currentCard.problem.difficulty === "Medium"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-rose-500/10 text-rose-400"
                  }`}>
                    {currentCard.problem.difficulty}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Optimal Complexities</span>
                  <div className="flex gap-1.5 mt-0.5 text-[9px] font-mono">
                    {currentCard.problem.timeComplexity ? (
                      <span className="bg-white/[0.02] border border-white/[0.04] text-slate-400 px-1.5 py-0.5 rounded">
                        Time: {currentCard.problem.timeComplexity}
                      </span>
                    ) : (
                      <span className="text-slate-600 italic">No time complexity logged</span>
                    )}
                    {currentCard.problem.spaceComplexity ? (
                      <span className="bg-white/[0.02] border border-white/[0.04] text-slate-400 px-1.5 py-0.5 rounded">
                        Space: {currentCard.problem.spaceComplexity}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              {!approachRevealed ? (
                <div className="bg-white/[0.01] border border-white/[0.04] rounded-lg p-6 text-center space-y-3">
                  <p className="text-xs text-slate-400">
                    Recall the optimal code approach, data structures, and corner cases for this problem context.
                  </p>
                  <button
                    onClick={() => setApproachRevealed(true)}
                    className="bg-accentPrimary hover:bg-accentPrimary/90 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer shadow-md"
                  >
                    Reveal Problem & Approach
                  </button>
                </div>
              ) : (
                <div
                    className="animate-slide-up bg-white/[0.01] border border-white/[0.06] rounded-lg p-5 space-y-4"
                  >
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Problem Solution</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-white">{currentCard.problem.name}</span>
                      <a
                        href={currentCard.problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {currentCard.problem.notes.trim() ? (
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Your Key Insights</span>
                      <div className="text-xs text-slate-300 bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg leading-relaxed max-h-[150px] overflow-y-auto">
                        <MarkdownRenderer content={currentCard.problem.notes} />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No notes logged for this problem yet. Open the DSA Board to save notes.</p>
                  )}

                  <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.04]">
                    <button
                      onClick={() => {
                        handleResetInterval(currentCard.topic.id, currentCard.problem.id);
                        setApproachRevealed(false);
                      }}
                      className="bg-white/[0.01] hover:bg-white/[0.04] text-rose-400 border border-white/[0.04] text-xs px-3.5 py-2 rounded-lg transition-all font-mono cursor-pointer"
                    >
                      Reset (Fail)
                    </button>
                    <button
                      onClick={() => {
                        handleMarkRevised(currentCard.topic.id, currentCard.problem.id, currentCard.problem.revisionInterval || 0);
                        setApproachRevealed(false);
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer shadow"
                    >
                      Revised (Pass)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        );
      })()}

      {/* Grid structure: Due Today vs Upcoming Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Due Today & Weak Spots */}
        <div className="lg:col-span-2 space-y-6 flex-1">
          
          {/* Due Today Card */}
          <GlassCard className="space-y-4 border-l-4 border-l-amber-500">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-amber-500" /> Active Reviews Due
              </h3>
              <span className="text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
                {dueToday.length} Problems
              </span>
            </div>

            <div className="space-y-3">
              {dueToday.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3 border border-emerald-500/20">
                    <CalendarClock className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-slate-300 font-bold mb-1">All Caught Up!</h3>
                  <p className="text-xs text-slate-500 italic">Revision inbox clean. All schedules up to date.</p>
                </div>
              ) : (
                dueToday.map(({ problem, topic }) => (
                  <div
                    key={problem.id}
                    className="p-3 bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.04] rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">{topic.name}</span>
                        <a
                          href={problem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <span className="text-xs font-semibold text-slate-200">{problem.name}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                        <span>Interval: {problem.revisionInterval} days</span>
                        <span>•</span>
                        <span>Due: {problem.nextRevisionDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleResetInterval(topic.id, problem.id)}
                        className="bg-white/[0.01] hover:bg-white/[0.04] text-slate-400 hover:text-rose-400 border border-white/[0.04] text-[10px] px-2.5 py-1.5 rounded transition-all font-mono"
                        title="Fail review, reset to 3-day interval"
                      >
                        Reset Interval
                      </button>
                      <button
                        onClick={() =>
                          handleMarkRevised(
                            topic.id,
                            problem.id,
                            problem.revisionInterval || 0
                          )
                        }
                        className="bg-accentPrimary hover:bg-accentPrimary/90 text-white text-[10px] font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow transition-all"
                      >
                        Mark Revised <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>

          {/* Flagged Mistakes (Weak Spots) */}
          <GlassCard className="space-y-4 border-l-4 border-l-rose-500">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" /> Flags / Error Notebook
              </h3>
              <span className="text-xs font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded">
                {weakSpots.length} Flagged
              </span>
            </div>

            <div className="space-y-3">
              {weakSpots.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
                    <AlertTriangle className="w-6 h-6 text-slate-500" />
                  </div>
                  <h3 className="text-slate-300 font-bold mb-1">No Flagged Mistakes</h3>
                  <p className="text-xs text-slate-500 italic max-w-xs">Tweak Leetcode checkboxes to bookmark items here for extra review.</p>
                </div>
              ) : (
                weakSpots.map(({ problem, topic }) => (
                  <div
                    key={problem.id}
                    className="p-3 bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.04] rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3 transition-all"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">{topic.name}</span>
                      <span className="text-xs font-semibold text-slate-200">{problem.name}</span>
                      {problem.notes.trim() && (
                        <p className="text-[10px] text-amber-500/80 font-mono mt-1 border-l border-amber-500/20 pl-2 leading-relaxed italic">
                          "{problem.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.04] text-slate-400 hover:text-white px-2.5 py-1.5 rounded text-[10px] font-mono transition-all flex items-center gap-1"
                      >
                        Solve <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => toggleDsaWeak(topic.id, problem.id)}
                        className="bg-white/[0.01] border border-white/[0.04] hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 px-2.5 py-1.5 rounded text-[10px] transition-all"
                      >
                        Unflag
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Upcoming Queue & Leitner info */}
        <div className="space-y-6">
          {/* Upcoming Schedule Queue */}
          <GlassCard className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" /> Upcoming Review Queue
            </h3>

            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {upcoming.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-3 border border-white/[0.04]">
                    <History className="w-6 h-6 text-slate-500" />
                  </div>
                  <h3 className="text-slate-300 font-bold mb-1">Queue Empty</h3>
                  <p className="text-xs text-slate-500 italic max-w-xs">No upcoming items scheduled in queue.</p>
                </div>
              ) : (
                upcoming.map(({ problem, topic }) => (
                  <div
                    key={problem.id}
                    className="p-2.5 bg-white/[0.005] border border-white/[0.02] rounded-lg flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 block leading-none mb-0.5">{topic.name}</span>
                      <span className="font-semibold text-slate-300">{problem.name}</span>
                    </div>
                    <div className="text-right text-[10px] font-mono text-slate-500">
                      <div>in {Math.max(1, Math.round((new Date(problem.nextRevisionDate!).getTime() - new Date(todayStr).getTime()) / (24 * 60 * 60 * 1000)))} days</div>
                      <div className="text-[9px] text-slate-600">Interval: {problem.revisionInterval}d</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>

          {/* Leitner Spaced Repetition guidelines */}
          <GlassCard className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-accentPrimary" /> Spaced Repetition Blueprint
            </h3>

            <div className="space-y-3 text-xs text-slate-400">
              <p className="leading-relaxed">
                When you solve a DSA problem, it automatically schedules a review in **3 days**.
              </p>
              <div className="space-y-2 border-l border-white/[0.06] pl-3 py-1 font-mono text-[10px]">
                <div className="flex justify-between">
                  <span>Level 1: Solve</span>
                  <span className="text-white">3 Days wait</span>
                </div>
                <div className="flex justify-between">
                  <span>Level 2: Revise ✓</span>
                  <span className="text-white">7 Days wait</span>
                </div>
                <div className="flex justify-between">
                  <span>Level 3: Revise ✓</span>
                  <span className="text-white">14 Days wait</span>
                </div>
                <div className="flex justify-between">
                  <span>Level 4: Revise ✓</span>
                  <span className="text-white">30 Days wait</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Level 5: Graduate</span>
                  <span>Mastered</span>
                </div>
              </div>
              <p className="leading-relaxed text-[11px] text-slate-500">
                If you fail a review (cannot explain or implement), click **Reset Interval** to bring it back to Level 1.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};


