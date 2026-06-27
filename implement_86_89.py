import re

with open('src/pages/InterviewSimulatorView.tsx', 'rb') as f:
    raw = f.read()
src = raw.decode('utf-8')

def r(old, new, desc):
    global src
    if old in src:
        src = src.replace(old, new, 1)
        print(f"Replaced {desc}")
    else:
        print(f"MISSING {desc}:", old[:50].replace("\r", "\\r").replace("\n", "\\n"))

# 1. State for showPreBrief
old_state = '  const [activeMobileTab, setActiveMobileTab] = useState<"chat" | "editor">("chat");'
new_state = '  const [activeMobileTab, setActiveMobileTab] = useState<"chat" | "editor">("chat");\r\n  const [showPreBrief, setShowPreBrief] = useState(false);\r\n\r\n  useEffect(() => {\r\n    if (activeSession && activeSession.timeLeft === 2700 && activeSession.chatHistory.length === 0) {\r\n      setShowPreBrief(true);\r\n    }\r\n  }, [activeSession?.id]);'
if old_state not in src:
    old_state = old_state.replace('\r\n', '\n')
    new_state = new_state.replace('\r\n', '\n')
r(old_state, new_state, "showPreBrief state")

# 2. Pause ref update
old_pause = '  useEffect(() => {\r\n    isPausedRef.current = isSessionPaused;\r\n  }, [isSessionPaused]);'
new_pause = '  useEffect(() => {\r\n    isPausedRef.current = isSessionPaused || showPreBrief;\r\n  }, [isSessionPaused, showPreBrief]);'
if old_pause not in src:
    old_pause = old_pause.replace('\r\n', '\n')
    new_pause = new_pause.replace('\r\n', '\n')
r(old_pause, new_pause, "pause ref update")

# 3. PreBrief Render
old_render = '  if (activeSession) {\r\n    // Phase 2: SPLIT SCREEN WORKSPACE\r\n    return (\r\n      <div className="space-y-6">'
new_render = '''  if (activeSession) {
    if (showPreBrief) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[600px] p-6 animate-fade-in">
          <div className="w-full max-w-2xl bg-darkCard border border-white/[0.08] p-8 rounded-2xl shadow-2xl glass-panel relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accentPrimary/50 via-purple-500/50 to-accentPrimary/50"></div>
            
            <div className="text-center space-y-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-accentPrimary/10 border border-accentPrimary/30 flex items-center justify-center mx-auto shadow-lg shadow-accentPrimary/5 mb-6">
                <Speech className="w-8 h-8 text-accentPrimary animate-pulse" />
              </div>
              <h1 className="text-3xl font-bold font-mono text-white tracking-tight">Interview Pre-Brief</h1>
              <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                Review your focus areas and target role before stepping into the simulator.
              </p>
            </div>

            <div className="space-y-6 bg-black/20 p-6 rounded-xl border border-white/[0.04]">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Topic Focus</span>
                  <div className="text-sm font-semibold text-white">{activeSession.topic}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Target Difficulty</span>
                  <div className="text-sm font-semibold text-accentPrimary">{activeSession.difficulty}</div>
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Interviewer Persona</span>
                  <div className="text-sm font-semibold text-white">{activeSession.interviewerPersonality}</div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/[0.04]">
                <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Interview Structure</span>
                <ul className="text-xs text-slate-300 space-y-2 font-mono">
                  <li className="flex gap-2 items-start"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"/> <span><strong>Phase 1:</strong> Introduction & Resume Review</span></li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"/> <span><strong>Phase 2:</strong> Data Structures & Algorithms Coding Challenge</span></li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"/> <span><strong>Phase 3:</strong> Core CS Theory & Architecture</span></li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"/> <span><strong>Phase 4:</strong> Logic Puzzles & System Verification</span></li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"/> <span><strong>Phase 5:</strong> Behavioral & HR Questions</span></li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.04] flex justify-end gap-4">
              <button
                onClick={handleExitInterview}
                className="px-6 py-2.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.04] text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPreBrief(false)}
                className="px-6 py-2.5 rounded-xl bg-accentPrimary hover:bg-accentPrimary/90 text-white text-xs font-bold font-mono transition-all shadow-lg shadow-accentPrimary/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Enter Simulator</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Phase 2: SPLIT SCREEN WORKSPACE
    return (
      <div className="space-y-6">'''
if old_render not in src:
    old_render = old_render.replace('\r\n', '\n')
    new_render = new_render.replace('\r\n', '\n')
r(old_render, new_render, "pre-brief render")

# 4. Trend Chart Component and rendering
old_hist = '        {/* History Scorecards (Right side, 1 Col) */}\r\n        <div className="space-y-6">\r\n          <InterviewHistoryPanel onViewReport={setEvaluationReport} />\r\n        </div>'
new_hist = '''        {/* History Scorecards (Right side, 1 Col) */}
        <div className="space-y-6">
          {state.mockInterviews && state.mockInterviews.length >= 2 && (
            <div className="bg-darkCard border border-white/[0.04] p-5 rounded-xl shadow-lg relative overflow-hidden glass-panel">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Performance Trend</h3>
              </div>
              <div className="flex items-end gap-2 h-32 pt-6">
                {[...state.mockInterviews].reverse().slice(-10).map((report, idx) => {
                  const score = report.scorecard.overallScore;
                  const height = `${Math.max(10, score * 10)}%`;
                  const colorClass = score >= 8 ? 'bg-emerald-500' : score >= 5 ? 'bg-amber-500' : 'bg-rose-500';
                  return (
                    <div key={report.id} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                      <div className="w-full flex justify-center h-full items-end">
                        <div 
                          className={`w-full max-w-[24px] rounded-t-sm opacity-60 group-hover:opacity-100 transition-all ${colorClass}`}
                          style={{ height }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 group-hover:text-white transition-colors">{score}</span>
                      <div className="absolute -top-10 bg-darkCard border border-white/[0.1] shadow-2xl p-2 rounded-lg text-[10px] text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 transition-opacity flex flex-col gap-1">
                        <span className="font-bold">{report.topic}</span>
                        <span className="text-slate-400 font-mono">{report.difficulty}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <InterviewHistoryPanel onViewReport={setEvaluationReport} />
        </div>'''
if old_hist not in src:
    old_hist = old_hist.replace('\r\n', '\n')
    new_hist = new_hist.replace('\r\n', '\n')
r(old_hist, new_hist, "trend chart rendering")

with open('src/pages/InterviewSimulatorView.tsx', 'w', encoding='utf-8', newline='') as f:
    f.write(src)
