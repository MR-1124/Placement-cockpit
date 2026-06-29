import os

file_path = r"d:\Placement Roadmap\src\pages\AiChatView.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Inputs
content = content.replace(
    'className="w-full h-40 bg-black/40 border border-white/[0.06] rounded-lg p-3 text-[11px] text-slate-300 font-mono resize-y focus:outline-none focus:border-accentPrimary transition-colors disabled:opacity-50"',
    'className="w-full h-40 bg-black/60 shadow-inner border border-white/[0.06] rounded-lg p-3 text-[11px] text-slate-300 font-mono resize-y focus:outline-none focus:border-accentPrimary transition-colors disabled:opacity-50"'
)

content = content.replace(
    'className="flex-1 min-w-0 bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-600 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed transition-colors resize-none overflow-y-auto max-h-[120px] leading-relaxed"',
    'className="flex-1 min-w-0 bg-black/60 shadow-inner border border-white/[0.08] focus:border-accentPrimary rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-600 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed transition-colors resize-none overflow-y-auto max-h-[120px] leading-relaxed"'
)

# 2. Send Button
content = content.replace(
    'className="w-10 h-10 rounded-xl bg-accentPrimary hover:bg-accentPrimary/90 disabled:bg-white/[0.02] text-white disabled:text-slate-600 border border-white/[0.04] disabled:border-transparent flex items-center justify-center shrink-0 transition-colors cursor-pointer"',
    'className="w-10 h-10 rounded-xl bg-accentPrimary hover:bg-accentPrimary/90 disabled:bg-white/[0.02] text-black disabled:text-slate-600 border border-white/[0.04] disabled:border-transparent flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-[0_0_15px_rgba(var(--color-accent-primary),0.4)] hover:scale-[1.02] active:scale-95 disabled:shadow-none"'
)

# 3. Sidebar Tabs
content = content.replace(
    '"bg-accentPrimary text-white shadow-md"',
    '"bg-accentPrimary text-black shadow-[0_0_15px_rgba(var(--color-accent-primary),0.4)]"'
)

# 4. New Chat Button
content = content.replace(
    'className="w-full py-2 bg-accentPrimary/10 border border-accentPrimary/20 hover:bg-accentPrimary/20 text-accentPrimary rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer mb-2"',
    'className="w-full py-2 bg-accentPrimary/10 border border-accentPrimary/20 hover:bg-accentPrimary/20 hover:shadow-lg text-accentPrimary rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] mb-2"'
)

# 5. Clear Chat Button
content = content.replace(
    'className="w-full py-2 border border-rose-500/20 hover:border-rose-500 bg-rose-500/5 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow shrink-0"',
    'className="w-full py-2 border border-rose-500/20 hover:border-rose-500 bg-rose-500/5 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:scale-[1.02] shrink-0"'
)

# 6. User Message Bubble
content = content.replace(
    '"bg-accentPrimary/10 border-accentPrimary/20 rounded-tr-none text-slate-200"',
    '"bg-accentPrimary/20 border-accentPrimary/40 rounded-tr-none text-slate-100 shadow-[0_0_15px_rgba(var(--color-accent-primary),0.1)]"'
)


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("AiChatView.tsx patched successfully!")
