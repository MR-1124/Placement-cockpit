import os

file_path = r"d:\Placement Roadmap\src\pages\DevView.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Category Filters
content = content.replace(
    '                ? "bg-white/[0.06] text-white"\n                : "text-slate-500 hover:text-slate-300"',
    '                ? "bg-white/[0.08] text-white shadow-sm border border-white/[0.04]"\n                : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02] border border-transparent"'
)

# 2. Skill Card
content = content.replace(
    '<GlassCard key={skill.id} className="flex flex-col justify-between p-5 space-y-4">',
    '<GlassCard key={skill.id} className="flex flex-col justify-between p-5 space-y-4 relative group hover:border-white/[0.1] transition-all overflow-hidden">\n                      <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">\n                        <Code2 className="w-24 h-24 text-accentPrimary" />\n                      </div>\n                      <div className="relative z-10 space-y-4">'
)

content = content.replace(
    '</GlassCard>',
    '</div>\n                    </GlassCard>'
)

# 3. Interaction Pills hover states
content = content.replace(
    'className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-center transition-all cursor-pointer ${',
    'className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-center transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ${'
)

# 4. FAQ Container
content = content.replace(
    'className="bg-white/[0.01] border border-white/[0.04] rounded-lg p-3 space-y-3 text-[10px] max-h-[200px] overflow-y-auto"',
    'className="bg-black/40 shadow-inner border border-white/[0.04] rounded-lg p-3 space-y-3 text-[10px] max-h-[200px] overflow-y-auto"'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("DevView.tsx patched successfully!")
