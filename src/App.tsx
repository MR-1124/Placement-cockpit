import React, { useState, useEffect, useRef } from "react";
import { AppStateProvider, useAppState } from "./context/AppStateContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Lazy load heavy views
const InterviewSimulatorView = React.lazy(() => import("./pages/InterviewSimulatorView").then(module => ({ default: module.InterviewSimulatorView })));
const DsaView = React.lazy(() => import("./pages/DsaView").then(module => ({ default: module.DsaView })));
const DevView = React.lazy(() => import("./pages/DevView").then(module => ({ default: module.DevView })));
const ProjectsView = React.lazy(() => import("./pages/ProjectsView").then(module => ({ default: module.ProjectsView })));
const RevisionView = React.lazy(() => import("./pages/RevisionView").then(module => ({ default: module.RevisionView })));
const NotesView = React.lazy(() => import("./pages/NotesView").then(module => ({ default: module.NotesView })));
const AiChatView = React.lazy(() => import("./pages/AiChatView").then(module => ({ default: module.AiChatView })));
const AiTrackerView = React.lazy(() => import("./pages/AiTrackerView").then(module => ({ default: module.AiTrackerView })));
const BadgesView = React.lazy(() => import("./pages/BadgesView").then(module => ({ default: module.BadgesView })));

const FlashcardsView = React.lazy(() => import("./pages/FlashcardsView").then(module => ({ default: module.FlashcardsView })));
const CompanyRoadmapsView = React.lazy(() => import("./pages/CompanyRoadmapsView").then(module => ({ default: module.CompanyRoadmapsView })));
const ResumeGraderView = React.lazy(() => import("./pages/ResumeGraderView").then(module => ({ default: module.ResumeGraderView })));


import { DashboardView } from "./pages/DashboardView";
import { RoadmapView } from "./pages/RoadmapView";
import { SettingsView } from "./pages/SettingsView";
import { ProfileView } from "./pages/ProfileView";
import { PlansView } from "./pages/PlansView";
import { LandingView } from "./pages/LandingView";
import { MarkdownRenderer } from "./components/MarkdownRenderer";
import { FocusMode } from "./components/FocusMode";
import { motion, AnimatePresence } from "framer-motion";

import {
  LayoutDashboard,
  Map,
  Code2,
  Layers,
  Terminal,
  FolderGit2,
  CalendarRange,
  StickyNote,
  Trophy,
  Settings,
  Flame,
  Menu,
  X,
  MessageSquare,
  Send,
  Bot,
  User,
  Loader2,
  Trash2,
  Maximize2,
  Minimize2,
  ClipboardList,
  Speech,
  Briefcase,
  Brain,
  FileText
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";


import { SYSTEM_PROMPT } from "./lib/prompts";

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedState = localStorage.getItem("placement_cockpit_state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.activeInterviewSession) {
          return "interview";
        }
      } catch (e) {}
    }
    const lastUser = localStorage.getItem("last_logged_in_user");
    return lastUser ? "dashboard" : "landing";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const state = useAppState(s => s.state);
const readinessScore = useAppState(s => s.readinessScore);
const level = useAppState(s => s.level);
const xpProgress = useAppState(s => s.xpProgress);
const levelTitle = useAppState(s => s.levelTitle);
const curriculum = useAppState(s => s.curriculum);
const addChatMessage = useAppState(s => s.addChatMessage);
const clearChatHistory = useAppState(s => s.clearChatHistory);
const confirmAction = useAppState(s => s.confirmAction);


  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isWideChat, setIsWideChat] = useState(false);
  const [chatInput, setChatInput] = useState("");

  const activeSession = state.chatSessions?.[state.currentSessionId || "default-session"];
  const currentMessages = activeSession?.messages || [];
  // Focus Mode state (restored from localStorage if active and not expired)
  const [focusSession, setFocusSession] = useState<{
    isOpen: boolean;
    active: any;
  }>(() => {
    const saved = localStorage.getItem("active_focus_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.active) {
          let restoredTime = parsed.timeLeft;
          if (!parsed.isPaused && parsed.lastSavedTime) {
            const elapsedSeconds = Math.floor((Date.now() - parsed.lastSavedTime) / 1000);
            restoredTime = Math.max(0, parsed.timeLeft - elapsedSeconds);
          }
          if (restoredTime > 0) {
            return { isOpen: true, active: { ...parsed.active, restoredTime, isPaused: parsed.isPaused } };
          } else {
            localStorage.removeItem("active_focus_session");
          }
        }
      } catch (e) {
        console.error("Failed to restore focus session state on startup", e);
      }
    }
    return { isOpen: false, active: null };
  });
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatStatus, setChatStatus] = useState<string>("");
  const [streamingResponse, setStreamingResponse] = useState<string>("");
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync tab navigation with user authentication status
  useEffect(() => {
    if (state.user === null) {
      setActiveTab("landing");
    } else if (activeTab === "landing") {
      setActiveTab("dashboard");
    }
  }, [state.user, activeTab]);

  useEffect(() => {
    if (chatTextAreaRef.current) {
      chatTextAreaRef.current.style.height = "auto";
      const newHeight = Math.min(chatTextAreaRef.current.scrollHeight, 120);
      chatTextAreaRef.current.style.height = `${newHeight}px`;
    }
  }, [chatInput]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentMessages, isLoading, streamingResponse]);

  // Cleanup AbortController on unmount
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
      // Bug #11 fix: clear partial streaming text on abort
      setStreamingResponse("");
      setChatError("Request cancelled by user.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const apiKey = state.sessionNvidiaKey;
    if (!apiKey) {
      setChatError("API Key is missing. Please configure it in Settings.");
      return;
    }

    const currentInput = chatInput;
    setChatInput("");
    setChatError(null);
    setStreamingResponse("");

    // Save message locally
    addChatMessage("user", currentInput);
    setIsLoading(true);
    setChatStatus("Initializing request...");

    // Set up AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const apiMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...currentMessages.map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: currentInput }
      ];

      let response;

      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const useStream = isLocalhost;

      try {
        setChatStatus(isLocalhost ? "Connecting to local Vite dev proxy (/api-nvidia)..." : "Connecting to Netlify API proxy (/api-nvidia)...");
        // Try local proxy endpoint first to bypass browser CORS blocks
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
            stream: useStream
          }),
          signal: controller.signal
        });

        if (response.status === 404) {
          throw new Error("Proxy route not configured or not found");
        }
      } catch (proxyErr: any) {
        if (proxyErr.name === "AbortError") {
          throw proxyErr;
        }
        
        console.warn("Proxy route failed/unavailable, trying direct API call:", proxyErr);
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
            stream: useStream
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
        // Non-streaming response fallback
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
          const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
          errMsg = isLocalhost
            ? "Connection Error: Failed to fetch response. This is likely due to browser CORS security blocks or network issues. Please verify that your internet connection is active, your NVIDIA API Key in Settings is valid, and the local Vite proxy server is running."
            : "Connection Error: Failed to fetch response from Netlify API proxy. Please verify that your internet connection is active, your NVIDIA API Key in Settings is valid, and the Netlify redirect configuration is correct.";
        }
        setChatError(errMsg);
      }
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
      setStreamingResponse("");
    }
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

  const primaryPlanId = state.primaryPlanId || "16-week-mastery";
  const primaryPlan = curriculum.ALL_PLANS.find((p: any) => p.id === primaryPlanId) || curriculum.ALL_PLANS[0];

  const navigationItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "companies", name: "Company Roadmaps", icon: Briefcase },
    { id: "flashcards", name: "Flashcards", icon: Brain },
    { id: "resume", name: "Resume ATS", icon: FileText },
    { id: "plans", name: "Plans", icon: ClipboardList },
    { id: "roadmap", name: primaryPlan.title, icon: Map },
    { id: "dsa", name: "DSA Tracker", icon: Code2 },
    { id: "dev", name: "Full Stack", icon: Layers },
    { id: "ai", name: "AI Tracker", icon: Terminal },
    { id: "aichat", name: "AI Mentor", icon: MessageSquare },
    { id: "interview", name: "Mock Interview", icon: Speech },
    { id: "projects", name: "Projects", icon: FolderGit2 },
    { id: "revision", name: "Revision Plan", icon: CalendarRange },
    { id: "notes", name: "Notebook", icon: StickyNote },
    { id: "badges", name: "Badges", icon: Trophy },
    { id: "profile", name: "My Profile", icon: User },
    { id: "settings", name: "Settings", icon: Settings }
  ];

  // Helper to resolve currently active page view
  const renderView = () => {
    switch (activeTab) {
      case "companies":
        return <CompanyRoadmapsView />;
      case "flashcards":
        return <FlashcardsView />;
      case "resume":
        return <ResumeGraderView />;
      case "dashboard":
        return (
          <DashboardView 
            setActiveTab={setActiveTab} 
            onOpenFocusConfig={() => setFocusSession({ isOpen: true, active: null })} 
          />
        );
      case "plans":
        return <PlansView />;
      case "roadmap":
        return <RoadmapView />;
      case "dsa":
        return <DsaView />;
      case "dev":
        return <DevView />;
      case "ai":
        return <AiTrackerView />;
      case "aichat":
        return <AiChatView />;
      case "interview":
        return <InterviewSimulatorView />;
      case "projects":
        return <ProjectsView />;
      case "revision":
        return <RevisionView />;
      case "notes":
        return <NotesView />;
      case "badges":
        return <BadgesView />;
      case "profile":
        return <ProfileView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView setActiveTab={setActiveTab} />;
    }
  };

  if (state.isLoadingUser) {
    return (
      <div className="min-h-screen bg-darkBg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accentPrimary animate-spin" />
      </div>
    );
  }

  if (state.user === null || activeTab === "landing") {
    return <LandingView onEnterDashboard={() => setActiveTab("dashboard")} />;
  }

  return (
    <div className={`min-h-screen flex text-slate-200 relative ${state.settings.compactUi ? "text-sm" : ""}`}>
      {/* Background dot grid helper */}
      <div className="absolute inset-0 bg-dot-grid pointer-events-none z-0" />

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-darkCard/80 border-r border-white/[0.06] backdrop-blur-md sticky top-0 h-screen z-20 justify-between select-none transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
        
        {/* Top Header Logo */}
        <div className={`p-6 border-b border-white/[0.06] flex items-center ${collapsed ? "justify-center flex-col gap-4" : "justify-between"}`}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accentPrimary flex items-center justify-center font-bold text-white text-xs shadow-md shrink-0">
              P
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <span className="font-extrabold text-white text-sm tracking-tight block truncate">Placement Cockpit</span>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-none">Personal OS</span>
              </div>
            )}
          </div>
          
          <button 
            onClick={toggleSidebar} 
            className="text-slate-500 hover:text-white transition-colors"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className={`flex-1 py-6 space-y-1 overflow-y-auto overflow-x-hidden ${collapsed ? "px-2" : "px-4"}`}>
          {navigationItems.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group relative w-full flex items-center ${collapsed ? "justify-center" : "gap-3"} px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all border ${
                  active
                    ? "bg-accentPrimary/5 border-accentPrimary/20 text-white"
                    : "bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.01]"
                }`}
              >
                {collapsed && active && (
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-accentPrimary shadow-[0_0_8px_var(--accent-color)]" />
                )}
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-accentPrimary" : "text-slate-500"}`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
                
                {/* Tooltip for Collapsed Mode */}
                {collapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-darkCard border border-white/10 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity">
                    {item.name}
                  </div>
                )}

                {/* Active Indicator LED (Expanded Mode) */}
                {!collapsed && active && (
                  <div className="w-1 h-1 rounded-full bg-accentPrimary ml-auto shadow-[0_0_8px_var(--accent-color)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Metrics card */}
        <div className="p-4 border-t border-white/[0.06] bg-white/[0.002] space-y-4">
          {/* Level Progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-accentPrimary font-bold uppercase tracking-wider">Lvl {level}: {levelTitle}</span>
              <span className="text-slate-500">{state.xp} XP</span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.02]">
              <div
                className="h-full bg-accentPrimary rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span>Streak: <span className="text-amber-500 font-bold">🔥 {state.streak}d</span></span>
              <span>Readiness: <span className="text-white font-bold">{readinessScore}%</span></span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.02]">
              <div
                className="h-full bg-accentPrimary rounded-full transition-all duration-500"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-darkCard/80 border-b border-white/[0.06] backdrop-blur-md flex justify-between items-center px-4 z-30 select-none">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-accentPrimary flex items-center justify-center font-bold text-white text-[10px] shadow">
            P
          </div>
          <span className="font-extrabold text-white text-xs tracking-tight">Placement Cockpit</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Quick Streak */}
          <div className="flex items-center gap-1 font-mono text-xs text-amber-500 font-bold bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
            <Flame className="w-3.5 h-3.5 fill-amber-500/10" />
            <span>{state.streak}d</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer Dropdown */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden absolute top-16 left-0 right-0 bg-darkCard/95 border-b border-white/[0.08] p-4 grid grid-cols-2 gap-3 z-40 backdrop-blur-md animate-slide-up"
        >
          {navigationItems.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 p-3 rounded-lg border text-xs font-semibold ${
                  active
                    ? "bg-accentPrimary/5 border-accentPrimary/20 text-white"
                    : "bg-white/[0.005] border-white/[0.04] text-slate-500"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (For Critical Dashboard elements) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-darkCard/80 border-t border-white/[0.06] backdrop-blur-md flex justify-around items-center px-2 z-20 select-none">
        {[
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { id: "roadmap", label: "16-Week", icon: Map },
          { id: "dsa", label: "DSA", icon: Code2 },
          { id: "dev", label: "Full Stack", icon: Layers },
          { id: "interview", label: "Mock", icon: Speech }
        ].map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[9px] font-semibold transition-all ${
                active ? "text-accentPrimary" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Contents Area */}
      <main className="flex-1 w-full min-h-screen pt-20 pb-24 px-4 sm:px-6 md:px-8 lg:pt-8 lg:pb-8 lg:px-12 z-10 overflow-y-auto max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Chat Bubble */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-20 lg:bottom-8 right-6 lg:right-8 w-12 h-12 rounded-full bg-accentPrimary hover:bg-accentPrimary/90 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(var(--accent-rgb),0.3)] hover:shadow-[0_4px_25px_rgba(var(--accent-rgb),0.5)] active:scale-95 transition-all z-40 group"
        aria-label={isChatOpen ? "Close placement assistant" : "Open placement assistant"}
      >
        {isChatOpen ? (
          <X className="w-5 h-5 transition-transform duration-300 rotate-90" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            {/* Bug #10 fix: dot shows when there ARE messages (invite to review)
                not when empty (the old inverted logic was counterintuitive) */}
            {currentMessages.length > 0 && (
              <>
                <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-accentPrimary rounded-full animate-ping" />
                <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-accentPrimary rounded-full" />
              </>
            )}
          </div>
        )}
      </button>

      {/* Slide-out Chat Drawer */}
      {isChatOpen && (
        <>
          {/* Backdrop Overlay for Mobile */}
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-40 animate-fade-in"
            onClick={() => setIsChatOpen(false)}
          />
          
          <div
            className={`fixed top-16 lg:top-0 right-0 bottom-16 lg:bottom-0 ${
              isWideChat ? "w-full lg:w-[600px]" : "w-full lg:w-[400px]"
            } bg-darkCard/95 backdrop-blur-xl border-l border-white/[0.08] z-50 flex flex-col shadow-2xl transition-all duration-300 animate-fade-in`}
          >
            {/* Drawer Header */}
            <div className="h-16 px-4 border-b border-white/[0.06] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accentPrimary/10 border border-accentPrimary/20 flex items-center justify-center text-accentPrimary">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">AI Placement Mentor</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${state.sessionNvidiaKey ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                    <span className="text-[9px] font-mono text-slate-500 uppercase">
                      {state.sessionNvidiaKey ? (state.settings.nvidiaModelName.split("/").pop() || "NVIDIA NIM") : "OFFLINE"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {currentMessages.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    title="Clear chat history"
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-white/[0.02] rounded-lg transition-colors cursor-pointer"
                    aria-label="Clear chat history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsWideChat(!isWideChat)}
                  title={isWideChat ? "Collapse view" : "Expand to wide view"}
                  className="p-2 text-slate-500 hover:text-white hover:bg-white/[0.02] rounded-lg transition-colors cursor-pointer"
                  aria-label={isWideChat ? "Collapse view" : "Expand to wide view"}
                >
                  {isWideChat ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 text-slate-500 hover:text-white hover:bg-white/[0.02] rounded-lg transition-colors cursor-pointer"
                  aria-label="Close Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text">
              {currentMessages.length === 0 && !streamingResponse ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-accentPrimary/5 border border-accentPrimary/20 flex items-center justify-center text-accentPrimary shadow-inner">
                    <Bot className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Placement AI Mentor</h4>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-[280px] leading-relaxed">
                      Powered by NVIDIA NIM. Ask me about DSA patterns, system design, mock interviews using the STAR format, and how to stop vibe-coding.
                    </p>
                  </div>

                  {!state.sessionNvidiaKey && (
                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 mt-4 text-left max-w-xs">
                      <span className="text-[10px] font-bold text-amber-500 block mb-1">API Key Needed</span>
                      <p className="text-[9px] text-slate-400 leading-normal">
                        You must supply an NVIDIA API Key in Settings to enable the AI Placement Mentor.
                      </p>
                      <button
                        onClick={() => {
                          setActiveTab("settings");
                          setIsChatOpen(false);
                        }}
                        className="mt-2.5 w-full bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white border border-amber-500/20 text-[9px] font-bold py-1.5 px-2 rounded-lg transition-colors"
                      >
                        Configure Cockpit Settings
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {currentMessages.map((msg) => {
                    const isUser = msg.role === "user";
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-2.5`}
                      >
                        {!isUser && (
                          <div className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-accentPrimary shrink-0 mt-0.5 shadow-sm">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed select-text shadow-sm ${
                            isUser
                              ? "bg-accentPrimary/10 border border-accentPrimary/20 rounded-tr-none text-slate-200"
                              : "bg-white/[0.01] border border-white/[0.04] rounded-tl-none text-slate-300"
                          }`}
                        >
                          {isUser ? (
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                          ) : (
                            <MarkdownRenderer content={msg.content} />
                          )}
                          <span className="block text-[8px] text-slate-600 font-mono text-right mt-1 tracking-tight">
                            {msg.timestamp}
                          </span>
                        </div>
                        {isUser && (
                          <div className="w-6 h-6 rounded-md bg-accentPrimary/10 border border-accentPrimary/20 flex items-center justify-center text-accentPrimary shrink-0 mt-0.5 shadow-sm">
                            <User className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {streamingResponse && (
                    <div className="flex justify-start items-start gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-accentPrimary shrink-0 mt-0.5 shadow-sm">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed select-text shadow-sm bg-white/[0.01] border border-white/[0.04] rounded-tl-none text-slate-300">
                        <MarkdownRenderer content={streamingResponse} />
                        <span className="block text-[8px] text-slate-600 font-mono text-right mt-1 tracking-tight animate-pulse">
                          Live generating...
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}

               {isLoading && (
                <div className="flex justify-start items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-accentPrimary shrink-0 mt-0.5 animate-pulse">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl rounded-tl-none px-3.5 py-3 text-xs text-slate-400 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-accentPrimary" />
                      <span className="font-mono text-[10px] tracking-wide text-slate-300">
                        {chatStatus || "Mentor is thinking..."}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAbortRequest}
                      className="self-start text-[9px] font-mono font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 px-2 py-0.5 rounded transition-all active:scale-95 cursor-pointer"
                    >
                      Cancel Response
                    </button>
                  </div>
                </div>
              )}

              {chatError && (
                <div className="p-3 bg-rose-500/5 border border-rose-500/10 text-rose-400 rounded-xl text-[10px] font-mono leading-relaxed">
                  <strong>Error:</strong> {chatError}
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input form */}
            <div className="p-4 border-t border-white/[0.06] bg-black/20 shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                <textarea
                  ref={chatTextAreaRef}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading || !state.sessionNvidiaKey}
                  placeholder={
                    state.sessionNvidiaKey
                      ? "Ask about DSA, projects, STAR method... (Shift+Enter for new line)"
                      : "Configure API Key in settings to chat"
                  }
                  rows={1}
                  className="flex-1 min-w-0 bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-lg py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed transition-colors resize-none overflow-y-auto max-h-[120px] leading-relaxed"
                />
                <button
                  type="submit"
                  disabled={isLoading || !chatInput.trim() || !state.sessionNvidiaKey}
                  className="w-8 h-8 rounded-lg bg-accentPrimary hover:bg-accentPrimary/90 disabled:bg-white/[0.02] text-white disabled:text-slate-600 border border-white/[0.04] disabled:border-transparent flex items-center justify-center shrink-0 transition-colors"
                  aria-label="Send Message"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </form>
              <div className="text-[9px] text-slate-500 mt-1.5 ml-1 select-none">
                Shift + Enter for new line, Enter to send
              </div>
            </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {focusSession.isOpen && (
          <FocusMode
            isOpen={focusSession.isOpen}
            onClose={() => setFocusSession({ isOpen: false, active: null })}
            onStartSession={(config) => setFocusSession({ isOpen: true, active: config })}
            activeSession={focusSession.active}
            onEndSession={() => {
              setFocusSession({ isOpen: false, active: null });
              setActiveTab("dashboard");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppStateProvider>
        <React.Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="text-white">Loading module...</div></div>}>
          <AppContent />
        </React.Suspense>
      </AppStateProvider>
    </ErrorBoundary>
  );
};

export default App;

