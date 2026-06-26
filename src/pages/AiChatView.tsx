import React, { useState, useEffect, useRef } from "react";
import { useAppState } from "../context/AppStateContext";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { GlassCard } from "../components/Common";
import { SYSTEM_PROMPT } from "../lib/prompts";
import {
  Bot,
  User,
  Send,
  Trash2,
  Loader2,
  Sparkles,
  Code2,
  Database,
  Briefcase,
  Terminal,
  Copy,
  AlertTriangle,
  RefreshCw,
  Settings,
  GitBranch,
  Pin,
  Edit2
} from "lucide-react";


export const AiChatView: React.FC = () => {
  const {
    state,
    addChatMessage,
    clearChatHistory,
    createNewSession,
    setActiveSession,
    deleteSession,
    togglePinSession,
    renameSession,
    confirmAction,
    updateSessionSystemPrompt,
    branchSession,
    removeLastAssistantMessage
  } = useAppState();
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatStatus, setChatStatus] = useState("");
  const [streamingResponse, setStreamingResponse] = useState("");
  const [sidebarTab, setSidebarTab] = useState<"templates" | "history" | "settings">("templates");
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleInput, setEditTitleInput] = useState("");

  const activeSession = state.chatSessions?.[state.currentSessionId || "default-session"];
  const currentMessages = activeSession?.messages || [];
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (chatTextAreaRef.current) {
      chatTextAreaRef.current.style.height = "auto";
      const newHeight = Math.min(chatTextAreaRef.current.scrollHeight, 120);
      chatTextAreaRef.current.style.height = `${newHeight}px`;
    }
  }, [chatInput]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isLoading, streamingResponse]);

  // Clean up controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleAbortRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      setChatStatus("");
      setStreamingResponse("");
      setChatError("Request cancelled by user.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(chatInput);
    }
  };

  const handleSendMessage = async (inputVal: string, isRegenerate: boolean = false) => {
    if (!inputVal.trim() && !isRegenerate) return;
    if (isLoading) return;
    if (!state.settings.nvidiaApiKey) {
      setChatError("NVIDIA API Key is missing. Please configure it in settings.");
      return;
    }

    setIsLoading(true);
    setChatError(null);
    setChatStatus("Initializing context...");

    if (!isRegenerate) {
      addChatMessage("user", inputVal);
      setChatInput("");
    }
    
    // Auto-create session if this is the first message and there is no active session
    if (!activeSession) {
       createNewSession();
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const messagesToSend = [...currentMessages];
      if (isRegenerate) {
        messagesToSend.pop(); // Remove the last assistant response
      }

      const apiMessages = [
        { role: "system", content: activeSession?.systemPrompt || SYSTEM_PROMPT },
        ...messagesToSend.map(m => ({ role: m.role, content: m.content })),
      ];
      
      if (!isRegenerate) {
        apiMessages.push({ role: "user", content: inputVal });
      }

      const apiKey = state.settings.nvidiaApiKey;
      let response;
      try {
        setChatStatus("Connecting to local Vite dev proxy (/api-nvidia)...");
        response = await fetch("/api-nvidia/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: state.settings.nvidiaModelName || "meta/llama-3.1-70b-instruct",
            messages: apiMessages,
            temperature: 0.2,
            max_tokens: 1024,
            stream: true
          }),
          signal: controller.signal
        });

        if (response.status === 404) {
          throw new Error("Proxy route not found");
        }
      } catch (proxyErr: any) {
        if (proxyErr.name === "AbortError") {
          throw proxyErr;
        }

        console.warn("Proxy route failed, trying direct connection:", proxyErr);
        setChatStatus("Proxy unavailable. Connecting directly to NVIDIA NIM API...");
        response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: state.settings.nvidiaModelName || "meta/llama-3.1-70b-instruct",
            messages: apiMessages,
            temperature: 0.2,
            max_tokens: 1024,
            stream: true
          }),
          signal: controller.signal
        });
      }

      setChatStatus("Receiving response payload...");

      if (!response.ok) {
        const errorText = await response.text();
        let errorJson;
        try {
          errorJson = JSON.parse(errorText);
        } catch {
          errorJson = null;
        }
        throw new Error(errorJson?.error?.message || `HTTP ${response.status}: Failed to fetch response from NVIDIA NIM.`);
      }

      const contentType = response.headers.get("content-type");
      let accumulatedContent = "";
      let accumulatedReasoning = "";

      if (contentType && contentType.includes("text/event-stream")) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        if (!reader) {
          throw new Error("Response body is not readable.");
        }

        let buffer = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (trimmed === "data: [DONE]") continue;

            if (trimmed.startsWith("data: ")) {
              try {
                const jsonStr = trimmed.slice(6);
                const parsed = JSON.parse(jsonStr);
                const delta = parsed.choices?.[0]?.delta;
                
                if (delta) {
                  if (delta.reasoning_content) {
                    accumulatedReasoning += delta.reasoning_content;
                    setChatStatus("Thinking...");
                  } else if (delta.content) {
                    accumulatedContent += delta.content;
                    setChatStatus("Responding...");
                  }
                  
                  let responseText = "";
                  if (accumulatedReasoning) {
                    responseText += `<think>\n${accumulatedReasoning}\n</think>\n`;
                  }
                  responseText += accumulatedContent;
                  setStreamingResponse(responseText);
                }
              } catch (e) {
                console.warn("Failed to parse stream line:", trimmed, e);
              }
            }
          }
        }
      } else {
        const data = await response.json();
        const msg = data.choices?.[0]?.message;
        if (msg) {
          accumulatedReasoning = msg.reasoning_content || "";
          accumulatedContent = msg.content || "";
        }
      }

      let finalReply = "";
      if (accumulatedReasoning && (!accumulatedContent || !accumulatedContent.includes("<think>"))) {
        finalReply += `<think>\n${accumulatedReasoning}\n</think>\n`;
      }
      finalReply += accumulatedContent || "No reply received.";

      addChatMessage("assistant", finalReply);
      setStreamingResponse("");
      setChatStatus("");
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Fetch request aborted.");
        setChatError("Request cancelled by user.");
      } else {
        console.error(err);
        let errMsg = err.message || "An unexpected error occurred.";
        if (errMsg.includes("Failed to fetch")) {
          errMsg = "Failed to fetch response. This is likely due to browser CORS security blocks or network issues. " +
                   "Please verify that your internet connection is active, your NVIDIA API Key in Settings is valid, and the local Vite proxy server is running.";
        }
        setChatError(errMsg);
      }
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
      setStreamingResponse("");
    }
  };

  const handleRegenerate = () => {
    if (isLoading || currentMessages.length < 2) return;
    const lastMessage = currentMessages[currentMessages.length - 1];
    if (lastMessage.role !== "assistant") return;
    
    removeLastAssistantMessage();
    handleSendMessage("", true);
  };

  const handleClearHistory = () => {
    confirmAction({
      title: "Clear Chat History",
      message: "Are you sure you want to clear your chat history? This cannot be undone.",
      confirmText: "Clear History",
      cancelText: "Cancel",
      severity: "danger",
      onConfirm: () => clearChatHistory()
    });
  };

  const copyMessageToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Structured templates deck
  const promptTemplates = [
    {
      title: "DSA Mock Interview",
      icon: Code2,
      desc: "Practice coding questions interactively",
      prompt: "Start a mock placement interview for a [Insert Difficulty: Easy/Medium/Hard] DSA problem on the topic of [Insert Topic: e.g., Trees/DP/Graphs/Arrays]. Do not give the code immediately; guide me through explaining my approach, check my pseudocode, and evaluate my time/space complexities."
    },
    {
      title: "System Design Drill",
      icon: Database,
      desc: "Design scalable distributed systems",
      prompt: "Walk me through the high-level system design of [Insert System: e.g., URL Shortener/Chat App/Uber/Netflix]. Detail the database schema, caching strategy, scaling mechanisms, and potential failure points."
    },
    {
      title: "STAR Project Story",
      icon: Briefcase,
      desc: "Format project achievements for HR",
      prompt: "Help me structure a STAR (Situation, Task, Action, Result) interview response for my project: [Insert Project Name]. The stack is [Insert Stack: e.g., React/Vite/TypeScript/Node], and it solves this problem: [Insert Brief Description]. Align my explanation for mock placement interviews."
    },
    {
      title: "Explain Concept Meticulously",
      icon: Terminal,
      desc: "Get tables/flowcharts explaining concepts",
      prompt: "Explain the concept of [Insert Topic: e.g., DBMS Normalization/REST vs GraphQL/Operating Systems Page Replacement] in meticulous detail. Use structured markdown tables and diagrams where helpful to explain it for placement prep."
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 select-none">
      
      {/* Left Column: Quick prompt templates deck / Chat history sessions */}
      <div className="w-full lg:w-80 flex flex-col gap-4 flex-shrink-0 justify-between h-full overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden min-h-0 space-y-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-slate-500">technical coaching</span>
            <h2 className="text-2xl font-extrabold tracking-tight text-white mt-0.5">Technical Mentor</h2>
            <p className="text-xs text-slate-400 leading-relaxed mt-1">
              Ask about algorithms, system layouts, mock interviews, or review custom code.
            </p>
          </div>

          {/* Sidebar Tabs */}
          <div className="flex bg-white/[0.02] border border-white/[0.04] p-1 rounded-xl text-xs font-bold uppercase tracking-wider select-none font-mono">
            <button
              onClick={() => setSidebarTab("templates")}
              className={`flex-1 py-1.5 px-3 rounded-lg transition-all cursor-pointer text-center ${
                sidebarTab === "templates"
                  ? "bg-accentPrimary text-white shadow-md"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setSidebarTab("history")}
              className={`flex-1 py-1.5 px-3 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                sidebarTab === "history"
                  ? "bg-accentPrimary text-white shadow-md"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              History
              {state.chatSessions && Object.keys(state.chatSessions).length > 0 && (
                <span className="bg-white/10 text-[9px] px-1.5 py-0.2 rounded-full text-slate-300">
                  {Object.keys(state.chatSessions).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setSidebarTab("settings")}
              className={`flex-1 py-1.5 px-3 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                sidebarTab === "settings"
                  ? "bg-accentPrimary text-white shadow-md"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Settings className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {sidebarTab === "templates" ? (
              <div className="space-y-3">
                {promptTemplates.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => setChatInput(item.prompt)}
                      className="bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.08] p-3 rounded-xl transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-accentPrimary transition-colors">
                        <Icon className="w-4 h-4 text-slate-500 group-hover:text-accentPrimary transition-colors" />
                        <span>{item.title}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 leading-normal group-hover:text-slate-400 transition-colors">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : sidebarTab === "history" ? (
              <div className="space-y-2">
                <button
                  onClick={() => createNewSession()}
                  className="w-full py-2 bg-accentPrimary/10 border border-accentPrimary/20 hover:bg-accentPrimary/20 text-accentPrimary rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer mb-2"
                >
                  + New Chat
                </button>
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {(Object.values(state.chatSessions || {}).sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))).map((session) => {
                    const active = state.currentSessionId === session.id;
                    const isEditing = editingSessionId === session.id;
                    
                    return (
                      <div
                        key={session.id}
                        className={`p-3 rounded-xl border transition-all cursor-pointer relative group ${
                          active
                            ? "bg-accentPrimary/10 border-accentPrimary/30"
                            : "bg-white/[0.01] border-white/[0.04] hover:bg-white/[0.03] hover:border-white/[0.08]"
                        }`}
                        onClick={() => setActiveSession(session.id)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editTitleInput}
                              onChange={(e) => setEditTitleInput(e.target.value)}
                              onBlur={() => {
                                if (editTitleInput.trim()) {
                                  renameSession(session.id, editTitleInput.trim());
                                }
                                setEditingSessionId(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  if (editTitleInput.trim()) {
                                    renameSession(session.id, editTitleInput.trim());
                                  }
                                  setEditingSessionId(null);
                                } else if (e.key === "Escape") {
                                  setEditingSessionId(null);
                                }
                              }}
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 bg-black/40 border border-white/[0.1] focus:border-accentPrimary rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                            />
                          ) : (
                            <span className="text-xs font-bold truncate flex-1 leading-normal pr-14">
                              {session.isPinned && "📌 "}{session.title}
                            </span>
                          )}

                          {!isEditing && (
                            <div className="absolute right-2 top-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 pl-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePinSession(session.id);
                                }}
                                title={session.isPinned ? "Unpin chat" : "Pin chat"}
                                className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-amber-400 transition-colors"
                              >
                                <Pin className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  branchSession(session.id);
                                }}
                                title="Fork session"
                                className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                              >
                                <GitBranch className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingSessionId(session.id);
                                  setEditTitleInput(session.title);
                                }}
                                title="Rename chat"
                                className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmAction({
                                    title: "Delete Chat Session",
                                    message: `Are you sure you want to delete "${session.title}"?`,
                                    confirmText: "Delete",
                                    cancelText: "Cancel",
                                    severity: "danger",
                                    onConfirm: () => deleteSession(session.id)
                                  });
                                }}
                                title="Delete chat"
                                className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-rose-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
                          <span>{session.messages.length} messages</span>
                          <span>{session.createdAt}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : sidebarTab === "settings" ? (
              <div className="space-y-4">
                <div className="bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-2 mb-1.5">
                      <Terminal className="w-3.5 h-3.5 text-accentPrimary" />
                      Session System Prompt
                    </label>
                    <p className="text-[10px] text-slate-500 leading-normal mb-3">
                      Override the default personality and instructions for the current chat session.
                    </p>
                    <textarea
                      value={activeSession?.systemPrompt || ""}
                      onChange={(e) => {
                        if (activeSession) {
                          updateSessionSystemPrompt(activeSession.id, e.target.value);
                        }
                      }}
                      disabled={!activeSession}
                      placeholder={SYSTEM_PROMPT}
                      className="w-full h-40 bg-black/40 border border-white/[0.06] rounded-lg p-3 text-[11px] text-slate-300 font-mono resize-y focus:outline-none focus:border-accentPrimary transition-colors disabled:opacity-50"
                    />
                  </div>
                  {!activeSession && (
                    <p className="text-[10px] text-amber-500 italic">Start a chat session first to customize its system prompt.</p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Clear Button */}
        {currentMessages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="w-full py-2 border border-rose-500/20 hover:border-rose-500 bg-rose-500/5 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow shrink-0"
          >
            <Trash2 className="w-4 h-4" /> Clear Current Chat
          </button>
        )}
      </div>

      {/* Right Column: Dynamic spacious Chat Viewport */}
      <GlassCard className="flex-1 flex flex-col justify-between overflow-hidden relative p-0 border border-white/[0.06] shadow-2xl rounded-2xl bg-darkCard/50">
        
        {/* Chat Drawer Header */}
        <div className="h-14 border-b border-white/[0.06] px-6 flex items-center justify-between bg-white/[0.002]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accentPrimary animate-pulse" />
            <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">Placement Mentor Chatroom</h3>
          </div>
          
          <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-slate-500">
            <span className={`w-1.5 h-1.5 rounded-full ${state.settings.nvidiaApiKey ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            <span>{state.settings.nvidiaApiKey ? state.settings.nvidiaModelName.split("/").pop() : "Offline mode"}</span>
          </div>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 select-text">
          {currentMessages.length === 0 && !streamingResponse ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-accentPrimary/5 border border-accentPrimary/20 flex items-center justify-center text-accentPrimary shadow-inner">
                <Bot className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-white">Interactive Engineering Coaching</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Start your training. Select a template on the left deck or ask custom placement prep queries below. Enforce code structures under time constraints.
                </p>
              </div>

              {!state.settings.nvidiaApiKey && (
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 text-left w-full">
                  <span className="text-[10px] font-bold text-amber-500 block mb-1">Cockpit Settings Needed</span>
                  <p className="text-[9px] text-slate-400 leading-normal">
                    AI chat requires an active API token. Go to settings tab, copy credentials from NVIDIA build catalog, and test configuration properties.
                  </p>
                </div>
              )}

              {/* Always show templates in empty state */}
              <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {promptTemplates.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setChatInput(item.prompt);
                        if (chatTextAreaRef.current) {
                          chatTextAreaRef.current.focus();
                        }
                      }}
                      className="bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] p-3 rounded-xl transition-all cursor-pointer group flex flex-col items-start gap-2 h-full"
                    >
                      <div className="w-6 h-6 rounded-md bg-accentPrimary/5 border border-accentPrimary/10 flex items-center justify-center text-accentPrimary shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-200 block mb-0.5">{item.title}</span>
                        <span className="text-[9px] text-slate-500 block">{item.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {currentMessages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-3 group relative`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-accentPrimary shrink-0 mt-0.5 shadow-sm select-none">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 select-text relative shadow-sm leading-relaxed border ${
                        isUser
                          ? "bg-accentPrimary/10 border-accentPrimary/20 rounded-tr-none text-slate-200"
                          : "bg-white/[0.01] border-white/[0.04] rounded-tl-none text-slate-300"
                      }`}
                    >
                      {/* Copy message helper */}
                      <div className="absolute top-2.5 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 select-none">
                        <button
                          onClick={() => copyMessageToClipboard(msg.content)}
                          title="Copy message contents"
                          className="p-1 rounded bg-black/40 border border-white/[0.06] text-slate-500 hover:text-white hover:bg-black/60 transition-all cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>

                      {isUser ? (
                        <div className="whitespace-pre-wrap text-[12px]">{msg.content}</div>
                      ) : (
                        <MarkdownRenderer content={msg.content} />
                      )}
                      
                      <span className="block text-[8px] text-slate-600 font-mono text-right mt-1.5 tracking-tight select-none">
                        {msg.timestamp}
                      </span>
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 rounded-lg bg-accentPrimary/10 border border-accentPrimary/20 flex items-center justify-center text-accentPrimary shrink-0 mt-0.5 shadow-sm select-none">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                      
                    {!isUser && msg.id === currentMessages[currentMessages.length - 1].id && (
                      <div className="absolute -bottom-6 left-12 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={handleRegenerate}
                          disabled={isLoading}
                          className="flex items-center gap-1.5 px-2 py-1 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.1] rounded-lg text-[9px] text-slate-400 hover:text-white transition-all disabled:opacity-50"
                        >
                          <RefreshCw className="w-3 h-3" /> Regenerate
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {streamingResponse && (
                <div className="flex justify-start items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-accentPrimary shrink-0 mt-0.5 shadow-sm select-none">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl px-4 py-3 select-text shadow-sm bg-white/[0.01] border border-white/[0.04] rounded-tl-none text-slate-300">
                    <MarkdownRenderer content={streamingResponse} />
                    <span className="block text-[8px] text-slate-600 font-mono text-right mt-1.5 tracking-tight animate-pulse select-none">
                      Live generating...
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {isLoading && (
            <div className="flex justify-start items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-accentPrimary shrink-0 mt-0.5 animate-pulse select-none">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl rounded-tl-none px-4 py-3 text-slate-400 flex flex-col gap-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-accentPrimary" />
                  <span className="font-mono text-[10px] tracking-wide text-slate-300">
                    {chatStatus || "Mentor is thinking..."}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAbortRequest}
                  className="self-start text-[9px] font-mono font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 px-2 py-0.5 rounded transition-all active:scale-95 cursor-pointer select-none"
                >
                  Cancel Response
                </button>
              </div>
            </div>
          )}

          {chatError && (
            <div className="p-3.5 bg-rose-500/5 border border-rose-500/10 text-rose-400 rounded-xl text-[10px] font-mono leading-relaxed select-text flex gap-2 items-start">
              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Connection Error:</strong> {chatError}
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input box */}
        <div className="p-4 border-t border-white/[0.06] bg-black/20 shrink-0 select-none">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(chatInput);
            }}
            className="flex gap-2 items-end"
          >
            <textarea
              ref={chatTextAreaRef}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || !state.settings.nvidiaApiKey}
              placeholder={
                state.settings.nvidiaApiKey
                  ? "Enter query (e.g. explain sliding window, review arrays structure)..."
                  : "NVIDIA API token key properties missing in cockpit config settings..."
              }
              rows={1}
              className="flex-1 min-w-0 bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-600 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed transition-colors resize-none overflow-y-auto max-h-[120px] leading-relaxed"
            />
            <button
              type="submit"
              disabled={isLoading || !chatInput.trim() || !state.settings.nvidiaApiKey}
              className="w-10 h-10 rounded-xl bg-accentPrimary hover:bg-accentPrimary/90 disabled:bg-white/[0.02] text-white disabled:text-slate-600 border border-white/[0.04] disabled:border-transparent flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      </GlassCard>
    </div>
  );
};

