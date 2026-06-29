import os

file_path = r"d:\Placement Roadmap\src\pages\LoginView.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Update Google Button
content = content.replace(
    'className="w-full h-11 bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 font-bold rounded-xl flex items-center justify-center gap-3 active:scale-98 transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden text-xs"',
    'className="w-full h-11 bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 font-bold rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden text-xs"'
)

# Update Guest Button
content = content.replace(
    'className="w-full h-11 bg-white/[0.02] hover:bg-white/[0.04] text-slate-300 hover:text-white border border-white/[0.06] font-semibold rounded-xl flex items-center justify-center gap-2.5 active:scale-98 transition-all cursor-pointer text-xs disabled:opacity-50"',
    'className="w-full h-11 bg-white/[0.02] hover:bg-white/[0.04] text-slate-300 hover:text-white border border-white/[0.06] font-semibold rounded-xl flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-inner text-xs disabled:opacity-50"'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("LoginView.tsx patched successfully!")
