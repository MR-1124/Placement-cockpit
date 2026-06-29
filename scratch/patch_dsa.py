import os

file_path = r"d:\Placement Roadmap\src\pages\DsaView.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Random Problem Button
content = content.replace(
    'className="flex items-center gap-2 px-4 py-2 bg-accentPrimary/10 border border-accentPrimary/20 text-accentPrimary hover:bg-accentPrimary hover:text-white rounded-lg text-sm font-bold transition-all shrink-0"',
    'className="flex items-center gap-2 px-4 py-2 bg-accentPrimary/10 border border-accentPrimary/30 text-accentPrimary hover:bg-accentPrimary hover:text-black hover:shadow-[0_0_15px_rgba(var(--color-accent-primary),0.4)] rounded-xl text-sm font-bold transition-all shrink-0 active:scale-95 cursor-pointer"'
)

# 2. Recommended Problem Card
content = content.replace(
    'className="bg-gradient-to-r from-accentPrimary/10 to-transparent border border-accentPrimary/20 p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"',
    'className="bg-gradient-to-r from-accentPrimary/10 to-transparent border border-accentPrimary/30 shadow-[0_0_20px_rgba(var(--color-accent-primary),0.1)] p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden group"'
)

content = content.replace(
    'className="px-5 py-2.5 bg-accentPrimary hover:bg-accentPrimary/90 text-white rounded-lg text-xs font-bold transition-all shadow-[0_0_15px_rgba(var(--color-accentPrimary),0.4)] flex items-center gap-2 shrink-0 cursor-pointer w-full sm:w-auto justify-center"',
    'className="px-5 py-2.5 bg-accentPrimary hover:bg-accentPrimary/90 text-black rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(var(--color-accent-primary),0.4)] hover:scale-[1.02] active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer w-full sm:w-auto justify-center relative z-10"'
)

# 3. Search Input
content = content.replace(
    'className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentPrimary"',
    'className="w-full bg-black/60 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentPrimary transition-colors shadow-inner"'
)

# 4. Filter Buttons
content = content.replace(
    '                  ? "bg-white/[0.06] text-white"\n                  : "text-slate-500 hover:text-slate-300"',
    '                  ? "bg-white/[0.08] text-white shadow-sm border border-white/[0.04]"\n                  : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02] border border-transparent"'
)

# 5. Topic Card Header Hover & Background Icon
content = content.replace(
    '                className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer hover:bg-white/[0.01] transition-all select-none"',
    '                className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer hover:bg-white/[0.02] transition-all select-none relative group/header"'
)

content = content.replace(
    '<div className="space-y-1 flex-1">',
    '<div className="absolute top-0 right-0 p-4 opacity-5 group-hover/header:opacity-10 transition-opacity pointer-events-none">\n                  <BookOpen className="w-24 h-24 text-accentPrimary" />\n                </div>\n                <div className="space-y-1 flex-1 relative z-10">'
)

content = content.replace(
    '<div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">',
    '<div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end relative z-10">'
)

# 6. TR Row Hover
content = content.replace(
    'className={`text-xs hover:bg-white/[0.01] transition-colors ${',
    'className={`text-xs hover:bg-white/[0.03] transition-colors cursor-default ${'
)

# 7. Notes Modal Background
content = content.replace(
    'className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"',
    'className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"'
)

# 8. Save Notes Button
content = content.replace(
    'className="bg-accentPrimary hover:bg-accentPrimary/90 text-white px-4 py-2 rounded-lg font-bold transition-all cursor-pointer"',
    'className="bg-accentPrimary hover:bg-accentPrimary/90 text-black px-4 py-2 rounded-xl font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(var(--color-accent-primary),0.3)] hover:scale-[1.02] active:scale-95"'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("DsaView.tsx patched successfully!")
