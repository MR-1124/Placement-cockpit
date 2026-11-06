import React, { useState } from "react";
import { useAppState } from "../context/AppStateContext";
import { SpotlightCard } from "../components/Common";
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
    
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const getZoneText = (score: number) => {
    if (score < 25) return { name: "Autonomous (Green Zone)", desc: "Exceptional code autonomy. High readiness relevance.", color: "neon-pill-emerald" };
    if (score < 50) return { name: "Caution (Amber Zone)", desc: "AI is writing boilerplate. Try building smaller parts manually.", color: "neon-pill-amber" };
    return { name: "Vibe-Coding (Red Zone)", desc: "High vulnerability to interview failures. Redo weak files independently.", color: "neon-pill-rose" };
  };

  const zone = getZoneText(aiDependencyScore);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <SpotlightCard className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accentPrimary font-bold bg-accentPrimary/10 border border-accentPrimary/25 px-2.5 py-0.5 rounded-md">
                Anti-Vibe-Coding Telemetry
              </span>
              <span className="text-[10px] font-mono text-slate-500">• Cognitive Muscle Tracker</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">AI Autonomy Monitor</h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Track daily AI usage, prevent mindless copy-pasting, and retain authentic problem-solving capability under interview pressure.
            </p>
          </div>
        </div>
      </SpotlightCard>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Inputs & Logs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Daily AI Usage Log Form */}
          <SpotlightCard className="space-y-4 p-6">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-accentPrimary" /> Log Coding Session Autonomy
            </h3>

            <form onSubmit={handleSaveLog} className="space-y-5 text-xs text-slate-300">
              
              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* AI Dependency % */}
                <div className="space-y-2 bg-white/[0.015] border border-white/[0.04] p-3.5 rounded-xl">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-slate-400">AI Share</span>
                    <span className="font-bold text-white">{aiPercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={aiPercentage}
                    onChange={e => setAiPercentage(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/[0.06] rounded-lg appearance-none cursor-pointer accent-accentPrimary"
                  />
                  <span className="text-[9px] text-slate-500 font-mono block">Estimated share of AI output</span>
                </div>

                {/* Self Solved Minutes */}
                <div className="space-y-2 bg-white/[0.015] border border-white/[0.04] p-3.5 rounded-xl">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-slate-400">Pure Typing</span>
                    <span className="font-bold text-white">{selfSolvedTime}m</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={selfSolvedTime}
                    onChange={e => setSelfSolvedTime(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/[0.06] rounded-lg appearance-none cursor-pointer accent-accentPrimary"
                  />
                  <span className="text-[9px] text-slate-500 font-mono block">Minutes solving without AI tools</span>
                </div>

                {/* AI Assisted Minutes */}
                <div className="space-y-2 bg-white/[0.015] border border-white/[0.04] p-3.5 rounded-xl">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-slate-400">AI Prompt Time</span>
                    <span className="font-bold text-white">{aiAssistedTime}m</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={aiAssistedTime}
                    onChange={e => setAiAssistedTime(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/[0.06] rounded-lg appearance-none cursor-pointer accent-accentPrimary"
                  />
                  <span className="text-[9px] text-slate-500 font-mono block">Minutes reading prompts/docs</span>
                </div>
              </div>

              {/* Checkbox assertions */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Code Ownership Assertions
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                      triedFirst ? "bg-white/[0.03] border-accentPrimary/30" : "border-white/[0.04] opacity-50"
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={triedFirst} 
                      onChange={e => setTriedFirst(e.target.checked)} 
                      className="mt-0.5 accent-accentPrimary cursor-pointer" 
                    />
                    <div>
                      <div className="font-bold text-white text-xs">20-Min Self Attempt First</div>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Attempted solving alone before querying.</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                      firstDraftSelf ? "bg-white/[0.03] border-accentPrimary/30" : "border-white/[0.04] opacity-50"
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={firstDraftSelf} 
                      onChange={e => setFirstDraftSelf(e.target.checked)} 
                      className="mt-0.5 accent-accentPrimary cursor-pointer" 
                    />
                    <div>
                      <div className="font-bold text-white text-xs">Self-Written First Draft</div>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Initial draft was manually coded.</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                      understoodCode ? "bg-white/[0.03] border-accentPrimary/30" : "border-white/[0.04] opacity-50"
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={understoodCode} 
                      onChange={e => setUnderstoodCode(e.target.checked)} 
                      className="mt-0.5 accent-accentPrimary cursor-pointer" 
                    />
                    <div>
                      <div className="font-bold text-white text-xs">Understand Every Line</div>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Able to defend time and space limits.</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                      canRebuild ? "bg-white/[0.03] border-accentPrimary/30" : "border-white/[0.04] opacity-50"
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={canRebuild} 
                      onChange={e => setCanRebuild(e.target.checked)} 
                      className="mt-0.5 accent-accentPrimary cursor-pointer" 
                    />
                    <div>
                      <div className="font-bold text-white text-xs">Can Rebuild From Memory</div>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Confidence to rewrite without aids.</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer sm:col-span-2 ${
                      copiedDirectly ? "bg-rose-500/10 border-rose-500/30 text-rose-300" : "border-white/[0.04] text-slate-500"
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={copiedDirectly} 
                      onChange={e => setCopiedDirectly(e.target.checked)} 
                      className="mt-0.5 accent-rose-500 cursor-pointer" 
                    />
                    <div>
                      <div className={`font-bold text-xs ${copiedDirectly ? "text-rose-400" : "text-slate-400"}`}>
                        Direct Copy-Paste Detected
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Pasted AI chunks directly without typing or manual review.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit panel */}
              <div className="flex justify-between items-center pt-3 border-t border-white/[0.06]">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                  {showSuccessToast && (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <Check className="w-3.5 h-3.5" /> Log updated successfully
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-accentPrimary text-slate-950 font-bold font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-accentPrimary/90 transition-all shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)] hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Save Daily Log
                </button>
              </div>

            </form>
          </SpotlightCard>

          {/* AI Logs History Table */}
          <SpotlightCard className="space-y-4 p-6">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3">
              Telemetry Log History
            </h3>
            
            <div className="overflow-x-auto custom-scrollbar">
              {state.aiLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 font-mono italic">
                  No logs compiled yet. Add today's log above.
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5 text-center">AI %</th>
                      <th className="py-2.5 text-center">Self Typing</th>
                      <th className="py-2.5 text-center">AI Reading</th>
                      <th className="py-2.5 text-center">Understood</th>
                      <th className="py-2.5 text-center">Rebuildable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-xs font-mono">
                    {[...state.aiLogs].reverse().map(log => (
                      <tr key={log.id} className="text-slate-300 hover:bg-white/[0.01]">
                        <td className="py-3 text-slate-400">{log.date}</td>
                        <td className="py-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              log.aiPercentage > 50
                                ? "bg-rose-500/15 text-rose-400 border border-rose-500/25"
                                : log.aiPercentage > 25
                                ? "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                                : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                            }`}
                          >
                            {log.aiPercentage}%
                          </span>
                        </td>
                        <td className="py-3 text-center text-slate-300">{log.selfSolvedTime}m</td>
                        <td className="py-3 text-center text-slate-300">{log.aiAssistedTime}m</td>
                        <td className="py-3 text-center">
                          {log.understoodCode ? (
                            <span className="text-emerald-400 font-bold">✓</span>
                          ) : (
                            <span className="text-rose-400 font-bold">✗</span>
                          )}
                        </td>
                        <td className="py-3 text-center">
                          {log.canRebuild ? (
                            <span className="text-emerald-400 font-bold">✓</span>
                          ) : (
                            <span className="text-rose-400 font-bold">✗</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </SpotlightCard>
        </div>

        {/* Right Column: Gauges & Reminders */}
        <div className="space-y-6">
          {/* AI Dependency Gauge */}
          <SpotlightCard className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider font-semibold">
              Vibe-Coding Risk Gauge
            </span>
            <span className="text-4xl font-extrabold text-white font-mono">
              {aiDependencyScore}%
            </span>
            <div className={`text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-lg border ${zone.color}`}>
              {zone.name}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[220px]">
              {zone.desc}
            </p>
          </SpotlightCard>

          {/* Cockpit Commandments */}
          <SpotlightCard className="space-y-4 p-6">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> Cockpit Commandments
            </h3>

            <div className="space-y-4">
              {[
                { title: "The 20-Minute Rule", desc: "Always draft pseudo-code and trace constraints for 20 minutes before looking up suggestions." },
                { title: "No Blind Copy-Paste", desc: "Type out every solution line-by-line. Blind copying bypasses neural retention and ruins live coding rounds." },
                { title: "Rebuild From Scratch", desc: "If you read an external answer, close it and rewrite the logic from pure memory before checking." },
                { title: "Verbal Defense", desc: "Explain time and space complexity aloud as if an interviewer were listening." }
              ].map((cmd, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <div className="w-5 h-5 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center font-mono font-bold text-accentPrimary text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <span className="font-bold text-slate-200 block">{cmd.title}</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{cmd.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
};
