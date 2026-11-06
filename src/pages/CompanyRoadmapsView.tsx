import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import { GlassCard, SpotlightCard } from "../components/Common";
import { audioTelemetry } from "../lib/audioTelemetry";
import roadmapsData from "../data/roadmaps.json";
import { 
  ArrowRight, CheckCircle, Code2, 
  Clock, Lightbulb, Bot, ExternalLink, PlayCircle,
  Target, BookOpen, Cpu
} from "lucide-react";

export const CompanyRoadmapsView: React.FC<{ setActiveTab?: (tab: string) => void }> = ({ setActiveTab }) => {
  const { state, openChatWithPrompt } = useAppState();
  
  const catalogRoadmaps: any[] = roadmapsData;
  const activeRoadmaps = state.activeRoadmaps || [];
  
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);

  const getRoadmapDisplay = (segments: any) => {
    const activeData = activeRoadmaps.find(r => r.id === segments.id);
    return activeData || { ...segments, isEnrolled: false, progress: 0 };
  };

  const selectedRoadmap = selectedRoadmapId 
    ? getRoadmapDisplay(catalogRoadmaps.find(r => r.id === selectedRoadmapId)!)
    : null;

  const handleAskMentor = () => {
    if (openChatWithPrompt && selectedRoadmap) {
      openChatWithPrompt(`I am preparing for a ${selectedRoadmap.companyName} interview. Give me some specific tips and behavioral round strategies based on their core values.`);
    }
    if (setActiveTab) setActiveTab("aichat");
  };

  const handleStartMock = () => {
    if (selectedRoadmap) {
      const topTopic = selectedRoadmap.frequentlyAskedTopics?.[0] || "Any";
      localStorage.setItem("mock_interview_topic", topTopic);
      localStorage.setItem("mock_interview_company", selectedRoadmap.companyName);
    }
    if (setActiveTab) setActiveTab("interview");
  };

  const handleSolveQuestions = () => {
    if (selectedRoadmap) {
      const topTopic = selectedRoadmap.frequentlyAskedTopics?.[0] || "";
      localStorage.setItem("dsa_filter_query", topTopic);
    }
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
            const segments = getRoadmapDisplay(rawRoadmap);
            return (
              <SpotlightCard
                key={segments.id}
                className="relative group overflow-hidden flex flex-col h-full cursor-pointer hover:border-accentPrimary/40 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.15)]"
                onClick={() => {
                  audioTelemetry.click();
                  setSelectedRoadmapId(segments.id);
                }}
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <img src={segments.logoUrl} alt={segments.companyName} className="h-8 object-contain bg-white rounded-md p-1 opacity-90 shadow-sm" />
                    {segments.isEnrolled ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Enrolled
                      </span>
                    ) : (
                      <div className="flex gap-1 text-[10px] font-mono">
                         {segments.difficulty && (
                           <span className={`px-2 py-1 rounded-md border ${
                             segments.difficulty === 'Hard' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                             segments.difficulty === 'Extreme' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                             'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                           }`}>
                             {segments.difficulty}
                           </span>
                         )}
                         {segments.estimatedTime && (
                           <span className="px-2 py-1 bg-white/[0.05] border border-white/[0.1] text-slate-300 rounded-md flex items-center gap-1">
                             <Clock className="w-3 h-3" /> {segments.estimatedTime}
                           </span>
                         )}
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accentPrimary transition-colors">{segments.companyName}</h3>
                  <p className="text-xs text-slate-400 line-clamp-3 mb-4">{segments.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {segments.focusAreas?.slice(0, 3).map((area: string) => (
                      <span key={area} className="text-[9px] font-mono text-slate-300 bg-white/[0.05] px-2 py-1 rounded border border-white/[0.05]">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-white/[0.06] pt-4">
                  <button 
                    className="w-full py-2.5 bg-black/40 shadow-inner hover:bg-accentPrimary/15 border border-white/[0.06] hover:border-accentPrimary/40 rounded-lg text-xs font-semibold text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                  >
                    View Curriculum <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </SpotlightCard>
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
                  {selectedRoadmap.interviewRounds.map((round: string, idx: number) => (
                    <React.Fragment key={idx}>
                      <span className="text-xs font-bold text-slate-300">{round}</span>
                      {idx < selectedRoadmap.interviewRounds.length - 1 && <ArrowRight className="w-3 h-3 text-slate-600" />}
                    </React.Fragment>
                  ))}
                </div>
              )}
              
              <div className="flex flex-wrap gap-3">
                <button onClick={handleStartMock} className="px-5 py-2.5 bg-accentPrimary text-black font-bold rounded-lg text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(var(--color-accent-primary),0.3)]">
                  <PlayCircle className="w-4 h-4" /> Start Mock Interview
                </button>
                <button onClick={handleSolveQuestions} className="px-5 py-2.5 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] text-white font-semibold rounded-lg text-sm flex items-center gap-2 transition-all">
                  <Code2 className="w-4 h-4 text-accentPrimary" /> Solve Top Questions
                </button>
                <button onClick={handleAskMentor} className="px-5 py-2.5 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] text-white font-semibold rounded-lg text-sm flex items-center gap-2 transition-all">
                  <Bot className="w-4 h-4 text-accentPrimary" /> Ask AI Mentor
                </button>
              </div>
            </div>
          </GlassCard>

          {/* New Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2 p-6 flex flex-col h-full border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-4 text-white font-bold">
                <Lightbulb className="w-5 h-5 text-accentPrimary" />
                <h3>Company Specific Advice</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                {selectedRoadmap.companySpecificAdvice || "No specific advice available for this company yet. Focus on core Computer Science fundamentals and Data Structures."}
              </p>

              <div className="flex items-center gap-2 mb-4 text-white font-bold mt-4">
                <Target className="w-5 h-5 text-emerald-400" />
                <h3>Frequently Asked Topics</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedRoadmap.frequentlyAskedTopics?.map((topic: string) => (
                  <span key={topic} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-md text-xs font-semibold">
                    {topic}
                  </span>
                )) || <span className="text-sm text-slate-500">Topics data unavailable</span>}
              </div>
            </GlassCard>

            <GlassCard className="p-6 flex flex-col h-full border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-4 text-white font-bold">
                <Cpu className="w-5 h-5 text-amber-400" />
                <h3>Core Subjects Weightage</h3>
              </div>
              <div className="space-y-3 mb-6">
                {selectedRoadmap.coreSubjectsFocus ? (
                  Object.entries(selectedRoadmap.coreSubjectsFocus).map(([subject, weight]) => (
                    <div key={subject} className="flex justify-between items-center text-sm border-b border-white/[0.02] pb-2 last:border-0 last:pb-0">
                      <span className="text-slate-300 font-medium">{subject}</span>
                      <span className={`font-mono font-bold ${
                        weight === 'High' ? 'text-rose-400' :
                        weight === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>{weight as string}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">Weightage data unavailable</span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-4 text-white font-bold mt-auto pt-4 border-t border-white/[0.04]">
                <BookOpen className="w-5 h-5 text-sky-400" />
                <h3>Helpful Resources</h3>
              </div>
              <div className="space-y-2">
                {selectedRoadmap.resources?.map((res: any, idx: number) => (
                  <a key={idx} href={res.url} target="_blank" rel="noreferrer" className="flex items-center justify-between text-xs p-2 rounded hover:bg-white/[0.05] border border-transparent hover:border-white/[0.1] text-slate-400 hover:text-white transition-all group">
                    <span className="truncate pr-2">{res.title}</span>
                    <ExternalLink className="w-3 h-3 text-sky-400 opacity-50 group-hover:opacity-100 shrink-0" />
                  </a>
                )) || <span className="text-sm text-slate-500">Resources unavailable</span>}
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </motion.div>
  );
};
