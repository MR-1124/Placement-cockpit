import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import { GlassCard } from "../components/Common";
import { ResumeParser } from "../components/ResumeParser";
import { nvidiaFetch } from "../lib/nvidiaApi";
import { 
  Search, Loader2, Star, AlertTriangle, FileText, CheckCircle, 
  XCircle, Zap, Target, Award, List, History, Download, X
} from "lucide-react";
import type { AtsReport } from "../types/AppTypes";

export const ResumeGraderView: React.FC = () => {
  const { state, saveAtsReport } = useAppState();
  
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Entry Level / New Grad");
  const [techStack, setTechStack] = useState("");
  
  const [isGrading, setIsGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState<AtsReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "impact" | "formatting">("overview");
  
  const [showHistory, setShowHistory] = useState(false);

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
The candidate specifically focuses on the following tech stack / domain: "${techStack || 'General'}".

You MUST respond with ONLY a valid JSON object matching this exact structure, with no markdown code blocks or conversational filler outside the JSON.
{
  "scores": {
    "overall": number (0-100),
    "keywords": number (0-100),
    "impact": number (0-100),
    "clarity": number (0-100),
    "verbs": number (0-100)
  },
  "summary": "2-3 sentences summarizing the overall strength and major weaknesses",
  "foundKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["missing1", "missing2"],
  "actionVerbs": {
    "strong": ["Engineered", "Architected", "Spearheaded"],
    "weak": ["Helped", "Worked", "Responsible"]
  },
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
        temperature: 0.1, 
        maxTokens: 3000,
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
      let rawText = data.choices[0].message.content;
      
      // Remove <think> blocks first
      rawText = rawText.replace(/<think>[\s\S]*?<\/think>/g, '');
      
      const startIdx = rawText.indexOf('{');
      const endIdx = rawText.lastIndexOf('}');
      
      if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
        throw new Error("Could not find a valid JSON object in the AI response.");
      }
      
      const jsonText = rawText.substring(startIdx, endIdx + 1);

      try {
        const parsed = JSON.parse(jsonText);
        
        const report: AtsReport = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          role: targetRole,
          level: experienceLevel,
          focus: techStack,
          ...parsed
        };
        
        setGradeResult(report);
        saveAtsReport(report); // Save to history
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

  const downloadMarkdown = () => {
    if (!gradeResult) return;
    
    const mdContent = `# ATS Report for ${gradeResult.role}
**Date:** ${new Date(gradeResult.timestamp).toLocaleDateString()}
**Level:** ${gradeResult.level}
**Tech Stack Focus:** ${gradeResult.focus || 'General'}

## Scores
- **Overall Match:** ${gradeResult.scores.overall}/100
- **Keywords:** ${gradeResult.scores.keywords}/100
- **Impact & Metrics:** ${gradeResult.scores.impact}/100
- **Clarity & Formatting:** ${gradeResult.scores.clarity}/100
- **Action Verbs:** ${gradeResult.scores.verbs}/100

## Summary
${gradeResult.summary}

## Missing Keywords
${gradeResult.missingKeywords.map(k => `- [ ] ${k}`).join('\n')}

## Found Keywords
${gradeResult.foundKeywords.map(k => `- [x] ${k}`).join('\n')}

## Weak vs Strong Action Verbs
**Strong Verbs Found:** ${gradeResult.actionVerbs.strong.join(', ')}
**Weak Verbs Found:** ${gradeResult.actionVerbs.weak.join(', ')}

## Impact & Bullet Point Rewrites
${gradeResult.impactIssues.map(i => `
### Weak Bullet Point:
> ${i.original}
### Strong Rewrite:
> ${i.fixed}
*Reason:* ${i.reason}
`).join('\n')}

## Formatting Issues
${gradeResult.formattingIssues.map(i => `- ${i}`).join('\n')}
`;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ATS_Report_${gradeResult.role.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-rose-400";
  };
  
  const getScoreStroke = (score: number) => {
    if (score >= 80) return "#34d399";
    if (score >= 60) return "#fbbf24";
    return "#fb7185";
  };

  const renderMiniGauge = (label: string, score: number) => (
    <div className="flex flex-col items-center bg-black/20 p-4 rounded-xl border border-white/5">
      <div className="relative w-16 h-16 shrink-0 mb-3">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
          <circle 
            cx="50" cy="50" r="45" fill="none" 
            stroke={getScoreStroke(score)} 
            strokeWidth="8" 
            strokeDasharray={`${2 * Math.PI * 45}`} 
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - score / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out" 
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}</span>
        </div>
      </div>
      <span className="text-[10px] uppercase font-mono text-slate-400 text-center">{label}</span>
    </div>
  );

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
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">AI Resume ATS Grader V3</h1>
          <p className="text-sm text-slate-400 mt-1">
            Simulate a FAANG Applicant Tracking System to find missing keywords, evaluate action verbs, and fix impact.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-white/10 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-white/[0.08]"
          >
            <History className="w-4 h-4" />
            Past Scans
          </button>
          {gradeResult && (
            <button 
              onClick={downloadMarkdown}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-sm font-medium transition-colors border border-emerald-500/20"
            >
              <Download className="w-4 h-4" />
              Export .md
            </button>
          )}
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
              <label className="text-[10px] uppercase font-mono text-slate-500 block mb-2">Tech Stack / Focus (Optional)</label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="e.g. MERN, AWS, Python"
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
            
            <div className="pt-2 border-t border-white/5 mt-4">
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
                          <div className="relative w-28 h-28 shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/10" />
                              <circle 
                                cx="50" cy="50" r="45" fill="none" 
                                stroke={getScoreStroke(gradeResult.scores.overall)} 
                                strokeWidth="8" 
                                strokeDasharray={`${2 * Math.PI * 45}`} 
                                strokeDashoffset={`${2 * Math.PI * 45 * (1 - gradeResult.scores.overall / 100)}`}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out" 
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                              <span className={`text-3xl font-extrabold ${getScoreColor(gradeResult.scores.overall)}`}>{gradeResult.scores.overall}</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-white mb-2">Overall ATS Match</h4>
                            <p className="text-slate-300 text-sm leading-relaxed">{gradeResult.summary}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4">
                          {renderMiniGauge("Keywords", gradeResult.scores.keywords)}
                          {renderMiniGauge("Impact", gradeResult.scores.impact)}
                          {renderMiniGauge("Clarity", gradeResult.scores.clarity)}
                          {renderMiniGauge("Verbs", gradeResult.scores.verbs)}
                        </div>
                      </div>
                    )}

                    {activeTab === "keywords" && (
                      <div className="space-y-8">
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
                          <p className="text-xs text-slate-500 mt-4">Add these naturally to bypass ATS filters.</p>
                        </div>
                        
                        <div className="h-px bg-white/5" />

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
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
                            <h5 className="text-[10px] uppercase font-mono text-rose-400 mb-2">Weak Verbs Used</h5>
                            <div className="flex flex-wrap gap-2">
                              {gradeResult.actionVerbs.weak.length > 0 ? gradeResult.actionVerbs.weak.map((v, i) => (
                                <span key={i} className="px-2 py-1 bg-black/30 text-rose-200 text-xs rounded">{v}</span>
                              )) : <span className="text-xs text-slate-400">None found</span>}
                            </div>
                           </div>
                           <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                            <h5 className="text-[10px] uppercase font-mono text-emerald-400 mb-2">Strong Verbs Used</h5>
                            <div className="flex flex-wrap gap-2">
                              {gradeResult.actionVerbs.strong.length > 0 ? gradeResult.actionVerbs.strong.map((v, i) => (
                                <span key={i} className="px-2 py-1 bg-black/30 text-emerald-200 text-xs rounded">{v}</span>
                              )) : <span className="text-xs text-slate-400">None found</span>}
                            </div>
                           </div>
                        </div>

                        <h4 className="text-sm font-bold text-white mb-2 pt-4 border-t border-white/5">Parseability Issues</h4>
                        <div className="space-y-3">
                          {gradeResult.formattingIssues.length > 0 ? (
                            gradeResult.formattingIssues.map((issue, i) => (
                              <div key={i} className="flex gap-3 bg-black/30 p-4 rounded-xl border border-white/5">
                                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                                <p className="text-sm text-slate-300 leading-relaxed">{issue}</p>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-slate-400 text-sm">No major formatting or parseability issues detected.</p>
                            </div>
                          )}
                        </div>
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
      
      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-dark/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-accentPrimary" /> Scan History
                </h3>
                <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-4">
                {(!state.atsReports || state.atsReports.length === 0) ? (
                  <p className="text-center text-slate-500 py-8 text-sm">No past scans found.</p>
                ) : (
                  state.atsReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between bg-black/40 border border-white/5 p-4 rounded-xl hover:border-white/10 transition-colors">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`text-lg font-bold ${getScoreColor(report.scores.overall)}`}>{report.scores.overall}</span>
                          <span className="text-white font-medium">{report.role}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{new Date(report.timestamp).toLocaleDateString()}</span>
                          <span>&bull;</span>
                          <span>{report.level}</span>
                          {report.focus && (
                            <>
                              <span>&bull;</span>
                              <span className="text-accentPrimary">{report.focus}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setGradeResult(report);
                          setShowHistory(false);
                        }}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        View
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
