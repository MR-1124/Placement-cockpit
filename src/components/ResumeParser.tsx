import React, { useState } from "react";
import { Loader2, FileJson, ClipboardList, CheckCircle } from "lucide-react";

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

interface ResumeParserProps {
  resumeText: string;
  setResumeText: (t: string) => void;
  resumeFileName: string;
  setResumeFileName: (n: string) => void;
  title?: string;
  description?: string;
}

export const ResumeParser: React.FC<ResumeParserProps> = ({
  resumeText,
  setResumeText,
  resumeFileName,
  setResumeFileName,
  title = "Resume Upload & Parser",
  description = "Upload your resume (.txt, .md, or .pdf) to let the AI Interviewer adapt questions to your experience and projects."
}) => {
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const [showPasteArea, setShowPasteArea] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          const arrayBuffer = evt.target?.result as ArrayBuffer;
          const text = await extractTextFromPdf(arrayBuffer);
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

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
          <FileJson className="w-4 h-4 text-accentPrimary" /> {title}
        </h3>
        <p className="text-[10px] text-slate-500 mt-1 leading-normal">
          {description}
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
        </div>
      ) : (
        <div className="space-y-3">
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
    </div>
  );
};
