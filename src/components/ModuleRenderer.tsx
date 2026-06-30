import { useAppState } from "../context/AppStateContext";
import { Code2, Terminal, Briefcase, FileText, Circle } from "lucide-react";
import type { PlanModule } from "../data/curriculum";

interface ModuleRendererProps {
  module: PlanModule;
  segmentId: string;
}

export function ModuleRenderer({ module, segmentId }: ModuleRendererProps) {
  const { state, toggleDsaProblem, updateDevSkill } = useAppState();

  const getIcon = () => {
    switch (module.type) {
      case "dsa": return <Code2 className="w-4 h-4 text-emerald-500" />;
      case "dev": return <Terminal className="w-4 h-4 text-blue-500" />;
      case "project": return <Briefcase className="w-4 h-4 text-purple-500" />;
      case "aptitude": return <FileText className="w-4 h-4 text-amber-500" />;
      default: return <Circle className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2">
        {getIcon()}
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          {module.title}
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Render DSA modules */}
        {module.type === "dsa" && module.targetIds?.map((topicId: string) => {
          const topic = state.dsaTopics.find(t => t.id === topicId);
          if (!topic) return null;
          return topic.problems.map(problem => (
            <div
              key={problem.id}
              onClick={() => toggleDsaProblem(topic.id, problem.id)}
              className={`flex justify-between items-center p-2.5 rounded-lg border transition-all cursor-pointer hover:scale-[1.01] select-none ${
                problem.isCompleted
                  ? "bg-emerald-500/5 border-emerald-500/20 text-white"
                  : "bg-white/[0.01] border-white/[0.04] text-slate-400 hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={problem.isCompleted || false}
                  onChange={() => {}}
                  className="accent-emerald-500 rounded flex-shrink-0 cursor-pointer"
                />
                <span className="text-xs font-medium truncate">{problem.name}</span>
              </div>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase flex-shrink-0 ${
                  problem.difficulty === "Easy"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : problem.difficulty === "Medium"
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-rose-500/10 text-rose-400"
                }`}
              >
                {problem.difficulty}
              </span>
            </div>
          ));
        })}

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
          
          // Let's just track overall completion based on "learned" or "built"
          const isCompleted = foundSkill.learned || foundSkill.built;
          
          return (
            <div
              key={foundSkill.id}
              onClick={() => updateDevSkill(foundSkill!.id, "learned")} // Toggle "learned" as primary
              className={`flex justify-between items-center p-2.5 rounded-lg border transition-all cursor-pointer hover:scale-[1.01] select-none ${
                isCompleted
                  ? "bg-blue-500/5 border-blue-500/20 text-white"
                  : "bg-white/[0.01] border-white/[0.04] text-slate-400 hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={isCompleted || false}
                  onChange={() => {}}
                  className="accent-blue-500 rounded flex-shrink-0 cursor-pointer"
                />
                <span className="text-xs font-medium truncate">{foundSkill.name}</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-mono uppercase bg-white/5 text-slate-400 border border-white/10 flex-shrink-0">
                Dev Skill
              </span>
            </div>
          );
        })}

        {/* Render Project / Aptitude / Custom content */}
        {(module.type === "project" || module.type === "aptitude" || module.type === "core") && (
          <div className="col-span-1 sm:col-span-2 p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] text-xs space-y-2">
            {module.customContent ? (
              <div className="text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
                {module.customContent}
              </div>
            ) : (
              <div className="text-slate-500 italic">No specific targets mapped yet.</div>
            )}
            {module.targetIds && module.targetIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {module.targetIds.map((tid: string) => (
                  <span key={tid} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-slate-400">
                    {tid}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* We use segmentId silently or you can print it. We don't render it for now */}
      <span className="hidden">{segmentId}</span>
    </div>
  );
}
