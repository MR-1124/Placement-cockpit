import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import { GlassCard } from "../components/Common";
import { ResumeParser } from "../components/ResumeParser";
import { nvidiaFetch } from "../lib/nvidiaApi";
import { 
  Search, Loader2, Star, AlertTriangle, FileText, CheckCircle, 
  XCircle, Zap, Target, Award, List
} from "lucide-react";

interface AtsReport {
  score: number;
  summary: string;
  foundKeywords: string[];
  missingKeywords: string[];
  impactIssues: { original: string; fixed: string; reason: string }[];
  formattingIssues: string[];
}

export const ResumeGraderView: React.FC = () => {
  const { state } = useAppState();
  
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Entry Level / New Grad");
  
  const [isGrading, setIsGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState<AtsReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "impact" | "formatting">("overview");

  const handleGradeResume = async () => {
    if (!resumeText) {
      setError("Please upload or paste a resume first.");
      return;
    }
    if (!state.sessionNvidiaKey) {
      setError("NVIDIA API key is required. Please configure it in Settings.");
      return;
    }

    setIsGrading(true);
    setError(null);
    setGradeResult(null);
    setActiveTab("overview");

    const systemPrompt = `You are an expert Applicant Tracking System (ATS) and Senior Technical Recruiter at a FAANG company.
Your job is to evaluate the provided resume text for the role of "${targetRole}" at the "${experienceLevel}" level.

You MUST respond with ONLY a valid JSON object matching this exact structure, with no markdown code blocks or conversational filler outside the JSON.
{
  "score": number (0-100 ATS match score),
  "summary": "2-3 sentences summarizing the overall strength and major weaknesses",
  "foundKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["missing1", "missing2"],
  "impactIssues": [
    {
      "original": "original weak bullet point",
      "fixed": "rewritten bullet point with quantifiable metrics and action verbs",
      "reason": "why this is better"
    }
  ],
  "formattingIssues": ["issue 1", "issue 2"]
}`;

    try {
      const response = await nvidiaFetch({
        apiKey: state.sessionNvidiaKey,
        modelName: state.settings.nvidiaModelName,
        temperature: 0.1, // Very low temp for strict JSON adherence
        maxTokens: 2000,
        stream: false,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `RESUME TEXT:\n\n${resumeText}` }
        ]
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const rawText = data.choices[0].message.content;
      
      // Attempt to extract JSON if it was wrapped in markdown
      let jsonText = rawText;
      const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonText = jsonMatch[1];
      }

      try {
        const parsed: AtsReport = JSON.parse(jsonText);
        setGradeResult(parsed);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Raw output:", rawText);
        throw new Error("Failed to parse ATS report data. The AI did not return valid JSON.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while analyzing the resume.");
    } finally {
      setIsGrading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-rose-400";
  };
  
  const getScoreStroke = (score: number) => {
    if (score >= 80) return "#34d399"; // emerald-400
    if (score >= 60) return "#fbbf24"; // amber-400
    return "#fb7185"; // rose-400
  };

  const renderTabs = () => {
    const tabs = [
      { id: "overview", label: "Overview", icon: Target },
      { id: "keywords", label: "Keywords", icon: Search },
      { id: "impact", label: "Impact Fixes", icon: Zap },
      { id: "formatting", label: "Formatting", icon: List },
    ] as const;

    return (
      <div className="flex overflow-x-auto gap-2 mb-6 border-b border-white/[0.06] pb-2 hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
              activeTab === tab.id 
                ? "bg-white/10 text-white" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-500">Career Tool</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">AI Resume ATS Grader</h1>
          <p className="text-sm text-slate-400 mt-1">
            Simulate a FAANG Applicant Tracking System to find missing keywords and impact metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Input (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" /> Analysis Config
            </h3>
            
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-500 block mb-2">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-lg py-2 px-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-500 block mb-2">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-lg py-2 px-3 text-sm text-white focus:outline-none transition-colors appearance-none"
              >
                <option>Entry Level / New Grad</option>
                <option>Junior (1-3 yrs)</option>
                <option>Mid-Level (3-5 yrs)</option>
                <option>Senior (5+ yrs)</option>
              </select>
            </div>
            
            <div className="pt-2">
              <ResumeParser 
                resumeText={resumeText}
                setResumeText={setResumeText}
                resumeFileName={resumeFileName}
                setResumeFileName={setResumeFileName}
                title="Resume Input"
                description="Upload PDF or paste text. Processed locally."
              />
            </div>
          </GlassCard>

          <button
            onClick={handleGradeResume}
            disabled={isGrading || !resumeText}
            className="w-full px-6 py-4 bg-accentPrimary hover:bg-accentPrimary/90 text-white rounded-xl font-bold shadow-lg shadow-accentPrimary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isGrading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Star className="w-5 h-5" />
                Scan Resume
              </>
            )}
          </button>
          
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-4 rounded-lg flex gap-2 items-start">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Right Side: Results (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <GlassCard className="h-full min-h-[500px]">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-slate-400" /> ATS Report Details
            </h3>
            
            {isGrading ? (
              <div className="flex flex-col items-center justify-center h-[400px] opacity-60">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-accentPrimary/30 rounded-full animate-ping absolute inset-0" />
                  <div className="w-16 h-16 border-4 border-accentPrimary rounded-full border-t-transparent animate-spin" />
                </div>
                <p className="text-xs font-mono text-accentPrimary mt-6 uppercase tracking-widest">Parsing Structure & Metrics...</p>
              </div>
            ) : gradeResult ? (
              <div>
                {renderTabs()}
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "overview" && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-8 bg-black/30 p-6 rounded-xl border border-white/5">
                          <div className="relative w-24 h-24 shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/10" />
                              <circle 
                                cx="50" cy="50" r="45" fill="none" 
                                stroke={getScoreStroke(gradeResult.score)} 
                                strokeWidth="8" 
                                strokeDasharray={`${2 * Math.PI * 45}`} 
                                strokeDashoffset={`${2 * Math.PI * 45 * (1 - gradeResult.score / 100)}`}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out" 
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                              <span className={`text-2xl font-bold ${getScoreColor(gradeResult.score)}`}>{gradeResult.score}</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-white mb-2">Overall Match Score</h4>
                            <p className="text-slate-300 text-sm leading-relaxed">{gradeResult.summary}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-rose-400 mb-2">
                              <XCircle className="w-5 h-5" />
                              <span className="font-bold">Missing Core Keywords</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{gradeResult.missingKeywords.length}</p>
                          </div>
                          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-amber-400 mb-2">
                              <AlertTriangle className="w-5 h-5" />
                              <span className="font-bold">Impact Weaknesses</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{gradeResult.impactIssues.length}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "keywords" && (
                      <div className="space-y-8">
                        <div>
                          <h4 className="flex items-center gap-2 text-emerald-400 font-bold mb-4">
                            <CheckCircle className="w-5 h-5" /> Found Keywords
                          </h4>
                          {gradeResult.foundKeywords.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {gradeResult.foundKeywords.map((kw, i) => (
                                <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-full">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-400 italic">No significant matching keywords found.</p>
                          )}
                        </div>
                        
                        <div className="h-px bg-white/5" />

                        <div>
                          <h4 className="flex items-center gap-2 text-rose-400 font-bold mb-4">
                            <XCircle className="w-5 h-5" /> Missing Keywords
                          </h4>
                          {gradeResult.missingKeywords.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {gradeResult.missingKeywords.map((kw, i) => (
                                <span key={i} className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-full">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-400 italic">Excellent! No major keywords missing.</p>
                          )}
                          <p className="text-xs text-slate-500 mt-4">Add these naturally to your experience or skills section to bypass ATS filters.</p>
                        </div>
                      </div>
                    )}

                    {activeTab === "impact" && (
                      <div className="space-y-4">
                        {gradeResult.impactIssues.length > 0 ? (
                          gradeResult.impactIssues.map((issue, i) => (
                            <div key={i} className="bg-black/30 border border-white/10 rounded-xl overflow-hidden">
                              <div className="p-4 bg-rose-500/5 border-b border-white/5">
                                <span className="text-[10px] uppercase font-mono text-rose-400 mb-1 block">Before (Weak)</span>
                                <p className="text-sm text-slate-300">"{issue.original}"</p>
                              </div>
                              <div className="p-4 bg-emerald-500/5 border-b border-white/5">
                                <span className="text-[10px] uppercase font-mono text-emerald-400 mb-1 block">After (Strong)</span>
                                <p className="text-sm text-white font-medium">"{issue.fixed}"</p>
                              </div>
                              <div className="p-3 bg-black/40 flex gap-2 items-start">
                                <Award className="w-4 h-4 text-accentPrimary shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-400">{issue.reason}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <CheckCircle className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
                            <p className="text-slate-300">All bullet points show strong impact and metrics.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "formatting" && (
                      <div className="space-y-3">
                        {gradeResult.formattingIssues.length > 0 ? (
                          gradeResult.formattingIssues.map((issue, i) => (
                            <div key={i} className="flex gap-3 bg-black/30 p-4 rounded-xl border border-white/5">
                              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                              <p className="text-sm text-slate-300 leading-relaxed">{issue}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <CheckCircle className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
                            <p className="text-slate-300">No major formatting or parseability issues detected.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-slate-500 text-center px-6">
                <CheckCircle className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-medium">Upload a resume and click Scan to generate an interactive JSON report.</p>
                <p className="text-xs mt-2 opacity-60 max-w-xs">The AI will extract keywords, rate impact, and suggest precise bullet point rewrites.</p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
};
