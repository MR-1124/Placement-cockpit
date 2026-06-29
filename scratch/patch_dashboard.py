import os
import re

file_path = r"d:\Placement Roadmap\src\pages\DashboardView.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add huge icons to cards
# Syllabus Completion
content = content.replace(
    '<GlassCard className="flex flex-col justify-between h-full">',
    '<GlassCard className="flex flex-col justify-between h-full relative group hover:border-white/[0.1] transition-all overflow-hidden">\n            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity pointer-events-none">\n              <BookOpen className="w-24 h-24" />\n            </div>\n            <div className="relative z-10">'
)

# DSA Proficiency
content = content.replace(
    '<span className="text-sm font-semibold text-slate-300">DSA Proficiency</span>',
    '</div>\n            <div className="mt-4 relative z-10">\n              <ProgressBar percentage={overallCompletion} />\n            </div>\n          </GlassCard>\n\n          <GlassCard className="flex flex-col justify-between h-full relative group hover:border-white/[0.1] transition-all overflow-hidden">\n            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity pointer-events-none">\n              <Code2 className="w-24 h-24 text-violet-500" />\n            </div>\n            <div className="relative z-10">\n              <div className="flex items-center justify-between mb-3">\n                <span className="text-sm font-semibold text-slate-300">DSA Proficiency</span>'
)

# We need to make sure we close the div properly and fix the rest.
# Actually, the safest way to patch DashboardView's cards is string replacement on the exact blocks.
