/**
 * Arch Debt #13 fix (partial): Centralised type definitions.
 *
 * Previously all interfaces lived inside AppStateContext.tsx (2369 lines).
 * This file owns the canonical shapes. AppStateContext.tsx imports from here.
 *
 * NOTE: Types that are tightly coupled to React (e.g. context value shapes)
 * remain in AppStateContext to avoid circular imports.
 */

// ─── Domain Entities ────────────────────────────────────────────────────────

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: "info" | "warning" | "danger";
  onConfirm: () => void;
}

export interface Project {
  id: string;
  name: string;
  status: "Planning" | "In Progress" | "Testing" | "Deployed" | "Polished";
  difficulty: "Easy" | "Medium" | "Hard";
  completion: number;
  techStack: string[];
  notes: string;
  links: { github?: string; live?: string };
  interviewNotes: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  checklists: {
    readme: boolean;
    deployment: boolean;
    interviewReady: boolean;
  };
}

export interface AiLog {
  id: string;
  date: string; // YYYY-MM-DD
  aiPercentage: number; // 0 - 100
  selfSolvedTime: number; // minutes
  aiAssistedTime: number; // minutes
  triedFirst: boolean;
  firstDraftSelf: boolean;
  understoodCode: boolean;
  copiedDirectly: boolean;
  canRebuild: boolean;
}

export interface CustomTask {
  id: string;
  name: string;
  isCompleted: boolean;
}

export interface DailyHabitState {
  solveDsa: boolean;
  reviseOld: boolean;
  buildFeature: boolean;
  avoidAi: boolean;
  pushGithub: boolean;
  readDoc: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: "DSA" | "Development" | "Mistake" | "Concept" | "General";
  tags: string[];
  updatedAt: string;
}

export interface AppSettings {
  accentColor: "violet" | "emerald" | "amber" | "rose" | "blue";
  compactUi: boolean;
  remindersEnabled: boolean;
  reminderFrequency: "daily" | "weekly";
  showSections: Record<string, boolean>;
  nvidiaApiKey: string;
  nvidiaModelName: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  isPinned?: boolean;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  targetCompanies: string[];
  linkedinUrl: string;
  githubUrl: string;
  resumeLink: string;
  cohort: string;
  savedIntro?: string;
  /** Arch Debt #16: persisted resume text avoids re-upload on each session. */
  resumeText?: string;
  resumeFileName?: string;
}

export interface HistoryItem {
  date: string; // YYYY-MM-DD
  habitsCompleted: number;
}

// ─── Interview ────────────────────────────────────────────────────────────────

export interface MockInterviewReport {
  id: string;
  date: string; // YYYY-MM-DD
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  interviewerPersonality: "Helpful Mentor" | "Quiet Observer" | "Strict Interviewer";
  codeSolution: string;
  language: string;
  chatHistory: ChatMessage[];
  scorecard: {
    problemSolving: number; // 0 - 10
    codeQuality: number; // 0 - 10
    communication: number; // 0 - 10
    overallScore: number; // 0 - 10
    recommendation: "Strong Hire" | "Hire" | "Leaning Hire" | "No Hire";
    strengths: string[];
    weaknesses: string[];
    feedback: string;
    questionsFeedback?: {
      question: string;
      response: string;
      rating: number; // 0 - 10
      feedback: string;
    }[];
  };
}

export type InterviewPhase = "intro" | "dsa" | "core" | "puzzles" | "hr" | "evaluating";

export interface ActiveInterviewSession {
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  interviewerPersonality: "Helpful Mentor" | "Quiet Observer" | "Strict Interviewer";
  timeLeft: number; // seconds remaining
  code: string;
  language: string;
  chatHistory: ChatMessage[];
  currentPhase: InterviewPhase;
  subPhaseStatus?: string;
  lastSavedTime?: number;
  goal?: string;
  resumeText?: string;
  resumeFileName?: string;
}
