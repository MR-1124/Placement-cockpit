import os

file_path = r"d:\Placement Roadmap\src\pages\ResumeGraderView.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Inputs
content = content.replace(
    'className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-lg py-2 px-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"',
    'className="w-full bg-black/60 shadow-inner border border-white/[0.08] focus:border-accentPrimary rounded-lg py-2 px-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"'
)
content = content.replace(
    'className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-lg py-2 px-3 text-sm text-white focus:outline-none transition-colors appearance-none"',
    'className="w-full bg-black/60 shadow-inner border border-white/[0.08] focus:border-accentPrimary rounded-lg py-2 px-3 text-sm text-white focus:outline-none transition-colors appearance-none"'
)

# 2. Main Scan Button
content = content.replace(
    'className="w-full px-6 py-4 bg-accentPrimary hover:bg-accentPrimary/90 text-white rounded-xl font-bold shadow-lg shadow-accentPrimary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"',
    'className="w-full px-6 py-4 bg-accentPrimary hover:bg-accentPrimary/90 text-black rounded-xl font-bold shadow-[0_0_20px_rgba(var(--color-accent-primary),0.4)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"'
)

# 3. Gauges Background
content = content.replace(
    'className="flex flex-col items-center bg-black/20 p-4 rounded-xl border border-white/5"',
    'className="flex flex-col items-center bg-black/40 shadow-inner p-4 rounded-xl border border-white/5"'
)

# 4. Impact Fixes Cards Background
content = content.replace(
    'className="bg-black/30 border border-white/10 rounded-xl overflow-hidden"',
    'className="bg-black/50 shadow-inner border border-white/10 rounded-xl overflow-hidden"'
)

# 5. History Modal Button
content = content.replace(
    'className="flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-white/10 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-white/[0.08]"',
    'className="flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-white/10 hover:shadow-lg text-slate-300 rounded-lg text-sm font-medium transition-all border border-white/[0.08] hover:scale-[1.02]"'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("ResumeGraderView.tsx patched successfully!")
