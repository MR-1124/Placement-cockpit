import os

file_path = r"src/App.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target = """        {/* Sidebar Footer Metrics card */}
        <div className="p-4 border-t border-white/[0.06] bg-white/[0.002] space-y-4">
          {/* Level Progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-accentPrimary font-bold uppercase tracking-wider">Lvl {level}: {levelTitle}</span>
              <span className="text-slate-500">{state.xp} XP</span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.02]">
              <div
                className="h-full bg-accentPrimary rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span>Streak: <span className="text-amber-500 font-bold">🔥 {state.streak}d</span></span>
              <span>Readiness: <span className="text-white font-bold">{readinessScore}%</span></span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.02]">
              <div
                className="h-full bg-accentPrimary rounded-full transition-all duration-500"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
          </div>
        </div>"""

replacement = """        {/* Sidebar Footer Metrics card */}
        <div className={`border-t border-white/[0.06] bg-white/[0.002] flex flex-col items-center justify-center transition-all ${collapsed ? "p-3 py-5 space-y-4" : "p-4 space-y-4"}`}>
          {collapsed ? (
            <>
              {/* Collapsed Level */}
              <div className="group relative">
                <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/[0.06] shadow-inner flex flex-col items-center justify-center cursor-help hover:border-accentPrimary/50 transition-colors">
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none mb-0.5">Lvl</span>
                  <span className="text-xs font-bold text-accentPrimary leading-none">{level}</span>
                </div>
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-darkCard border border-white/10 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 shadow-xl transition-all translate-x-2 group-hover:translate-x-0 flex flex-col gap-1">
                  <span className="text-accentPrimary font-bold">Lvl {level}: {levelTitle}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{state.xp} XP / {level * 1000} XP</span>
                  <div className="h-1 w-full bg-white/[0.04] rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-accentPrimary" style={{ width: `${xpProgress}%` }} />
                  </div>
                </div>
              </div>
              
              {/* Collapsed Streak */}
              <div className="group relative">
                <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/[0.06] shadow-inner flex flex-col items-center justify-center cursor-help hover:border-amber-500/50 transition-colors">
                  <span className="text-xs mb-0.5">🔥</span>
                  <span className="text-[10px] font-bold text-amber-500 leading-none">{state.streak}</span>
                </div>
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-darkCard border border-white/10 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 shadow-xl transition-all translate-x-2 group-hover:translate-x-0 flex flex-col gap-1">
                  <span className="text-amber-500 font-bold">Streak: {state.streak} Days</span>
                  <span className="text-white font-mono text-[10px]">Readiness: {readinessScore}%</span>
                  <div className="h-1 w-full bg-white/[0.04] rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-accentPrimary" style={{ width: `${readinessScore}%` }} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full space-y-4">
              {/* Level Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-accentPrimary font-bold uppercase tracking-wider truncate mr-2">Lvl {level}: {levelTitle}</span>
                  <span className="text-slate-500 shrink-0">{state.xp} XP</span>
                </div>
                <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.02] shadow-inner">
                  <div
                    className="h-full bg-accentPrimary rounded-full transition-all duration-500 shadow-[0_0_10px_var(--accent-color)]"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>

              {/* Streak & Readiness */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span className="truncate">Streak: <span className="text-amber-500 font-bold">🔥 {state.streak}d</span></span>
                  <span className="shrink-0 ml-2">Readiness: <span className="text-white font-bold">{readinessScore}%</span></span>
                </div>
                <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.02] shadow-inner">
                  <div
                    className="h-full bg-accentPrimary rounded-full transition-all duration-500 shadow-[0_0_10px_var(--accent-color)]"
                    style={{ width: `${readinessScore}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>"""

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully patched sidebar metrics.")
else:
    print("Target not found. Check exact spacing.")
