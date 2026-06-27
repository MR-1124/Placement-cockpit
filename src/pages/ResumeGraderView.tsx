import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import { GlassCard } from "../components/Common";
import { ResumeParser } from "../components/ResumeParser";
import { nvidiaFetch } from "../lib/nvidiaApi";
import { Search, Loader2, Star, AlertTriangle, FileText, CheckCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const ResumeGraderView: React.FC = () => {
  const { state } = useAppState();
  
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  
  const [isGrading, setIsGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGradeResume = async () => {
    if (!resumeText) {
      setError("Please upload or paste a resume first.");
      return;
    }
    if (!state.sessionNvidiaKey) {
      setError("NVIDIA API key is required. Please unlock it in Settings.");
      return;
    }

    setIsGrading(true);
    setError(null);
    setGradeResult(null);

    const systemPrompt = `You are an expert Applicant Tracking System (ATS) and Senior Technical Recruiter at a FAANG company.
Your job is to evaluate the provided resume text for the role of "${targetRole}".

Output a structured markdown report with EXACTLY these sections:
### ATS Score: [Score out of 100]
(Provide a brief 1-2 sentence summary of why this score was given)

### 🔴 Missing Keywords
(List 3-5 critical technical or behavioral keywords missing for a ${targetRole})

### ⚠️ Formatting & Impact Issues
(List any issues with measurable metrics, vague bullet points, or parseability)

### ✨ Rewrite Suggestions
(Provide 2-3 specific "Before" and "After" examples for bullet points to increase impact)

Keep the response concise, punchy, and highly actionable. DO NOT add conversational filler.`;

    try {
      const response = await nvidiaFetch({
        apiKey: state.sessionNvidiaKey,
        modelName: state.settings.nvidiaModelName,
        temperature: 0.2, // Low temperature for consistent grading
        maxTokens: 1000,
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
      setGradeResult(data.choices[0].message.content);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while analyzing the resume.");
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-500">Career Tool</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">AI Resume ATS Grader</h1>
          <p className="text-sm text-slate-400 mt-1">
            Simulate a FAANG Applicant Tracking System to find missing keywords and impact metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Input */}
        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" /> Analysis Configuration
            </h3>
            
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-500 block mb-2">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Frontend Developer, Data Scientist..."
                className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-lg py-2 px-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>
            
            <div className="pt-2">
              <ResumeParser 
                resumeText={resumeText}
                setResumeText={setResumeText}
                resumeFileName={resumeFileName}
                setResumeFileName={setResumeFileName}
                title="Resume Input"
                description="Upload a PDF or paste text. Files are processed locally and text is only sent for grading. Files are NOT saved."
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
                Analyzing against {targetRole} requirements...
              </>
            ) : (
              <>
                <Star className="w-5 h-5" />
                Analyze Resume
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

        {/* Right Side: Results */}
        <div className="space-y-6">
          <GlassCard className="h-full min-h-[500px]">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2 mb-6">
              <FileText className="w-4 h-4 text-slate-400" /> ATS Report
            </h3>
            
            {isGrading ? (
              <div className="flex flex-col items-center justify-center h-64 opacity-60">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-accentPrimary/30 rounded-full animate-ping absolute inset-0" />
                  <div className="w-16 h-16 border-4 border-accentPrimary rounded-full border-t-transparent animate-spin" />
                </div>
                <p className="text-xs font-mono text-accentPrimary mt-6 uppercase tracking-widest">Scanning Keywords...</p>
              </div>
            ) : gradeResult ? (
              <div className="prose prose-invert prose-sm max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight 
                prose-h3:text-lg prose-h3:text-white prose-h3:border-b prose-h3:border-white/[0.06] prose-h3:pb-2 prose-h3:mt-6 prose-h3:mb-4
                prose-p:text-slate-300 prose-p:leading-relaxed 
                prose-li:text-slate-300 prose-li:marker:text-accentPrimary
                prose-strong:text-emerald-400">
                <ReactMarkdown>{gradeResult}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-center px-6">
                <CheckCircle className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-medium">Upload a resume and click Analyze to see your ATS compatibility report.</p>
                <p className="text-xs mt-2 opacity-60">The AI will check for keywords, impact metrics, and action verbs.</p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
};
