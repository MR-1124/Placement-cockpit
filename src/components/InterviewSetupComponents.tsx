import React, { useState } from "react";
import { GlassCard } from "./Common";
import { useAppState } from "../context/AppStateContext";
import {
  Play,
  Trash2,
  Loader2,
  FileJson,
  CheckCircle,
  ClipboardList
} from "lucide-react";
import { getScoreColor } from "./InterviewScorecard";

let pdfJsLoadPromise: Promise<any> | null = null;

const loadPdfJs = (): Promise<any> => {
  if ((window as any).pdfjsLib) return Promise.resolve((window as any).pdfjsLib);
  if (pdfJsLoadPromise) return pdfJsLoadPromise;

  pdfJsLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
    script.async = true;
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
      resolve(pdfjsLib);
    };
    script.onerror = () => {
      pdfJsLoadPromise = null;
      reject(new Error("Failed to load PDF.js from CDN"));
    };
    document.body.appendChild(script);
  });
  return pdfJsLoadPromise;
};

const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  const pdfjsLib = await loadPdfJs();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(" ");
    text += pageText + "\n";
  }
  return text;
};

interface InterviewSetupPanelProps {
  onLaunch: (
    topic: string,
    difficulty: "Easy" | "Medium" | "Hard",
    personality: "Helpful Mentor" | "Quiet Observer" | "Strict Interviewer",
    problemDesc: string,
    resumeText: string,
    resumeFileName: string
  ) => void;
}

export const InterviewSetupPanel: React.FC<InterviewSetupPanelProps> = ({ onLaunch }) => {
  const { state, updateUserProfile } = useAppState();

  const [selectedTopic, setSelectedTopic] = useState<string>("Any");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [selectedPersonality, setSelectedPersonality] = useState<"Helpful Mentor" | "Quiet Observer" | "Strict Interviewer">("Helpful Mentor");
  const [warmupCheck1, setWarmupCheck1] = useState(false);
  const [warmupCheck2, setWarmupCheck2] = useState(false);
  
  const [tempIntro, setTempIntro] = useState(state.user?.savedIntro || "");
  const [resumeText, setResumeText] = useState(state.user?.resumeText || "");
  const [resumeFileName, setResumeFileName] = useState(state.user?.resumeFileName || "");
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const [showPasteArea, setShowPasteArea] = useState(false);

  const apiKey = state.settings.nvidiaApiKey || "";



  const handleSaveIntro = () => {
    updateUserProfile({ savedIntro: tempIntro });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingResume(true);
    setResumeError("");
    setResumeFileName(file.name);

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "txt" || ext === "md") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        setResumeText(text);
        setIsParsingResume(false);
      };
      reader.onerror = () => {
        setResumeError("Failed to read text file.");
        setIsParsingResume(false);
      };
      reader.readAsText(file);
    } else if (ext === "pdf") {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const buffer = evt.target?.result as ArrayBuffer;
          const text = await extractTextFromPdf(buffer);
          if (!text.trim()) {
            throw new Error("No text content found in PDF.");
          }
          setResumeText(text);
        } catch (err: any) {
          console.error("PDF parse failed", err);
          setResumeError("Automatic PDF parsing failed. Please paste resume text manually.");
          setShowPasteArea(true);
        } finally {
          setIsParsingResume(false);
        }
      };
      reader.onerror = () => {
        setResumeError("Failed to load PDF file bytes.");
        setIsParsingResume(false);
      };
      reader.readAsArrayBuffer(file);
    } else {
      setResumeError("Unsupported file type. Use .pdf, .txt, or .md. Or paste manually.");
      setIsParsingResume(false);
      setShowPasteArea(true);
    }
  };

  const handleClearResume = () => {
    setResumeText("");
    setResumeFileName("");
    setResumeError("");
  };

  const handleLaunchClicked = () => {
    if (!warmupCheck1 || !warmupCheck2) return;
    
    let problemDesc = "";
    try {
      const matchingProblems: { name: string; desc?: string; url?: string }[] = [];
      state.dsaTopics.forEach(t => {
        if (selectedTopic === "Any" || t.name.toLowerCase().includes(selectedTopic.toLowerCase())) {
          t.problems.forEach(p => {
            if (p.difficulty === selectedDifficulty) {
              matchingProblems.push({ name: p.name, url: p.url });
            }
          });
        }
      });

      if (matchingProblems.length > 0) {
        const picked = matchingProblems[Math.floor(Math.random() * matchingProblems.length)];
        problemDesc = `Problem Name: ${picked.name}\nDifficulty: ${selectedDifficulty}\nLeetcode Reference: ${picked.url || "N/A"}\n\nTask: Design an optimal solution. You must explain your time and space complexity before typing the code in the editor workspace.`;
      } else {
        problemDesc = `Problem Name: Kth Smallest Element in a Sorted Matrix\nDifficulty: Medium\n\nGiven an n x n matrix where each of the rows and columns is sorted in ascending order, return the kth smallest element in the matrix.\n\nNote that it is the kth smallest element in the sorted order, not the kth distinct element.\nYou must find a solution with a memory complexity better than O(n^2).`;
      }
    } catch (e) {
      problemDesc = "Failed to load problem statement. General coding interview initiated.";
    }

    onLaunch(selectedTopic, selectedDifficulty, selectedPersonality, problemDesc, resumeText, resumeFileName);
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-6 space-y-6">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Simulator Configuration</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-500 uppercase block">DSA Focus Area</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-lg py-2.5 px-3 text-xs text-slate-200 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="Any">Any (Randomized Challenge)</option>
              {state.dsaTopics.map(t => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-500 uppercase block">Interview Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {(["Easy", "Medium", "Hard"] as const).map(diff => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    selectedDifficulty === diff
                      ? "bg-accentPrimary/10 border-accentPrimary/30 text-white"
                      : "bg-black/35 border-transparent text-slate-500 hover:text-slate-350"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono text-slate-500 uppercase block">Interviewer Personality Profile</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "Helpful Mentor", title: "Helpful Mentor", desc: "Provides progressive hints & points out bugs gently." },
              { id: "Quiet Observer", title: "Quiet Observer", desc: "Speaks very little. Only answers specific questions." },
              { id: "Strict Interviewer", title: "Strict Interviewer", desc: "Interrupts with edge cases & strict complexity evaluations." }
            ].map(persona => (
              <button
                key={persona.id}
                type="button"
                onClick={() => setSelectedPersonality(persona.id as any)}
                className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer h-full ${
                  selectedPersonality === persona.id
                    ? "bg-accentPrimary/5 border-accentPrimary/30"
                    : "bg-black/20 border-white/[0.04] hover:border-white/[0.08]"
                }`}
              >
                <span className={`text-xs font-bold font-mono ${selectedPersonality === persona.id ? "text-white" : "text-slate-400"}`}>
                  {persona.title}
                </span>
                <span className="text-[10px] text-slate-500 leading-normal">
                  {persona.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <FileJson className="w-4 h-4 text-accentPrimary" /> Resume Upload & Parser
          </h3>
          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
            Upload your resume (.txt, .md, or .pdf) to let the AI Interviewer adapt questions to your experience and projects.
          </p>
        </div>

        {!resumeText ? (
          <div className="space-y-3">
            {!showPasteArea ? (
              <div className="relative border border-dashed border-white/[0.08] hover:border-accentPrimary/40 rounded-xl p-6 transition-colors group flex flex-col items-center justify-center gap-2 bg-black/10">
                <input
                  type="file"
                  accept=".pdf,.txt,.md"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isParsingResume}
                />
                {isParsingResume ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 text-accentPrimary animate-spin" />
                    <span className="text-[10px] text-slate-400 font-mono">Extracting text details...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-slate-400 group-hover:text-accentPrimary group-hover:border-accentPrimary/20 transition-all">
                      <ClipboardList className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] text-slate-355 group-hover:text-white transition-colors">
                      Drag & drop or Click to upload
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">Supports PDF, TXT, or MD</span>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-slate-500 uppercase block">Paste Plaintext / Markdown Resume</label>
                <textarea
                  placeholder="Paste your resume details (Work Experience, Skills, Education, Projects) here..."
                  rows={5}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-700 focus:outline-none transition-colors resize-none overflow-y-auto"
                />
              </div>
            )}

            {resumeError && (
              <p className="text-[10px] text-rose-400 leading-normal bg-rose-500/5 border border-rose-500/10 p-2 rounded-lg">
                {resumeError}
              </p>
            )}

            <div className="flex justify-between items-center pt-1">
              <button
                type="button"
                onClick={() => setShowPasteArea(!showPasteArea)}
                className="text-[10px] font-mono text-slate-400 hover:text-accentPrimary transition-colors cursor-pointer"
              >
                {showPasteArea ? "Use file uploader instead" : "Paste text manually"}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-2.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-bold text-white leading-none">Resume Loaded</span>
              </div>
              <button
                type="button"
                onClick={handleClearResume}
                className="text-[9px] font-mono text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
              >
                Clear Resume
              </button>
            </div>
            <div className="bg-black/30 border border-white/[0.04] p-2 rounded-lg max-h-[80px] overflow-y-auto font-mono text-[9px] text-slate-400 leading-normal scrollbar-thin select-text">
              {resumeFileName ? (
                <span className="font-bold text-slate-350 block mb-1">File: {resumeFileName}</span>
              ) : (
                <span className="font-bold text-slate-350 block mb-1">Source: Copied Text</span>
              )}
              {resumeText.slice(0, 300)}...
            </div>
          </div>
        )}
      </GlassCard>

      <GlassCard className="p-6 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Standard Candidate Pitch</h3>
          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
            Save your standard personal introduction, target project achievements, and technical stack details to quickly paste it during intro phases.
          </p>
        </div>
        <textarea
          value={tempIntro}
          onChange={(e) => setTempIntro(e.target.value)}
          placeholder="Hello! I am a final year Computer Science student. I build full stack applications using React and Node.js..."
          rows={4}
          className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-700 focus:outline-none transition-colors resize-none overflow-y-auto"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSaveIntro}
            className="px-4 py-1.5 rounded-lg bg-accentPrimary/15 hover:bg-accentPrimary/25 border border-accentPrimary/30 hover:border-accentPrimary/50 text-accentPrimary text-[11px] font-bold font-mono transition-all cursor-pointer"
          >
            Save Pitch Template
          </button>
        </div>
      </GlassCard>

      <GlassCard className="p-6 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Warmup Protocol Checklists</h3>
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={warmupCheck1}
              onChange={(e) => setWarmupCheck1(e.target.checked)}
              className="mt-0.5 rounded border-white/[0.08] bg-black/40 text-accentPrimary focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-350 group-hover:text-white transition-colors">I will explain my logic out loud</span>
              <p className="text-[10px] text-slate-500 leading-normal">Top engineering candidates explain their approaches, complexity targets, and logic tradeoffs before typing code.</p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={warmupCheck2}
              onChange={(e) => setWarmupCheck2(e.target.checked)}
              className="mt-0.5 rounded border-white/[0.08] bg-black/40 text-accentPrimary focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-350 group-hover:text-white transition-colors">I will test edge cases manually</span>
              <p className="text-[10px] text-slate-500 leading-normal">I will evaluate empty arrays, duplicate values, overflow thresholds, and boundary inputs in my logical descriptions.</p>
            </div>
          </label>
        </div>
        <button
          onClick={() => {
            if (!apiKey) {
              alert("Please configure your Gemini API Key in the Settings tab first.");
            } else {
              handleLaunchClicked();
            }
          }}
          disabled={!warmupCheck1 || !warmupCheck2}
          className="w-full h-11 bg-accentPrimary hover:bg-accentPrimary/90 disabled:bg-white/[0.02] text-white disabled:text-slate-600 border border-accentPrimary/20 disabled:border-transparent font-bold rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all shadow-lg shadow-accentPrimary/10 cursor-pointer text-xs disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{apiKey ? "Launch Timed Mock Interview Room" : "NVIDIA API Key Missing (Click to go to Settings)"}</span>
        </button>
      </GlassCard>
    </div>
  );
};

export const InterviewHistoryPanel: React.FC<{ onViewReport: (report: any) => void }> = ({ onViewReport }) => {
  const { state, confirmAction, deleteMockInterviewReport } = useAppState();

  return (
    <GlassCard className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <ClipboardList className="w-4 h-4 text-accentPrimary" />
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Past Interview History</h3>
      </div>

      {(!state.mockInterviews || state.mockInterviews.length === 0) ? (
        <div className="text-center py-8 space-y-3">
          <div className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-slate-600 mx-auto">
            <FileJson className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-slate-500">No mock interview records saved yet.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {[...state.mockInterviews].reverse().map((rep) => (
            <div 
              key={rep.id} 
              className="p-3 rounded-lg bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] flex flex-col gap-2 transition-all cursor-pointer group"
              onClick={() => onViewReport(rep)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold text-white group-hover:text-accentPrimary transition-colors block leading-tight">{rep.topic} ({rep.difficulty})</span>
                  <span className="text-[9px] font-mono text-slate-500 mt-0.5 block">{rep.date}</span>
                </div>
                <span className={`text-xs font-extrabold font-mono ${getScoreColor(rep.scorecard.overallScore)}`}>
                  {rep.scorecard.overallScore}/10
                </span>
              </div>

              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-1 pt-1.5 border-t border-white/[0.04]">
                <span>{rep.interviewerPersonality}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmAction({
                      title: "Delete Scorecard Report?",
                      message: "Are you sure you want to permanently delete this mock interview report from your history?",
                      confirmText: "Delete Report",
                      cancelText: "Cancel",
                      severity: "danger",
                      onConfirm: () => deleteMockInterviewReport(rep.id)
                    });
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 rounded transition-all cursor-pointer"
                  title="Delete scorecard"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};
