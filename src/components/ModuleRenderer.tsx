import { useState } from "react";
import { useAppState } from "../context/AppStateContext";
import { Code2, Terminal, Briefcase, FileText, Circle, ExternalLink } from "lucide-react";
import type { PlanModule } from "../data/curriculum";

interface ModuleRendererProps {
  module: PlanModule;
  segmentId: string;
}

export function ModuleRenderer({ module, segmentId }: ModuleRendererProps) {
  const { state, toggleDsaProblem, updateDevSkill } = useAppState();
  const [selectedDifficulty, setSelectedDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All");

  const getIcon = () => {
    switch (module.type) {
      case "dsa": return <Code2 className="w-4 h-4 text-emerald-500" />;
      case "dev": return <Terminal className="w-4 h-4 text-blue-500" />;
      case "project": return <Briefcase className="w-4 h-4 text-purple-500" />;
      case "aptitude": return <FileText className="w-4 h-4 text-amber-500" />;
      default: return <Circle className="w-4 h-4 text-slate-500" />;
    }
  };

  // Collect all DSA problems for this module
  const dsaProblemsWithTopic: { problem: any; topicId: string }[] = [];
  if (module.type === "dsa" && module.targetIds) {
    module.targetIds.forEach(topicId => {
      const topic = state.dsaTopics.find(t => t.id === topicId);
      if (topic) {
        topic.problems.forEach(problem => {
          dsaProblemsWithTopic.push({ problem, topicId: topic.id });
        });
      }
    });
  }

  const easyProblems = dsaProblemsWithTopic.filter(p => p.problem.difficulty === "Easy");
  const mediumProblems = dsaProblemsWithTopic.filter(p => p.problem.difficulty === "Medium");
  const hardProblems = dsaProblemsWithTopic.filter(p => p.problem.difficulty === "Hard");

  const easySolved = easyProblems.filter(p => p.problem.isCompleted).length;
  const mediumSolved = mediumProblems.filter(p => p.problem.isCompleted).length;
  const hardSolved = hardProblems.filter(p => p.problem.isCompleted).length;
  const totalSolved = dsaProblemsWithTopic.filter(p => p.problem.isCompleted).length;

  const filteredDsaProblems = selectedDifficulty === "All"
    ? dsaProblemsWithTopic
    : dsaProblemsWithTopic.filter(p => p.problem.difficulty === selectedDifficulty);

  return (
    <div className="space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            {module.title}
          </h4>
        </div>

        {/* DSA Difficulty Categorized Tabs */}
        {module.type === "dsa" && dsaProblemsWithTopic.length > 0 && (
          <div className="flex items-center gap-1 bg-black/40 border border-white/[0.06] p-1 rounded-lg">
            <button
              onClick={() => setSelectedDifficulty("All")}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                selectedDifficulty === "All"
                  ? "bg-accentPrimary text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All ({totalSolved}/{dsaProblemsWithTopic.length})
            </button>
            <button
              onClick={() => setSelectedDifficulty("Easy")}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                selectedDifficulty === "Easy"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-emerald-400/70 hover:text-emerald-400"
              }`}
            >
              Easy ({easySolved}/{easyProblems.length})
            </button>
            <button
              onClick={() => setSelectedDifficulty("Medium")}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                selectedDifficulty === "Medium"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-amber-400/70 hover:text-amber-400"
              }`}
            >
              Med ({mediumSolved}/{mediumProblems.length})
            </button>
            <button
              onClick={() => setSelectedDifficulty("Hard")}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                selectedDifficulty === "Hard"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "text-rose-400/70 hover:text-rose-400"
              }`}
            >
              Hard ({hardSolved}/{hardProblems.length})
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Render Categorized DSA Problems */}
        {module.type === "dsa" && (
          filteredDsaProblems.length > 0 ? (
            filteredDsaProblems.map(({ problem, topicId }) => (
              <div
                key={problem.id}
                onClick={() => toggleDsaProblem(topicId, problem.id)}
                className={`flex justify-between items-center p-2.5 rounded-xl border transition-all cursor-pointer hover:scale-[1.01] select-none ${
                  problem.isCompleted
                    ? "bg-emerald-500/10 border-emerald-500/30 text-white shadow-sm"
                    : "bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.04] hover:border-white/10"
                }`}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={problem.isCompleted || false}
                    onChange={() => {}}
                    className="accent-emerald-500 rounded flex-shrink-0 cursor-pointer w-3.5 h-3.5"
                  />
                  <span className={`text-xs font-semibold truncate ${problem.isCompleted ? "line-through text-slate-400" : "text-white"}`}>
                    {problem.name}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  {problem.url && (
                    <a
                      href={problem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-slate-500 hover:text-accentPrimary transition-colors"
                      title="Open Problem on Platform"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                      problem.difficulty === "Easy"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : problem.difficulty === "Medium"
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 sm:col-span-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center text-xs text-slate-500">
              No {selectedDifficulty !== "All" ? selectedDifficulty : ""} problems found in this module.
            </div>
          )
        )}

        {/* Render DEV modules */}
        {module.type === "dev" && module.targetIds?.map((skillId: string) => {
          let foundCategory = null;
          let foundSkill = null;
          for (const cat of state.devCategories) {
            const sk = cat.skills.find(s => s.id === skillId);
            if (sk) {
              foundCategory = cat;
              foundSkill = sk;
              break;
            }
          }
          if (!foundSkill || !foundCategory) return null;
          
          const isCompleted = foundSkill.learned || foundSkill.built;
          
          return (
            <div
              key={foundSkill.id}
              onClick={() => updateDevSkill(foundSkill!.id, "learned")}
              className={`flex justify-between items-center p-2.5 rounded-xl border transition-all cursor-pointer hover:scale-[1.01] select-none ${
                isCompleted
                  ? "bg-blue-500/10 border-blue-500/30 text-white shadow-sm"
                  : "bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={isCompleted || false}
                  onChange={() => {}}
                  className="accent-blue-500 rounded flex-shrink-0 cursor-pointer w-3.5 h-3.5"
                />
                <span className={`text-xs font-semibold truncate ${isCompleted ? "text-blue-300" : "text-white"}`}>
                  {foundSkill.name}
                </span>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded font-mono uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30 flex-shrink-0 font-bold">
                Dev Skill
              </span>
            </div>
          );
        })}

        {/* Render Project / Aptitude / Custom content */}
        {(module.type === "project" || module.type === "aptitude" || module.type === "core") && (
          <div className="col-span-1 sm:col-span-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-2">
            {module.customContent ? (
              <div className="text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
                {module.customContent}
              </div>
            ) : (
              <div className="text-slate-500 italic">No specific targets mapped yet.</div>
            )}
            {module.targetIds && module.targetIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {module.targetIds.map((tid: string) => (
                  <span key={tid} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-slate-300 font-bold">
                    {tid.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      <span className="hidden">{segmentId}</span>
    </div>
  );
}
