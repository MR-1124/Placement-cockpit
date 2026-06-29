import os

file_path = r"d:\Placement Roadmap\src\pages\ProjectsView.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Project Button
content = content.replace(
    'className="bg-accentPrimary hover:bg-accentPrimary/90 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition-all"',
    'className="bg-accentPrimary hover:bg-accentPrimary/90 text-black font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(var(--color-accent-primary),0.4)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"'
)

# 2. Search Input
content = content.replace(
    'className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentPrimary"',
    'className="w-full bg-black/60 shadow-inner border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accentPrimary transition-colors"'
)

# 3. Project Card Header watermark
content = content.replace(
    '                  className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 cursor-pointer hover:bg-white/[0.01] transition-all select-none"',
    '                  className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 cursor-pointer hover:bg-white/[0.02] transition-all select-none relative group/phead"'
)

content = content.replace(
    '<div className="space-y-2 flex-1">',
    '<div className="absolute top-0 right-0 p-4 opacity-5 group-hover/phead:opacity-10 transition-opacity pointer-events-none">\n                    <Rocket className="w-24 h-24 text-accentPrimary" />\n                  </div>\n                  <div className="space-y-2 flex-1 relative z-10">'
)

content = content.replace(
    '<div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end">',
    '<div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end relative z-10">'
)

# 4. Modal Background
content = content.replace(
    'className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"',
    'className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"'
)

# 5. Form Textareas inside Pitch sheet
content = content.replace(
    'className="w-full h-28 bg-white/[0.01] border border-white/[0.04] rounded-lg p-2.5 text-xs text-slate-300 placeholder-slate-800 focus:outline-none focus:border-accentPrimary resize-none"',
    'className="w-full h-28 bg-black/40 shadow-inner border border-white/[0.08] rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-accentPrimary transition-colors resize-none"'
)

# 6. Save Button in Modal
content = content.replace(
    'className="bg-accentPrimary hover:bg-accentPrimary/90 text-white font-bold px-4 py-2 rounded-lg transition-all"',
    'className="bg-accentPrimary hover:bg-accentPrimary/90 text-black font-bold px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(var(--color-accent-primary),0.3)] hover:scale-[1.02] active:scale-95"'
)

# 7. Inputs inside Add Project Form
content = content.replace(
    'className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-accentPrimary"',
    'className="w-full bg-black/40 shadow-inner border border-white/[0.08] rounded-lg px-3 py-2 text-white outline-none focus:border-accentPrimary transition-colors"'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("ProjectsView.tsx patched successfully!")
