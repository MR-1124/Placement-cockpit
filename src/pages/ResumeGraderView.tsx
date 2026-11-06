import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import { SpotlightCard } from "../components/Common";
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
      
      rawText = rawText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      if (rawText.includes("```")) {
        const codeMatch = rawText.match(/```(?:json)?([\s\S]*?)```/);
        if (codeMatch && codeMatch[1]) {
          rawText = codeMatch[1].trim();
        }
      }
      
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
        saveAtsReport(report);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Raw output:", rawText);
        throw new Error("Failed to parse ATS report data. The AI did not return valid JSON.", { cause: parseError });
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
${gradeResult.missingKeywords.map(k => `- ${k}`).join('\n')}

## Found Keywords
${gradeResult.foundKeywords.map(k => `- ${k}`).join('\n')}

## Impact Improvements
${gradeResult.impactIssues.map(issue => `### Before\n> ${issue.original}\n\n### After\n> ${issue.fixed}\n\n*Why: ${issue.reason}*\n`).join('\n---\n')}
`;

    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ATS-Report-${gradeResult.role.replace(/\s+/g, '-')}.md`;
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
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#f43f5e";
  };

  const renderMiniGauge = (label: string, score: number) => (
    <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
      <div className="relative w-14 h-14">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
          <circle 
            cx="50" cy="50" r="42" fill="none" 
            stroke={getScoreStroke(score)} 
            strokeWidth="8" 
            strokeDasharray={`${2 * Math.PI * 42}`} 
            strokeDashoffset={`${2 * Math.PI * 42 * (1 - score / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out" 
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-mono font-bold ${getScoreColor(score)}`}>{score}</span>
        </div>
      </div>
      <span className="text-[10px] uppercase font-mono text-slate-400 text-center font-semibold">{label}</span>
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
      <div className="flex overflow-x-auto gap-2 mb-6 border-b border-white/[0.06] pb-2 custom-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === tab.id 
                ? "bg-accentPrimary/15 border border-accentPrimary/30 text-accentPrimary shadow-sm" 
                : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <SpotlightCard className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accentPrimary font-bold bg-accentPrimary/10 border border-accentPrimary/25 px-2.5 py-0.5 rounded-md">
                ATS Recruiter Engine
              </span>
              <span className="text-[10px] font-mono text-slate-500">• FAANG Heuristics</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">AI Resume ATS Grader</h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Simulate technical recruiter algorithms to detect missing keywords, quantify impact statements, and polish phrasing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white rounded-xl text-xs font-mono font-bold transition-all border border-white/[0.08] cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>Past Scans</span>
            </button>
            {gradeResult && (
              <button 
                onClick={downloadMarkdown}
                className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-xl text-xs font-mono font-bold transition-colors border border-emerald-500/30 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report</span>
              </button>
            )}
          </div>
        </div>
      </SpotlightCard>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Input (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <SpotlightCard className="p-6 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-accentPrimary" /> Target Criteria
            </h3>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Fullstack Engineer"
                className="w-full bg-darkCard/60 border border-white/[0.08] focus:border-accentPrimary rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">Tech Focus (Optional)</label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="e.g. React, Node.js, Go, Distributed Systems"
                className="w-full bg-darkCard/60 border border-white/[0.08] focus:border-accentPrimary rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full bg-darkCard/60 border border-white/[0.08] focus:border-accentPrimary rounded-xl py-2 px-3 text-xs text-white focus:outline-none transition-colors font-mono cursor-pointer"
              >
                <option>Entry Level / New Grad</option>
                <option>Junior (1-3 yrs)</option>
                <option>Mid-Level (3-5 yrs)</option>
                <option>Senior (5+ yrs)</option>
              </select>
            </div>
            
            <div className="pt-2 border-t border-white/[0.06] mt-4">
              <ResumeParser 
                resumeText={resumeText}
                setResumeText={setResumeText}
                resumeFileName={resumeFileName}
                setResumeFileName={setResumeFileName}
                title="Resume Input"
                description="Upload PDF or paste text. Evaluated in sandbox."
              />
            </div>
          </SpotlightCard>

          <button
            onClick={handleGradeResume}
            disabled={isGrading || !resumeText}
            className="w-full py-3.5 bg-accentPrimary hover:bg-accentPrimary/90 text-slate-950 rounded-xl font-bold font-mono text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isGrading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Evaluating Metrics...</span>
              </>
            ) : (
              <>
                <Star className="w-4 h-4 fill-current" />
                <span>Scan ATS Compatibility</span>
              </>
            )}
          </button>
          
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs p-4 rounded-xl flex gap-2.5 items-start">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Right Side: Results (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <SpotlightCard className="p-6 h-full min-h-[500px]">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-accentPrimary" /> Comprehensive Diagnostic Report
            </h3>
            
            {isGrading ? (
              <div className="flex flex-col items-center justify-center h-[400px]">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-accentPrimary/20 rounded-full animate-ping absolute inset-0" />
                  <div className="w-16 h-16 border-4 border-accentPrimary rounded-full border-t-transparent animate-spin" />
                </div>
                <p className="text-xs font-mono text-accentPrimary mt-6 uppercase tracking-widest animate-pulse font-bold">
                  Extracting Keywords & Action Verbs...
                </p>
              </div>
            ) : gradeResult ? (
              <div>
                {renderTabs()}
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    {activeTab === "overview" && (
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row items-center gap-6 bg-white/[0.02] p-6 rounded-2xl border border-white/[0.05]">
                          <div className="relative w-28 h-28 shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                              <circle 
                                cx="50" cy="50" r="42" fill="none" 
                                stroke={getScoreStroke(gradeResult.scores.overall)} 
                                strokeWidth="8" 
                                strokeDasharray={`${2 * Math.PI * 42}`} 
                                strokeDashoffset={`${2 * Math.PI * 42 * (1 - gradeResult.scores.overall / 100)}`}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out" 
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                              <span className={`text-3xl font-extrabold font-mono ${getScoreColor(gradeResult.scores.overall)}`}>
                                {gradeResult.scores.overall}
                              </span>
                              <span className="text-[9px] font-mono text-slate-500 uppercase">Match</span>
                            </div>
                          </div>
                          <div className="space-y-2 text-center sm:text-left">
                            <h4 className="text-lg font-bold text-white">Overall ATS Alignment</h4>
                            <p className="text-slate-300 text-xs leading-relaxed">{gradeResult.summary}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {renderMiniGauge("Keywords", gradeResult.scores.keywords)}
                          {renderMiniGauge("Impact", gradeResult.scores.impact)}
                          {renderMiniGauge("Clarity", gradeResult.scores.clarity)}
                          {renderMiniGauge("Action Verbs", gradeResult.scores.verbs)}
                        </div>
                      </div>
                    )}

                    {activeTab === "keywords" && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase font-mono mb-3">
                            <XCircle className="w-4 h-4" /> Missing Keywords
                          </h4>
                          {gradeResult.missingKeywords.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {gradeResult.missingKeywords.map((kw, i) => (
                                <span key={i} className="px-3 py-1 bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs rounded-lg font-mono">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic font-mono">Clean! No critical keywords missing.</p>
                          )}
                          <p className="text-[10px] text-slate-500 font-mono mt-3">Integrate these technical keywords naturally into project descriptions.</p>
                        </div>
                        
                        <div className="h-px bg-white/[0.06]" />

                        <div>
                          <h4 className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase font-mono mb-3">
                            <CheckCircle className="w-4 h-4" /> Found Matched Keywords
                          </h4>
                          {gradeResult.foundKeywords.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {gradeResult.foundKeywords.map((kw, i) => (
                                <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs rounded-lg font-mono">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic font-mono">No matching domain keywords found.</p>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === "impact" && (
                      <div className="space-y-4">
                        {gradeResult.impactIssues.length > 0 ? (
                          gradeResult.impactIssues.map((issue, i) => (
                            <div key={i} className="bg-white/[0.015] border border-white/[0.06] rounded-2xl overflow-hidden">
                              <div className="p-3.5 bg-rose-500/5 border-b border-white/[0.04]">
                                <span className="text-[9px] uppercase font-mono text-rose-400 mb-1 block font-bold">Original Bullet (Passive / Non-Quantified)</span>
                                <p className="text-xs text-slate-300 italic">"{issue.original}"</p>
                              </div>
                              <div className="p-3.5 bg-emerald-500/5 border-b border-white/[0.04]">
                                <span className="text-[9px] uppercase font-mono text-emerald-400 mb-1 block font-bold">Suggested Rewrite (Active + Metrics)</span>
                                <p className="text-xs text-white font-medium">"{issue.fixed}"</p>
                              </div>
                              <div className="p-3 bg-black/30 flex gap-2 items-start text-xs text-slate-400 font-mono">
                                <Award className="w-3.5 h-3.5 text-accentPrimary shrink-0 mt-0.5" />
                                <p className="text-[11px]">{issue.reason}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 space-y-2">
                            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                            <p className="text-slate-300 text-xs font-mono">All bullet points show quantifiable metrics and strong agency.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "formatting" && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-rose-500/5 border border-rose-500/20 p-4 rounded-2xl space-y-2">
                            <h5 className="text-[10px] uppercase font-mono text-rose-400 font-bold">Weak Action Verbs</h5>
                            <div className="flex flex-wrap gap-1.5">
                              {gradeResult.actionVerbs.weak.length > 0 ? gradeResult.actionVerbs.weak.map((v, i) => (
                                <span key={i} className="px-2.5 py-1 bg-black/40 text-rose-300 text-xs rounded-lg font-mono">{v}</span>
                              )) : <span className="text-xs text-slate-500 font-mono">None detected</span>}
                            </div>
                          </div>
                          <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl space-y-2">
                            <h5 className="text-[10px] uppercase font-mono text-emerald-400 font-bold">Strong Power Verbs</h5>
                            <div className="flex flex-wrap gap-1.5">
                              {gradeResult.actionVerbs.strong.length > 0 ? gradeResult.actionVerbs.strong.map((v, i) => (
                                <span key={i} className="px-2.5 py-1 bg-black/40 text-emerald-300 text-xs rounded-lg font-mono">{v}</span>
                              )) : <span className="text-xs text-slate-500 font-mono">None detected</span>}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Formatting & Parseability</h4>
                          {gradeResult.formattingIssues.length > 0 ? (
                            gradeResult.formattingIssues.map((issue, i) => (
                              <div key={i} className="flex gap-3 bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.05] text-xs text-slate-300 items-start">
                                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <p>{issue}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-400 text-xs font-mono">No parseability or format issues detected.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[380px] text-slate-500 text-center px-6 space-y-3">
                <CheckCircle className="w-12 h-12 text-slate-700" />
                <p className="text-xs font-medium text-slate-400 font-mono">Upload a resume and trigger ATS scan to generate structured feedback.</p>
              </div>
            )}
          </SpotlightCard>
        </div>
      </div>
      
      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
            <SpotlightCard className="w-full max-w-2xl border border-white/[0.12] shadow-2xl p-6 flex flex-col max-h-[80vh]">
              <div className="border-b border-white/[0.06] pb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase">
                  <History className="w-4 h-4 text-accentPrimary" /> Previous Resume Scans
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg border border-white/[0.08] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="py-4 overflow-y-auto space-y-3 custom-scrollbar">
                {(!state.atsReports || state.atsReports.length === 0) ? (
                  <p className="text-center text-slate-500 py-8 text-xs font-mono">No saved scans found.</p>
                ) : (
                  state.atsReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.05] p-3.5 rounded-xl hover:border-white/[0.1] transition-all">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`text-base font-bold font-mono ${getScoreColor(report.scores.overall)}`}>
                            {report.scores.overall}
                          </span>
                          <span className="text-white text-xs font-semibold">{report.role}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                          <span>{new Date(report.timestamp).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{report.level}</span>
                          {report.focus && (
                            <>
                              <span>•</span>
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
                        className="px-3.5 py-1.5 bg-accentPrimary/15 hover:bg-accentPrimary/25 text-accentPrimary border border-accentPrimary/30 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </div>
                  ))
                )}
              </div>
            </SpotlightCard>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
