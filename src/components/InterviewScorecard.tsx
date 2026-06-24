/**
 * Arch Debt #12 fix: Extracted from InterviewSimulatorView.tsx (was ~530 lines inline).
 *
 * Pure presentational component — receives the completed report and a callback
 * to dismiss it. No API calls, no context reads, no side effects.
 */
import React, { useState, useEffect, useRef } from "react";
import { GlassCard } from "../components/Common";
import {
  Award,
  CheckCircle,
  XCircle,
  CornerDownRight,
  ClipboardList,
  Code2,
  Speech,
  Sparkles,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ArrowRight,
  ArrowLeft,
  Printer
} from "lucide-react";
import type { MockInterviewReport } from "../types/AppTypes";

// ─── Helper functions (moved here from ISV) ──────────────────────────────────

export function getScoreColor(score: number): string {
  if (score >= 8) return "text-emerald-400";
  if (score >= 6) return "text-amber-400";
  return "text-rose-400";
}

export function getRecBadge(rec: string): string {
  switch (rec) {
    case "Strong Hire":   return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    case "Hire":          return "bg-blue-500/10 border-blue-500/30 text-blue-400";
    case "Leaning Hire":  return "bg-amber-500/10 border-amber-500/30 text-amber-400";
    default:              return "bg-rose-500/10 border-rose-500/30 text-rose-400";
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

interface InterviewScorecardProps {
  report: MockInterviewReport;
  onDismiss: () => void;
}

export const InterviewScorecard: React.FC<InterviewScorecardProps> = ({ report, onDismiss }) => {
  const [replayMode, setReplayMode] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const replayContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && replayMode) {
      interval = setInterval(() => {
        setReplayIndex(prev => {
          if (prev >= report.chatHistory.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500); // Wait 1.5 seconds per message
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, replayMode, report.chatHistory.length]);

  useEffect(() => {
    if (replayMode && replayContainerRef.current) {
      replayContainerRef.current.scrollTop = replayContainerRef.current.scrollHeight;
    }
  }, [replayIndex, replayMode]);

  return (
    <div className="print-area max-w-3xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="bg-darkCard/50 border border-white/[0.04] p-4 rounded-xl backdrop-blur-md flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Interview Evaluation Scorecard</h2>
            <p className="text-[10px] text-slate-500 font-mono">Completed: {report.date}</p>
          </div>
        </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-bold text-yellow-400 font-mono">+300 XP</span>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-accentPrimary/10 border border-accentPrimary/20 text-accentPrimary hover:bg-accentPrimary hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={onDismiss}
              className="px-4 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              Start New Round
            </button>
          </div>
      </div>

      {/* Scorecard box */}
      <GlassCard className="p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accentPrimary/10 rounded-full blur-2xl pointer-events-none" />

        {/* Recommendation + overall score */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.06]">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Overall Evaluation</span>
            <span className={`inline-block px-3 py-1 mt-1 text-sm font-bold rounded-lg border font-mono uppercase ${getRecBadge(report.scorecard.recommendation)}`}>
              {report.scorecard.recommendation}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Average Score</span>
            <span className={`text-4xl font-extrabold font-mono ${getScoreColor(report.scorecard.overallScore)}`}>
              {report.scorecard.overallScore}/10
            </span>
          </div>
        </div>

        {/* Sub-criteria */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          {[
            { label: "Problem Solving", value: report.scorecard.problemSolving, desc: "Edge cases logic correctness" },
            { label: "Code Quality", value: report.scorecard.codeQuality, desc: "Naming, structure & optimization" },
            { label: "Communication", value: report.scorecard.communication, desc: "Explanation of approach & complexities" }
          ].map(({ label, value, desc }) => (
            <div key={label} className="space-y-1.5 p-3 rounded-lg bg-white/[0.01] border border-white/[0.04]">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">{label}</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-extrabold font-mono ${getScoreColor(value)}`}>{value}</span>
                <span className="text-xs text-slate-600">/ 10</span>
              </div>
              <p className="text-[10px] text-slate-500">{desc}</p>
            </div>
          ))}
        </div>

        {/* Phase Scores */}
        {report.scorecard.phaseScores && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pb-4">
            {[
              { label: "Intro", value: report.scorecard.phaseScores.intro },
              { label: "DSA", value: report.scorecard.phaseScores.dsa },
              { label: "Core CS", value: report.scorecard.phaseScores.core },
              { label: "Puzzles", value: report.scorecard.phaseScores.puzzles },
              { label: "HR", value: report.scorecard.phaseScores.hr }
            ].filter(p => p.value !== undefined).map(({ label, value }) => (
              <div key={label} className="p-2 rounded bg-white/[0.01] border border-white/[0.04] text-center">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-1">{label}</span>
                <span className={`text-lg font-bold font-mono ${getScoreColor(value as number)}`}>{value}/10</span>
              </div>
            ))}
          </div>
        )}

        {/* Feedback section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">AI Recruiter Feedback</h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl">
            {report.scorecard.feedback}
          </p>

          {/* Strengths & weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>Key Strengths</span>
              </h4>
              <ul className="space-y-1.5">
                {report.scorecard.strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                    <CornerDownRight className="w-3.5 h-3.5 text-emerald-500/60 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold text-rose-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                <span>Areas of Improvement</span>
              </h4>
              <ul className="space-y-1.5">
                {report.scorecard.weaknesses.map((weak, idx) => (
                  <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                    <CornerDownRight className="w-3.5 h-3.5 text-rose-500/60 shrink-0 mt-0.5" />
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Question-by-question breakdown */}
          {report.scorecard.questionsFeedback && report.scorecard.questionsFeedback.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-white/[0.06]">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-accentPrimary" />
                <span>Detailed Response Feedback</span>
              </h3>
              <div className="space-y-3">
                {report.scorecard.questionsFeedback.map((qf, index) => {
                  const badgeColor =
                    qf.rating >= 8 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : qf.rating >= 5 ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20";

                  return (
                    <div key={index} className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] space-y-2.5">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[11px] font-bold text-slate-350 font-mono">Q{index + 1}: {qf.question}</span>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
                          Score: {qf.rating}/10
                        </span>
                      </div>
                      {qf.response && (
                        <p className="text-[10px] text-slate-500 bg-black/20 p-2 rounded-lg font-mono whitespace-pre-wrap leading-normal">
                          Candidate Response: {qf.response}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                        <span className="font-bold text-accentPrimary font-mono">AI Critique: </span>
                        {qf.feedback}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Accordion — code + transcript */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
            <details className="group bg-white/[0.01] border border-white/[0.04] rounded-xl overflow-hidden cursor-pointer select-none">
              <summary className="px-4 py-3 flex justify-between items-center text-xs font-bold text-slate-300 font-mono hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-accentPrimary" />
                  <span>Submitted Code Solution ({report.language})</span>
                </div>
                <span className="text-[10px] text-slate-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-4 bg-black/40 border-t border-white/[0.04] font-mono text-[10px] text-slate-200 overflow-x-auto select-text cursor-text">
                <pre className="whitespace-pre-wrap">{report.codeSolution || "// No code was submitted"}</pre>
              </div>
            </details>

            <details className="group bg-white/[0.01] border border-white/[0.04] rounded-xl overflow-hidden cursor-pointer select-none" onToggle={(e) => {
              if (!(e.target as HTMLDetailsElement).open) {
                setReplayMode(false);
                setIsPlaying(false);
              }
            }}>
              <summary className="px-4 py-3 flex justify-between items-center text-xs font-bold text-slate-300 font-mono hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-2">
                  <Speech className="w-4 h-4 text-accentPrimary" />
                  <span>Interview Chat Transcript</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (!replayMode) {
                        setReplayMode(true);
                        setReplayIndex(0);
                      } else {
                        setReplayMode(false);
                        setIsPlaying(false);
                      }
                    }}
                    className={`px-2 py-1 rounded text-[9px] font-bold border transition-colors ${replayMode ? 'bg-accentPrimary/20 text-accentPrimary border-accentPrimary/40' : 'bg-white/[0.05] text-slate-400 border-white/[0.1] hover:text-white'}`}
                  >
                    {replayMode ? "Exit Replay" : "Replay Mode"}
                  </button>
                  <span className="text-[10px] text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                </div>
              </summary>
              
              {replayMode && (
                <div className="px-4 py-2 border-t border-white/[0.04] bg-black/60 flex items-center justify-between cursor-default">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { setIsPlaying(false); setReplayIndex(0); }}
                      disabled={replayIndex === 0}
                      className="p-1 rounded hover:bg-white/[0.1] disabled:opacity-30"
                    >
                      <SkipBack className="w-3.5 h-3.5 text-slate-300" />
                    </button>
                    <button 
                      onClick={() => { setIsPlaying(false); setReplayIndex(Math.max(0, replayIndex - 1)); }}
                      disabled={replayIndex === 0}
                      className="p-1 rounded hover:bg-white/[0.1] disabled:opacity-30"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-slate-300" />
                    </button>
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 rounded bg-accentPrimary/20 hover:bg-accentPrimary/30 text-accentPrimary"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => { setIsPlaying(false); setReplayIndex(Math.min(report.chatHistory.length - 1, replayIndex + 1)); }}
                      disabled={replayIndex >= report.chatHistory.length - 1}
                      className="p-1 rounded hover:bg-white/[0.1] disabled:opacity-30"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                    </button>
                    <button 
                      onClick={() => { setIsPlaying(false); setReplayIndex(report.chatHistory.length - 1); }}
                      disabled={replayIndex >= report.chatHistory.length - 1}
                      className="p-1 rounded hover:bg-white/[0.1] disabled:opacity-30"
                    >
                      <SkipForward className="w-3.5 h-3.5 text-slate-300" />
                    </button>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Msg {replayIndex + 1} of {report.chatHistory.length}
                  </div>
                </div>
              )}

              <div ref={replayContainerRef} className="p-4 bg-black/40 border-t border-white/[0.04] max-h-60 overflow-y-auto space-y-3 cursor-text select-text scroll-smooth">
                {report.chatHistory.map((msg, index) => {
                  if (replayMode && index > replayIndex) return null;
                  
                  const isUser = msg.role === "user";
                  return (
                    <div key={msg.id || index} className={`text-[10px] leading-relaxed transition-all duration-300 ${replayMode && index === replayIndex ? "opacity-100 scale-100" : "opacity-75"}`}>
                      <span className={`font-bold font-mono ${isUser ? "text-accentPrimary" : "text-slate-400"}`}>
                        {isUser ? "Candidate" : "Interviewer"}:
                      </span>
                      <p className="text-slate-300 ml-2 whitespace-pre-wrap leading-normal">{msg.content}</p>
                    </div>
                  );
                })}
              </div>
            </details>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
