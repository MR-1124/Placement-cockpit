import React, { useState, useEffect, useRef } from "react";
import { useAppState } from "../context/AppStateContext";
import type { MockInterviewReport, InterviewPhase } from "../types/AppTypes";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { InterviewScorecard } from "../components/InterviewScorecard";
import { InterviewSetupPanel, InterviewHistoryPanel } from "../components/InterviewSetupComponents";
import { nvidiaFetch } from "../lib/nvidiaApi";
import { 
  Play, 
  Send, 
  Loader2, 
  Sparkles, 
  Speech, 
  Clock, 
  Code2, 
  FileJson, 
  HelpCircle, 
  UserCheck,
  CheckCircle,
  XCircle,
  ClipboardList,
  ChevronRight,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  RotateCcw,
  Pause,
  ChevronDown
} from "lucide-react";

// Private MarkdownRenderer removed (Bug #7 fix).
// Now using shared MarkdownRenderer from components/MarkdownRenderer.tsx
// which supports: tables, mermaid diagrams, think-blocks, copy buttons.


const cleanResponseTags = (text: string) => {
  return text
    .replace(/\[PHASE_TRANSITION:\s*(intro|dsa|core|puzzles|hr|evaluating)\]/gi, "")
    .replace(/\[SUB_STATUS:\s*(.*?)\]/gi, "")
    .trim();
};

const robustJsonParse = (text: string): unknown => {
  let jsonStr = text.trim();
  if (jsonStr.includes("```")) {
    const matches = jsonStr.match(/```(?:json)?([\s\S]*?)```/);
    if (matches && matches[1]) {
      jsonStr = matches[1].trim();
    }
  }
  
  try {
    return JSON.parse(jsonStr);
  } catch (parseErr) {
    console.warn("Standard JSON parse failed, attempting regex extraction...", parseErr);
    
    const extractNumber = (key: string, defaultValue: number): number => {
      const regex = new RegExp(`"${key}"\\s*:\\s*(\\d+)`, "i");
      const match = jsonStr.match(regex);
      if (match && match[1]) {
        return Number(match[1]);
      }
      const regexNoQuotes = new RegExp(`${key}\\s*:\\s*(\\d+)`, "i");
      const matchNoQuotes = jsonStr.match(regexNoQuotes);
      if (matchNoQuotes && matchNoQuotes[1]) {
        return Number(matchNoQuotes[1]);
      }
      return defaultValue;
    };

    const extractString = (key: string, defaultValue: string): string => {
      const regex = new RegExp(`"${key}"\\s*:\\s*"([^"]*)"`, "i");
      const match = jsonStr.match(regex);
      if (match && match[1]) {
        return match[1];
      }
      const regexSingle = new RegExp(`"${key}"\\s*:\\s*'([^']*)'`, "i");
      const matchSingle = jsonStr.match(regexSingle);
      if (matchSingle && matchSingle[1]) {
        return matchSingle[1];
      }
      return defaultValue;
    };

    const extractStringArray = (key: string): string[] => {
      const regex = new RegExp(`"${key}"\\s*:\\s*\\[([^\\]]*)\\]`, "i");
      const match = jsonStr.match(regex);
      if (match && match[1]) {
        const itemsStr = match[1];
        return itemsStr
          .split(",")
          .map(item => item.trim().replace(/^["']|["']$/g, ""))
          .filter(item => item.length > 0);
      }
      return [];
    };

    const questionsFeedback: Array<{ question: string; response: string; rating: number; feedback: string }> = [];
    const qfRegex = /\{\s*"question"\s*:\s*"([^"]*)"\s*,\s*"response"\s*:\s*"([^"]*)"\s*,\s*"rating"\s*:\s*(\d+)\s*,\s*"feedback"\s*:\s*"([^"]*)"\s*\}/gi;
    let qfMatch;
    while ((qfMatch = qfRegex.exec(jsonStr)) !== null) {
      questionsFeedback.push({
        question: qfMatch[1],
        response: qfMatch[2],
        rating: Number(qfMatch[3]),
        feedback: qfMatch[4]
      });
    }

    if (questionsFeedback.length === 0) {
      const questionMatches = [...jsonStr.matchAll(/"question"\s*:\s*"([^"]*)"/gi)];
      const responseMatches = [...jsonStr.matchAll(/"response"\s*:\s*"([^"]*)"/gi)];
      const ratingMatches = [...jsonStr.matchAll(/"rating"\s*:\s*(\d+)/gi)];
      const feedbackMatches = [...jsonStr.matchAll(/"feedback"\s*:\s*"([^"]*)"/gi)];
      
      const minLen = Math.min(questionMatches.length, responseMatches.length, ratingMatches.length, feedbackMatches.length);
      for (let i = 0; i < minLen; i++) {
        questionsFeedback.push({
          question: questionMatches[i][1],
          response: responseMatches[i][1],
          rating: Number(ratingMatches[i][1]),
          feedback: feedbackMatches[i][1]
        });
      }
    }

    const result = {
      problemSolving: extractNumber("problemSolving", 5),
      codeQuality: extractNumber("codeQuality", 5),
      communication: extractNumber("communication", 5),
      overallScore: extractNumber("overallScore", 5),
      recommendation: extractString("recommendation", "Hire"),
      strengths: extractStringArray("strengths"),
      weaknesses: extractStringArray("weaknesses"),
      feedback: extractString("feedback", "Completed the interview session. Standard feedback provided."),
      questionsFeedback: questionsFeedback
    };

    if (result.problemSolving || result.codeQuality || result.communication) {
      return result;
    }

    throw parseErr;
  }
};

const LANGUAGE_BOILERPLATES: Record<string, string> = {
  cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

class Solution {
public:
    void solve() {
        // Write your logic here
    }
};

int main() {
    Solution sol;
    sol.solve();
    return 0;
}`,
  java: `import java.util.*;

class Solution {
    public void solve() {
        // Write your logic here
    }
}

public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
        sol.solve();
    }
}`,
  python: `class Solution:
    def solve(self):
        # Write your logic here
        pass

if __name__ == "__main__":
    sol = Solution()
    sol.solve()`,
  typescript: `class Solution {
    solve(): void {
        // Write your logic here
    }
}

const sol = new Solution();
sol.solve();`
};

export const InterviewSimulatorView: React.FC = () => {
  const { 
    state, 
    confirmAction, 
    startInterviewSession, 
    updateInterviewSession, 
    addInterviewChatMessage, 
    endInterviewSession
  } = useAppState();

  const apiKey = state.settings.nvidiaApiKey;
  const modelName = state.settings.nvidiaInterviewerModelName || state.settings.nvidiaModelName || "meta/llama-3.1-70b-instruct";


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
  const [evalMsgIndex, setEvalMsgIndex] = useState(0);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);
  const [isSessionPaused, setIsSessionPaused] = useState(false);
  const [isGoalExpanded, setIsGoalExpanded] = useState(true);
  const [copyCodeSuccess, setCopyCodeSuccess] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"chat" | "editor">("chat");
  const [showPreBrief, setShowPreBrief] = useState(false);

  useEffect(() => {
    if (activeSession && activeSession.timeLeft === 2700 && activeSession.chatHistory.length === 0) {
      setTimeout(() => setShowPreBrief(true), 0);
    }
  }, [activeSession]);

  const EVALUATION_MESSAGES = [
    "Analyzing logical code soundness...",
    "Evaluating time and space complexity...",
    "Checking for edge cases and unhandled errors...",
    "Assessing communication and explanation clarity...",
    "Generating feedback and scorecard...",
    "Finalizing evaluation report..."
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isEvaluating || activeSession?.currentPhase === "evaluating") {
      interval = setInterval(() => {
        setEvalMsgIndex(prev => (prev + 1) % EVALUATION_MESSAGES.length);
      }, 5000); // Change message every 5 seconds
    } else {
      setTimeout(() => setEvalMsgIndex(0), 0);
    }
    return () => clearInterval(interval);
  }, [isEvaluating, activeSession?.currentPhase, EVALUATION_MESSAGES.length]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep refs containing absolute latest values to prevent stale closure bugs
  const chatHistoryRef = useRef<Array<{ id: string; role: "user" | "assistant" | "system"; content: string; timestamp: string }>>([]);
  const codeRef = useRef("");
  const langRef = useRef("cpp");
  const phaseRef = useRef<string>("intro");
  const timeLeftRef = useRef(45 * 60);
  // Bug-fix #1/#2: guard ref prevents double evaluation trigger
  const isEvaluatingRef = useRef(false);
  const isPausedRef = useRef(false);

  useEffect(() => {
    isPausedRef.current = isSessionPaused || showPreBrief;
  }, [isSessionPaused, showPreBrief]);

  useEffect(() => {
    if (activeSession) {
      chatHistoryRef.current = activeSession.chatHistory;
      codeRef.current = activeSession.code;
      langRef.current = activeSession.language;
      phaseRef.current = activeSession.currentPhase;
      timeLeftRef.current = activeSession.timeLeft;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession?.chatHistory, activeSession?.code, activeSession?.language, activeSession?.currentPhase, activeSession?.timeLeft]);

  // Sync state values if activeSession is updated or restored
  useEffect(() => {
    if (activeSession) {
      setTimeout(() => {
        setInputCode(activeSession.code);
        setSelectedLang(activeSession.language);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession?.topic]); // Run once when session changes/loads

  // Reset editor maximization when phase transitions away from DSA coding
  useEffect(() => {
    if (activeSession && activeSession.currentPhase !== "dsa") {
      setTimeout(() => setIsEditorMaximized(false), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession?.currentPhase]);

  // Bug-fix #1: Removed auto-trigger useEffect.
  // Evaluation is ONLY triggered explicitly by handleSubmitInterview (HR phase button)
  // or handleTimeOutSubmission (timer expiry). The useEffect caused a double-call race
  // because triggerEvaluationFlow() itself sets currentPhase="evaluating", which
  // re-fired this effect, starting a second evaluation that caused permanent "stuck" state.



  // Sync editor contents to context state on changes
  const handleCodeChange = (val: string) => {
    setInputCode(val);
    codeRef.current = val;
    if (activeSession) {
      updateInterviewSession(
        activeSession.timeLeft,
        val,
        langRef.current,
        chatHistoryRef.current,
        phaseRef.current as InterviewPhase
      );
    }
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const val = e.currentTarget.value;
      const nextValue = val.substring(0, start) + "    " + val.substring(end);
      handleCodeChange(nextValue);
      // Reset cursor position
      setTimeout(() => {
        if (e.currentTarget) {
          e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    langRef.current = lang;
    
    // Auto-fill boilerplate if editor is empty or matches old boilerplate
    const currentCode = codeRef.current.trim();
    const isCodeEmpty = currentCode === "";
    const matchesOldBoilerplate = Object.values(LANGUAGE_BOILERPLATES).some(bp => bp.trim() === currentCode);
    
    let newCode = codeRef.current;
    if (isCodeEmpty || matchesOldBoilerplate) {
      newCode = LANGUAGE_BOILERPLATES[lang] || "";
      setInputCode(newCode);
      codeRef.current = newCode;
    }

    if (activeSession) {
      updateInterviewSession(
        activeSession.timeLeft,
        newCode,
        lang,
        chatHistoryRef.current,
        phaseRef.current as InterviewPhase
      );
    }
  };

  // Ensure boilerplate is injected on initial mount if empty and in DSA phase
  useEffect(() => {
    if (activeSession && activeSession.currentPhase === "dsa" && !codeRef.current.trim()) {
      const defaultCode = LANGUAGE_BOILERPLATES[langRef.current] || "";
      setTimeout(() => setInputCode(defaultCode), 0);
      codeRef.current = defaultCode;
      updateInterviewSession(
        activeSession.timeLeft,
        defaultCode,
        langRef.current,
        chatHistoryRef.current,
        "dsa"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession?.currentPhase]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeSession?.chatHistory, streamingDelta, isAiResponding]);

  const handleLaunchSession = (topic: string, difficulty: "Easy" | "Medium" | "Hard", personality: "Helpful Mentor" | "Quiet Observer" | "Strict Interviewer", problemDesc: string, resumeText: string, resumeFileName: string) => {
    setIsEditorMaximized(false);
    setIsSessionPaused(false);
    isPausedRef.current = false;
    isEvaluatingRef.current = false;
    startInterviewSession(topic, difficulty, personality, problemDesc, resumeText, resumeFileName);
    setEvaluationReport(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendChatMessage();
    }
  };

  // Chat message send handler
  const handleSendChatMessage = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const textToSend = overrideText || chatInput;
    if (!textToSend.trim() || isAiResponding || !activeSession) return;

    const messageText = textToSend;
    setChatInput("");
    setStreamingDelta("");
    
    // Add user message to history
    addInterviewChatMessage("user", messageText);
    setIsAiResponding(true);
    setAiStatusText("Interviewer is thinking...");

    // Bug-fix #4: use chatHistoryRef.current (always up-to-date) instead of
    // activeSession.chatHistory (stale React state snapshot) to avoid message drops
    // when user sends two messages in rapid succession.
    const chatHistory = [...chatHistoryRef.current, { id: "temp", role: "user" as const, content: messageText, timestamp: "" }];
    
    await getInterviewerResponse(chatHistory);
  };

  // Get Hint trigger
  const handleRequestHint = async () => {
    if (isAiResponding || !activeSession) return;
    setIsAiResponding(true);
    setAiStatusText("Interviewer is formulating a hint...");
    setStreamingDelta("");

    // Bug-fix #4: same fix — use chatHistoryRef.current
    const chatHistory = [
      ...chatHistoryRef.current, 
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
    if (!activeSession) return;
    if (!apiKey) {
      addInterviewChatMessage("assistant", "API Key is missing. Configure it in Settings to talk with the AI Interviewer.");
      setIsAiResponding(false);
      return;
    }

    const systemPrompt = `You are a Principal Software Engineer acting as a technical interviewer named Mentor AI. You are conducting a structured live technical interview.
Your personality profile is: ${activeSession?.interviewerPersonality}.
Target Topic: ${activeSession?.topic}
Initial Difficulty Target: ${activeSession?.difficulty}

Candidate Resume Text Profile:
${activeSession?.resumeText || "No resume uploaded."}

If a resume is uploaded above:
- Read and understand candidate's technical skills, experience level, and listed projects.
- Tailor the questions in DSA, Core CS, puzzles, and HR situational parts to align with their tech stack (e.g. if they know React/Node, ask web-related or appropriate system design questions. If they know C++/Java, focus on those language properties in Core CS).
- Reference their resume projects or internship work at appropriate moments to simulate a highly realistic, customized corporate tech interview.
- Acknowledge their resume highlights (such as internships, projects, or education) in your first message.

The interview must proceed strictly through the following phases. You are responsible for guiding the candidate.
At the start of your message, you MUST output two tags:
1. [SUB_STATUS: <progress_details>] - This represents the current question or task number in the active phase (e.g., [SUB_STATUS: Question 2 of 3] or [SUB_STATUS: Logic Discussion]).
2. [PHASE_TRANSITION: <new_phase>] - ONLY output this tag when you are explicitly transitioning to a new phase. DO NOT output this tag if you are staying in the same phase.

Current Phase: ${activeSession?.currentPhase}.

Phase Details & Transitions:
1. intro:
   - Topic: Introduction & Resume review.
   - Action: 
     - 1st Response: Welcome candidate, review self-introduction.
     - 2nd Response: Ask 1 follow-up question about their background, project stacks, or target companies.
     - You must ask at least 2 distinct questions/follow-ups in this phase.
     - Transition: Only output "[PHASE_TRANSITION: dsa]" on the 3rd turn after the candidate answers the follow-up question.

2. dsa:
   - Topic: Data Structures & Algorithms.
   - Action:
     - Present the coding challenge: ${activeSession?.goal || "N/A"}.
     - 1st response in DSA: Ask candidate to describe their logic, complexities (Time & Space) in the chat before they code.
     - 2nd response in DSA: Review their logic. Give feedback, nudge them if logic is suboptimal. Tell them to write the code in the editor workspace on the right.
     - 3rd response in DSA: Once code is submitted (or candidate says done), review code. Point out any bug, edge case, or optimization. If correct, ask them a Medium/Hard follow-up extension of the problem.
     - Transition: Only output "[PHASE_TRANSITION: core]" after they have fully coded their solution, discussed complexities, and responded to your follow-up extension (at least 3 responses inside this phase).

3. core:
   - Topic: Core Computer Science theory (DBMS, Operating Systems, Computer Networks, OOPS).
   - Action: 
     - Ask exactly 3 specific theoretical questions (e.g. process vs thread, database normalization, TCP vs UDP, polymorphism). 
     - Ask them one-by-one. Wait for their answer before asking the next question.
     - Transition: ONLY output "[PHASE_TRANSITION: puzzles]" after the candidate has answered all 3 theoretical questions.

4. puzzles:
   - Topic: Logic & Brain Teaser Puzzles.
   - Action:
     - Ask 1 classic engineering puzzle (e.g. 3-gallon and 5-gallon water jug problem, or cross the bridge with a torch, or 2 eggs 100 floors).
     - Once they attempt, ask 1 follow-up explaining a variation or asking them to verify edge constraints.
     - Transition: ONLY output "[PHASE_TRANSITION: hr]" after they have attempted both the puzzle and responded to your follow-up.

5. hr:
   - Topic: HR & Situational Behavioral questions.
   - Action: 
     - Ask exactly 2 situational behavioral questions (e.g. conflict with teammate, handling project failure, or deadline pressure). 
     - Ask them one-by-one. Wait for their answer before asking the second question.
     - Transition: ONLY output "[PHASE_TRANSITION: evaluating]" after they have answered the second HR question. Inform them the interview is completed and that they should click the Submit button to generate their scorecard.

Core Persona Rules:
- Helpful Mentor: Supportive, friendly, offers logical guidance/clues, asks candidate to verify edge cases.
- Quiet Observer: Highly professional, silent, keeps replies terse, does not offer hints unless directly asked.
- Strict Interviewer: Demanding, points out edge cases/redundancies immediately, pushes for optimal complexities, evaluates strictly.

Rule: Do not output code solutions. Guide them using conceptual feedback. Keep replies conversational. Always place the tags [SUB_STATUS: <details>] and [PHASE_TRANSITION: <phase>] on the very first lines of your response when needed.`;

    try {
      const apiMessages = [
        { role: "system" as const, content: systemPrompt },
        ...chatHistory.map(c => ({ role: c.role as "user" | "assistant" | "system", content: c.content }))
      ];

      // Arch Debt #14 fix: replaced 3-try copy-paste with shared nvidiaFetch utility
      const response = await nvidiaFetch({
        apiKey,
        modelName,
        messages: apiMessages,
        temperature: 0.4,
        maxTokens: 1000,
        stream: true
      });

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
                setStreamingDelta(cleanResponseTags(accumulatedResponse));
              }
            } catch (err) {
              console.warn("Stream JSON parse error", err);
            }
          }
        }
      }

      // Parse phase transitions
      let nextPhase = activeSession.currentPhase;
      const phaseMatch = accumulatedResponse.match(/\[PHASE_TRANSITION:\s*(intro|dsa|core|puzzles|hr|evaluating)\]/i);
      if (phaseMatch) {
        nextPhase = phaseMatch[1].toLowerCase() as InterviewPhase;
      }

      // Parse sub-phase status
      let nextSubStatus = activeSession.subPhaseStatus || "";
      const subStatusMatch = accumulatedResponse.match(/\[SUB_STATUS:\s*(.*?)\]/i);
      if (subStatusMatch) {
        nextSubStatus = subStatusMatch[1].trim();
      }

      const cleanedResponse = cleanResponseTags(accumulatedResponse);

      setStreamingDelta("");

      const newMessage = {
        id: `msg-${Date.now()}`,
        role: "assistant" as const,
        content: cleanedResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const newHistory = [...chatHistoryRef.current, newMessage];

      updateInterviewSession(
        timeLeftRef.current,
        codeRef.current,
        langRef.current,
        newHistory,
        nextPhase,
        nextSubStatus
      );
    } catch (err: unknown) {
      console.error(err);
      addInterviewChatMessage("assistant", `Failed to get a response from the interviewer. Error details: ${(err as Error).message}`);
    } finally {
      setIsAiResponding(false);
      setAiStatusText("");
    }
  };

  // Submit interview action
  const handleSubmitInterview = () => {
    // Bug-fix #1: Guard prevents double invocation from confirmAction + useEffect
    if (isEvaluatingRef.current) return;
    confirmAction({
      title: "Submit Code & Finish Interview?",
      message: "Are you sure you want to submit your code? The AI interviewer will analyze your code, chat history, and complexity analysis to render your placement scorecard.",
      confirmText: "Submit & Evaluate",
      cancelText: "Keep Working",
      severity: "info",
      onConfirm: () => triggerEvaluationFlow()
    });
  };

  const handleSubmitCodeToInterviewer = async () => {
    if (isAiResponding || !activeSession || !inputCode.trim()) return;

    setIsAiResponding(true);
    setAiStatusText("Interviewer is reviewing your code...");
    setStreamingDelta("");

    const messageText = `[Candidate submits code solution for review]\nLanguage: ${selectedLang}\n\nCode:\n\`\`\`${selectedLang}\n${inputCode}\n\`\`\``;
    
    // Add user message to history
    addInterviewChatMessage("user", messageText);

    // Build Chat History for API call
    const chatHistory = [...chatHistoryRef.current, { id: `temp-${Date.now()}`, role: "user" as const, content: messageText, timestamp: "" }];
    
    await getInterviewerResponse(chatHistory);
  };

  function handleTimeOutSubmission() {
    // Bug-fix #2: timer already stopped before this is called; just trigger eval
    triggerEvaluationFlow();
  }

  // Evaluator pipeline with NVIDIA NIM
  async function triggerEvaluationFlow() {
    // Bug-fix #1/#2: isEvaluatingRef is a synchronous guard (unlike isEvaluating state
    // which has async update lag). Set it immediately to block any concurrent call.
    if (isEvaluatingRef.current) return;
    isEvaluatingRef.current = true;

    if (!activeSession) {
      isEvaluatingRef.current = false;
      return;
    }
    
    setIsEvaluating(true);
    // Bug-fix #3: use codeRef.current (always latest) instead of inputCode React state
    // which may be stale if user typed code just before evaluation triggered.
    // Bug-fix #4: use chatHistoryRef.current (always latest) instead of activeSession.chatHistory.
    const currentCode = codeRef.current;
    const currentLang = langRef.current;
    const currentHistory = [...chatHistoryRef.current];

    // Switch state to evaluating phase
    updateInterviewSession(
      timeLeftRef.current,
      currentCode,
      currentLang,
      currentHistory,
      "evaluating"
    );

    if (!apiKey) {
      setIsEvaluating(false);
      alert("NVIDIA API Key missing. Can't perform AI code evaluation.");
      endInterviewSession(false);
      return;
    }

    const evaluationPrompt = `You are a Principal Engineering Recruiter evaluating a candidate's code interview.
Topic: ${activeSession.topic}
Difficulty: ${activeSession.difficulty}
Interviewer Personality: ${activeSession.interviewerPersonality}

Candidate Resume Text Profile:
${activeSession.resumeText || "No resume uploaded."}

Candidate's Final Code:
\`\`\`${currentLang}
${currentCode || "// No code was submitted"}
\`\`\`

Interview Chat Log Transcript:
${currentHistory.map(h => `${h.role === "user" ? "Candidate" : "Interviewer"}: ${h.content}`).join("\n")}

Evaluate the candidate and return a JSON object ONLY matching this schema:
{
  "problemSolving": [Score from 0 to 10],
  "codeQuality": [Score from 0 to 10],
  "communication": [Score from 0 to 10],
  "overallScore": [Score from 0 to 10],
  "phaseScores": {
    "intro": [Score from 0 to 10],
    "dsa": [Score from 0 to 10],
    "core": [Score from 0 to 10],
    "puzzles": [Score from 0 to 10],
    "hr": [Score from 0 to 10]
  },
  "recommendation": ["Strong Hire", "Hire", "Leaning Hire", "No Hire"],
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "feedback": "Comprehensive summary review...",
  "questionsFeedback": [
    {
      "question": "The question asked by the interviewer (summarized or exact)",
      "response": "The candidate's response",
      "rating": [Score from 0 to 10],
      "feedback": "Critique and localized feedback for this specific answer"
    }
  ]
}

Identify each question asked (including self-introduction, DSA problems, Core CS, Puzzles, and HR) and list it in the questionsFeedback array.
Ensure the output is valid JSON. Do not include markdown codeblocks or other explanations outside the JSON payload.`;

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 45000); // 45s timeout

    try {
      // Arch Debt #14 fix: replaced 3-try copy-paste with shared nvidiaFetch utility
      const response = await nvidiaFetch({
        apiKey,
        modelName,
        messages: [{ role: "user", content: evaluationPrompt }],
        temperature: 0.2,
        maxTokens: 2000,
        stream: false,
        signal: abortController.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      const scores = robustJsonParse(content) as {
        problemSolving?: number;
        codeQuality?: number;
        communication?: number;
        overallScore?: number;
        recommendation?: string;
        strengths?: string[];
        weaknesses?: string[];
        feedback?: string;
        questionsFeedback?: Array<{ question: string; response: string; rating: number; feedback: string }>;
      };

      const report: MockInterviewReport = {
        id: `report-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        topic: activeSession.topic,
        difficulty: activeSession.difficulty,
        interviewerPersonality: activeSession.interviewerPersonality,
        codeSolution: currentCode,
        language: currentLang,
        chatHistory: currentHistory,
        scorecard: {
          problemSolving: Number(scores.problemSolving) || 5,
          codeQuality: Number(scores.codeQuality) || 5,
          communication: Number(scores.communication) || 5,
          overallScore: Number(scores.overallScore) || 5,
          phaseScores: {
            intro: Number(scores.phaseScores?.intro) || undefined,
            dsa: Number(scores.phaseScores?.dsa) || undefined,
            core: Number(scores.phaseScores?.core) || undefined,
            puzzles: Number(scores.phaseScores?.puzzles) || undefined,
            hr: Number(scores.phaseScores?.hr) || undefined
          },
          recommendation: scores.recommendation || "No Hire",
          strengths: Array.isArray(scores.strengths) ? scores.strengths : [],
          weaknesses: Array.isArray(scores.weaknesses) ? scores.weaknesses : [],
          feedback: scores.feedback || "No general feedback generated.",
          questionsFeedback: Array.isArray(scores.questionsFeedback) ? scores.questionsFeedback : []
        }
      };

      setEvaluationReport(report);
      endInterviewSession(true, report);
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      console.error("Evaluation failed", err);

      if ((err as Error).name === "AbortError" || (err as Error).message?.includes("timeout") || (err as Error).message?.includes("Abort")) {
        alert("The AI evaluation timed out after 45 seconds. The API might be heavily loaded. Please click 'End Interview' to try again.");
        // Revert phase to allow retry
        updateInterviewSession(
          timeLeftRef.current,
          currentCode,
          currentLang,
          currentHistory,
          phaseRef.current as InterviewPhase
        );
        return;
      }
      // Fallback dummy report in case parsing fails
      const fallbackReport: MockInterviewReport = {
        id: `report-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        topic: activeSession.topic,
        difficulty: activeSession.difficulty,
        interviewerPersonality: activeSession.interviewerPersonality,
        codeSolution: currentCode,
        language: currentLang,
        chatHistory: currentHistory,
        scorecard: {
          problemSolving: 7,
          codeQuality: 6,
          communication: 8,
          overallScore: 7,
          phaseScores: {
            intro: 7,
            dsa: 6,
            core: 7,
            hr: 8
          },
          recommendation: "Leaning Hire",
          strengths: ["Attempted all sections", "Explained approach"],
          weaknesses: ["Logic had unverified edge cases"],
          feedback: "Evaluation parsing failed due to api output formatting. A default score was recorded.",
          questionsFeedback: [
            {
              question: "Self-Introduction & Core CS concepts",
              response: "Attempted conversation flow",
              rating: 7,
              feedback: "Completed dialogue transitions. Code was written in the editor."
            }
          ]
        }
      };
      setEvaluationReport(fallbackReport);
      endInterviewSession(true, fallbackReport);
    } finally {
      setIsEvaluating(false);
      // Bug-fix #1/#2: release guard so the NEXT interview session can evaluate
      isEvaluatingRef.current = false;
    }
  };

  // Exit interview confirmation
  const handleExitInterview = () => {
    confirmAction({
      title: "End Interview Middle?",
      message: "Warning: If you end the interview in the middle, it will not be evaluated and no scorecard report will be generated. Your progress will be lost. Are you sure you want to end the interview?",
      confirmText: "Yes, End Interview",
      cancelText: "Cancel & Continue",
      severity: "danger",
      onConfirm: () => {
        endInterviewSession(false);
      }
    });
  };

  const handleCopyCode = async () => {
    if (inputCode) {
      await navigator.clipboard.writeText(inputCode);
      setCopyCodeSuccess(true);
      setTimeout(() => setCopyCodeSuccess(false), 2000);
    }
  };

  const handleResetCode = () => {
    confirmAction({
      title: "Reset Code?",
      message: "Are you sure you want to reset the editor? All your written code will be lost.",
      confirmText: "Reset Code",
      cancelText: "Cancel",
      severity: "danger",
      onConfirm: () => {
        const defaultCode = LANGUAGE_BOILERPLATES[langRef.current] || "";
        setInputCode(defaultCode);
        codeRef.current = defaultCode;
        if (activeSession) {
          updateInterviewSession(
            activeSession.timeLeft,
            defaultCode,
            langRef.current,
            chatHistoryRef.current,
            activeSession.currentPhase as InterviewPhase
          );
        }
      }
    });
  };

  // Helper formatting for countdown timer
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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
        if (!isPausedRef.current) {
          secondsLeft = Math.max(0, secondsLeft - 1);

          if (secondsLeft === 0) {
            // Bug-fix #2: clear timer BEFORE setting phase and calling evaluation
            // so the timer never fires again and cannot re-trigger handleTimeOutSubmission
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            updateInterviewSession(
              0,
              codeRef.current,
              langRef.current,
              chatHistoryRef.current,
              "evaluating"
            );
            handleTimeOutSubmission();
          } else {
            updateInterviewSession(
              secondsLeft,
              codeRef.current,
              langRef.current,
              chatHistoryRef.current,
              phaseRef.current as InterviewPhase
            );
          }
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession === null, activeSession?.currentPhase]);

  // Render View Selector

  if (activeSession) {
    if (showPreBrief) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[600px] p-6 animate-fade-in">
          <div className="w-full max-w-2xl bg-darkCard border border-white/[0.08] p-8 rounded-2xl shadow-2xl glass-panel relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accentPrimary/50 via-purple-500/50 to-accentPrimary/50"></div>
            
            <div className="text-center space-y-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-accentPrimary/10 border border-accentPrimary/30 flex items-center justify-center mx-auto shadow-lg shadow-accentPrimary/5 mb-6">
                <Speech className="w-8 h-8 text-accentPrimary animate-pulse" />
              </div>
              <h1 className="text-3xl font-bold font-mono text-white tracking-tight">Interview Pre-Brief</h1>
              <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                Review your focus areas and target role before stepping into the simulator.
              </p>
            </div>

            <div className="space-y-6 bg-black/20 p-6 rounded-xl border border-white/[0.04]">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Topic Focus</span>
                  <div className="text-sm font-semibold text-white">{activeSession.topic}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Target Difficulty</span>
                  <div className="text-sm font-semibold text-accentPrimary">{activeSession.difficulty}</div>
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Interviewer Persona</span>
                  <div className="text-sm font-semibold text-white">{activeSession.interviewerPersonality}</div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/[0.04]">
                <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Interview Structure</span>
                <ul className="text-xs text-slate-300 space-y-2 font-mono">
                  <li className="flex gap-2 items-start"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"/> <span><strong>Phase 1:</strong> Introduction & Resume Review</span></li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"/> <span><strong>Phase 2:</strong> Data Structures & Algorithms Coding Challenge</span></li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"/> <span><strong>Phase 3:</strong> Core CS Theory & Architecture</span></li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"/> <span><strong>Phase 4:</strong> Logic Puzzles & System Verification</span></li>
                  <li className="flex gap-2 items-start"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"/> <span><strong>Phase 5:</strong> Behavioral & HR Questions</span></li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.04] flex justify-end gap-4">
              <button
                onClick={handleExitInterview}
                className="px-6 py-2.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.04] text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPreBrief(false)}
                className="px-6 py-2.5 rounded-xl bg-accentPrimary hover:bg-accentPrimary/90 text-white text-xs font-bold font-mono transition-all shadow-lg shadow-accentPrimary/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Enter Simulator</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Phase 2: SPLIT SCREEN WORKSPACE
    return (
      <div className="space-y-6">
        {/* Visual Progress Stepper */}
        <div className="bg-darkCard/50 border border-white/[0.04] p-4 rounded-xl backdrop-blur-md flex flex-wrap justify-between items-center gap-4">
          {["intro", "dsa", "core", "puzzles", "hr", "evaluating"].map((phase, idx) => {
            const phaseLabels: Record<string, string> = {
              intro: "1. Intro & Resume",
              dsa: "2. DSA Coding",
              core: "3. Core Theory",
              puzzles: "4. Logic Puzzles",
              hr: "5. HR Behavioral",
              evaluating: "6. Evaluating"
            };
            const phaseNames = ["intro", "dsa", "core", "puzzles", "hr", "evaluating"];
            const currentIdx = phaseNames.indexOf(activeSession.currentPhase);
            const isActive = activeSession.currentPhase === phase;
            const isCompleted = phaseNames.indexOf(phase) < currentIdx;

            return (
              <div key={phase} className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full border text-[10px] font-mono font-bold transition-all ${isCompleted ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : isActive ? "bg-accentPrimary/10 border-accentPrimary/30 text-accentPrimary animate-pulse shadow-lg shadow-accentPrimary/10" : "bg-white/[0.02] border-white/[0.08] text-slate-500"}`}>
                  {isCompleted ? "✓" : idx + 1}
                </div>
                <span className={`text-[11px] font-medium font-mono transition-all ${isCompleted ? "text-emerald-400/80" : isActive ? "text-white font-bold" : "text-slate-500"}`}>
                  {phaseLabels[phase]}
                </span>
                {idx < 5 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-700 hidden md:block" />
                )}
              </div>
            );
          })}
        </div>

        {/* Workspace Sub Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-darkCard/50 border border-white/[0.04] p-4 rounded-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accentPrimary/10 border border-accentPrimary/20 flex items-center justify-center text-accentPrimary">
              <Speech className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <span>Structured Technical Interview</span>
                {activeSession.subPhaseStatus && (
                  <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-accentPrimary/10 border border-accentPrimary/35 text-accentPrimary animate-pulse">
                    {activeSession.subPhaseStatus}
                  </span>
                )}
              </h1>
              <p className="text-[10px] text-slate-500 font-mono">
                Topic: <span className="text-white font-bold">{activeSession.topic}</span> | Difficulty Target: <span className="text-accentPrimary font-bold">{activeSession.difficulty}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Play/Pause Timer */}
            <button
              onClick={() => setIsSessionPaused(!isSessionPaused)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer flex items-center justify-center ${isSessionPaused ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20' : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white'}`}
              title={isSessionPaused ? "Resume Session" : "Pause Session"}
              aria-label={isSessionPaused ? "Resume Session" : "Pause Session"}
            >
              {isSessionPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
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
        {(activeSession.currentPhase as string) === "evaluating" || isEvaluating ? (
          <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-6">
            <div className="relative w-16 h-16">
              <Loader2 className="w-16 h-16 animate-spin text-accentPrimary" />
              <Sparkles className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto animate-ping" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Recruiting AI Evaluator Active</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed h-10 transition-opacity duration-500">
                {EVALUATION_MESSAGES[evalMsgIndex]}
              </p>
            </div>
          </div>
        ) : (
          /* Split Screen Panel */
          <>
            {/* Mobile Tab Switcher */}
            <div className="lg:hidden flex bg-black/40 p-1 rounded-xl border border-white/[0.08] mb-4">
              <button
                onClick={() => setActiveMobileTab("chat")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                  activeMobileTab === "chat" ? "bg-accentPrimary text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Dialogue Panel
              </button>
              <button
                onClick={() => setActiveMobileTab("editor")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                  activeMobileTab === "editor" ? "bg-accentPrimary text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Workspace
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left side: Dialogue & Chat Panel (5 Columns) */}
              <div className={`${isEditorMaximized ? "hidden" : "lg:col-span-5"} ${activeMobileTab === "chat" ? "flex" : "hidden"} lg:flex flex-col h-[650px] bg-darkCard/80 border border-white/[0.06] rounded-2xl overflow-hidden backdrop-blur-md`}>
                <div className="px-4 py-3 border-b border-white/[0.06] bg-white/[0.01] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-accentPrimary" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    {activeSession.currentPhase === "intro" ? "HR Panel" :
                     activeSession.currentPhase === "dsa" ? "Code Reviewer Panel" :
                     activeSession.currentPhase === "core" ? "Core CS Panel" :
                     activeSession.currentPhase === "puzzles" ? "Logic Panel" :
                     (activeSession.currentPhase as string) === "evaluating" ? "Evaluator Panel" :
                     "Interviewer Panel"}
                  </span>
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
                        <MarkdownRenderer content={msg.content} />
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
                        <MarkdownRenderer content={streamingDelta} />
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
              <div className="p-3 border-t border-white/[0.06] bg-black/20 shrink-0 animate-fade-in">
                {activeSession.currentPhase === "intro" && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.04] text-[10px] font-mono select-none">
                    <span className="text-slate-500">Self-Introduction:</span>
                    <div className="flex gap-2.5">
                      {state.user?.savedIntro ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setChatInput(state.user?.savedIntro || "")}
                            className="text-slate-400 hover:text-white transition-colors cursor-pointer hover:underline"
                            title="Insert saved introduction text into text box"
                          >
                            Draft Saved Pitch
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendChatMessage(undefined, state.user?.savedIntro)}
                            className="text-accentPrimary hover:text-cyan-400 transition-colors cursor-pointer font-bold hover:underline"
                            title="Send saved introduction immediately"
                          >
                            Instant Send
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-600 italic">No pitch template saved. Set in config panel.</span>
                      )}
                    </div>
                  </div>
                )}
                {/* Prompt Suggestions (Fix 87) */}
                {activeSession.currentPhase !== "evaluating" && !isAiResponding && !isSessionPaused && (
                  <div className="flex flex-wrap gap-2 pb-2">
                    {activeSession.currentPhase === "intro" && [
                      "Here is my quick introduction...",
                      "Can you review my resume highlights?"
                    ].map(s => (
                      <button key={s} onClick={() => setChatInput(s)} className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-white/[0.02] hover:bg-accentPrimary/10 border border-white/[0.08] hover:border-accentPrimary/30 text-slate-400 hover:text-accentPrimary transition-all cursor-pointer shadow-sm">
                        {s}
                      </button>
                    ))}
                    {activeSession.currentPhase === "dsa" && [
                      "Can I have a hint?", 
                      "Is my time complexity optimal?",
                      "Should I write the code now?"
                    ].map(s => (
                      <button key={s} onClick={() => setChatInput(s)} className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-white/[0.02] hover:bg-accentPrimary/10 border border-white/[0.08] hover:border-accentPrimary/30 text-slate-400 hover:text-accentPrimary transition-all cursor-pointer shadow-sm">
                        {s}
                      </button>
                    ))}
                    {activeSession.currentPhase === "core" && [
                      "Can you clarify the question?", 
                      "I'm not exactly sure, but I think..."
                    ].map(s => (
                      <button key={s} onClick={() => setChatInput(s)} className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-white/[0.02] hover:bg-accentPrimary/10 border border-white/[0.08] hover:border-accentPrimary/30 text-slate-400 hover:text-accentPrimary transition-all cursor-pointer shadow-sm">
                        {s}
                      </button>
                    ))}
                    {activeSession.currentPhase === "puzzles" && [
                      "Wait, let me think step-by-step.", 
                      "Does the edge case matter here?"
                    ].map(s => (
                      <button key={s} onClick={() => setChatInput(s)} className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-white/[0.02] hover:bg-accentPrimary/10 border border-white/[0.08] hover:border-accentPrimary/30 text-slate-400 hover:text-accentPrimary transition-all cursor-pointer shadow-sm">
                        {s}
                      </button>
                    ))}
                    {activeSession.currentPhase === "hr" && [
                      "Can I take a moment to format my STAR response?", 
                      "I have faced this before, specifically when..."
                    ].map(s => (
                      <button key={s} onClick={() => setChatInput(s)} className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-white/[0.02] hover:bg-accentPrimary/10 border border-white/[0.08] hover:border-accentPrimary/30 text-slate-400 hover:text-accentPrimary transition-all cursor-pointer shadow-sm">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 items-end">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isAiResponding || isSessionPaused}
                    placeholder="Type response... (Enter to send, Shift+Enter for new line)"
                    rows={2}
                    className="flex-1 min-w-0 bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-lg py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors resize-none overflow-y-auto max-h-32"
                  />
                  <button
                    onClick={() => handleSendChatMessage()}
                    disabled={isAiResponding || !chatInput.trim() || isSessionPaused}
                    className="w-8 h-8 rounded-lg bg-accentPrimary hover:bg-accentPrimary/90 disabled:bg-white/[0.02] text-white disabled:text-slate-600 flex items-center justify-center shrink-0 transition-colors cursor-pointer mb-0.5"
                    aria-label="Send Message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right side: Phase Specific Workspace Panel (7 Columns) */}
            <div className={`${isEditorMaximized ? "lg:col-span-12" : "lg:col-span-7"} ${activeMobileTab === "editor" ? "flex" : "hidden"} lg:flex flex-col h-[650px] bg-darkCard/80 border border-white/[0.06] rounded-2xl overflow-hidden backdrop-blur-md`}>
              {activeSession.currentPhase === "dsa" ? (
                <>
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
                        disabled={isSessionPaused}
                      >
                        <option value="cpp">C++ (G++ 17)</option>
                        <option value="java">Java (JDK 17)</option>
                        <option value="python">Python (3.9)</option>
                        <option value="typescript">TypeScript (TS 4.9)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setIsEditorMaximized(!isEditorMaximized)}
                        className="p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title={isEditorMaximized ? "Minimize Workspace" : "Maximize Workspace"}
                        aria-label={isEditorMaximized ? "Minimize Workspace" : "Maximize Workspace"}
                      >
                        {isEditorMaximized ? (
                          <Minimize2 className="w-3.5 h-3.5" />
                        ) : (
                          <Maximize2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Problem Description Panel */}
                  <div className="border-b border-white/[0.06] bg-black/20 shrink-0">
                    <button 
                      onClick={() => setIsGoalExpanded(!isGoalExpanded)}
                      className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    >
                      <span className="text-[10px] font-bold text-slate-400 font-mono group-hover:text-white transition-colors">Problem Statement</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isGoalExpanded ? "rotate-180" : ""}`} />
                    </button>
                    {isGoalExpanded && (
                      <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed font-mono max-h-48 overflow-y-auto">
                        <MarkdownRenderer content={activeSession.goal || ""} />
                      </div>
                    )}
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
                      onKeyDown={handleEditorKeyDown}
                      disabled={isSessionPaused}
                      placeholder="// Paste problem boilerplate or write your solution here...&#10;// Make sure to define time & space complexities before submissions."
                      className="flex-1 bg-transparent p-3 font-mono text-[11px] text-slate-200 placeholder-slate-700 focus:outline-none resize-none leading-relaxed overflow-y-auto disabled:opacity-50"
                    />
                  </div>

                  {/* Action bar */}
                  <div className="p-4 border-t border-white/[0.06] bg-black/30 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleRequestHint}
                        disabled={isAiResponding || isSessionPaused}
                        className="px-3.5 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.12] text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Get Hint</span>
                      </button>
                      <div className="w-px h-6 bg-white/[0.08] mx-1"></div>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="px-2.5 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.12] text-slate-300 text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Copy Code"
                        aria-label="Copy Code"
                      >
                        {copyCodeSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={handleResetCode}
                        disabled={isSessionPaused}
                        className="px-2.5 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.12] text-slate-300 hover:text-rose-400 text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Reset to Boilerplate"
                        aria-label="Reset to Boilerplate"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleExitInterview}
                        className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>End Interview Early</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSubmitCodeToInterviewer}
                        disabled={isAiResponding || !inputCode.trim() || isSessionPaused}
                        className="px-4 py-1.5 rounded-lg bg-accentPrimary hover:bg-accentPrimary/90 border border-accentPrimary/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-accentPrimary/20 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Submit Code</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : activeSession.currentPhase === "intro" ? (
                <div className="p-6 overflow-y-auto space-y-6 flex-1 flex flex-col justify-center select-text">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-accentPrimary/10 border border-accentPrimary/20 flex items-center justify-center mx-auto text-accentPrimary">
                      <UserCheck className="w-6 h-6 animate-pulse" />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Phase 1: Resume & Profile Assessment</h3>
                    <p className="text-xs text-slate-450 max-w-sm mx-auto leading-normal">
                      Introduce your background, primary technical stacks, and notable projects in the interviewer panel.
                    </p>
                  </div>
                  <div className="bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl space-y-3 max-w-sm mx-auto w-full">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-white/[0.04] pb-1.5">Candidate Profile</h4>
                    <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                      <div>
                        <span className="text-slate-500 block">Cohort:</span>
                        <span className="text-slate-300 font-bold">{state.user?.cohort || "CSE 2026"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Target Companies:</span>
                        <span className="text-slate-300 font-bold max-w-[120px] truncate block" title={state.user?.targetCompanies?.join(", ")}>{state.user?.targetCompanies?.join(", ") || "Any"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeSession.currentPhase === "core" ? (
                <div className="p-6 overflow-y-auto space-y-6 flex-1 flex flex-col justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-accentPrimary/10 border border-accentPrimary/20 flex items-center justify-center mx-auto text-accentPrimary">
                      <FileJson className="w-6 h-6 animate-pulse" />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Phase 3: Core CS Reference Guide</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-normal">
                      Keep these core theoretical concepts in mind during your explanations:
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto w-full text-left">
                    <div className="p-2.5 bg-white/[0.01] border border-white/[0.04] rounded-lg">
                      <span className="text-[10px] font-bold text-slate-400 font-mono block mb-1">Operating Systems</span>
                      <p className="text-[9px] text-slate-500 leading-normal">Processes vs Threads, Semaphores, Deadlocks, Paging, Virtual Memory.</p>
                    </div>
                    <div className="p-2.5 bg-white/[0.01] border border-white/[0.04] rounded-lg">
                      <span className="text-[10px] font-bold text-slate-400 font-mono block mb-1">DBMS</span>
                      <p className="text-[9px] text-slate-500 leading-normal">ACID properties, Normalization (1NF-3NF), B-Trees indexing, Joins, SQL vs NoSQL.</p>
                    </div>
                    <div className="p-2.5 bg-white/[0.01] border border-white/[0.04] rounded-lg">
                      <span className="text-[10px] font-bold text-slate-400 font-mono block mb-1">Computer Networks</span>
                      <p className="text-[9px] text-slate-500 leading-normal">OSI Model, TCP vs UDP handshakes, IP Routing, DNS, HTTP/HTTPS protocols.</p>
                    </div>
                    <div className="p-2.5 bg-white/[0.01] border border-white/[0.04] rounded-lg">
                      <span className="text-[10px] font-bold text-slate-400 font-mono block mb-1">OOPs Paradigm</span>
                      <p className="text-[9px] text-slate-500 leading-normal">Abstraction, Encapsulation, Inheritance, Run-time vs Compile-time Polymorphism.</p>
                    </div>
                  </div>
                </div>
              ) : activeSession.currentPhase === "puzzles" ? (
                <div className="p-4 flex-1 flex flex-col space-y-4">
                  <div className="text-center space-y-1 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-accentPrimary/10 border border-accentPrimary/20 flex items-center justify-center mx-auto text-accentPrimary">
                      <ClipboardList className="w-5 h-5 animate-pulse" />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Phase 4: Brainstorming Scratchpad</h3>
                    <p className="text-[10px] text-slate-400">Use this scratchpad to draft calculations or write down notes during the logic puzzle round.</p>
                  </div>
                  <textarea
                    placeholder="Type your notes or scratch calculations here..."
                    className="flex-1 bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-xl p-4 font-mono text-[11px] text-slate-250 placeholder-slate-700 focus:outline-none resize-none leading-relaxed overflow-y-auto"
                  />
                </div>
              ) : (
                <div className="p-6 overflow-y-auto space-y-6 flex-1 flex flex-col justify-center">
                  <div className="text-center space-y-2 text-slate-300">
                    <div className="w-12 h-12 rounded-full bg-accentPrimary/10 border border-accentPrimary/20 flex items-center justify-center mx-auto text-accentPrimary">
                      <Speech className="w-6 h-6 animate-pulse" />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Phase 5: STAR Response Framework</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-normal">
                      Recruiters score behavioral answers based on the **STAR** method:
                    </p>
                  </div>
                  <div className="max-w-sm mx-auto w-full space-y-3.5 text-left">
                    <div className="flex gap-3">
                      <span className="text-[10px] font-mono font-bold text-accentPrimary bg-accentPrimary/10 w-5 h-5 rounded flex items-center justify-center shrink-0">S</span>
                      <div>
                        <span className="text-[10px] font-bold text-white font-mono block">Situation</span>
                        <p className="text-[9.5px] text-slate-500 leading-normal">Set the context. Describe the specific event or challenge.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-[10px] font-mono font-bold text-accentPrimary bg-accentPrimary/10 w-5 h-5 rounded flex items-center justify-center shrink-0">T</span>
                      <div>
                        <span className="text-[10px] font-bold text-white font-mono block">Task</span>
                        <p className="text-[9.5px] text-slate-500 leading-normal">Describe the responsibility or goal that needed to be completed.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-[10px] font-mono font-bold text-accentPrimary bg-accentPrimary/10 w-5 h-5 rounded flex items-center justify-center shrink-0">A</span>
                      <div>
                        <span className="text-[10px] font-bold text-white font-mono block">Action</span>
                        <p className="text-[9.5px] text-slate-500 leading-normal">Explain the exact steps you took to address the challenge.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-[10px] font-mono font-bold text-accentPrimary bg-accentPrimary/10 w-5 h-5 rounded flex items-center justify-center shrink-0">R</span>
                      <div>
                        <span className="text-[10px] font-bold text-white font-mono block">Result</span>
                        <p className="text-[9.5px] text-slate-500 leading-normal">Outline the outputs, achievements, and key lessons learned.</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={handleSubmitInterview}
                      className="px-6 py-2 rounded-xl bg-accentPrimary hover:bg-accentPrimary/90 border border-accentPrimary/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-accentPrimary/20"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Submit & Get AI Scorecard</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          </>
        )}
      </div>
    );
  }

  // Phase 3: SCORECARD EVALUATION REPORT VIEW
  if (evaluationReport) {
    return (
      <InterviewScorecard 
        report={evaluationReport} 
        onDismiss={() => setEvaluationReport(null)} 
      />
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
          <InterviewSetupPanel onLaunch={handleLaunchSession} />
        </div>

        {/* History Scorecards (Right side, 1 Col) */}
        <div className="space-y-6">
          {state.mockInterviews && state.mockInterviews.length >= 2 && (
            <div className="bg-darkCard border border-white/[0.04] p-5 rounded-xl shadow-lg relative overflow-hidden glass-panel">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Performance Trend</h3>
              </div>
              <div className="flex items-end gap-2 h-32 pt-6">
                {[...state.mockInterviews].reverse().slice(-10).map((report) => {
                  const score = report.scorecard.overallScore;
                  const height = `${Math.max(10, score * 10)}%`;
                  const colorClass = score >= 8 ? 'bg-emerald-500' : score >= 5 ? 'bg-amber-500' : 'bg-rose-500';
                  return (
                    <div key={report.id} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                      <div className="w-full flex justify-center h-full items-end">
                        <div 
                          className={`w-full max-w-[24px] rounded-t-sm opacity-60 group-hover:opacity-100 transition-all ${colorClass}`}
                          style={{ height }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 group-hover:text-white transition-colors">{score}</span>
                      <div className="absolute -top-10 bg-darkCard border border-white/[0.1] shadow-2xl p-2 rounded-lg text-[10px] text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 transition-opacity flex flex-col gap-1">
                        <span className="font-bold">{report.topic}</span>
                        <span className="text-slate-400 font-mono">{report.difficulty}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <InterviewHistoryPanel onViewReport={setEvaluationReport} />
        </div>
      </div>
    </div>
  );
};

