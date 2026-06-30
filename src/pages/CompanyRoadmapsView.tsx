import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import { GlassCard } from "../components/Common";
import roadmapsData from "../data/roadmaps.json";
import type { CompanyRoadmap } from "../types/AppTypes";
import { 
  Map, ArrowRight, CheckCircle, Code2, Users, Layers, MessageSquare, 
  Clock, Lightbulb, GitCommit, ChevronDown, ChevronUp, Bot, ExternalLink, PlayCircle,
  HelpCircle, Target
} from "lucide-react";

const typeIcons = {
  dsa: Code2,
  system_design: Layers,
  behavioral: Users,
  core: Map,
  project: MessageSquare
};

interface CompanyRoadmapsViewProps {
  setActiveTab?: (tab: string) => void;
}

export const CompanyRoadmapsView: React.FC<CompanyRoadmapsViewProps> = ({ setActiveTab }) => {
  const { state, enrollCompanyRoadmap, updateRoadmapProgress } = useAppState();
  
  // Base raw roadmaps from JSON
  const catalogRoadmaps = roadmapsData as CompanyRoadmap[];
  
  // Merge with user's active roadmaps
  const activeRoadmaps = state.activeRoadmaps || [];
  
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

  const getRoadmapDisplay = (roadmap: CompanyRoadmap) => {
    const activeData = activeRoadmaps.find(r => r.id === roadmap.id);
    return activeData || { ...roadmap, isEnrolled: false, progress: 0 };
  };

  const selectedRoadmap = selectedRoadmapId 
    ? getRoadmapDisplay(catalogRoadmaps.find(r => r.id === selectedRoadmapId)!)
    : null;

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const handleAskMentor = () => {
    if (setActiveTab) setActiveTab("aichat");
  };

  const handleStartMock = () => {
    if (setActiveTab) setActiveTab("interview");
  };

  const handleSolveQuestions = () => {
    if (setActiveTab) setActiveTab("dsa");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-500">Target Preparation</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">Company Roadmaps</h1>
          <p className="text-sm text-slate-400 mt-1">
            Follow customized, extremely detailed preparation paths tailored for top tech giants.
          </p>
        </div>
      </div>

      {!selectedRoadmap ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogRoadmaps.map(rawRoadmap => {
            const roadmap = getRoadmapDisplay(rawRoadmap);
            return (
              <GlassCard key={roadmap.id} className="relative group overflow-hidden flex flex-col h-full cursor-pointer hover:border-accentPrimary/40 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(var(--color-accent-primary),0.1)]" onClick={() => setSelectedRoadmapId(roadmap.id)}>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <img src={roadmap.logoUrl} alt={roadmap.companyName} className="h-8 object-contain bg-white rounded-md p-1 opacity-90" />
                    {roadmap.isEnrolled ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Enrolled
                      </span>
                    ) : (
                      <div className="flex gap-1 text-[10px] font-mono">
                         {roadmap.difficulty && (
                           <span className={`px-2 py-1 rounded-md border ${
                             roadmap.difficulty === 'Hard' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                             roadmap.difficulty === 'Extreme' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                             'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                           }`}>
                             {roadmap.difficulty}
                           </span>
                         )}
                         {roadmap.estimatedTime && (
                           <span className="px-2 py-1 bg-white/[0.05] border border-white/[0.1] text-slate-300 rounded-md flex items-center gap-1">
                             <Clock className="w-3 h-3" /> {roadmap.estimatedTime}
                           </span>
                         )}
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accentPrimary transition-colors">{roadmap.companyName}</h3>
                  <p className="text-xs text-slate-400 line-clamp-3 mb-4">{roadmap.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {roadmap.focusAreas.slice(0, 3).map(area => (
                      <span key={area} className="text-[9px] font-mono text-slate-300 bg-white/[0.05] px-2 py-1 rounded border border-white/[0.05]">
                        {area}
                      </span>
                    ))}
                  </div>

                  {/* Hover Reveal: Interview Rounds */}
                  {roadmap.interviewRounds && (
                    <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 group-hover:mt-4 transition-all duration-300 overflow-hidden">
                      <p className="text-[10px] uppercase font-mono text-slate-500 mb-2">Hiring Pipeline:</p>
                      <div className="flex flex-wrap gap-1">
                        {roadmap.interviewRounds.map((round, i) => (
                           <span key={i} className="text-[9px] text-slate-400 bg-black/40 px-2 py-1 rounded flex items-center gap-1 shadow-inner border border-white/[0.04]">
                             <GitCommit className="w-2 h-2 text-accentPrimary" /> {round}
                           </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-white/[0.06] pt-4">
                  {roadmap.isEnrolled ? (
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Progress</span>
                        <span className="text-accentPrimary">{roadmap.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-black/60 shadow-inner rounded-full overflow-hidden border border-white/[0.05]">
                        <div className="h-full bg-accentPrimary shadow-[0_0_10px_rgba(var(--color-accent-primary),0.8)]" style={{ width: `${roadmap.progress}%` }} />
                      </div>
                    </div>
                  ) : null}
                  <button 
                    className="w-full py-2.5 bg-black/40 shadow-inner hover:bg-accentPrimary/10 border border-white/[0.06] hover:border-accentPrimary/40 rounded-lg text-xs font-semibold text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                  >
                    {roadmap.isEnrolled ? "Continue Journey" : "View Curriculum"} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
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
            className="text-xs font-mono text-slate-500 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-white/[0.05]"
          >
            &larr; Back to Companies
          </button>

          <GlassCard className="flex flex-col md:flex-row gap-8 items-start relative overflow-hidden p-8 border border-white/[0.08] shadow-[0_0_30px_rgba(0,0,0,0.5)] bg-gradient-to-br from-darkCard to-black/90">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accentPrimary opacity-5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="w-28 h-28 bg-white/5 backdrop-blur-xl rounded-2xl p-5 flex items-center justify-center shrink-0 shadow-2xl relative z-10 border border-white/10 ring-1 ring-white/5">
              <img src={selectedRoadmap.logoUrl} alt={selectedRoadmap.companyName} className="w-full h-full object-contain filter drop-shadow-md brightness-110" />
            </div>
            
            <div className="flex-1 relative z-10 w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
                    {selectedRoadmap.companyName} Track
                    {selectedRoadmap.difficulty && (
                      <span className={`text-[10px] px-2 py-1 rounded-md border font-mono tracking-wider align-middle ${
                        selectedRoadmap.difficulty === 'Hard' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        selectedRoadmap.difficulty === 'Extreme' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {selectedRoadmap.difficulty}
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-2xl">{selectedRoadmap.description}</p>
                </div>
              </div>
              
              {selectedRoadmap.interviewRounds && (
                <div className="mb-6 bg-black/40 shadow-inner rounded-xl p-3 border border-white/[0.04] inline-flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] uppercase font-mono text-slate-500 mr-2 flex items-center gap-1">
                     <Clock className="w-3 h-3" /> Timeline: {selectedRoadmap.estimatedTime || "N/A"}
                  </span>
                  <div className="h-4 w-px bg-white/10 hidden sm:block mx-1" />
                  {selectedRoadmap.interviewRounds.map((round, idx) => (
                    <React.Fragment key={idx}>
                      <span className="text-xs font-bold text-slate-300">{round}</span>
                      {idx < selectedRoadmap.interviewRounds!.length - 1 && <ArrowRight className="w-3 h-3 text-slate-600" />}
                    </React.Fragment>
                  ))}
                </div>
              )}
              
              <div className="flex flex-wrap items-center gap-4">
                {!selectedRoadmap.isEnrolled ? (
                  <button
                    onClick={() => enrollCompanyRoadmap({ ...selectedRoadmap, isEnrolled: true, progress: 0 })}
                    className="px-8 py-3 bg-accentPrimary hover:bg-accentPrimary/90 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(var(--color-accent-primary),0.3)] hover:scale-[1.02] active:scale-95"
                  >
                    Enroll in Track
                  </button>
                ) : (
                  <div className="flex-1 w-full bg-black/40 border border-white/[0.06] shadow-inner p-4 rounded-xl flex items-center gap-6 min-w-[200px]">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 shrink-0">
                      <CheckCircle className="w-4 h-4" /> Track Active
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                        <span>Overall Progress</span>
                        <span className="text-accentPrimary font-bold text-xs">{selectedRoadmap.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-black/60 shadow-inner rounded-full overflow-hidden border border-white/[0.04]">
                        <div className="h-full bg-accentPrimary transition-all duration-500 shadow-[0_0_10px_rgba(var(--color-accent-primary),0.6)]" style={{ width: `${selectedRoadmap.progress}%` }} />
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  onClick={handleAskMentor}
                  className="px-4 py-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.15] text-slate-300 font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 group shrink-0"
                >
                  <Bot className="w-4 h-4 text-accentPrimary group-hover:scale-110 transition-transform" /> Ask Mentor
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Insider Tips Vault */}
          {selectedRoadmap.tips && (
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6 relative overflow-hidden shadow-inner">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
              <h3 className="text-sm font-bold text-amber-500 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> Insider Tips Vault
              </h3>
              <ul className="space-y-2">
                {selectedRoadmap.tips.map((tip, idx) => (
                  <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-amber-500/50 mt-1">•</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interactive Timeline Curriculum */}
          <div className="space-y-6 mt-10">
            <h3 className="text-xl font-extrabold text-white mb-6 flex items-center gap-2">
              <Map className="w-5 h-5 text-accentPrimary" /> Curriculum Phases
            </h3>
            
            <div className="relative border-l-2 border-white/[0.06] ml-4 space-y-8 pb-10">
              {selectedRoadmap.phases.map((phase, idx) => {
                const isExpanded = expandedPhases[phase.id] !== false; // Default true
                
                return (
                  <div key={phase.id} className="relative pl-8">
                    {/* Timeline Node */}
                    <div className="absolute -left-[17px] top-4 w-8 h-8 rounded-full bg-darkCard border-2 border-accentPrimary/50 flex items-center justify-center font-bold text-accentPrimary text-xs shadow-[0_0_15px_rgba(var(--color-accent-primary),0.3)] z-10">
                      {idx + 1}
                    </div>

                    <GlassCard className="p-0 overflow-hidden border border-white/[0.08] shadow-lg">
                      {/* Phase Header */}
                      <div 
                        onClick={() => togglePhase(phase.id)}
                        className="p-5 bg-white/[0.01] hover:bg-white/[0.03] flex items-center justify-between gap-4 cursor-pointer transition-colors border-b border-transparent"
                        style={{ borderBottomColor: isExpanded ? 'rgba(255,255,255,0.06)' : 'transparent' }}
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-lg font-bold text-white">{phase.name}</h4>
                            {phase.estimatedTime && (
                              <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-2 py-0.5 rounded border border-white/5 shadow-inner">
                                {phase.estimatedTime}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500">{phase.description}</p>
                        </div>
                        <button className="text-slate-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      {/* Phase Milestones */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="divide-y divide-white/[0.04] bg-black/20"
                          >
                            {phase.milestones.map(milestone => {
                              const Icon = typeIcons[milestone.type as keyof typeof typeIcons] || Code2;
                              return (
                                <div key={milestone.id} className={`p-5 flex gap-4 transition-colors ${milestone.isCompleted ? 'bg-emerald-500/5' : 'hover:bg-white/[0.01]'}`}>
                                  <button
                                    disabled={!selectedRoadmap.isEnrolled}
                                    onClick={() => updateRoadmapProgress(selectedRoadmap.id, milestone.id, !milestone.isCompleted)}
                                    className={`w-6 h-6 shrink-0 rounded-lg border-2 flex items-center justify-center mt-0.5 transition-all shadow-inner ${
                                      milestone.isCompleted 
                                        ? "bg-emerald-500 border-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]" 
                                        : "bg-black/40 border-slate-600 hover:border-slate-400"
                                    } ${!selectedRoadmap.isEnrolled && "opacity-50 cursor-not-allowed"}`}
                                  >
                                    {milestone.isCompleted && <CheckCircle className="w-4 h-4" />}
                                  </button>
                                  
                                  <div className="flex-1 w-full min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                      <div className="flex items-center gap-2">
                                        <Icon className="w-4 h-4 text-accentPrimary" />
                                        <span className={`text-base font-bold ${milestone.isCompleted ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                                          {milestone.title}
                                        </span>
                                      </div>

                                      {/* Tags */}
                                      {milestone.priority === 'Must-Do' && (
                                        <span className="text-[9px] uppercase font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(244,63,94,0.1)]">
                                          Must Do
                                        </span>
                                      )}
                                      {milestone.difficulty && (
                                        <span className={`text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${
                                          milestone.difficulty === 'Hard' ? 'text-amber-400 bg-amber-500/5 border-amber-500/20' :
                                          'text-emerald-400 bg-emerald-500/5 border-emerald-500/20'
                                        }`}>
                                          {milestone.difficulty}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed max-w-3xl mb-4">{milestone.description}</p>
                                    
                                    {/* Questions Section */}
                                    {milestone.questions && milestone.questions.length > 0 && (
                                      <div className="mb-4 bg-black/40 border border-white/[0.05] rounded-xl p-4 shadow-inner">
                                        <h5 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
                                          <HelpCircle className="w-4 h-4 text-accentPrimary" />
                                          Target Problems
                                        </h5>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                          {milestone.questions.map((q, qIdx) => (
                                            <span key={qIdx} className="text-[10px] bg-white/[0.05] text-slate-300 border border-white/[0.1] px-2 py-1 rounded flex items-center gap-1.5">
                                              <Target className="w-3 h-3 text-slate-500" /> {q}
                                            </span>
                                          ))}
                                        </div>
                                        <button 
                                          onClick={handleSolveQuestions}
                                          className="text-[10px] font-bold text-white bg-accentPrimary/20 hover:bg-accentPrimary/30 border border-accentPrimary/30 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                                        >
                                          Solve in DSA Tracker &rarr;
                                        </button>
                                      </div>
                                    )}

                                    {/* Action Links & Tools */}
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                      {milestone.links?.map(link => (
                                        <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="text-xs text-accentPrimary hover:text-accentPrimary/80 flex items-center gap-1 transition-colors px-2 py-1 bg-accentPrimary/5 hover:bg-accentPrimary/10 rounded border border-accentPrimary/10">
                                          <ExternalLink className="w-3 h-3" /> {link.title}
                                        </a>
                                      ))}

                                      {(milestone.type === 'dsa' || milestone.type === 'system_design' || milestone.type === 'behavioral') && (
                                        <button 
                                          onClick={handleStartMock}
                                          className="text-xs font-bold text-white bg-white/5 hover:bg-white/10 px-3 py-1 rounded-md border border-white/10 shadow-sm flex items-center gap-1.5 transition-colors"
                                        >
                                          <PlayCircle className="w-3.5 h-3.5 text-accentPrimary" /> Start Mock Interview
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </GlassCard>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
