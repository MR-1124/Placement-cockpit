import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import { SKILL_TREE_NODES, type SkillNode } from "../data/skillTree";
import { SpotlightCard } from "../components/Common";
import * as LucideIcons from "lucide-react";
import confetti from "canvas-confetti";
import { audioTelemetry } from "../lib/audioTelemetry";

export const SkillTreeView: React.FC<{ setActiveTab?: (tab: string) => void }> = () => {
  const { state, toggleSkill } = useAppState();
  const completedSkills = state.completedSkills || [];
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [zoom, setZoom] = useState<number>(1);

  const isUnlocked = (node: SkillNode) => {
    if (node.requires.length === 0) return true;
    return node.requires.every(req => completedSkills.includes(req));
  };

  const isCompleted = (nodeId: string) => completedSkills.includes(nodeId);

  const handleNodeClick = (node: SkillNode) => {
    setSelectedNode(node);
  };

  const handleToggleSkillWithFx = (nodeId: string) => {
    const willBeCompleted = !isCompleted(nodeId);
    toggleSkill(nodeId);
    if (willBeCompleted) {
      audioTelemetry.levelUp();
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.8 },
        colors: ["#8b5cf6", "#10b981", "#3b82f6"]
      });
    } else {
      audioTelemetry.click();
    }
  };

  const drawEdges = () => {
    return SKILL_TREE_NODES.flatMap(node => 
      node.requires.map(reqId => {
        const reqNode = SKILL_TREE_NODES.find(n => n.id === reqId);
        if (!reqNode) return null;

        const startX = reqNode.x + 36;
        const startY = reqNode.y + 72;
        const endX = node.x + 36;
        const endY = node.y;

        const isLight = state.settings.theme === "light";
        const isLineActive = isCompleted(reqNode.id);
        const strokeColor = isLineActive 
          ? "rgba(var(--accent-rgb), 0.85)" 
          : isLight 
            ? "rgba(0, 0, 0, 0.16)" 
            : "rgba(255, 255, 255, 0.08)";

        return (
          <path
            key={`${reqId}-${node.id}`}
            d={`M ${startX} ${startY} C ${startX} ${startY + 60}, ${endX} ${endY - 60}, ${endX} ${endY}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth={isLineActive ? 3.5 : 2}
            strokeDasharray={isLineActive ? undefined : "4 4"}
            className="transition-all duration-500"
          />
        );
      })
    );
  };

  const completedCount = SKILL_TREE_NODES.filter(n => isCompleted(n.id)).length;
  const progressPercentage = Math.round((completedCount / SKILL_TREE_NODES.length) * 100);

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex flex-col relative pb-12">
      {/* Header Info */}
      <SpotlightCard className="p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accentPrimary font-bold bg-accentPrimary/10 border border-accentPrimary/25 px-2.5 py-0.5 rounded-md">
                RPG Skill Constellation
              </span>
              <span className="text-[10px] font-mono text-slate-500">• Core Mastery Paths</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Algorithm Skill Tree</h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
              Unlock algorithmic skill milestones sequentially. Complete prerequisites to traverse the mastery graph.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] p-3 rounded-2xl">
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Tree Mastery</span>
              <span className="text-xl font-bold font-mono text-white">{completedCount} / {SKILL_TREE_NODES.length}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accentPrimary/15 border border-accentPrimary/30 flex items-center justify-center text-accentPrimary font-mono font-bold text-xs shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)]">
              {progressPercentage}%
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border-l border-white/10 pl-3">
              <button
                onClick={() => setZoom(prev => Math.min(1.4, prev + 0.1))}
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-mono"
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={() => setZoom(1)}
                className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors cursor-pointer text-[10px] font-mono"
                title="Reset Zoom"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                onClick={() => setZoom(prev => Math.max(0.6, prev - 0.1))}
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-mono"
                title="Zoom Out"
              >
                -
              </button>
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* RPG Tree Canvas */}
      <div className="flex-1 overflow-auto custom-scrollbar relative z-10 w-full bg-darkCard/40 border border-white/[0.06] rounded-3xl p-6 backdrop-blur-md">
        <div 
          className="relative w-[1200px] h-[1000px] mx-auto origin-top transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
             {drawEdges()}
          </svg>

          {SKILL_TREE_NODES.map(node => {
            const unlocked = isUnlocked(node);
            const completed = isCompleted(node.id);
            const Icon = (LucideIcons as any)[node.icon || "Code"] || LucideIcons.Code;
            
            return (
              <motion.div
                key={node.id}
                className="absolute"
                style={{ left: node.x, top: node.y }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={unlocked ? { scale: 1.12 } : {}}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <div 
                  onClick={() => handleNodeClick(node)}
                  className={`w-18 h-18 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 backdrop-blur-xl select-none ${
                    completed 
                      ? "bg-accentPrimary/20 border-accentPrimary text-white shadow-[0_0_30px_rgba(var(--accent-rgb),0.5),inset_0_0_15px_rgba(var(--accent-rgb),0.3)]" 
                      : unlocked 
                        ? "bg-darkCard/90 border-white/20 text-slate-200 hover:border-accentPrimary hover:text-white hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]"
                        : "bg-black/60 border-white/[0.04] text-slate-600 grayscale opacity-40 cursor-not-allowed"
                  }`}
                >
                  <Icon className="w-7 h-7 mb-1" />
                  {completed && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,1)]" />
                  )}
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none">
                  <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-lg border shadow-lg ${
                    completed
                      ? "bg-accentPrimary/15 border-accentPrimary/40 text-accentPrimary"
                      : unlocked
                      ? "bg-slate-900/90 border-white/10 text-slate-300"
                      : "bg-black/80 border-transparent text-slate-600"
                  }`}>
                    {node.title}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Detail Bottom Sheet */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
          >
            <SpotlightCard className="p-6 border border-white/[0.15] shadow-2xl bg-darkCard/95 backdrop-blur-xl">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {selectedNode.title}
                    {isCompleted(selectedNode.id) && <LucideIcons.CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                      selectedNode.difficulty === "Hard" || selectedNode.difficulty === "Extreme" ? "neon-pill-rose" :
                      selectedNode.difficulty === "Medium" ? "neon-pill-amber" :
                      "neon-pill-emerald"
                    }`}>
                      {selectedNode.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">+100 XP Mastery</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg border border-white/[0.08] cursor-pointer"
                >
                  <LucideIcons.X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-300 mb-5 leading-relaxed">{selectedNode.description}</p>
              
              {!isUnlocked(selectedNode) ? (
                <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl p-3 text-xs text-rose-300 flex items-center gap-2.5 font-mono">
                  <LucideIcons.Lock className="w-4 h-4 shrink-0 text-rose-400" />
                  Locked. You must complete prerequisite nodes first.
                </div>
              ) : (
                <button 
                  onClick={() => handleToggleSkillWithFx(selectedNode.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isCompleted(selectedNode.id) 
                      ? "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] border border-white/[0.08]"
                      : "bg-accentPrimary text-slate-950 hover:bg-accentPrimary/90 shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  {isCompleted(selectedNode.id) ? "Mark Unfinished" : "Unlock & Mark Completed (+100 XP)"}
                </button>
              )}
            </SpotlightCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
