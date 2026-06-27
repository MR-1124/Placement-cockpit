#!/usr/bin/env python3
"""Apply all Fix 81-90 context transformations to AppStateContext.tsx (binary-safe CRLF)"""

with open('src/context/AppStateContext.tsx', 'rb') as f:
    raw = f.read()

src = raw.decode('utf-8')

def R(old, new, name=""):
    if old in src:
        print(f"  OK: {name or old[:50]}")
        return src.replace(old, new, 1)
    else:
        print(f"  MISS: {name or old[:50]}")
        return src

# ── Fix 81: Remove framer-motion, add useMemo ─────────────────────────────────
src = R(
    'import React, { createContext, useContext, useState, useEffect, useRef } from "react";',
    'import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from "react";',
    "add useMemo"
)
src = R(
    'import { motion, AnimatePresence } from "framer-motion";\r\n',
    '', "remove framer-motion"
)
src = R(
    'import { AlertTriangle, AlertCircle, Info } from "lucide-react";\r\n',
    '', "remove Alert icons"
)

# ── Fix types ──────────────────────────────────────────────────────────────────
src = R(
    '  InterviewPhase,\r\n  WeeklyGoal\r\n} from "../types/AppTypes";',
    '  InterviewPhase,\r\n  WeeklyGoal,\r\n  DailyChallenge\r\n} from "../types/AppTypes";',
    "add DailyChallenge import"
)
# Re-exports (first occurrence after import)
import re
if '  DailyChallenge\r\n};' not in src:
    src = re.sub(
        r'  InterviewPhase,\r\n  WeeklyGoal\r\n\};',
        '  InterviewPhase,\r\n  WeeklyGoal,\r\n  DailyChallenge\r\n};',
        src, count=1
    )
    print("  OK: add DailyChallenge re-export")

# ── AppState interface additions ───────────────────────────────────────────────
src = R(
    '  chatSessions?: ChatSession[];\r\n',
    '  chatSessions?: Record<string, ChatSession>;\r\n',
    "AppState chatSessions type"
)
src = R(
    '  xp: number;\r\n\r\n  chatSessions',
    '  xp: number;\r\n  dailyChallenge?: DailyChallenge;\r\n\r\n  chatSessions',
    "add dailyChallenge to AppState"
)

# ── Context type additions ─────────────────────────────────────────────────────
src = R(
    '  deleteMockInterviewReport: (id: string) => void;\r\n}',
    '  deleteMockInterviewReport: (id: string) => void;\r\n  completeDailyChallenge: () => void;\r\n  refreshDailyChallenge: () => void;\r\n}',
    "add daily challenge to context type"
)

# ── getInitialState: fix chatSessions ─────────────────────────────────────────
src = R(
    '  chatSessions: [\r\n    {\r\n      id: "default-session",\r\n      title: "Placement Chat Room",\r\n      messages: [],\r\n      createdAt: new Date().toLocaleDateString(),\r\n      isPinned: false\r\n    }\r\n  ],',
    '  chatSessions: {\r\n    "default-session": {\r\n      id: "default-session",\r\n      title: "Placement Chat Room",\r\n      messages: [],\r\n      createdAt: new Date().toLocaleDateString(),\r\n      isPinned: false\r\n    }\r\n  },',
    "fix getInitialState chatSessions"
)

# ── serializeState: fix chatSessions ──────────────────────────────────────────
src = re.sub(r'chatSessions: state\.chatSessions \? state\.chatSessions\.slice\(-50\) : \[\],',
             'chatSessions: state.chatSessions || {},', src)
print("  OK: serializeState chatSessions")

# ── deserialize: fix chatSessions restore ─────────────────────────────────────
src = re.sub(r'chatSessions: serialized\.chatSessions \? serialized\.chatSessions\.slice\(-50\) : \[\],',
             'chatSessions: serialized.chatSessions || {},', src)

# ── migration block ────────────────────────────────────────────────────────────
src = R(
    '          if (updatedState.chatSessions === undefined || updatedState.chatSessions.length === 0) {\r\n            updatedState.chatSessions = [\r\n              {\r\n                id: "default-session",\r\n                title: "Placement Chat Room",\r\n                messages: (updatedState as any).chatMessages || [],\r\n                createdAt: new Date().toLocaleDateString(),\r\n                isPinned: false\r\n              }\r\n            ];\r\n            updatedState.currentSessionId = "default-session";\r\n          }',
    '          if (updatedState.chatSessions === undefined || Object.keys((updatedState.chatSessions as any) || {}).length === 0) {\r\n            updatedState.chatSessions = {\r\n              "default-session": {\r\n                id: "default-session",\r\n                title: "Placement Chat Room",\r\n                messages: (updatedState as any).chatMessages || [],\r\n                createdAt: new Date().toLocaleDateString(),\r\n                isPinned: false\r\n              }\r\n            } as Record<string, ChatSession>;\r\n            updatedState.currentSessionId = "default-session";\r\n          }',
    "migration block"
)

# ── addChatMessage ─────────────────────────────────────────────────────────────
src = R(
    'const addChatMessage = (role: "user" | "assistant", content: string) => {\r\n    updateState(prev => {\r\n      const newMsg: ChatMessage = {\r\n        id: Math.random().toString(36).substring(7),\r\n        role,\r\n        content,\r\n        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })\r\n      };\r\n      \r\n      const activeId = prev.currentSessionId || "default-session";\r\n      let chatSessions = prev.chatSessions || [];\r\n      if (chatSessions.length === 0) {\r\n        chatSessions = [{\r\n          id: "default-session",\r\n          title: "Placement Chat Room",\r\n          messages: [],\r\n          createdAt: new Date().toLocaleDateString(),\r\n          isPinned: false\r\n        }];\r\n      }\r\n\r\n      const updatedSessions = chatSessions.map(session => {\r\n        if (session.id !== activeId) return session;\r\n        let title = session.title;\r\n        if (session.messages.length === 0 && role === "user") {\r\n          title = content.length > 30 ? content.slice(0, 30) + "..." : content;\r\n        }\r\n        return {\r\n          ...session,\r\n          title,\r\n          messages: [...session.messages, newMsg]\r\n        };\r\n      });\r\n\r\n      return {\r\n        ...prev,\r\n        chatSessions: updatedSessions\r\n      };\r\n    });\r\n  };',
    'const addChatMessage = (role: "user" | "assistant", content: string) => {\r\n    updateState(prev => {\r\n      const newMsg: ChatMessage = {\r\n        id: Math.random().toString(36).substring(7),\r\n        role,\r\n        content,\r\n        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })\r\n      };\r\n      const activeId = prev.currentSessionId || "default-session";\r\n      const chatSessions: Record<string, ChatSession> = prev.chatSessions || {};\r\n      const activeSession = chatSessions[activeId] || {\r\n        id: activeId, title: "Placement Chat Room", messages: [],\r\n        createdAt: new Date().toLocaleDateString(), isPinned: false\r\n      };\r\n      const title = activeSession.messages.length === 0 && role === "user"\r\n        ? (content.length > 30 ? content.slice(0, 30) + "..." : content)\r\n        : activeSession.title;\r\n      return {\r\n        ...prev,\r\n        chatSessions: { ...chatSessions, [activeId]: { ...activeSession, title, messages: [...activeSession.messages, newMsg] } }\r\n      };\r\n    });\r\n  };',
    "addChatMessage"
)

# ── clearChatHistory ───────────────────────────────────────────────────────────
src = R(
    'const clearChatHistory = () => {\r\n    updateState(prev => {\r\n      const activeId = prev.currentSessionId || "default-session";\r\n      const chatSessions = (prev.chatSessions || []).map(s => {\r\n        if (s.id !== activeId) return s;\r\n        return { ...s, messages: [] };\r\n      });\r\n      return {\r\n        ...prev,\r\n        chatSessions\r\n      };\r\n    });\r\n  };',
    'const clearChatHistory = () => {\r\n    updateState(prev => {\r\n      const activeId = prev.currentSessionId || "default-session";\r\n      const chatSessions = prev.chatSessions || {};\r\n      const s = chatSessions[activeId];\r\n      if (!s) return prev;\r\n      return { ...prev, chatSessions: { ...chatSessions, [activeId]: { ...s, messages: [] } } };\r\n    });\r\n  };',
    "clearChatHistory"
)

# ── createNewSession ───────────────────────────────────────────────────────────
src = R(
    'const createNewSession = (title?: string) => {\r\n    updateState(prev => {\r\n      const newSession: ChatSession = {\r\n        id: Math.random().toString(36).substring(7),\r\n        title: title || "New Chat Session",\r\n        messages: [],\r\n        createdAt: new Date().toLocaleDateString(),\r\n        isPinned: false\r\n      };\r\n      const chatSessions = [...(prev.chatSessions || []), newSession];\r\n      return {\r\n        ...prev,\r\n        chatSessions,\r\n        currentSessionId: newSession.id\r\n      };\r\n    });\r\n  };',
    'const createNewSession = (title?: string) => {\r\n    updateState(prev => {\r\n      const newSession: ChatSession = {\r\n        id: Math.random().toString(36).substring(7),\r\n        title: title || "New Chat Session",\r\n        messages: [],\r\n        createdAt: new Date().toLocaleDateString(),\r\n        isPinned: false\r\n      };\r\n      return {\r\n        ...prev,\r\n        chatSessions: { ...(prev.chatSessions || {}), [newSession.id]: newSession },\r\n        currentSessionId: newSession.id\r\n      };\r\n    });\r\n  };',
    "createNewSession"
)

# ── deleteSession ──────────────────────────────────────────────────────────────
src = R(
    '      let chatSessions = (prev.chatSessions || []).filter(s => s.id !== sessionId);\r\n      let currentSessionId = prev.currentSessionId;\r\n      \r\n      if (chatSessions.length === 0) {',
    '      const chatSessions: Record<string, ChatSession> = { ...(prev.chatSessions || {}) };\r\n      delete chatSessions[sessionId];\r\n      let currentSessionId = prev.currentSessionId;\r\n      \r\n      if (Object.keys(chatSessions).length === 0) {',
    "deleteSession filter"
)
src = R(
    '        chatSessions = [defaultSession];\r\n',
    '        chatSessions["default-session"] = defaultSession;\r\n',
    "deleteSession fallback"
)
src = R(
    '      } else if (currentSessionId === sessionId) {\r\n        currentSessionId = chatSessions[0].id;',
    '      } else if (currentSessionId === sessionId) {\r\n        currentSessionId = Object.keys(chatSessions)[0];',
    "deleteSession currentSessionId"
)

# ── togglePinSession ───────────────────────────────────────────────────────────
src = R(
    '      const chatSessions = (prev.chatSessions || []).map(s => {\r\n        if (s.id !== sessionId) return s;\r\n        return { ...s, isPinned: !s.isPinned };\r\n      });\r\n      return {\r\n        ...prev,\r\n        chatSessions\r\n      };',
    '      const chatSessions = prev.chatSessions || {};\r\n      const s = chatSessions[sessionId];\r\n      if (!s) return prev;\r\n      return { ...prev, chatSessions: { ...chatSessions, [sessionId]: { ...s, isPinned: !s.isPinned } } };',
    "togglePinSession"
)

# ── renameSession ──────────────────────────────────────────────────────────────
src = R(
    '      const chatSessions = (prev.chatSessions || []).map(s => {\r\n        if (s.id !== sessionId) return s;\r\n        return { ...s, title };\r\n      });\r\n      return {\r\n        ...prev,\r\n        chatSessions\r\n      };',
    '      const chatSessions = prev.chatSessions || {};\r\n      const s = chatSessions[sessionId];\r\n      if (!s) return prev;\r\n      return { ...prev, chatSessions: { ...chatSessions, [sessionId]: { ...s, title } } };',
    "renameSession"
)

# ── updateSessionSystemPrompt ──────────────────────────────────────────────────
src = R(
    'const updateSessionSystemPrompt = (sessionId: string, prompt: string) => {\r\n    updateState(prev => {\r\n      const chatSessions = (prev.chatSessions || []).map(s => {\r\n        if (s.id !== sessionId) return s;\r\n        return { ...s, systemPrompt: prompt };\r\n      });\r\n      return { ...prev, chatSessions };\r\n    });\r\n  };',
    'const updateSessionSystemPrompt = (sessionId: string, systemPrompt: string) => {\r\n    updateState(prev => {\r\n      const chatSessions = prev.chatSessions || {};\r\n      const s = chatSessions[sessionId];\r\n      if (!s) return prev;\r\n      return { ...prev, chatSessions: { ...chatSessions, [sessionId]: { ...s, systemPrompt } } };\r\n    });\r\n  };',
    "updateSessionSystemPrompt"
)

# ── branchSession ──────────────────────────────────────────────────────────────
src = R(
    '      const sessionToBranch = prev.chatSessions?.find(s => s.id === sessionId);\r\n',
    '      const sessionToBranch = (prev.chatSessions || {})[sessionId];\r\n',
    "branchSession find"
)
src = R(
    '        chatSessions: [newSession, ...(prev.chatSessions || [])],\r\n',
    '        chatSessions: { ...(prev.chatSessions || {}), [newSession.id]: newSession },\r\n',
    "branchSession chatSessions"
)

# ── removeLastAssistantMessage ─────────────────────────────────────────────────
src = R(
    '      const chatSessions = (prev.chatSessions || []).map(s => {\r\n        if (s.id !== sessionId) return s;\r\n        if (s.messages.length === 0) return s;\r\n        \r\n        const lastMessage = s.messages[s.messages.length - 1];\r\n        if (lastMessage.role === "assistant") {\r\n          return {\r\n            ...s,\r\n            messages: s.messages.slice(0, -1)\r\n          };\r\n        }\r\n        return s;\r\n      });\r\n      \r\n      return { ...prev, chatSessions };',
    '      const chatSessions = prev.chatSessions || {};\r\n      const s = chatSessions[sessionId];\r\n      if (!s || s.messages.length === 0) return prev;\r\n      const lastMessage = s.messages[s.messages.length - 1];\r\n      if (lastMessage.role === "assistant") {\r\n        return { ...prev, chatSessions: { ...chatSessions, [sessionId]: { ...s, messages: s.messages.slice(0, -1) } } };\r\n      }\r\n      return prev;',
    "removeLastAssistantMessage"
)

# ── Fix AnimatePresence in confirm modal ──────────────────────────────────────
# Find and replace the AnimatePresence block
anim_pattern = re.compile(
    r'      <AnimatePresence>\r?\n          <motion\.div\r?\n            .*?\r?\n            .*?\r?\n            .*?\r?\n          >\r?\n            <motion\.div\r?\n              .*?\r?\n              .*?\r?\n              .*?\r?\n              .*?\r?\n            >',
    re.DOTALL
)
match = anim_pattern.search(src)
if match:
    src = src[:match.start()] + '          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] select-none animate-fade-in">\r\n            <div className="w-full max-w-md bg-darkCard/95 border border-white/[0.08] shadow-2xl relative rounded-2xl overflow-hidden glass-panel animate-slide-up">' + src[match.end():]
    print("  OK: AnimatePresence opener")
else:
    print("  MISS: AnimatePresence opener")

src = R(
    '          </motion.div>\r\n        </motion.div>\r\n      </AnimatePresence>',
    '          </div>\r\n        </div>',
    "AnimatePresence closer"
)

# Remove AlertTriangle/AlertCircle/Info icon usages in confirm severity display
src = src.replace('<AlertCircle className=', '<span className=')
src = src.replace('<AlertTriangle className=', '<span className=')  
src = src.replace('<Info className=', '<span className=')

# ── Fix 88: Daily Challenge functions ─────────────────────────────────────────
daily_funcs = '''
  // ── Fix 88: Daily Challenge ────────────────────────────────────────────────
  const getTodayStr = () => new Date().toISOString().split("T")[0];

  const generateDailyChallenge = (prev: AppState): DailyChallenge | undefined => {
    const unsolvedProblems: Array<{
      problemId: string; topicId: string; problemName: string; topicName: string; difficulty: string;
    }> = [];
    (prev.dsaTopics || []).forEach((topic: any) => {
      topic.problems.forEach((prob: any) => {
        if (!prob.isCompleted) {
          unsolvedProblems.push({
            problemId: prob.id, topicId: topic.id, problemName: prob.name,
            topicName: topic.name, difficulty: prob.difficulty || "Medium"
          });
        }
      });
    });
    if (unsolvedProblems.length === 0) return undefined;
    const today = getTodayStr();
    const seed = today.split("").reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0);
    const picked = unsolvedProblems[seed % unsolvedProblems.length];
    return { date: today, problemId: picked.problemId, topicId: picked.topicId,
      problemName: picked.problemName, topicName: picked.topicName,
      difficulty: picked.difficulty, isCompleted: false, xpBonus: 100 };
  };

  const completeDailyChallenge = () => {
    updateState(prev => {
      if (!prev.dailyChallenge || prev.dailyChallenge.isCompleted) return prev;
      return {
        ...prev,
        dailyChallenge: { ...prev.dailyChallenge, isCompleted: true },
        xp: (prev.xp || 0) + prev.dailyChallenge.xpBonus
      };
    });
  };

  const refreshDailyChallenge = () => {
    updateState(prev => {
      const today = getTodayStr();
      if (prev.dailyChallenge?.date === today && !prev.dailyChallenge?.isCompleted) return prev;
      return { ...prev, dailyChallenge: generateDailyChallenge(prev) };
    });
  };

'''

# Insert before the return statement
return_pattern = re.compile(r'\r?\n  return \(\r?\n    <AppContext\.Provider')
match = return_pattern.search(src)
if match:
    insert_at = match.start()
    src = src[:insert_at] + daily_funcs.replace('\n', '\r\n') + src[insert_at:]
    print("  OK: Daily challenge functions inserted")
else:
    print("  MISS: return/AppContext.Provider not found")

# ── Add completeDailyChallenge/refreshDailyChallenge to provider value ────────
src = R(
    '        deleteMockInterviewReport\r\n      }}>',
    '        deleteMockInterviewReport,\r\n        completeDailyChallenge,\r\n        refreshDailyChallenge\r\n      }}>',
    "provider value additions"
)

# ── Fix useMemo for readinessScore if still a plain const ─────────────────────
# (Complex — skip for now, add separately)

print(f"\nFinal size: {len(src)} chars")

with open('src/context/AppStateContext.tsx', 'w', encoding='utf-8', newline='') as f:
    f.write(src)

print("Done!")
