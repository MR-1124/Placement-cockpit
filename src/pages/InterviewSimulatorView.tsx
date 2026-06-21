import React, { useState, useEffect, useRef } from "react";
import { useAppState } from "../context/AppStateContext";
import type { MockInterviewReport } from "../context/AppStateContext";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../components/Common";
import { 
  Play, 
  Trash2, 
  Send, 
  Loader2, 
  Sparkles, 
  Speech, 
  Award, 
  Calendar, 
  ChevronRight, 
  AlertTriangle, 
  Clock, 
  Code2, 
  FileJson, 
  BookOpen, 
  HelpCircle, 
  RefreshCw,
  UserCheck,
  CheckCircle,
  XCircle,
  CornerDownRight,
  ClipboardList
} from "lucide-react";
import confetti from "canvas-confetti";

export const InterviewSimulatorView: React.FC = () => {
  const { 
    state, 
    confirmAction, 
    startInterviewSession, 
    updateInterviewSession, 
    addInterviewChatMessage, 
    endInterviewSession, 
    deleteMockInterviewReport 
  } = useAppState();

  const apiKey = state.settings.nvidiaApiKey;
  const modelName = state.settings.nvidiaModelName || "meta/llama-3.1-70b-instruct";

  // Setup view states
  const [selectedTopic, setSelectedTopic] = useState("Any");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [selectedPersonality, setSelectedPersonality] = useState<"Helpful Mentor" | "Quiet Observer" | "Strict Interviewer">("Helpful Mentor");
  const [warmupCheck1, setWarmupCheck1] = useState(false);
  const [warmupCheck2, setWarmupCheck2] = useState(false);
  
  // Interactive active states
  const activeSession = state.activeInterviewSession;
  const [inputCode, setInputCode] = useState("");
  const [selectedLang, setSelectedLang] = useState("cpp");
  const [chatInput, setChatInput] = useState("");
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [aiStatusText, setAiStatusText] = useState("");
  const [streamingDelta, setStreamingDelta] = useState("");
  const [evaluationReport, setEvaluationReport] = useState<MockInterviewReport | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  // Sync state values if activeSession is updated or restored
  useEffect(() => {
    if (activeSession) {
      setInputCode(activeSession.code);
      setSelectedLang(activeSession.language);
    }
  }, [activeSession?.topic]); // Run once when session changes/loads

  // 1. Time-delta reload persistence logic
  useEffect(() => {
    if (activeSession && activeSession.timeLeft > 0 && activeSession.currentPhase !== "evaluating") {
      // Calculate delta on first mount if time was saved
      const saved = localStorage.getItem("placement_cockpit_state");
      let correctedTime = activeSession.timeLeft;
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const activeSess = parsed.activeInterviewSession;
          if (activeSess && activeSess.lastSavedTime) {
            const elapsed = Math.floor((Date.now() - activeSess.lastSavedTime) / 1000);
            correctedTime = Math.max(0, activeSess.timeLeft - elapsed);
          }
        } catch (e) {
          console.error("Failed to recover time delta", e);
        }
      }

      // Interval countdown tick
      let secondsLeft = correctedTime;
      timerRef.current = setInterval(() => {
        secondsLeft = Math.max(0, secondsLeft - 1);
        updateInterviewSession(
          secondsLeft,
          inputCode,
          selectedLang,
          activeSession.chatHistory,
          secondsLeft === 0 ? "evaluating" : activeSession.currentPhase
        );

        if (secondsLeft === 0) {
          clearInterval(timerRef.current);
          handleTimeOutSubmission();
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSession === null, activeSession?.currentPhase]);

  // Sync editor contents to context state on changes
  const handleCodeChange = (val: string) => {
    setInputCode(val);
    if (activeSession) {
      updateInterviewSession(
        activeSession.timeLeft,
        val,
        selectedLang,
        activeSession.chatHistory,
        activeSession.currentPhase
      );
    }
  };

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    if (activeSession) {
      updateInterviewSession(
        activeSession.timeLeft,
        inputCode,
        lang,
        activeSession.chatHistory,
        activeSession.currentPhase
      );
    }
  };

  // Scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeSession?.chatHistory, streamingDelta, isAiResponding]);

  // Start interview launcher
  const handleLaunchSession = async () => {
    if (!warmupCheck1 || !warmupCheck2) return;
    
    // Choose a random problem description matching difficulty and topic
    let problemTitle = "Custom Challenge";
    let problemDesc = "";
    
    try {
      // Pick dynamic problems from static curriculum data
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
        problemTitle = picked.name;
        problemDesc = `Problem Name: ${picked.name}\nDifficulty: ${selectedDifficulty}\nLeetcode Reference: ${picked.url || "N/A"}\n\nTask: Design an optimal solution. You must explain your time and space complexity before typing the code in the editor workspace.`;
      } else {
        // Fallback placeholder dsa problem
        problemTitle = "Kth Smallest Element in a Sorted Matrix";
        problemDesc = `Problem Name: Kth Smallest Element in a Sorted Matrix\nDifficulty: Medium\n\nGiven an n x n matrix where each of the rows and columns is sorted in ascending order, return the kth smallest element in the matrix.\n\nNote that it is the kth smallest element in the sorted order, not the kth distinct element.\nYou must find a solution with a memory complexity better than O(n^2).`;
      }
    } catch (e) {
      problemDesc = "Failed to load problem statement. General coding interview initiated.";
    }

    startInterviewSession(selectedTopic, selectedDifficulty, selectedPersonality, problemDesc);
    setEvaluationReport(null);
  };

  // Chat message send handler
  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isAiResponding || !activeSession) return;

    const messageText = chatInput;
    setChatInput("");
    setStreamingDelta("");
    
    // Add user message to history
    addInterviewChatMessage("user", messageText);
    setIsAiResponding(true);
    setAiStatusText("Interviewer is thinking...");

    // Build Chat History for API call
    const chatHistory = [...activeSession.chatHistory, { id: "temp", role: "user" as const, content: messageText, timestamp: "" }];
    
    await getInterviewerResponse(chatHistory);
  };

  // Get Hint trigger
  const handleRequestHint = async () => {
    if (isAiResponding || !activeSession) return;
    setIsAiResponding(true);
    setAiStatusText("Interviewer is formulating a hint...");
    setStreamingDelta("");

    const chatHistory = [
      ...activeSession.chatHistory, 
      { 
        id: "temp", 
        role: "user" as const, 
        content: "[Candidate asks for a hint regarding the logic, edge cases, or optimal approach]", 
        timestamp: "" 
      }
    ];

    await getInterviewerResponse(chatHistory);
  };

  // Interviewer persona reply handler
  const getInterviewerResponse = async (chatHistory: { role: "user" | "assistant" | "system"; content: string }[]) => {
    if (!apiKey) {
      addInterviewChatMessage("assistant", "API Key is missing. Configure it in Settings to talk with the AI Interviewer.");
      setIsAiResponding(false);
      return;
    }

    const systemPrompt = `You are a technical interviewer named Mentor AI. You are conducting a live code assessment.
Your personality profile is: ${activeSession?.interviewerPersonality}.
Topic: ${activeSession?.topic}
Difficulty: ${activeSession?.difficulty}

Follow these strict persona guidelines:
1. Helpful Mentor: Be supportive. Give small, constructive hints when requested. Prompt the candidate to outline time/space complexity before coding.
2. Quiet Observer: Keep replies very brief. Confirm understanding. Do not give any hints unless candidate specifically asks.
3. Strict Interviewer: Ask tough questions, point out potential logic bugs or unhandled edge cases, and evaluate complexity optimizations strictly.

Current Phase: ${activeSession?.currentPhase}.
Candidate Final Code Solution so far:
\`\`\`${activeSession?.language}
${inputCode || "No code written yet."}
\`\`\`

Rule: Do not give the code solution directly. Help the candidate code it. Keep responses short and conversational.`;

    try {
      const apiMessages = [
        { role: "system", content: systemPrompt },
        ...chatHistory.map(c => ({ role: c.role, content: c.content }))
      ];

      let response;
      try {
        response = await fetch("/api-nvidia/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: modelName,
            messages: apiMessages,
            temperature: 0.4,
            max_tokens: 500,
            stream: true
          })
        });
      } catch (err) {
        // Direct NIM API fallback
        response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: modelName,
            messages: apiMessages,
            temperature: 0.4,
            max_tokens: 500,
            stream: true
          })
        });
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      if (!reader) throw new Error("Body is not readable");

      let buffer = "";
      let accumulatedResponse = "";

      setAiStatusText("Interviewer is responding...");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === "data: [DONE]") continue;
          if (trimmed.startsWith("data: ")) {
            try {
              const jsonStr = trimmed.slice(6);
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content || "";
              if (content) {
                accumulatedResponse += content;
                setStreamingDelta(accumulatedResponse);
              }
            } catch (e) {}
          }
        }
      }

      addInterviewChatMessage("assistant", accumulatedResponse);
      setStreamingDelta("");
    } catch (err: any) {
      console.error(err);
      addInterviewChatMessage("assistant", `Failed to get a response from the interviewer. Error details: ${err.message}`);
    } finally {
      setIsAiResponding(false);
      setAiStatusText("");
    }
  };

  // Submit interview action
  const handleSubmitInterview = () => {
    confirmAction({
      title: "Submit Code & Finish Interview?",
      message: "Are you sure you want to submit your code? The AI interviewer will analyze your code, chat history, and complexity analysis to render your placement scorecard.",
      confirmText: "Submit & Evaluate",
      cancelText: "Keep Working",
      severity: "info",
      onConfirm: () => triggerEvaluationFlow()
    });
  };

  const handleTimeOutSubmission = () => {
    triggerEvaluationFlow();
  };

  // Evaluator pipeline with NVIDIA NIM
  const triggerEvaluationFlow = async () => {
    if (!activeSession) return;
    
    setIsEvaluating(true);
    // Switch state to evaluating phase
    updateInterviewSession(
      activeSession.timeLeft,
      inputCode,
      selectedLang,
      activeSession.chatHistory,
      "evaluating"
    );

    if (!apiKey) {
      setIsEvaluating(false);
      alert("NVIDIA API Key missing. Can't perform AI code evaluation.");
      return;
    }

    const evaluationPrompt = `You are a Principal Engineering Recruiter evaluating a candidate's code interview.
Topic: ${activeSession.topic}
Difficulty: ${activeSession.difficulty}
Interviewer Personality: ${activeSession.interviewerPersonality}

Candidate's Final Code:
\`\`\`${activeSession.language}
${inputCode || "// No code was submitted"}
\`\`\`

Interview Chat Log Transcript:
${activeSession.chatHistory.map(h => `${h.role === "user" ? "Candidate" : "Interviewer"}: ${h.content}`).join("\n")}

Evaluate the candidate and return a JSON object ONLY matching this schema:
{
  "problemSolving": [Score from 0 to 10],
  "codeQuality": [Score from 0 to 10],
  "communication": [Score from 0 to 10],
  "overallScore": [Score from 0 to 10],
  "recommendation": ["Strong Hire", "Hire", "Leaning Hire", "No Hire"],
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "feedback": "Comprehensive summary review..."
}

Ensure the output is valid JSON. Do not include markdown codeblocks or other explanations outside the JSON payload.`;

    try {
      let response;
      try {
        response = await fetch("/api-nvidia/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: modelName,
            messages: [{ role: "user", content: evaluationPrompt }],
            temperature: 0.2,
            max_tokens: 800
          })
        });
      } catch (err) {
        response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: modelName,
            messages: [{ role: "user", content: evaluationPrompt }],
            temperature: 0.2,
            max_tokens: 800
          })
        });
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";
      
      // Attempt to extract JSON from markdown wrappers if AI included them
      let jsonStr = content.trim();
      if (jsonStr.includes("```")) {
        const matches = jsonStr.match(/```(?:json)?([\s\S]*?)```/);
        if (matches && matches[1]) {
          jsonStr = matches[1].trim();
        }
      }

      const scores = JSON.parse(jsonStr);

      const report: MockInterviewReport = {
        id: `report-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        topic: activeSession.topic,
        difficulty: activeSession.difficulty,
        interviewerPersonality: activeSession.interviewerPersonality,
        codeSolution: inputCode,
        language: activeSession.language,
        chatHistory: activeSession.chatHistory,
        scorecard: {
          problemSolving: Number(scores.problemSolving) || 5,
          codeQuality: Number(scores.codeQuality) || 5,
          communication: Number(scores.communication) || 5,
          overallScore: Number(scores.overallScore) || 5,
          recommendation: scores.recommendation || "No Hire",
          strengths: Array.isArray(scores.strengths) ? scores.strengths : [],
          weaknesses: Array.isArray(scores.weaknesses) ? scores.weaknesses : [],
          feedback: scores.feedback || "No general feedback generated."
        }
      };

      setEvaluationReport(report);
      endInterviewSession(true, report);
    } catch (err) {
      console.error("Evaluation failed", err);
      // Fallback dummy report in case parsing fails
      const fallbackReport: MockInterviewReport = {
        id: `report-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        topic: activeSession.topic,
        difficulty: activeSession.difficulty,
        interviewerPersonality: activeSession.interviewerPersonality,
        codeSolution: inputCode,
        language: activeSession.language,
        chatHistory: activeSession.chatHistory,
        scorecard: {
          problemSolving: 7,
          codeQuality: 6,
          communication: 8,
          overallScore: 7,
          recommendation: "Leaning Hire",
          strengths: ["Attempted all sections", "Explained approach"],
          weaknesses: ["Logic had unverified edge cases"],
          feedback: "Evaluation parsing failed due to api output formatting. A default score was recorded."
        }
      };
      setEvaluationReport(fallbackReport);
      endInterviewSession(true, fallbackReport);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Exit interview confirmation
  const handleExitInterview = () => {
    confirmAction({
      title: "Exit Interview Round?",
      message: "Exiting the interview terminates the session. No report scorecard will be compiled, and you will lose your code progress. Are you sure you want to quit?",
      confirmText: "Quit Session",
      cancelText: "Stay & Code",
      severity: "danger",
      onConfirm: () => {
        endInterviewSession(false);
      }
    });
  };

  // Helper formatting for countdown timer
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-400";
    if (score >= 6) return "text-amber-400";
    return "text-rose-400";
  };

  const getRecBadge = (rec: string) => {
    if (rec === "Strong Hire") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (rec === "Hire") return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    if (rec === "Leaning Hire") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  };

  // Render View Selector
  if (activeSession) {
    // Phase 2: SPLIT SCREEN WORKSPACE
    return (
      <div className="space-y-6">
        {/* Workspace Sub Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-darkCard/50 border border-white/[0.04] p-4 rounded-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accentPrimary/10 border border-accentPrimary/20 flex items-center justify-center text-accentPrimary">
              <Speech className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Coding Assessment</h1>
              <p className="text-[10px] text-slate-500 font-mono">
                Topic: <span className="text-white font-bold">{activeSession.topic}</span> | Difficulty: <span className="text-accentPrimary font-bold">{activeSession.difficulty}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* 45 Min Timer */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold ${activeSession.timeLeft < 300 ? "bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse" : "bg-white/[0.02] border-white/[0.08] text-white"}`}>
              <Clock className="w-4 h-4" />
              <span>{formatTimer(activeSession.timeLeft)}</span>
            </div>

            <button
              onClick={handleExitInterview}
              className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-xs font-bold transition-all ml-auto sm:ml-0 cursor-pointer"
            >
              Exit Session
            </button>
          </div>
        </div>

        {/* Loading Spinner for Evaluation */}
        {activeSession.currentPhase === "evaluating" || isEvaluating ? (
          <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-6">
            <div className="relative w-16 h-16">
              <Loader2 className="w-16 h-16 animate-spin text-accentPrimary" />
              <Sparkles className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto animate-ping" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Recruiting AI Evaluator Active</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Analyzing logical code soundness, time/space complexity optimization, error margins, and explanation readability. Please wait...
              </p>
            </div>
          </div>
        ) : (
          /* Split Screen Panel */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left side: Dialogue & Chat Panel (5 Columns) */}
            <div className="lg:col-span-5 flex flex-col h-[650px] bg-darkCard/80 border border-white/[0.06] rounded-2xl overflow-hidden backdrop-blur-md">
              <div className="px-4 py-3 border-b border-white/[0.06] bg-white/[0.01] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-accentPrimary" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Interviewer Panel</span>
                </div>
                <span className="text-[10px] font-mono bg-white/[0.04] px-2 py-0.5 rounded text-slate-400">
                  {activeSession.interviewerPersonality}
                </span>
              </div>

              {/* Chat Conversation History Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text">
                {activeSession.chatHistory.map(msg => {
                  const isUser = msg.role === "user";
                  return (
                    <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-2.5`}>
                      {!isUser && (
                        <div className="w-6 h-6 rounded bg-accentPrimary/10 border border-accentPrimary/20 flex items-center justify-center text-accentPrimary shrink-0 mt-0.5 shadow-sm font-mono text-[9px] font-bold">
                          AI
                        </div>
                      )}
                      <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${isUser ? "bg-accentPrimary/10 border border-accentPrimary/20 rounded-tr-none text-slate-200" : "bg-white/[0.02] border border-white/[0.04] rounded-tl-none text-slate-300"}`}>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                        <span className="block text-[8px] text-slate-600 font-mono text-right mt-1">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* AI Streaming Response bubble */}
                {isAiResponding && (
                  <div className="flex justify-start items-start gap-2.5">
                    <div className="w-6 h-6 rounded bg-accentPrimary/10 border border-accentPrimary/20 flex items-center justify-center text-accentPrimary shrink-0 mt-0.5 font-mono text-[9px] font-bold">
                      AI
                    </div>
                    <div className="max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed bg-white/[0.02] border border-white/[0.04] rounded-tl-none text-slate-300">
                      {streamingDelta ? (
                        <div className="whitespace-pre-wrap">{streamingDelta}</div>
                      ) : (
                        <div className="flex items-center gap-2 py-1">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-accentPrimary" />
                          <span className="text-[10px] font-mono text-slate-500">{aiStatusText}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input message box */}
              <div className="p-3 border-t border-white/[0.06] bg-black/20 shrink-0">
                <form onSubmit={handleSendChatMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={isAiResponding}
                    placeholder="Type your explanation or ask a question..."
                    className="flex-1 min-w-0 bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-lg py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isAiResponding || !chatInput.trim()}
                    className="w-8 h-8 rounded-lg bg-accentPrimary hover:bg-accentPrimary/90 disabled:bg-white/[0.02] text-white disabled:text-slate-600 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Right side: Code Workspace (7 Columns) */}
            <div className="lg:col-span-7 flex flex-col h-[650px] bg-darkCard/80 border border-white/[0.06] rounded-2xl overflow-hidden backdrop-blur-md">
              <div className="px-4 py-3 border-b border-white/[0.06] bg-white/[0.01] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-accentPrimary" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Workspace Code Editor</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-slate-500">Language:</span>
                  <select
                    value={selectedLang}
                    onChange={(e) => handleLangChange(e.target.value)}
                    className="bg-black/50 border border-white/[0.08] rounded-md text-[10px] font-mono text-slate-300 py-1 px-2 focus:outline-none focus:border-accentPrimary cursor-pointer"
                  >
                    <option value="cpp">C++ (G++ 17)</option>
                    <option value="java">Java (JDK 17)</option>
                    <option value="python">Python (3.9)</option>
                    <option value="typescript">TypeScript (TS 4.9)</option>
                  </select>
                </div>
              </div>

              {/* Code TextArea Editor body */}
              <div className="flex-1 relative overflow-hidden flex">
                {/* Simulated Line numbers */}
                <div className="w-10 bg-black/40 border-r border-white/[0.04] py-3 text-right pr-2.5 font-mono text-[10px] text-slate-700 select-none leading-relaxed">
                  {Array.from({ length: Math.max(15, inputCode.split("\n").length) }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                {/* Editor Textarea */}
                <textarea
                  value={inputCode}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="// Paste problem boilerplate or write your solution here...&#10;// Make sure to define time & space complexities before submissions."
                  className="flex-1 bg-transparent p-3 font-mono text-[11px] text-slate-200 placeholder-slate-700 focus:outline-none resize-none leading-relaxed overflow-y-auto"
                />
              </div>

              {/* Action bar */}
              <div className="p-4 border-t border-white/[0.06] bg-black/30 flex justify-between items-center shrink-0">
                <button
                  type="button"
                  onClick={handleRequestHint}
                  disabled={isAiResponding}
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.12] text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Get Hint</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitInterview}
                  disabled={isAiResponding}
                  className="px-4 py-1.5 rounded-lg bg-accentPrimary hover:bg-accentPrimary/90 border border-accentPrimary/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-accentPrimary/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Submit Code Solution</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Phase 3: SCORECARD EVALUATION REPORT VIEW
  if (evaluationReport) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-darkCard/50 border border-white/[0.04] p-4 rounded-xl backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Interview Evaluation Scorecard</h2>
              <p className="text-[10px] text-slate-500 font-mono">Completed: {evaluationReport.date}</p>
            </div>
          </div>
          <button
            onClick={() => setEvaluationReport(null)}
            className="px-4 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            Start New Round
          </button>
        </div>

        {/* Scorecard Box */}
        <GlassCard className="p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accentPrimary/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Recommendation Badge */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.06]">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Overall Evaluation</span>
              <span className={`inline-block px-3 py-1 mt-1 text-sm font-bold rounded-lg border font-mono uppercase ${getRecBadge(evaluationReport.scorecard.recommendation)}`}>
                {evaluationReport.scorecard.recommendation}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Average Score</span>
              <span className={`text-4xl font-extrabold font-mono ${getScoreColor(evaluationReport.scorecard.overallScore)}`}>
                {evaluationReport.scorecard.overallScore}/10
              </span>
            </div>
          </div>

          {/* Sub Criteria Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            <div className="space-y-1.5 p-3 rounded-lg bg-white/[0.01] border border-white/[0.04]">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Problem Solving</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-extrabold font-mono ${getScoreColor(evaluationReport.scorecard.problemSolving)}`}>
                  {evaluationReport.scorecard.problemSolving}
                </span>
                <span className="text-xs text-slate-600">/ 10</span>
              </div>
              <p className="text-[10px] text-slate-500">Edge cases logic correctness</p>
            </div>

            <div className="space-y-1.5 p-3 rounded-lg bg-white/[0.01] border border-white/[0.04]">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Code Quality</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-extrabold font-mono ${getScoreColor(evaluationReport.scorecard.codeQuality)}`}>
                  {evaluationReport.scorecard.codeQuality}
                </span>
                <span className="text-xs text-slate-600">/ 10</span>
              </div>
              <p className="text-[10px] text-slate-500">Naming, structure & optimization</p>
            </div>

            <div className="space-y-1.5 p-3 rounded-lg bg-white/[0.01] border border-white/[0.04]">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Communication</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-extrabold font-mono ${getScoreColor(evaluationReport.scorecard.communication)}`}>
                  {evaluationReport.scorecard.communication}
                </span>
                <span className="text-xs text-slate-600">/ 10</span>
              </div>
              <p className="text-[10px] text-slate-500">Explanation of approach & complexities</p>
            </div>
          </div>

          {/* Feedback & Bullet Lists */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">AI Recruiter Feedback</h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl">
              {evaluationReport.scorecard.feedback}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>Key Strengths</span>
                </h4>
                <ul className="space-y-1.5">
                  {evaluationReport.scorecard.strengths.map((str, idx) => (
                    <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                      <CornerDownRight className="w-3.5 h-3.5 text-emerald-500/60 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-[11px] font-bold text-rose-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  <span>Areas of Improvement</span>
                </h4>
                <ul className="space-y-1.5">
                  {evaluationReport.scorecard.weaknesses.map((weak, idx) => (
                    <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                      <CornerDownRight className="w-3.5 h-3.5 text-rose-500/60 shrink-0 mt-0.5" />
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  // Phase 1: MOCK SETUP CONFIGURATION
  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-accentPrimary/10 border border-accentPrimary/20 flex items-center justify-center text-accentPrimary">
          <Speech className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mock Coding Assessments</h1>
          <p className="text-xs text-slate-500">Test your code explanations, complexities, and logic under placement pressures.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Setup Parameters (Left side, 2 Cols) */}
        <div className="md:col-span-2 space-y-6">
          <GlassCard className="p-6 space-y-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Simulator Configuration</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Topic Select */}
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

              {/* Difficulty Select */}
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

            {/* Personality Select */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase block">Interviewer Personality Profile</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "Helpful Mentor",
                    title: "Helpful Mentor",
                    desc: "Provides progressive hints & points out bugs gently."
                  },
                  {
                    id: "Quiet Observer",
                    title: "Quiet Observer",
                    desc: "Speaks very little. Only answers specific questions."
                  },
                  {
                    id: "Strict Interviewer",
                    title: "Strict Interviewer",
                    desc: "Interrupts with edge cases & strict complexity evaluations."
                  }
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

          {/* Warmup Checklist */}
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
              onClick={handleLaunchSession}
              disabled={!warmupCheck1 || !warmupCheck2 || !apiKey}
              className="w-full h-11 bg-accentPrimary hover:bg-accentPrimary/90 disabled:bg-white/[0.02] text-white disabled:text-slate-600 border border-accentPrimary/20 disabled:border-transparent font-bold rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all shadow-lg shadow-accentPrimary/10 cursor-pointer text-xs disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{apiKey ? "Launch Timed Mock Interview Room" : "NVIDIA API Key Missing (Go to Settings)"}</span>
            </button>
          </GlassCard>
        </div>

        {/* History Scorecards (Right side, 1 Col) */}
        <div className="space-y-6">
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
                {state.mockInterviews.map((rep) => (
                  <div 
                    key={rep.id} 
                    className="p-3 rounded-lg bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] flex flex-col gap-2 transition-all cursor-pointer group"
                    onClick={() => setEvaluationReport(rep)}
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
        </div>
      </div>
    </div>
  );
};
