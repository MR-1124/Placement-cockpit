import os

file_path = r"d:\Placement Roadmap\src\pages\InterviewSimulatorView.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Action Buttons in Editor Header
content = content.replace(
    'className="px-3.5 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.12] text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"',
    'className="px-3.5 py-1.5 rounded-lg bg-black/40 shadow-inner hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.12] hover:scale-[1.02] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"'
)

content = content.replace(
    'className="px-2.5 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.12] text-slate-300 text-xs transition-all flex items-center gap-1.5 cursor-pointer"',
    'className="px-2.5 py-1.5 rounded-lg bg-black/40 shadow-inner hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.12] hover:scale-[1.02] text-white text-xs transition-all flex items-center gap-1.5 cursor-pointer"'
)

content = content.replace(
    'className="px-2.5 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.12] text-slate-300 hover:text-rose-400 text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"',
    'className="px-2.5 py-1.5 rounded-lg bg-black/40 shadow-inner hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.12] hover:scale-[1.02] text-slate-300 hover:text-rose-400 text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"'
)

# 2. End Interview Early
content = content.replace(
    'className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"',
    'className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:scale-[1.02] active:scale-95"'
)

# 3. Submit Code Button
content = content.replace(
    'className="px-4 py-1.5 rounded-lg bg-accentPrimary hover:bg-accentPrimary/90 border border-accentPrimary/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-accentPrimary/20 disabled:opacity-40 disabled:cursor-not-allowed"',
    'className="px-4 py-1.5 rounded-xl bg-accentPrimary hover:bg-accentPrimary/90 border border-accentPrimary/20 text-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(var(--color-accent-primary),0.4)] hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"'
)

# 4. Phase 5 Submit Button
content = content.replace(
    'className="px-6 py-2 rounded-xl bg-accentPrimary hover:bg-accentPrimary/90 border border-accentPrimary/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-accentPrimary/20"',
    'className="px-6 py-2 rounded-xl bg-accentPrimary hover:bg-accentPrimary/90 border border-accentPrimary/20 text-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(var(--color-accent-primary),0.4)] hover:scale-[1.02] active:scale-95"'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("InterviewSimulatorView.tsx patched successfully!")
