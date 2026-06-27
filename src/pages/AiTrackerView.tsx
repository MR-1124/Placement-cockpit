import { motion } from "framer-motion";
import React, { useState } from "react";
import { useAppState } from "../context/AppStateContext";
import { GlassCard } from "../components/Common";
import {
  ShieldAlert,
  Terminal,
  Check
} from "lucide-react";

export const AiTrackerView: React.FC = () => {
  const state = useAppState(s => s.state);
const aiDependencyScore = useAppState(s => s.aiDependencyScore);
const addAiLog = useAppState(s => s.addAiLog);


  // Local form state
  const [aiPercentage, setAiPercentage] = useState(30);
  const [selfSolvedTime, setSelfSolvedTime] = useState(30);
  const [aiAssistedTime, setAiAssistedTime] = useState(20);
  const [triedFirst, setTriedFirst] = useState(true);
  const [firstDraftSelf, setFirstDraftSelf] = useState(true);
  const [understoodCode, setUnderstoodCode] = useState(true);
  const [copiedDirectly, setCopiedDirectly] = useState(false);
  const [canRebuild, setCanRebuild] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    addAiLog({
      aiPercentage,
      selfSolvedTime,
      aiAssistedTime,
      triedFirst,
      firstDraftSelf,
      understoodCode,
      copiedDirectly,
      canRebuild
    });
    
    // Trigger toast notification
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const getZoneText = (score: number) => {
    if (score < 25) return { name: "Independent (Green Zone)", desc: "Maintain code autonomy. High readiness relevance.", color: "text-emerald-400 border-emerald-500/10 bg-emerald-500/5" };
    if (score < 50) return { name: "Caution (Amber Zone)", desc: "AI is writing boilerplate. Try building smaller parts.", color: "text-amber-400 border-amber-500/10 bg-amber-500/5" };
    return { name: "Vibe-Coding (Red Zone)", desc: "High vulnerability to interview failures. Redo weak files.", color: "text-rose-400 border-rose-500/10 bg-rose-500/5" };
  };

  const zone = getZoneText(aiDependencyScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-500">Anti-Vibe-Coding</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">AI Dependency Tracker</h1>
          <p className="text-sm text-slate-400 mt-1">
            Build true code ownership. Log daily AI usage, copy ratios, and self-compilation targets.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Inputs & Logs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Daily AI Usage Log Form */}
          <GlassCard className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-400" /> Log Today's Coding Session
            </h3>

            <form onSubmit={handleSaveLog} className="space-y-5 text-xs text-slate-300">
              
              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* AI Dependency % */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono">
                    <span>AI Contribution</span>
                    <span className="font-bold text-white">{aiPercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={aiPercentage}
                    onChange={e => setAiPercentage(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/[0.04] rounded-lg appearance-none cursor-pointer accent-accentPrimary"
                  />
                  <span className="text-[10px] text-slate-500 font-mono block">Estimated share of code AI generated.</span>
                </div>

                {/* Self Solved Minutes */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono">
                    <span>Self Coding Time</span>
                    <span className="font-bold text-white">{selfSolvedTime}m</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={selfSolvedTime}
                    onChange={e => setSelfSolvedTime(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/[0.04] rounded-lg appearance-none cursor-pointer accent-accentPrimary"
                  />
                  <span className="text-[10px] text-slate-500 font-mono block">Minutes spent typing without helper tools.</span>
                </div>

                {/* AI Assisted Minutes */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono">
                    <span>AI Query Time</span>
                    <span className="font-bold text-white">{aiAssistedTime}m</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={aiAssistedTime}
                    onChange={e => setAiAssistedTime(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/[0.04] rounded-lg appearance-none cursor-pointer accent-accentPrimary"
                  />
                  <span className="text-[10px] text-slate-500 font-mono block">Minutes spent reading prompts/explanations.</span>
                </div>
              </div>

              {/* Checkbox assertions */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Reflective Checklist
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  <div
                    onClick={() => setTriedFirst(!triedFirst)}
                    className={`flex items-start gap-2.5 p-2 rounded-lg border transition-all cursor-pointer ${
                      triedFirst ? "bg-white/[0.02] border-white/[0.06]" : "border-white/[0.02] opacity-50"
                    }`}
                  >
                    <input type="checkbox" checked={triedFirst} onChange={() => {}} className="mt-0.5 accent-accentPrimary" />
                    <div>
                      <div className="font-semibold text-slate-200">20-Min Self Attempt First</div>
                      <p className="text-[9px] text-slate-500 leading-normal mt-0.5">Attempted solving before querying chatbot.</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setFirstDraftSelf(!firstDraftSelf)}
                    className={`flex items-start gap-2.5 p-2 rounded-lg border transition-all cursor-pointer ${
                      firstDraftSelf ? "bg-white/[0.02] border-white/[0.06]" : "border-white/[0.02] opacity-50"
                    }`}
                  >
                    <input type="checkbox" checked={firstDraftSelf} onChange={() => {}} className="mt-0.5 accent-accentPrimary" />
                    <div>
                      <div className="font-semibold text-slate-200">Self-Written First Draft</div>
                      <p className="text-[9px] text-slate-500 leading-normal mt-0.5">First code draft was fully written manually.</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setUnderstoodCode(!understoodCode)}
                    className={`flex items-start gap-2.5 p-2 rounded-lg border transition-all cursor-pointer ${
                      understoodCode ? "bg-white/[0.02] border-white/[0.06]" : "border-white/[0.02] opacity-50"
                    }`}
                  >
                    <input type="checkbox" checked={understoodCode} onChange={() => {}} className="mt-0.5 accent-accentPrimary" />
                    <div>
                      <div className="font-semibold text-slate-200">I Understand Every Line</div>
                      <p className="text-[9px] text-slate-500 leading-normal mt-0.5">Able to walk through time and space complexities.</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setCanRebuild(!canRebuild)}
                    className={`flex items-start gap-2.5 p-2 rounded-lg border transition-all cursor-pointer ${
                      canRebuild ? "bg-white/[0.02] border-white/[0.06]" : "border-white/[0.02] opacity-50"
                    }`}
                  >
                    <input type="checkbox" checked={canRebuild} onChange={() => {}} className="mt-0.5 accent-accentPrimary" />
                    <div>
                      <div className="font-semibold text-slate-200">Can Rebuild From Scratch</div>
                      <p className="text-[9px] text-slate-500 leading-normal mt-0.5">Confidence to rewrite without browser helpers.</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setCopiedDirectly(!copiedDirectly)}
                    className={`flex items-start gap-2.5 p-2 rounded-lg border transition-all cursor-pointer sm:col-span-2 ${
                      copiedDirectly ? "bg-rose-500/5 border-rose-500/10 text-rose-300" : "border-white/[0.02] text-slate-500"
                    }`}
                  >
                    <input type="checkbox" checked={copiedDirectly} onChange={() => {}} className="mt-0.5 accent-rose-500" />
                    <div>
                      <div className={`font-semibold ${copiedDirectly ? "text-rose-400" : "text-slate-400"}`}>
                        Copied Code Directly (Copy-Paste)
                      </div>
                      <p className="text-[9px] text-slate-500 leading-normal mt-0.5">Directly copied and ran chatbot generated chunks without typing.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit panel */}
              <div className="flex justify-between items-center pt-3 border-t border-white/[0.04]">
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                  {showSuccessToast && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Log updated successfully
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-accentPrimary text-white font-bold px-4 py-2 rounded-lg hover:bg-accentPrimary/90 transition-all shadow-md"
                >
                  Save Log Entry
                </button>
              </div>

            </form>
          </GlassCard>

          {/* AI Logs History Table */}
          <GlassCard className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3">
              Session History
            </h3>
            
            <div className="overflow-x-auto">
              {state.aiLogs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-600 font-mono italic">
                  No logs compiled yet. Add today's log above.
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5 text-center">AI %</th>
                      <th className="py-2.5 text-center">Self Time</th>
                      <th className="py-2.5 text-center">AI Time</th>
                      <th className="py-2.5 text-center">Understand</th>
                      <th className="py-2.5 text-center">Rebuild</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-xs font-mono">
                    {[...state.aiLogs].reverse().map(log => (
                      <tr key={log.id} className="text-slate-300">
                        <td className="py-3 text-slate-400">{log.date}</td>
                        <td className="py-3 text-center">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              log.aiPercentage > 50
                                ? "bg-rose-500/10 text-rose-400"
                                : log.aiPercentage > 25
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-emerald-500/10 text-emerald-400"
                            }`}
                          >
                            {log.aiPercentage}%
                          </span>
                        </td>
                        <td className="py-3 text-center text-slate-400">{log.selfSolvedTime} min</td>
                        <td className="py-3 text-center text-slate-400">{log.aiAssistedTime} min</td>
                        <td className="py-3 text-center">
                          {log.understoodCode ? (
                            <span className="text-emerald-400 text-xs">✓</span>
                          ) : (
                            <span className="text-rose-500 text-xs">✗</span>
                          )}
                        </td>
                        <td className="py-3 text-center">
                          {log.canRebuild ? (
                            <span className="text-emerald-400 text-xs">✓</span>
                          ) : (
                            <span className="text-rose-500 text-xs">✗</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Gauges & Reminders */}
        <div className="space-y-6">
          {/* AI Dependency Gauge */}
          <GlassCard className="flex flex-col items-center justify-center py-6 border-l-4 border-l-rose-500 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">
              Autonomy Ratio
            </span>
            <span className="text-4xl font-extrabold text-white font-mono mt-1">
              {aiDependencyScore}%
            </span>
            <div className={`mt-3 text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${zone.color}`}>
              {zone.name}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-[200px] mt-3">
              {zone.desc}
            </p>
          </GlassCard>

          {/* Spaced reminders / Anti-vibe rules */}
          <GlassCard className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" /> Cockpit Commandments
            </h3>

            <div className="space-y-3.5">
              {[
                { title: "The 20-Minute Directive", desc: "Try to trace, conceptualize, and outline logic manually for 20 minutes before accessing chatbot tools." },
                { title: "No Blind Copy-Paste", desc: "Write out generated fixes line-by-line. Tapping CMD+C bypasses motor memory, resulting in interviews failure." },
                { title: "Code Rebuild Audit", desc: "If you copy an algorithmic segment or API hook, delete it and attempt to write it from memory. If you cannot rebuild it, you do not own it yet." },
                { title: "Line-by-Line Explanation", desc: "Explain the stack, loop constraints, and lookup space out loud before completing a problem." }
              ].map((cmd, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center font-mono font-semibold text-slate-500 text-[10px]">
                    {i + 1}
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <span className="font-semibold text-slate-300 block">{cmd.title}</span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{cmd.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
};
