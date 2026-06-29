import os

file_path = r"d:\Placement Roadmap\src\pages\PlansView.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Search Input
content = content.replace(
    'className="w-full bg-slate-900/50 border border-white/[0.08] focus:border-accentPrimary rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"',
    'className="w-full bg-black/60 shadow-inner border border-white/[0.08] focus:border-accentPrimary rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"'
)

# 2. Select dropdowns
content = content.replace(
    'className="w-full bg-slate-900/50 border border-white/[0.08] focus:border-accentPrimary rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none transition-all"',
    'className="w-full bg-black/60 shadow-inner border border-white/[0.08] focus:border-accentPrimary rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none transition-all cursor-pointer"'
)
content = content.replace(
    'className="w-full bg-slate-900/50 border border-white/[0.08] focus:border-accentPrimary rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-300 outline-none transition-all"',
    'className="w-full bg-black/60 shadow-inner border border-white/[0.08] focus:border-accentPrimary rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-300 outline-none transition-all cursor-pointer"'
)

# 3. Action Buttons
content = content.replace(
    'className="w-full py-2 bg-accentPrimary hover:bg-accentPrimary/90 active:scale-[0.98] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-accentPrimary/20 cursor-pointer"',
    'className="w-full py-2 bg-accentPrimary hover:bg-accentPrimary/90 active:scale-[0.98] hover:scale-[1.02] text-black font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(var(--color-accent-primary),0.4)] cursor-pointer"'
)
content = content.replace(
    '<Star className="w-3.5 h-3.5 fill-white" />',
    '<Star className="w-3.5 h-3.5 fill-black" />'
)

content = content.replace(
    'className="w-full py-2 bg-slate-900 border border-white/[0.08] hover:bg-slate-800 active:scale-[0.98] text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"',
    'className="w-full py-2 bg-slate-900 border border-white/[0.08] hover:bg-slate-800 active:scale-[0.98] hover:scale-[1.02] text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("PlansView.tsx patched successfully!")
