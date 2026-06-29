import os

file_path = r"d:\Placement Roadmap\src\pages\RoadmapView.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Search Input
content = content.replace(
    'className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentPrimary"',
    'className="w-full bg-black/60 shadow-inner border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accentPrimary transition-colors"'
)

# 2. Phase Filters
content = content.replace(
    '                  ? "bg-white/[0.06] text-white"\n                  : "text-slate-500 hover:text-slate-300"',
    '                  ? "bg-white/[0.08] text-white shadow-sm border border-white/[0.04]"\n                  : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02] border border-transparent"'
)

# 3. Mark Week Completed Button
content = content.replace(
    '                            : "bg-accentPrimary text-white border-accentPrimary hover:bg-accentPrimary/90"',
    '                            : "bg-accentPrimary text-black font-bold shadow-[0_0_15px_rgba(var(--color-accent-primary),0.4)] hover:scale-[1.02] active:scale-95 border-transparent"'
)

content = content.replace(
    'className={`flex justify-between items-center p-2.5 rounded-lg border transition-all cursor-pointer select-none ${',
    'className={`flex justify-between items-center p-2.5 rounded-lg border transition-all cursor-pointer hover:scale-[1.01] select-none ${'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("RoadmapView.tsx patched successfully!")
