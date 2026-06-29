import os

file_path = r"d:\Placement Roadmap\src\pages\FlashcardsView.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. AI Generate Button Top
content = content.replace(
    'className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm font-medium transition-colors border border-purple-500/20"',
    'className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] text-purple-400 rounded-lg text-sm font-medium transition-all border border-purple-500/20"'
)

# 2. Flashcard Front
content = content.replace(
    'className="absolute inset-0 backface-hidden bg-darkCard border border-white/[0.08] rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-lg"',
    'className="absolute inset-0 backface-hidden bg-black/80 border border-white/[0.08] rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-[0_0_30px_rgba(255,255,255,0.05)]"'
)

# 3. Flashcard Back
content = content.replace(
    'className="absolute inset-0 backface-hidden bg-darkCard border border-accentPrimary/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(var(--accent-rgb),0.1)] flex flex-col"',
    'className="absolute inset-0 backface-hidden bg-black/90 border border-accentPrimary/40 rounded-2xl p-8 shadow-[0_0_30px_rgba(var(--color-accent-primary),0.2)] flex flex-col"'
)

# 4. Textarea in Modal
content = content.replace(
    'className="w-full bg-black/40 border border-white/10 focus:border-purple-500 rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:outline-none"',
    'className="w-full bg-black/60 shadow-inner border border-white/10 focus:border-purple-500 rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"'
)

# 5. Modal Generate Button
content = content.replace(
    'className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"',
    'className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-black font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"'
)

# 6. DeckCard Icon bg
content = content.replace(
    'className={`p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] ${deck.color.replace(\'bg-\', \'text-\')}`}',
    'className={`p-3 rounded-xl bg-black/40 shadow-inner border border-white/[0.06] ${deck.color.replace(\'bg-\', \'text-\')}`}'
)

# 7. DeckCard Cram Mode Button
content = content.replace(
    'className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 px-2 py-1 rounded border border-amber-400/20 flex items-center gap-1"',
    'className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 hover:shadow-[0_0_10px_rgba(251,191,36,0.3)] hover:scale-[1.05] px-2 py-1 rounded border border-amber-400/20 flex items-center gap-1 transition-all"'
)


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("FlashcardsView.tsx patched successfully!")
