import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import { GlassCard } from "../components/Common";
import roadmapsData from "../data/roadmaps.json";
import { CompanyRoadmap } from "../types/AppTypes";
import { Map, ArrowRight, CheckCircle, ChevronDown, Code2, Users, Layers, MessageSquare } from "lucide-react";

const typeIcons = {
  dsa: Code2,
  system_design: Layers,
  behavioral: Users,
  core: Map,
  project: MessageSquare
};

export const CompanyRoadmapsView: React.FC = () => {
  const { state, enrollCompanyRoadmap, updateRoadmapProgress } = useAppState();
  
  // Base raw roadmaps from JSON
  const catalogRoadmaps = roadmapsData as CompanyRoadmap[];
  
  // Merge with user's active roadmaps
  const activeRoadmaps = state.activeRoadmaps || [];
  
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);

  const getRoadmapDisplay = (roadmap: CompanyRoadmap) => {
    const activeData = activeRoadmaps.find(r => r.id === roadmap.id);
    return activeData || { ...roadmap, isEnrolled: false, progress: 0 };
  };

  const selectedRoadmap = selectedRoadmapId 
    ? getRoadmapDisplay(catalogRoadmaps.find(r => r.id === selectedRoadmapId)!)
    : null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-500">Target Preparation</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">Company Roadmaps</h1>
          <p className="text-sm text-slate-400 mt-1">
            Follow customized preparation paths tailored for top tech giants.
          </p>
        </div>
      </div>

      {!selectedRoadmap ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogRoadmaps.map(rawRoadmap => {
            const roadmap = getRoadmapDisplay(rawRoadmap);
            return (
              <GlassCard key={roadmap.id} className="relative group overflow-hidden flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <img src={roadmap.logoUrl} alt={roadmap.companyName} className="h-8 object-contain bg-white rounded-md p-1 opacity-90" />
                    {roadmap.isEnrolled ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Enrolled
                      </span>
                    ) : null}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{roadmap.companyName}</h3>
                  <p className="text-xs text-slate-400 line-clamp-3 mb-4">{roadmap.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {roadmap.focusAreas.slice(0, 3).map(area => (
                      <span key={area} className="text-[9px] font-mono text-slate-300 bg-white/[0.05] px-2 py-1 rounded">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto border-t border-white/[0.06] pt-4">
                  {roadmap.isEnrolled ? (
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Progress</span>
                        <span className="text-accentPrimary">{roadmap.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                        <div className="h-full bg-accentPrimary" style={{ width: `${roadmap.progress}%` }} />
                      </div>
                    </div>
                  ) : null}
                  <button 
                    onClick={() => setSelectedRoadmapId(roadmap.id)}
                    className="w-full py-2 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] rounded-lg text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2"
                  >
                    {roadmap.isEnrolled ? "Continue Journey" : "View Curriculum"} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          <button 
            onClick={() => setSelectedRoadmapId(null)}
            className="text-xs font-mono text-slate-500 hover:text-white flex items-center gap-1 transition-colors"
          >
            &larr; Back to Companies
          </button>

          <GlassCard className="flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accentPrimary opacity-5 blur-[100px] rounded-full" />
            
            <div className="w-24 h-24 bg-white rounded-2xl p-4 flex items-center justify-center shrink-0 shadow-xl relative z-10">
              <img src={selectedRoadmap.logoUrl} alt={selectedRoadmap.companyName} className="w-full h-full object-contain" />
            </div>
            
            <div className="flex-1 relative z-10">
              <h2 className="text-3xl font-bold text-white mb-2">{selectedRoadmap.companyName} Prep Track</h2>
              <p className="text-sm text-slate-400 mb-6">{selectedRoadmap.description}</p>
              
              {!selectedRoadmap.isEnrolled ? (
                <button
                  onClick={() => enrollCompanyRoadmap({ ...selectedRoadmap, isEnrolled: true, progress: 0 })}
                  className="px-6 py-2.5 bg-accentPrimary hover:bg-accentPrimary/90 text-white font-bold rounded-lg transition-colors shadow-lg shadow-accentPrimary/20"
                >
                  Enroll in Track
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Track Active
                  </span>
                  <div className="flex-1 max-w-xs">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Overall Progress</span>
                      <span className="text-accentPrimary">{selectedRoadmap.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/[0.04]">
                      <div className="h-full bg-accentPrimary transition-all duration-500" style={{ width: `${selectedRoadmap.progress}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">Curriculum Phases</h3>
            {selectedRoadmap.phases.map((phase, idx) => (
              <GlassCard key={phase.id} className="p-0 overflow-hidden">
                <div className="p-4 bg-white/[0.01] border-b border-white/[0.06] flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center font-bold text-slate-400 text-xs border border-white/[0.04]">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{phase.name}</h4>
                    <p className="text-xs text-slate-500">{phase.description}</p>
                  </div>
                </div>
                
                <div className="divide-y divide-white/[0.04]">
                  {phase.milestones.map(milestone => {
                    const Icon = typeIcons[milestone.type as keyof typeof typeIcons] || Code2;
                    return (
                      <div key={milestone.id} className={`p-4 flex gap-4 transition-colors ${milestone.isCompleted ? 'bg-emerald-500/5' : 'hover:bg-white/[0.01]'}`}>
                        <button
                          disabled={!selectedRoadmap.isEnrolled}
                          onClick={() => updateRoadmapProgress(selectedRoadmap.id, milestone.id, !milestone.isCompleted)}
                          className={`w-5 h-5 shrink-0 rounded border flex items-center justify-center mt-0.5 transition-colors ${
                            milestone.isCompleted 
                              ? "bg-emerald-500 border-emerald-500 text-white" 
                              : "border-slate-600 hover:border-slate-400"
                          } ${!selectedRoadmap.isEnrolled && "opacity-50 cursor-not-allowed"}`}
                        >
                          {milestone.isCompleted && <CheckCircle className="w-3 h-3" />}
                        </button>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="w-3.5 h-3.5 text-accentPrimary" />
                            <span className={`text-sm font-bold ${milestone.isCompleted ? 'text-slate-300 line-through' : 'text-slate-200'}`}>
                              {milestone.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{milestone.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
