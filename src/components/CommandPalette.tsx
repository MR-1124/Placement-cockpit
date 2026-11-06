import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAppState } from "../context/AppStateContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  Map,
  BookOpen,
  Code2,
  GitFork,
  Target,
  Layers,
  FolderGit2,
  GraduationCap,
  Sparkles,
  Speech,
  FileText,
  Briefcase,
  Layers as FlashcardIcon,
  CalendarRange,
  StickyNote,
  Trophy,
  User,
  Settings,
  Sun,
  Moon,
  ExternalLink,
  Command,
  ArrowRight,
  CheckCircle2,
  Circle,
  X
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const { state, toggleTheme, toggleDsaProblem } = useAppState();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setQuery("");
        setSelectedIndex(0);
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // View Navigation Items
  const navigationItems = useMemo(() => [
    { id: "dashboard", name: "Dashboard", category: "Navigation", icon: LayoutDashboard, keywords: ["home", "overview", "stats"] },
    { id: "segments", name: "16-Week Mastery Tracker", category: "Navigation", icon: Map, keywords: ["curriculum", "weeks", "primary"] },
    { id: "plans", name: "Study Plans & Roadmaps", category: "Navigation", icon: BookOpen, keywords: ["catalog", "curriculum", "sprint"] },
    { id: "dsa", name: "DSA Problem Matrix", category: "Navigation", icon: Code2, keywords: ["leetcode", "algorithms", "patterns"] },
    { id: "skilltree", name: "Skill Tree & Tech Radar", category: "Navigation", icon: GitFork, keywords: ["radar", "graph", "skills"] },
    { id: "practice", name: "Practice Arena", category: "Navigation", icon: Target, keywords: ["timer", "problems", "coding"] },
    { id: "dev", name: "Full Stack Engineering Matrix", category: "Navigation", icon: Layers, keywords: ["frontend", "backend", "system"] },
    { id: "projects", name: "STAR Project Forge", category: "Navigation", icon: FolderGit2, keywords: ["portfolio", "github", "build"] },
    { id: "aptitude", name: "Aptitude & Quant Library", category: "Navigation", icon: GraduationCap, keywords: ["math", "logical", "quiz"] },
    { id: "ai", name: "NVIDIA NIM AI Mentor", category: "Navigation", icon: Sparkles, keywords: ["chat", "assistant", "llama"] },
    { id: "interview", name: "Mock Interview Simulator", category: "Navigation", icon: Speech, keywords: ["eval", "mock", "scorecard"] },
    { id: "resume-grader", name: "Resume ATS Grader", category: "Navigation", icon: FileText, keywords: ["ats", "pdf", "cv"] },
    { id: "company-roadmaps", name: "Company Roadmaps", category: "Navigation", icon: Briefcase, keywords: ["google", "amazon", "meta"] },
    { id: "flashcards", name: "Flashcards & Spaced Repetition", category: "Navigation", icon: FlashcardIcon, keywords: ["cards", "decks", "anki"] },
    { id: "revision", name: "Revision Queue", category: "Navigation", icon: CalendarRange, keywords: ["memory", "decay", "review"] },
    { id: "notes", name: "Engineering Notes", category: "Navigation", icon: StickyNote, keywords: ["markdown", "cheatsheet", "docs"] },
    { id: "badges", name: "Badge Vault & Credentials", category: "Navigation", icon: Trophy, keywords: ["xp", "ranks", "achievements"] },
    { id: "profile", name: "Candidate Profile", category: "Navigation", icon: User, keywords: ["resume", "target", "account"] },
    { id: "settings", name: "Cockpit Settings", category: "Navigation", icon: Settings, keywords: ["theme", "accent", "api"] }
  ], []);

  // Quick Action Commands
  const actionItems = useMemo(() => [
    {
      id: "action-toggle-theme",
      name: `Switch to ${state.settings.theme === "light" ? "Dark" : "Light"} Mode`,
      category: "Quick Actions",
      icon: state.settings.theme === "light" ? Moon : Sun,
      action: () => {
        toggleTheme();
        onClose();
      }
    }
  ], [state.settings.theme, toggleTheme, onClose]);

  // Search DSA Problems
  const matchingProblems = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: { problem: any; topicId: string; topicName: string }[] = [];

    for (const topic of state.dsaTopics || []) {
      for (const prob of topic.problems || []) {
        if (
          prob.name.toLowerCase().includes(q) ||
          topic.name.toLowerCase().includes(q) ||
          prob.difficulty.toLowerCase().includes(q)
        ) {
          results.push({ problem: prob, topicId: topic.id, topicName: topic.name });
          if (results.length >= 12) break; // Cap at 12 for speed
        }
      }
      if (results.length >= 12) break;
    }
    return results;
  }, [query, state.dsaTopics]);

  // Combined Results
  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();

    if (!q) {
      return [
        ...actionItems,
        ...navigationItems.slice(0, 8)
      ];
    }

    const filteredNav = navigationItems.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.keywords.some(k => k.includes(q))
    );

    const filteredActions = actionItems.filter(item =>
      item.name.toLowerCase().includes(q)
    );

    const problemItems = matchingProblems.map(({ problem, topicId, topicName }) => ({
      id: `problem-${problem.id}`,
      name: problem.name,
      category: `DSA Problem • ${topicName}`,
      isProblem: true,
      problem,
      topicId,
      action: () => {
        onNavigate("dsa");
        onClose();
      }
    }));

    return [...filteredActions, ...filteredNav, ...problemItems];
  }, [query, navigationItems, actionItems, matchingProblems, onNavigate, onClose]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredResults[selectedIndex];
      if (selected) {
        if ((selected as any).action) {
          (selected as any).action();
        } else {
          onNavigate(selected.id);
          onClose();
        }
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 px-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette"
          className="relative w-full max-w-2xl bg-darkCard/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-panel flex flex-col max-h-[75vh]"
          onKeyDown={handleKeyDown}
        >
          {/* Header Search Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] gap-3 bg-black/20">
            <Search className="w-5 h-5 text-accentPrimary shrink-0" />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={filteredResults.length > 0}
              aria-controls="command-palette-results"
              placeholder="Search views, 700+ DSA problems, quick actions..."
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="p-1 text-slate-500 hover:text-white rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block text-[10px] font-mono bg-white/[0.05] border border-white/10 px-2 py-0.5 rounded text-slate-400">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div id="command-palette-results" role="listbox" aria-label="Search suggestions" ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredResults.map((item, idx) => {
              const active = idx === selectedIndex;
              const isProblem = (item as any).isProblem;
              const prob = (item as any).problem;
              const topicId = (item as any).topicId;
              const Icon = (item as any).icon;

              return (
                <div
                  key={item.id}
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    if ((item as any).action) {
                      (item as any).action();
                    } else {
                      onNavigate(item.id);
                      onClose();
                    }
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    active
                      ? "bg-accentPrimary/15 border border-accentPrimary/40 text-white shadow-sm"
                      : "bg-transparent border border-transparent text-slate-300 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {isProblem ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDsaProblem(topicId, prob.id);
                        }}
                        className="p-1 hover:scale-110 transition-transform shrink-0 cursor-pointer"
                      >
                        {prob.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                    ) : Icon ? (
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-accentPrimary text-white" : "bg-white/[0.05] text-slate-400"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    ) : (
                      <Command className="w-4 h-4 text-slate-500 shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold truncate ${prob?.isCompleted ? "line-through text-slate-400" : ""}`}>
                          {item.name}
                        </span>
                        {isProblem && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase shrink-0 ${
                              prob.difficulty === "Easy"
                                ? "bg-emerald-500/15 text-emerald-400"
                                : prob.difficulty === "Medium"
                                ? "bg-amber-500/15 text-amber-400"
                                : "bg-rose-500/15 text-rose-400"
                            }`}
                          >
                            {prob.difficulty}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 block truncate">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {isProblem && prob.url && (
                      <a
                        href={prob.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 text-slate-500 hover:text-accentPrimary transition-colors"
                        title="Open on LeetCode"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {active && (
                      <ArrowRight className="w-4 h-4 text-accentPrimary animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })}

            {filteredResults.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500">
                No matching views or DSA problems found for "{query}".
              </div>
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-4 py-2.5 bg-black/30 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-500">
            <div className="flex items-center gap-3">
              <span><kbd className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-400">↑↓</kbd> Navigate</span>
              <span><kbd className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-400">↵</kbd> Select</span>
              <span><kbd className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-400">Ctrl+T</kbd> Toggle Theme</span>
            </div>
            <span>Placement Command Engine</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
