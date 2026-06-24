import React, { useState, useEffect, useRef } from "react";
import { useAppState } from "../context/AppStateContext";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Search, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  Code2, 
  Briefcase 
} from "lucide-react";
import confetti from "canvas-confetti";

interface FocusSessionConfig {
  goal: string;
  duration: number; // in minutes
  linkedDsaQuestion?: { topicId: string; problemId: string; name: string; difficulty: string };
  linkedProjectTask?: { projectId: string; taskKey: string; name: string };
}

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (config: FocusSessionConfig) => void;
  activeSession: FocusSessionConfig | null;
  onEndSession: (completed: boolean) => void;
}

export const FocusMode: React.FC<FocusModeProps> = ({
  isOpen,
  onClose,
  onStartSession,
  activeSession,
  onEndSession
}) => {
  const { state, confirmAction, toggleDsaProblem, updateProject } = useAppState();

  // Configurator form states
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState(25);
  const [dsaSearch, setDsaSearch] = useState("");
  const [selectedDsa, setSelectedDsa] = useState<FocusSessionConfig["linkedDsaQuestion"] | undefined>(undefined);
  const [selectedProjectTask, setSelectedProjectTask] = useState<FocusSessionConfig["linkedProjectTask"] | undefined>(undefined);
  const [hasStarted, setHasStarted] = useState(false);

  // Countdown timer states
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<any>(null);

  // Initialize timer when activeSession starts (or restore from localStorage if reloading)
  useEffect(() => {
    if (activeSession) {
      if (activeSession.restoredTime !== undefined) {
        if (activeSession.restoredTime <= 0) {
          localStorage.removeItem("active_focus_session");
          onEndSession(false);
          return;
        }
        setTimeLeft(activeSession.restoredTime);
        setIsPaused(activeSession.isPaused || false);
        setHasStarted(true);
        return;
      }
      
      const saved = localStorage.getItem("active_focus_session");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.active && parsed.active.goal === activeSession.goal) {
            let restoredTime = parsed.timeLeft;
            if (!parsed.isPaused && parsed.lastSavedTime) {
              const elapsedSeconds = Math.floor((Date.now() - parsed.lastSavedTime) / 1000);
              restoredTime = Math.max(0, parsed.timeLeft - elapsedSeconds);
            }
            if (restoredTime <= 0) {
              localStorage.removeItem("active_focus_session");
              onEndSession(false);
              return;
            }
            setTimeLeft(restoredTime);
            setIsPaused(parsed.isPaused);
            setHasStarted(true);
            return;
          }
        } catch (e) {
          console.error("Failed to restore focus session state", e);
        }
      }
      setTimeLeft(activeSession.duration * 60);
      setIsPaused(false);
      setHasStarted(true);
    } else {
      setHasStarted(false);
    }
  }, [activeSession]);

  // Save active focus session details to localStorage on change/tick
  useEffect(() => {
    if (activeSession && hasStarted) {
      localStorage.setItem("active_focus_session", JSON.stringify({
        active: activeSession,
        timeLeft,
        isPaused,
        lastSavedTime: Date.now()
      }));
    } else if (!activeSession) {
      localStorage.removeItem("active_focus_session");
    }
  }, [activeSession, timeLeft, isPaused, hasStarted]);

  // Interval timer tick
  useEffect(() => {
    if (activeSession && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSession, isPaused, timeLeft]);

  // Check if timer finished
  useEffect(() => {
    if (activeSession && hasStarted && timeLeft === 0) {
      handleCompleteSession();
    }
  }, [timeLeft, activeSession, hasStarted]);

  if (!isOpen) return null;

  // Retrieve unsolved DSA questions
  const unsolvedDsaQuestions: { topicId: string; problemId: string; name: string; difficulty: string }[] = [];
  state.dsaTopics.forEach(topic => {
    topic.problems.forEach(prob => {
      if (!prob.isCompleted) {
        unsolvedDsaQuestions.push({
          topicId: topic.id,
          problemId: prob.id,
          name: prob.name,
          difficulty: prob.difficulty
        });
      }
    });
  });

  const filteredDsa = unsolvedDsaQuestions.filter(q =>
    q.name.toLowerCase().includes(dsaSearch.toLowerCase())
  );

  // Retrieve incomplete project tasks
  const projectTasks: { projectId: string; taskKey: string; name: string }[] = [];
  state.projects.forEach(proj => {
    if (!proj.checklists.readme) {
      projectTasks.push({
        projectId: proj.id,
        taskKey: "readme",
        name: `${proj.name}: Write Clean README.md`
      });
    }
    if (!proj.checklists.deployment) {
      projectTasks.push({
        projectId: proj.id,
        taskKey: "deployment",
        name: `${proj.name}: Deploy to Production`
      });
    }
    if (!proj.checklists.interviewReady) {
      projectTasks.push({
        projectId: proj.id,
        taskKey: "interviewReady",
        name: `${proj.name}: Prepare Interview Stories`
      });
    }
  });

  // Calculate difficulty styles
  const getDiffStyles = (diff: string) => {
    if (diff === "Easy") return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    if (diff === "Medium") return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
  };

  const handleGoalChange = (val: string) => {
    setGoal(val);
    const trimmedVal = val.trim().toLowerCase();
    if (trimmedVal.length > 2) {
      // Check if it matches any unsolved DSA problem title (case-insensitive)
      const matchingDsa = unsolvedDsaQuestions.find(q => 
        q.name.toLowerCase() === trimmedVal || 
        trimmedVal.includes(q.name.toLowerCase()) || 
        q.name.toLowerCase().includes(trimmedVal)
      );
      if (matchingDsa) {
        setSelectedDsa(matchingDsa);
        setSelectedProjectTask(undefined);
        return;
      }

      // Check if it matches any project task description
      const matchingTask = projectTasks.find(t => {
        const taskLabel = t.name.split(":").pop()?.trim().toLowerCase() || "";
        return taskLabel === trimmedVal || 
               trimmedVal.includes(taskLabel) || 
               taskLabel.includes(trimmedVal) ||
               t.name.toLowerCase().includes(trimmedVal);
      });
      if (matchingTask) {
        setSelectedProjectTask(matchingTask);
        setSelectedDsa(undefined);
        return;
      }
    }
    // Deselect if no match or short query
    setSelectedDsa(undefined);
    setSelectedProjectTask(undefined);
  };

  const handleInitialize = () => {
    onStartSession({
      goal: goal.trim() || "General Study Session",
      duration,
      linkedDsaQuestion: selectedDsa,
      linkedProjectTask: selectedProjectTask
    });
  };

  const handleResetTimer = () => {
    if (activeSession) {
      setTimeLeft(activeSession.duration * 60);
    }
  };

  const handleCompleteSession = () => {
    if (!activeSession) return;

    // Confetti celebration
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#8b5cf6", "#10b981", "#3b82f6"]
    });

    // 1. If DSA question linked, complete it
    if (activeSession.linkedDsaQuestion) {
      toggleDsaProblem(activeSession.linkedDsaQuestion.topicId, activeSession.linkedDsaQuestion.problemId);
    }

    // 2. If Project task linked, complete it
    if (activeSession.linkedProjectTask) {
      const proj = state.projects.find(p => p.id === activeSession.linkedProjectTask!.projectId);
      if (proj) {
        const updated = {
          ...proj,
          checklists: {
            ...proj.checklists,
            [activeSession.linkedProjectTask!.taskKey]: true
          }
        };
        updateProject(updated);
      }
    }

    onEndSession(true);
  };

  const handleExitRequest = () => {
    confirmAction({
      title: "Exit Focus Protocol?",
      message: "We recommend not exiting unless the active task is finished or you need to close for other urgent work. Are you sure you want to stop focusing?",
      confirmText: "Exit Session",
      cancelText: "Stay Focused",
      severity: "warning",
      onConfirm: () => {
        onEndSession(false);
      }
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const activeProgress = activeSession ? (timeLeft / (activeSession.duration * 60)) * 100 : 100;

  return (
    <div className="fixed inset-0 z-[9000] bg-black flex items-center justify-center select-none overflow-y-auto">
      <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
      
      {!activeSession ? (
        /* Setup Configuration Workspace Panel */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-darkCard/95 border border-white/[0.08] shadow-2xl relative rounded-2xl glass-panel p-6 sm:p-8 m-4 space-y-6 z-10"
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 -ml-2 rounded-lg hover:bg-white/[0.04] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Focus Workspace</h2>
              <p className="text-xs text-slate-500">Configure your session, lock distractions, and execute.</p>
            </div>
          </div>

          {/* Goal Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block">
              WHAT ARE YOU BUILDING OR SOLVING?
            </label>
            <input
              type="text"
              value={goal}
              onChange={e => handleGoalChange(e.target.value)}
              placeholder="e.g., Implementing Auth flow, Solved 2 Medium Matrix questions"
              className="w-full bg-slate-900/50 border border-white/[0.08] focus:border-accentPrimary rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 outline-none transition-all focus:bg-slate-900"
            />
          </div>

          {/* Task Linking Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: Link DSA Problem */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                <span>LINK AN UNSOLVED DSA QUESTION</span>
                <span className="opacity-75">TOTAL: {unsolvedDsaQuestions.length}</span>
              </div>
              
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-550" />
                <input
                  type="text"
                  placeholder="Search questions by title or topic..."
                  value={dsaSearch}
                  onChange={e => setDsaSearch(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/[0.08] focus:border-accentPrimary rounded-lg pl-9 pr-3 py-2 text-[11px] text-white placeholder-slate-600 outline-none transition-all"
                />
              </div>

              <div className="h-44 overflow-y-auto border border-white/[0.06] rounded-xl bg-black/20 p-2 space-y-1">
                {filteredDsa.length === 0 ? (
                  <div className="p-4 text-center text-[10px] text-slate-600 italic font-mono">
                    No matching unsolved questions found.
                  </div>
                ) : (
                  filteredDsa.map(q => {
                    const active = selectedDsa?.problemId === q.problemId;
                    return (
                      <div
                        key={q.problemId}
                        onClick={() => {
                          if (active) {
                            setSelectedDsa(undefined);
                            setGoal("");
                          } else {
                            setSelectedDsa(q);
                            setSelectedProjectTask(undefined);
                            setGoal(`Solving: ${q.name}`);
                          }
                        }}
                        className={`flex justify-between items-center p-2 rounded-lg border text-[11px] transition-all cursor-pointer ${
                          active
                            ? "bg-accentPrimary/10 border-accentPrimary text-white"
                            : "border-transparent text-slate-400 hover:bg-white/[0.01]"
                        }`}
                      >
                        <span className="font-medium truncate pr-2">{q.name}</span>
                        <span className={`text-[8px] uppercase font-bold font-mono px-1 rounded ${getDiffStyles(q.difficulty)}`}>
                          {q.difficulty}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: Select Project Task */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                SELECT A PROJECT TASK
              </div>

              <div className="h-[212px] overflow-y-auto border border-white/[0.06] rounded-xl bg-black/20 p-2 space-y-1">
                {projectTasks.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-center p-4">
                    <p className="text-[11px] text-slate-600 font-mono italic">
                      No active project tasks. Add some on the Kanban board!
                    </p>
                  </div>
                ) : (
                  projectTasks.map(t => {
                    const active = selectedProjectTask?.projectId === t.projectId && selectedProjectTask?.taskKey === t.taskKey;
                    return (
                      <div
                        key={`${t.projectId}-${t.taskKey}`}
                        onClick={() => {
                          if (active) {
                            setSelectedProjectTask(undefined);
                            setGoal("");
                          } else {
                            setSelectedProjectTask(t);
                            setSelectedDsa(undefined);
                            setGoal(t.name);
                          }
                        }}
                        className={`p-2.5 rounded-lg border text-[11px] transition-all cursor-pointer flex items-center gap-2 ${
                          active
                            ? "bg-accentPrimary/10 border-accentPrimary text-white"
                            : "border-transparent text-slate-400 hover:bg-white/[0.01]"
                        }`}
                      >
                        <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="font-medium truncate">{t.name}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Time select */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block">
              SELECT FOCUS INTERVAL
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[15, 25, 35, 45, 60].map(m => {
                const active = duration === m;
                return (
                  <button
                    key={m}
                    onClick={() => setDuration(m)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                      active
                        ? "border-cyan-500 text-cyan-400 bg-cyan-500/5 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                        : "bg-white/[0.01] border-white/[0.04] text-slate-500 hover:text-slate-350"
                    }`}
                  >
                    {m}m
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleInitialize}
            className="w-full h-12 bg-gradient-to-r from-cyan-500 to-accentPrimary hover:brightness-110 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer mt-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Initialize Focus Protocol</span>
          </button>
        </motion.div>
      ) : (
        /* Immersive Distraction-Free Focus Countdown Board */
        <div className="w-full min-h-screen bg-[#0a0a0c] text-slate-200 flex flex-col justify-between items-center p-6 sm:p-8 relative">
          
          {/* Header indicator & exit trigger */}
          <div className="w-full max-w-5xl flex justify-between items-center z-10 select-none">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
              <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-ping shrink-0" />
              <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full absolute shrink-0" />
              <span className="ml-1 text-cyan-500">Focus Mode Active</span>
            </div>

            <button
              onClick={handleExitRequest}
              className="px-4 py-1.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.04] text-[10px] font-mono uppercase tracking-wider text-slate-500 hover:text-white transition-all cursor-pointer"
            >
              Exit Protocol
            </button>
          </div>

          {/* Center Circular Timer Screen */}
          <div className="flex flex-col items-center justify-center text-center space-y-6 z-10 flex-1 py-10">
            {/* Countdown Circle */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg width="256" height="256" className="transform -rotate-90">
                {/* Background path */}
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  className="stroke-white/[0.02]"
                  strokeWidth="6"
                  fill="transparent"
                />
                {/* Active progress countdown path */}
                <motion.circle
                  cx="128"
                  cy="128"
                  r="110"
                  className="stroke-cyan-500"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 110}
                  animate={{
                    strokeDashoffset: (2 * Math.PI * 110) * (1 - activeProgress / 100)
                  }}
                  transition={{ duration: 0.3, ease: "linear" }}
                />
              </svg>
              {/* Numeric display overlay */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white leading-none">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mt-2">
                  {isPaused ? "PAUSED" : "STUDYING"}
                </span>
              </div>
            </div>

            {/* Target goal text */}
            <div className="space-y-2 max-w-md">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight px-4 leading-normal">
                {activeSession.goal}
              </h1>
              <p className="text-[11px] text-slate-500 leading-relaxed px-6">
                Stay locked. Deep work blocks build long-term memory. Minimize tab jumping and focus on completion.
              </p>
            </div>

            {/* Warning block */}
            <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl px-4 py-3 text-[10px] font-mono leading-relaxed text-slate-400 flex items-center gap-3 max-w-sm mx-4">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <p className="text-left">
                Avoid YouTube/social media. Set your phone to DND and execute the active task blocks.
              </p>
            </div>

            {/* Active task tags display */}
            {(activeSession.linkedDsaQuestion || activeSession.linkedProjectTask) && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 select-none">
                {activeSession.linkedDsaQuestion && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-[9px] font-bold font-mono text-violet-400">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>DSA: {activeSession.linkedDsaQuestion.name}</span>
                  </div>
                )}
                {activeSession.linkedProjectTask && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[9px] font-bold font-mono text-emerald-400">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>TASK: {activeSession.linkedProjectTask.name.split(":").pop()?.trim()}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Action Controls */}
          <div className="w-full max-w-5xl flex justify-center items-center gap-4 z-10 select-none pb-4">
            {/* Reset */}
            <button
              onClick={handleResetTimer}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/[0.08] hover:bg-white/[0.04] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-slate-900 hover:bg-white/90 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
              title={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? <Play className="w-5 h-5 fill-slate-900 ml-0.5" /> : <Pause className="w-5 h-5 fill-slate-900" />}
            </button>

            {/* Complete */}
            <button
              onClick={handleCompleteSession}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/[0.08] hover:bg-emerald-500/10 hover:border-emerald-500/20 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition-colors cursor-pointer"
              title="Complete Session"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
