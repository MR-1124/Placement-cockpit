import type { DsaTopic, DevCategory, UserPlan, Plan, Badge } from "../data/curriculum";
import type {
  ConfirmationOptions,
  Project,
  AiLog,
  CustomTask,
  DailyHabitState,
  Note,
  AppSettings,
  ChatMessage,
  ChatSession,
  UserProfile,
  HistoryItem,
  MockInterviewReport,
  ActiveInterviewSession,
  WeeklyGoal,
  DailyChallenge,
  Flashcard,
  FlashcardDeck,
  FlashcardSession,
  CompanyRoadmap,
  AtsReport
} from "../types/AppTypes";

export interface BaseAppState {
  projects: Project[];
  completedSkills: string[];
  aiLogs: AiLog[];
  dailyHabits: DailyHabitState;
  customTasks: CustomTask[];
  weeklyGoals?: WeeklyGoal[];
  habitHistory: HistoryItem[];
  notes: Note[];
  settings: AppSettings;
  streak: number;
  lastActiveDate: string;
  unlockedBadges: string[];
  xp: number;
  chatSessions?: Record<string, ChatSession>;
  currentSessionId?: string;
  userPlans?: UserPlan[];
  primaryPlanId?: string;
  mockInterviews?: MockInterviewReport[];
  activeInterviewSession?: ActiveInterviewSession | null;
  flashcards?: Flashcard[];
  customDecks?: FlashcardDeck[];
  flashcardHistory?: FlashcardSession[];
  activeRoadmaps?: CompanyRoadmap[];
  atsReports?: AtsReport[];
  devPlanEnrolled?: boolean;
  devPlanTargetDate?: string;
  devPlanActiveSkillId?: string | null;
}

export interface AppState extends BaseAppState {
  version: number;
  isLoadingUser: boolean;
  user: UserProfile | null;
  dsaTopics: DsaTopic[];
  devCategories: DevCategory[];
  dailyChallenge?: DailyChallenge;
  sessionNvidiaKey?: string;
}

export interface SerializedProgress extends Partial<BaseAppState> {
  version?: number;
  user?: UserProfile;
  dsaProblems: {
    [problemId: string]: {
      isCompleted?: boolean;
      isWeak?: boolean;
      notes?: string;
      lastSolved?: string;
      revisionInterval?: number;
      nextRevisionDate?: string;
      timeComplexity?: string;
      spaceComplexity?: string;
      submissions?: number;
    };
  };
  dsaTopicMastery: {
    [topicId: string]: "Beginner" | "Intermediate" | "Master";
  };
  devSkills: {
    [skillId: string]: {
      learned?: boolean;
      practiced?: boolean;
      built?: boolean;
      deployed?: boolean;
      revised?: boolean;
    };
  };
  profile?: {
    name: string;
    email: string;
    avatar: string;
    targetCompanies: string[];
    linkedinUrl: string;
    githubUrl: string;
    resumeLink: string;
    cohort: string;
    savedIntro?: string;
    resumeText?: string;
    resumeFileName?: string;
  };
}

export interface AppContextType {
  state: AppState;
  curriculum: {
    DEFAULT_DSA_TOPICS: DsaTopic[];
    DEFAULT_DEV_CATEGORIES: DevCategory[];
    DEFAULT_BADGES: Badge[];
    ALL_PLANS: Plan[];
  };
  overallCompletion: number;
  dsaCompletion: number;
  devCompletion: number;
  aiDependencyScore: number;
  readinessScore: number;
  projectCount: number;
  revisionCompletion: number;
  level: number;
  xpProgress: number;
  levelTitle: string;
  loginUser: (user: UserProfile) => void;
  logoutUser: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  toggleWeek: (weekId: string) => void;
  toggleDsaProblem: (topicId: string, problemId: string) => void;
  updateDsaNotes: (topicId: string, problemId: string, notes: string) => void;
  toggleDsaWeak: (topicId: string, problemId: string) => void;
  scheduleRevision: (topicId: string, problemId: string, interval: number) => void;
  updateDsaMastery: (topicId: string, mastery: "Beginner" | "Intermediate" | "Master") => void;
  updateDsaComplexity: (topicId: string, problemId: string, timeComplexity: string, spaceComplexity: string) => void;
  incrementDsaSubmissions: (topicId: string, problemId: string) => void;
  updateDevSkill: (skillId: string, field: "learned" | "practiced" | "built" | "deployed" | "revised") => void;
  addAiLog: (log: Omit<AiLog, "id" | "date">) => void;
  toggleHabit: (key: keyof DailyHabitState) => void;
  addCustomTask: (name: string) => void;
  toggleCustomTask: (id: string) => void;
  deleteCustomTask: (id: string) => void;
  addWeeklyGoal: (text: string) => void;
  toggleWeeklyGoal: (id: string) => void;
  deleteWeeklyGoal: (id: string) => void;
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addChatMessage: (role: "user" | "assistant", content: string) => void;
  openChatWithPrompt: (prompt: string) => void;
  clearChatHistory: () => void;
  toggleSkill: (skillId: string) => void;
  createNewSession: (title?: string) => void;
  setActiveSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  togglePinSession: (sessionId: string) => void;
  renameSession: (sessionId: string, title: string) => void;
  updateSessionSystemPrompt: (sessionId: string, prompt: string) => void;
  branchSession: (sessionId: string) => void;
  removeLastAssistantMessage: () => void;
  addNote: (note: Omit<Note, "id" | "updatedAt">) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetAllData: () => void;
  seedMockData: () => void;
  followPlan: (planId: string) => void;
  pausePlan: (planId: string) => void;
  unfollowPlan: (planId: string) => void;
  setPrimaryPlan: (planId: string) => void;
  togglePlanWeek: (planId: string, segmentId: string) => void;
  togglePlanTask: (planId: string, taskKey: string) => void;
  confirmAction: (options: ConfirmationOptions) => void;
  startInterviewSession: (topic: string, difficulty: "Easy" | "Medium" | "Hard", personality: "Helpful Mentor" | "Quiet Observer" | "Strict Interviewer", problemDescription: string, resumeText?: string, resumeFileName?: string) => void;
  updateInterviewSession: (timeLeft: number, code: string, language: string, chatHistory: ChatMessage[], currentPhase: "intro" | "dsa" | "core" | "puzzles" | "hr" | "evaluating", subPhaseStatus?: string) => void;
  addInterviewChatMessage: (role: "user" | "assistant", content: string) => void;
  endInterviewSession: (completed: boolean, report?: MockInterviewReport) => void;
  deleteMockInterviewReport: (id: string) => void;
  completeDailyChallenge: () => void;
  refreshDailyChallenge: () => void;
  setSessionNvidiaKey: (key: string) => void;
  updateFlashcardReview: (flashcardId: string, easeFactor: number, interval: number, nextReviewDate: string, repetition: number) => void;
  enrollCompanyRoadmap: (roadmap: CompanyRoadmap) => void;
  updateRoadmapProgress: (roadmapId: string, milestoneId: string, completed: boolean) => void;
  importFlashcards: (deck: FlashcardDeck, cards: Flashcard[]) => void;
  addCustomDeck: (deck: FlashcardDeck) => void;
  deleteCustomDeck: (deckId: string) => void;
  addFlashcards: (_deckId: string, cards: Flashcard[]) => void;
  deleteFlashcard: (cardId: string) => void;
  updateFlashcard: (cardId: string, updates: Partial<Flashcard>) => void;
  saveFlashcardSession: (session: FlashcardSession) => void;

  saveAtsReport: (report: AtsReport) => void;
  enrollInDevPlan: (enrolled: boolean, targetDate?: string) => void;
  setDevPlanActiveSkillId: (skillId: string | null) => void;
}
