import re

with open('src/pages/InterviewSimulatorView.tsx', 'rb') as f:
    raw = f.read()
src = raw.decode('utf-8')

old_code = '                <div className="flex gap-2 items-end">\r\n                  <textarea'
new_code = '''                {/* Prompt Suggestions (Fix 87) */}
                {activeSession.currentPhase !== "evaluating" && !isAiResponding && !isSessionPaused && (
                  <div className="flex flex-wrap gap-2 pb-2">
                    {activeSession.currentPhase === "intro" && [
                      "Here is my quick introduction...",
                      "Can you review my resume highlights?"
                    ].map(s => (
                      <button key={s} onClick={() => setChatInput(s)} className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-white/[0.02] hover:bg-accentPrimary/10 border border-white/[0.08] hover:border-accentPrimary/30 text-slate-400 hover:text-accentPrimary transition-all cursor-pointer shadow-sm">
                        {s}
                      </button>
                    ))}
                    {activeSession.currentPhase === "dsa" && [
                      "Can I have a hint?", 
                      "Is my time complexity optimal?",
                      "Should I write the code now?"
                    ].map(s => (
                      <button key={s} onClick={() => setChatInput(s)} className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-white/[0.02] hover:bg-accentPrimary/10 border border-white/[0.08] hover:border-accentPrimary/30 text-slate-400 hover:text-accentPrimary transition-all cursor-pointer shadow-sm">
                        {s}
                      </button>
                    ))}
                    {activeSession.currentPhase === "core" && [
                      "Can you clarify the question?", 
                      "I'm not exactly sure, but I think..."
                    ].map(s => (
                      <button key={s} onClick={() => setChatInput(s)} className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-white/[0.02] hover:bg-accentPrimary/10 border border-white/[0.08] hover:border-accentPrimary/30 text-slate-400 hover:text-accentPrimary transition-all cursor-pointer shadow-sm">
                        {s}
                      </button>
                    ))}
                    {activeSession.currentPhase === "puzzles" && [
                      "Wait, let me think step-by-step.", 
                      "Does the edge case matter here?"
                    ].map(s => (
                      <button key={s} onClick={() => setChatInput(s)} className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-white/[0.02] hover:bg-accentPrimary/10 border border-white/[0.08] hover:border-accentPrimary/30 text-slate-400 hover:text-accentPrimary transition-all cursor-pointer shadow-sm">
                        {s}
                      </button>
                    ))}
                    {activeSession.currentPhase === "hr" && [
                      "Can I take a moment to format my STAR response?", 
                      "I have faced this before, specifically when..."
                    ].map(s => (
                      <button key={s} onClick={() => setChatInput(s)} className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-white/[0.02] hover:bg-accentPrimary/10 border border-white/[0.08] hover:border-accentPrimary/30 text-slate-400 hover:text-accentPrimary transition-all cursor-pointer shadow-sm">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 items-end">
                  <textarea'''

if old_code not in src:
    old_code = old_code.replace('\r\n', '\n')
    new_code = new_code.replace('\r\n', '\n')

src = src.replace(old_code, new_code, 1)

with open('src/pages/InterviewSimulatorView.tsx', 'w', encoding='utf-8', newline='') as f:
    f.write(src)
