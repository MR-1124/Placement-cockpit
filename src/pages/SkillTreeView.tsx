import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import { SKILL_TREE_NODES, type SkillNode } from "../data/skillTree";
import { GlassCard } from "../components/Common";
import * as LucideIcons from "lucide-react";

export const SkillTreeView: React.FC<{ setActiveTab?: (tab: string) => void }> = () => {
  const { state, toggleSkill } = useAppState();
  const completedSkills = state.completedSkills || [];
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  const isUnlocked = (node: SkillNode) => {
    if (node.requires.length === 0) return true;
    return node.requires.every(req => completedSkills.includes(req));
  };

  const isCompleted = (nodeId: string) => completedSkills.includes(nodeId);

  const handleNodeClick = (node: SkillNode) => {
    setSelectedNode(node);
  };

  const drawEdges = () => {
    return SKILL_TREE_NODES.flatMap(node => 
      node.requires.map(reqId => {
        const reqNode = SKILL_TREE_NODES.find(n => n.id === reqId);
        if (!reqNode) return null;

        // simple bezier curve from reqNode (top parent) to node (bottom child)
        const startX = reqNode.x + 32;
        const startY = reqNode.y + 64;
        const endX = node.x + 32;
        const endY = node.y;

        const isLineActive = isCompleted(reqNode.id);
        const strokeColor = isLineActive ? "rgba(var(--color-accent-primary-rgb), 0.5)" : "rgba(255, 255, 255, 0.1)";

        return (
          <path
            key={`${reqId}-${node.id}`}
            d={`M ${startX} ${startY} C ${startX} ${startY + 50}, ${endX} ${endY - 50}, ${endX} ${endY}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth={3}
            className={`transition-all duration-500 ${isLineActive ? 'shadow-[0_0_10px_rgba(var(--color-accent-primary),0.5)]' : ''}`}
          />
        );
      })
    );
  };

  return (
    <div className="w-full h-[calc(100vh-100px)] flex flex-col relative overflow-hidden">
      <div className="p-6 shrink-0 relative z-20 pointer-events-none">
        <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">DSA Skill Tree</h1>
        <p className="text-slate-400 text-sm mt-1 max-w-xl">
          Master the fundamentals and unlock advanced algorithms. 
        </p>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar relative z-10 w-full">
        {/* Canvas for RPG Tree */}
        <div className="relative w-[1200px] h-[1000px] mx-auto mt-10">
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
                whileHover={unlocked ? { scale: 1.1 } : {}}
              >
                <div 
                  onClick={() => handleNodeClick(node)}
                  className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 backdrop-blur-md shadow-xl ${
                    completed 
                      ? 'bg-accentPrimary/20 border-accentPrimary text-accentPrimary shadow-[0_0_30px_rgba(var(--color-accent-primary),0.4)]' 
                      : unlocked 
                        ? 'bg-white/10 border-white/30 text-white hover:border-accentPrimary hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                        : 'bg-black/50 border-white/5 text-slate-600 grayscale opacity-60 cursor-not-allowed'
                  }`}
                >
                  <Icon className={`w-7 h-7 mb-1 ${completed ? 'drop-shadow-[0_0_8px_rgba(var(--color-accent-primary),0.8)]' : ''}`} />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded bg-black/60 border ${
                    completed ? 'border-accentPrimary/30 text-accentPrimary/90' : unlocked ? 'border-white/10 text-slate-300' : 'border-transparent text-slate-600'
                  }`}>
                    {node.title}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
          >
            <GlassCard className="p-6 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {selectedNode.title}
                    {isCompleted(selectedNode.id) && <LucideIcons.CheckCircle2 className="w-5 h-5 text-accentPrimary" />}
                  </h3>
                  <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border mt-2 inline-block ${
                    selectedNode.difficulty === 'Hard' || selectedNode.difficulty === 'Extreme' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    selectedNode.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {selectedNode.difficulty}
                  </span>
                </div>
                <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white p-1 bg-white/5 rounded-full">
                  <LucideIcons.X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-slate-300 mb-6">{selectedNode.description}</p>
              
              {!isUnlocked(selectedNode) ? (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-xs text-rose-300 flex items-center gap-2">
                  <LucideIcons.Lock className="w-4 h-4 shrink-0" />
                  Locked. You must master prerequisite skills first.
                </div>
              ) : (
                <button 
                  onClick={() => toggleSkill(selectedNode.id)}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    isCompleted(selectedNode.id) 
                      ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                      : 'bg-accentPrimary text-black hover:bg-accentPrimary/90 shadow-[0_0_20px_rgba(var(--color-accent-primary),0.3)] hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  {isCompleted(selectedNode.id) ? (
                    <>Unmark Completion</>
                  ) : (
                    <><LucideIcons.Zap className="w-4 h-4" /> Master This Skill</>
                  )}
                </button>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
