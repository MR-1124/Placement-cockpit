import os

file_path = r"d:\Placement Roadmap\src\pages\ProfileView.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update Profile Avatar shadow
content = content.replace(
    'shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)]',
    'shadow-[0_0_15px_rgba(var(--color-accent-primary),0.3)]'
)

# 2. Update Placement Metrics Card with background icon
content = content.replace(
    '<GlassCard className="p-5 border border-white/[0.06] space-y-4">',
    '<GlassCard className="p-5 border border-white/[0.06] space-y-4 relative group hover:border-white/[0.1] transition-all overflow-hidden">\n            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">\n              <Activity className="w-24 h-24 text-accentPrimary" />\n            </div>\n            <div className="relative z-10">'
)
content = content.replace(
    '</GlassCard>\n        </div>\n\n        {/* Right Side: Edit Form, Target Placements, Social Profiles */}',
    '</div>\n          </GlassCard>\n        </div>\n\n        {/* Right Side: Edit Form, Target Placements, Social Profiles */}'
)

# 3. Inputs
content = content.replace(
    'className="w-full bg-white/[0.01] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentPrimary"',
    'className="w-full bg-black/60 border border-white/[0.08] focus:border-accentPrimary rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors shadow-inner"'
)

content = content.replace(
    'className="w-full bg-white/[0.01] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentPrimary font-mono"',
    'className="w-full bg-black/60 border border-white/[0.08] focus:border-accentPrimary rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors shadow-inner font-mono"'
)

# 4. Save Button
content = content.replace(
    'className="w-full sm:w-auto h-10 bg-accentPrimary hover:bg-accentPrimary/90 disabled:bg-slate-800 text-white font-bold font-mono uppercase px-5 rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer text-xs"',
    'className="w-full sm:w-auto h-10 bg-accentPrimary hover:bg-accentPrimary/90 disabled:bg-slate-800 text-black font-bold font-mono uppercase px-5 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-[0_0_15px_rgba(var(--color-accent-primary),0.3)] text-xs"'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("ProfileView.tsx patched successfully!")
