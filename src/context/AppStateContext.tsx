import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, hasFirebaseKeys } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  DEFAULT_DSA_TOPICS,
  DEFAULT_DEV_CATEGORIES,
  DEFAULT_WEEK_PLAN,
  DEFAULT_BADGES
} from "../data/curriculum";
import type { DsaTopic, DevCategory } from "../data/curriculum";

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
}

export interface HistoryItem {
  date: string; // YYYY-MM-DD
  habitsCompleted: number; // count
}

interface AppState {
  user: UserProfile | null;
  completedWeeks: string[];
  dsaTopics: DsaTopic[];
  devCategories: DevCategory[];
  projects: Project[];
  aiLogs: AiLog[];
  dailyHabits: DailyHabitState;
  customTasks: CustomTask[];
  habitHistory: HistoryItem[];
  notes: Note[];
  settings: AppSettings;
  streak: number;
  lastActiveDate: string;
  unlockedBadges: string[];
  xp: number;
  chatMessages: ChatMessage[];
  chatSessions?: ChatSession[];
  currentSessionId?: string;
}

interface AppContextType {
  state: AppState;
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
  updateDevSkill: (skillId: string, field: "learned" | "practiced" | "built" | "deployed" | "revised") => void;
  addAiLog: (log: Omit<AiLog, "id" | "date">) => void;
  toggleHabit: (key: keyof DailyHabitState) => void;
  addCustomTask: (name: string) => void;
  toggleCustomTask: (id: string) => void;
  deleteCustomTask: (id: string) => void;
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addChatMessage: (role: "user" | "assistant", content: string) => void;
  clearChatHistory: () => void;
  createNewSession: (title?: string) => void;
  setActiveSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  togglePinSession: (sessionId: string) => void;
  renameSession: (sessionId: string, title: string) => void;
  addNote: (note: Omit<Note, "id" | "updatedAt">) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetAllData: () => void;
  seedMockData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface SerializedProgress {
  completedWeeks: string[];
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
  projects: Project[];
  aiLogs: AiLog[];
  dailyHabits: DailyHabitState;
  customTasks: CustomTask[];
  habitHistory: HistoryItem[];
  notes: Note[];
  settings: AppSettings;
  streak: number;
  lastActiveDate: string;
  unlockedBadges: string[];
  xp: number;
  chatSessions?: ChatSession[];
  currentSessionId?: string;
  profile?: {
    name: string;
    email: string;
    avatar: string;
    targetCompanies: string[];
    linkedinUrl: string;
    githubUrl: string;
    resumeLink: string;
    cohort: string;
  };
}

const serializeState = (state: AppState): Omit<SerializedProgress, "user"> => {
  const dsaProblems: SerializedProgress["dsaProblems"] = {};
  const dsaTopicMastery: SerializedProgress["dsaTopicMastery"] = {};

  state.dsaTopics.forEach(topic => {
    if (topic.mastery) {
      dsaTopicMastery[topic.id] = topic.mastery;
    }
    topic.problems.forEach(prob => {
      if (
        prob.isCompleted ||
        prob.isWeak ||
        prob.notes ||
        prob.lastSolved ||
        prob.revisionInterval ||
        prob.nextRevisionDate ||
        prob.timeComplexity ||
        prob.spaceComplexity
      ) {
        dsaProblems[prob.id] = {
          ...(prob.isCompleted && { isCompleted: true }),
          ...(prob.isWeak && { isWeak: true }),
          ...(prob.notes && { notes: prob.notes }),
          ...(prob.lastSolved && { lastSolved: prob.lastSolved }),
          ...(prob.revisionInterval !== undefined && { revisionInterval: prob.revisionInterval }),
          ...(prob.nextRevisionDate && { nextRevisionDate: prob.nextRevisionDate }),
          ...(prob.timeComplexity && { timeComplexity: prob.timeComplexity }),
          ...(prob.spaceComplexity && { spaceComplexity: prob.spaceComplexity })
        };
      }
    });
  });

  const devSkills: SerializedProgress["devSkills"] = {};
  state.devCategories.forEach(cat => {
    cat.skills.forEach(skill => {
      if (skill.learned || skill.practiced || skill.built || skill.deployed || skill.revised) {
        devSkills[skill.id] = {
          ...(skill.learned && { learned: true }),
          ...(skill.practiced && { practiced: true }),
          ...(skill.built && { built: true }),
          ...(skill.deployed && { deployed: true }),
          ...(skill.revised && { revised: true })
        };
      }
    });
  });

  return {
    completedWeeks: state.completedWeeks || [],
    dsaProblems,
    dsaTopicMastery,
    devSkills,
    projects: state.projects || [],
    aiLogs: state.aiLogs || [],
    dailyHabits: state.dailyHabits,
    customTasks: state.customTasks || [],
    habitHistory: state.habitHistory || [],
    notes: state.notes || [],
    settings: state.settings,
    streak: state.streak || 0,
    lastActiveDate: state.lastActiveDate,
    unlockedBadges: state.unlockedBadges || [],
    xp: state.xp || 0,
    chatSessions: state.chatSessions || [],
    currentSessionId: state.currentSessionId || "default-session",
    profile: state.user ? {
      name: state.user.name,
      email: state.user.email,
      avatar: state.user.avatar,
      targetCompanies: state.user.targetCompanies || [],
      linkedinUrl: state.user.linkedinUrl || "",
      githubUrl: state.user.githubUrl || "",
      resumeLink: state.user.resumeLink || "",
      cohort: state.user.cohort || ""
    } : undefined
  };
};

const deserializeState = (serialized: Partial<SerializedProgress>): Partial<AppState> => {
  const dsaTopics = DEFAULT_DSA_TOPICS.map(defaultTopic => {
    const mastery = serialized.dsaTopicMastery?.[defaultTopic.id] || defaultTopic.mastery;
    const problems = defaultTopic.problems.map(defaultProb => {
      const savedProb = serialized.dsaProblems?.[defaultProb.id];
      if (!savedProb) return defaultProb;
      return {
        ...defaultProb,
        isCompleted: savedProb.isCompleted ?? defaultProb.isCompleted,
        isWeak: savedProb.isWeak ?? defaultProb.isWeak,
        notes: savedProb.notes ?? defaultProb.notes,
        lastSolved: savedProb.lastSolved ?? defaultProb.lastSolved,
        revisionInterval: savedProb.revisionInterval ?? defaultProb.revisionInterval,
        nextRevisionDate: savedProb.nextRevisionDate ?? defaultProb.nextRevisionDate,
        timeComplexity: savedProb.timeComplexity ?? defaultProb.timeComplexity,
        spaceComplexity: savedProb.spaceComplexity ?? defaultProb.spaceComplexity
      };
    });
    return {
      ...defaultTopic,
      mastery,
      problems
    };
  });

  const devCategories = DEFAULT_DEV_CATEGORIES.map(defaultCat => {
    const skills = defaultCat.skills.map(defaultSkill => {
      const savedSkill = serialized.devSkills?.[defaultSkill.id];
      if (!savedSkill) return defaultSkill;
      return {
        ...defaultSkill,
        learned: savedSkill.learned ?? defaultSkill.learned,
        practiced: savedSkill.practiced ?? defaultSkill.practiced,
        built: savedSkill.built ?? defaultSkill.built,
        deployed: savedSkill.deployed ?? defaultSkill.deployed,
        revised: savedSkill.revised ?? defaultSkill.revised
      };
    });
    return {
      ...defaultCat,
      skills
    };
  });

  return {
    completedWeeks: serialized.completedWeeks || [],
    dsaTopics,
    devCategories,
    projects: serialized.projects || [],
    aiLogs: serialized.aiLogs || [],
    dailyHabits: serialized.dailyHabits || {
      solveDsa: false,
      reviseOld: false,
      buildFeature: false,
      avoidAi: false,
      pushGithub: false,
      readDoc: false
    },
    customTasks: serialized.customTasks || [],
    habitHistory: serialized.habitHistory || [],
    notes: serialized.notes || [],
    settings: {
      accentColor: serialized.settings?.accentColor ?? "violet",
      compactUi: serialized.settings?.compactUi ?? false,
      remindersEnabled: serialized.settings?.remindersEnabled ?? true,
      reminderFrequency: serialized.settings?.reminderFrequency ?? "daily",
      showSections: serialized.settings?.showSections ?? {
        dashboard: true,
        roadmap: true,
        dsa: true,
        dev: true,
        ai: true,
        habits: true,
        projects: true,
        revision: true,
        notes: true,
        badges: true
      },
      nvidiaApiKey: serialized.settings?.nvidiaApiKey ?? "",
      nvidiaModelName: serialized.settings?.nvidiaModelName ?? "meta/llama-3.1-70b-instruct"
    },
    streak: serialized.streak || 0,
    lastActiveDate: serialized.lastActiveDate || getTodayString(),
    unlockedBadges: serialized.unlockedBadges || [],
    xp: serialized.xp || 0,
    chatSessions: serialized.chatSessions || [
      {
        id: "default-session",
        title: "Placement Chat Room",
        messages: [],
        createdAt: new Date().toLocaleDateString(),
        isPinned: false
      }
    ],
    currentSessionId: serialized.currentSessionId || "default-session"
  };
};

const calculateReadinessScore = (
  dsaCompletion: number,
  devCompletion: number,
  projectCompletionPercentage: number,
  streak: number,
  aiDependencyScore: number,
  aiLogsCount: number
): number => {
  const dsaContribution = dsaCompletion * 0.35;
  const devContribution = devCompletion * 0.30;
  const projectContribution = projectCompletionPercentage * 0.25;
  const streakContribution = Math.min(10, streak) * 10 * 0.10;

  const aiPenalty = aiLogsCount > 0 ? (aiDependencyScore * 0.15) : 0;

  return Math.min(100, Math.max(0, Math.round(dsaContribution + devContribution + projectContribution + streakContribution - aiPenalty)));
};

const getLevelInfo = (totalXp: number) => {
  let level = Math.floor(0.5 + Math.sqrt(0.25 + totalXp / 100));
  if (level < 1) level = 1;

  const xpForCurrentLevel = 100 * level * (level - 1);
  const xpForNextLevel = 100 * (level + 1) * level;
  const xpInCurrentLevel = totalXp - xpForCurrentLevel;
  const xpRequiredForNextLevel = xpForNextLevel - xpForCurrentLevel;

  const xpProgress = xpRequiredForNextLevel > 0
    ? Math.min(100, Math.round((xpInCurrentLevel / xpRequiredForNextLevel) * 100))
    : 100;

  return { level, xpProgress };
};

const STORAGE_KEY = "placement_cockpit_state";

const getTodayString = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

const getYesterdayString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

const INITIAL_STATE: AppState = {
  user: null,
  completedWeeks: [],
  dsaTopics: DEFAULT_DSA_TOPICS,
  devCategories: DEFAULT_DEV_CATEGORIES,
  projects: [],
  aiLogs: [],
  dailyHabits: {
    solveDsa: false,
    reviseOld: false,
    buildFeature: false,
    avoidAi: false,
    pushGithub: false,
    readDoc: false
  },
  customTasks: [],
  habitHistory: [],
  notes: [],
  settings: {
    accentColor: "violet",
    compactUi: false,
    remindersEnabled: true,
    reminderFrequency: "daily",
    showSections: {
      dashboard: true,
      roadmap: true,
      dsa: true,
      dev: true,
      ai: true,
      habits: true,
      projects: true,
      revision: true,
      notes: true,
      badges: true
    },
    nvidiaApiKey: "",
    nvidiaModelName: "meta/llama-3.1-70b-instruct"
  },
  streak: 0,
  lastActiveDate: "",
  unlockedBadges: [],
  xp: 0,
  chatMessages: [],
  chatSessions: [
    {
      id: "default-session",
      title: "Placement Chat Room",
      messages: [],
      createdAt: new Date().toLocaleDateString(),
      isPinned: false
    }
  ],
  currentSessionId: "default-session"
};

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AppState;
        
        // Dynamic day check for habits reset & streak retention
        const today = getTodayString();
        const yesterday = getYesterdayString();
        let updatedState = { ...parsed };
        updatedState.user = null;

        // Merge saved dsaTopics progress with fresh DEFAULT_DSA_TOPICS definitions
        updatedState.dsaTopics = DEFAULT_DSA_TOPICS.map(defaultTopic => {
          const savedTopic = (parsed.dsaTopics || []).find(t => t.id === defaultTopic.id);
          if (!savedTopic) return defaultTopic;

          const mergedProblems = defaultTopic.problems.map(defaultProb => {
            const savedProb = savedTopic.problems.find(p => p.id === defaultProb.id);
            if (!savedProb) return defaultProb;

            return {
              ...defaultProb,
              isCompleted: savedProb.isCompleted ?? defaultProb.isCompleted,
              isWeak: savedProb.isWeak ?? defaultProb.isWeak,
              notes: savedProb.notes ?? defaultProb.notes,
              lastSolved: savedProb.lastSolved ?? defaultProb.lastSolved,
              revisionInterval: savedProb.revisionInterval ?? defaultProb.revisionInterval,
              nextRevisionDate: savedProb.nextRevisionDate ?? defaultProb.nextRevisionDate,
              timeComplexity: savedProb.timeComplexity ?? defaultProb.timeComplexity,
              spaceComplexity: savedProb.spaceComplexity ?? defaultProb.spaceComplexity
            };
          });

          return {
            ...defaultTopic,
            mastery: savedTopic.mastery || defaultTopic.mastery,
            problems: mergedProblems
          };
        });

        if (updatedState.xp === undefined) {
          updatedState.xp = 0;
        }
        
        if (updatedState.chatMessages === undefined) {
          updatedState.chatMessages = [];
        }

        if (updatedState.chatSessions === undefined || updatedState.chatSessions.length === 0) {
          updatedState.chatSessions = [
            {
              id: "default-session",
              title: "Placement Chat Room",
              messages: updatedState.chatMessages || [],
              createdAt: new Date().toLocaleDateString(),
              isPinned: false
            }
          ];
          updatedState.currentSessionId = "default-session";
        }

        if (updatedState.settings.nvidiaApiKey === undefined) {
          updatedState.settings.nvidiaApiKey = "";
        }

        if (updatedState.settings.nvidiaModelName === undefined) {
          updatedState.settings.nvidiaModelName = "meta/llama-3.1-70b-instruct";
        }

        if (parsed.lastActiveDate !== today) {
          // It's a new day, save yesterday's habit count to history
          if (parsed.lastActiveDate) {
            const completedCount = Object.values(parsed.dailyHabits).filter(Boolean).length;
            const historyItem: HistoryItem = {
              date: parsed.lastActiveDate,
              habitsCompleted: completedCount
            };
            
            // Avoid duplicate history items
            const filteredHistory = parsed.habitHistory.filter(h => h.date !== parsed.lastActiveDate);
            updatedState.habitHistory = [...filteredHistory, historyItem];
          }

          // Reset habits for today
          updatedState.dailyHabits = {
            solveDsa: false,
            reviseOld: false,
            buildFeature: false,
            avoidAi: false,
            pushGithub: false,
            readDoc: false
          };
          
          // Clear yesterday's completed custom tasks, keep uncompleted ones
          updatedState.customTasks = parsed.customTasks.filter(t => !t.isCompleted);

          // Streak check
          if (parsed.lastActiveDate === yesterday) {
            // Active yesterday, keep streak
          } else if (parsed.lastActiveDate !== "") {
            // Broke the streak (gap of more than 1 day)
            updatedState.streak = 0;
          }
          
          updatedState.lastActiveDate = today;
        }

        return updatedState;
      } catch (e) {
        console.error("Failed to parse saved state, using initial state", e);
      }
    }
    return {
      ...INITIAL_STATE,
      lastActiveDate: getTodayString()
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Apply theme variable to document root
    const root = document.documentElement;
    let colorValue = "#8b5cf6"; // violet
    let rgbValue = "139, 92, 246";
    if (state.settings.accentColor === "emerald") { colorValue = "#10b981"; rgbValue = "16, 185, 129"; }
    else if (state.settings.accentColor === "amber") { colorValue = "#f59e0b"; rgbValue = "245, 158, 11"; }
    else if (state.settings.accentColor === "rose") { colorValue = "#f43f5e"; rgbValue = "244, 63, 94"; }
    else if (state.settings.accentColor === "blue") { colorValue = "#3b82f6"; rgbValue = "59, 130, 246"; }

    root.style.setProperty("--accent-color", colorValue);
    root.style.setProperty("--accent-rgb", rgbValue);
  }, [state]);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const savedProfile = localStorage.getItem(`profile_${firebaseUser.uid}`);
        let userProfile: UserProfile;

        if (savedProfile) {
          try {
            userProfile = JSON.parse(savedProfile);
            // Dynamic updates from Firebase
            userProfile.name = firebaseUser.displayName || userProfile.name;
            userProfile.avatar = firebaseUser.photoURL || userProfile.avatar;
            userProfile.email = firebaseUser.email || userProfile.email;
          } catch (e) {
            userProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || "Google Candidate",
              email: firebaseUser.email || "",
              avatar: firebaseUser.photoURL || "",
              targetCompanies: [],
              linkedinUrl: "",
              githubUrl: "",
              resumeLink: "",
              cohort: "2026 Cohort"
            };
          }
        } else {
          userProfile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || "Google Candidate",
            email: firebaseUser.email || "",
            avatar: firebaseUser.photoURL || "",
            targetCompanies: [],
            linkedinUrl: "",
            githubUrl: "",
            resumeLink: "",
            cohort: "2026 Cohort"
          };
        }

        // Fetch user data from Firestore on login
        if (hasFirebaseKeys) {
          try {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              const deserialized = deserializeState(data);

              if (data.profile) {
                userProfile = {
                  ...userProfile,
                  targetCompanies: data.profile.targetCompanies || userProfile.targetCompanies,
                  linkedinUrl: data.profile.linkedinUrl || userProfile.linkedinUrl,
                  githubUrl: data.profile.githubUrl || userProfile.githubUrl,
                  resumeLink: data.profile.resumeLink || userProfile.resumeLink,
                  cohort: data.profile.cohort || userProfile.cohort,
                  name: data.profile.name || userProfile.name,
                  avatar: data.profile.avatar || userProfile.avatar,
                  email: data.profile.email || userProfile.email
                };
              }

              localStorage.setItem(`profile_${firebaseUser.uid}`, JSON.stringify(userProfile));

              setState(prev => ({
                ...prev,
                ...deserialized,
                user: userProfile
              }));
            } else {
              localStorage.setItem(`profile_${firebaseUser.uid}`, JSON.stringify(userProfile));
              setState(prev => ({ ...prev, user: userProfile }));
            }
          } catch (err) {
            console.error("Error loading user data from Firestore:", err);
            localStorage.setItem(`profile_${firebaseUser.uid}`, JSON.stringify(userProfile));
            setState(prev => ({ ...prev, user: userProfile }));
          }
        } else {
          localStorage.setItem(`profile_${firebaseUser.uid}`, JSON.stringify(userProfile));
          setState(prev => ({ ...prev, user: userProfile }));
        }
      } else {
        setState(prev => ({ ...prev, user: null }));
      }
    });

    return () => unsubscribe();
  }, []);

  // Debounced state save to Firestore
  useEffect(() => {
    if (!state.user || !hasFirebaseKeys) return;

    const timer = setTimeout(async () => {
      try {
        const serialized = serializeState(state);
        const userDocRef = doc(db, "users", state.user!.uid);
        await setDoc(userDocRef, serialized, { merge: true });
        console.log("Firestore state saved successfully");
      } catch (err) {
        console.error("Failed to save state to Firestore:", err);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [state, state.user?.uid]);

  const loginUser = (userProfile: UserProfile) => {
    setState(prev => ({ ...prev, user: userProfile }));
  };

  const logoutUser = () => {
    setState(prev => ({ ...prev, user: null }));
  };

  const updateUserProfile = (profileUpdate: Partial<UserProfile>) => {
    setState(prev => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, ...profileUpdate };
      localStorage.setItem(`profile_${prev.user.uid}`, JSON.stringify(updatedUser));
      return { ...prev, user: updatedUser };
    });
  };

  // Save state to localStorage whenever it changes

  // Dynamic Badge Unlocking Engine
  const checkAndTriggerBadges = (updatedState: AppState) => {
    // 1. Calculate values
    const dsaSolvedCount = updatedState.dsaTopics.reduce(
      (acc, topic) => acc + topic.problems.filter(p => p.isCompleted).length,
      0
    );

    const devMasteredCount = updatedState.devCategories.reduce(
      (acc, cat) =>
        acc + cat.skills.filter(s => s.learned && s.practiced && s.built && s.deployed && s.revised).length,
      0
    );

    const logCount = updatedState.aiLogs.length;
    const avgAiPercent = logCount > 0
      ? updatedState.aiLogs.reduce((acc, l) => acc + l.aiPercentage, 0) / logCount
      : 100;

    const zeroCopyLogs = updatedState.aiLogs.filter(l => l.aiPercentage === 0).length;

    // Revision items completed
    const totalRevisionsSolved = updatedState.dsaTopics.reduce((acc, topic) => {
      return acc + topic.problems.filter(p => p.lastSolved && p.revisionInterval && p.revisionInterval > 0).length;
    }, 0);

    // Dynamic readiness calculation
    const dsaTotal = updatedState.dsaTopics.reduce((acc, t) => acc + t.problems.length, 0);
    const dsaComp = dsaTotal > 0 ? (dsaSolvedCount / dsaTotal) * 100 : 0;

    const devTotalSkills = updatedState.devCategories.reduce((acc, c) => acc + c.skills.length, 0);
    const devCompletedActions = updatedState.devCategories.reduce((acc, c) => {
      return acc + c.skills.reduce((sum, s) => {
        let sc = 0;
        if (s.learned) sc++;
        if (s.practiced) sc++;
        if (s.built) sc++;
        if (s.deployed) sc++;
        if (s.revised) sc++;
        return sum + sc;
      }, 0);
    }, 0);
    const devComp = devTotalSkills > 0 ? (devCompletedActions / (devTotalSkills * 5)) * 100 : 0;

    const projComp = updatedState.projects.length > 0
      ? (updatedState.projects.reduce((acc, p) => acc + p.completion, 0) / (updatedState.projects.length * 100)) * 100
      : 0;

    const readinessScore = calculateReadinessScore(
      dsaComp,
      devComp,
      projComp,
      updatedState.streak,
      avgAiPercent,
      logCount
    );

    const freshlyUnlocked: string[] = [];

    DEFAULT_BADGES.forEach(badge => {
      if (updatedState.unlockedBadges.includes(badge.id)) return;

      let passes = false;
      // Evaluate requirement string manually
      switch (badge.id) {
        case "badge-1": // dsaCount >= 10
          passes = dsaSolvedCount >= 10;
          break;
        case "badge-2": // dsaCount >= 40
          passes = dsaSolvedCount >= 40;
          break;
        case "badge-3": // devCount >= 5
          passes = devMasteredCount >= 5;
          break;
        case "badge-4": // devCount >= 12
          passes = devMasteredCount >= 12;
          break;
        case "badge-5": // avgAiPercent <= 20 && logCount >= 3
          passes = avgAiPercent <= 20 && logCount >= 3;
          break;
        case "badge-6": // zeroCopyLogs >= 5
          passes = zeroCopyLogs >= 5;
          break;
        case "badge-7": // streak >= 7
          passes = updatedState.streak >= 7;
          break;
        case "badge-8": // revisionCount >= 10
          passes = totalRevisionsSolved >= 10;
          break;
        case "badge-9": // readinessScore >= 85
          passes = readinessScore >= 85;
          break;
      }

      if (passes) {
        freshlyUnlocked.push(badge.id);
      }
    });

    if (freshlyUnlocked.length > 0) {
      // Trigger Confetti!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#8b5cf6", "#10b981", "#f59e0b", "#f43f5e", "#3b82f6"]
      });
      
      return {
        ...updatedState,
        unlockedBadges: [...updatedState.unlockedBadges, ...freshlyUnlocked]
      };
    }

    return updatedState;
  };

  // Helper to safely wrap updates, checking badges and streaks
  const updateState = (updater: (prev: AppState) => AppState) => {
    setState(prev => {
      const next = updater(prev);
      return checkAndTriggerBadges(next);
    });
  };

  // Calculations
  const dsaTotalCount = state.dsaTopics.reduce((acc, topic) => acc + topic.problems.length, 0);
  const dsaSolvedCount = state.dsaTopics.reduce(
    (acc, topic) => acc + topic.problems.filter(p => p.isCompleted).length,
    0
  );
  const dsaCompletion = dsaTotalCount > 0 ? Math.round((dsaSolvedCount / dsaTotalCount) * 100) : 0;

  // Dev completion
  const devTotalSkills = state.devCategories.reduce((acc, cat) => acc + cat.skills.length, 0);
  const devCompletedActions = state.devCategories.reduce((acc, cat) => {
    return (
      acc +
      cat.skills.reduce((sum, skill) => {
        let count = 0;
        if (skill.learned) count++;
        if (skill.practiced) count++;
        if (skill.built) count++;
        if (skill.deployed) count++;
        if (skill.revised) count++;
        return sum + count;
      }, 0)
    );
  }, 0);
  const devCompletion =
    devTotalSkills > 0 ? Math.round((devCompletedActions / (devTotalSkills * 5)) * 100) : 0;

  // AI Score (higher is worse AI reliance, so lower percentage = better)
  const aiLogsCount = state.aiLogs.length;
  const aiDependencyScore =
    aiLogsCount > 0
      ? Math.round(state.aiLogs.reduce((acc, log) => acc + log.aiPercentage, 0) / aiLogsCount)
      : 0;

  // Project metrics
  const projectCount = state.projects.length;
  const projectCompletionPercentage =
    projectCount > 0
      ? Math.round(state.projects.reduce((acc, proj) => acc + proj.completion, 0) / projectCount)
      : 0;

  // Spaced Repetition / Revision metrics
  // Completed revisions = problems that have a revisionInterval > 0
  const revisionTotalCount = state.dsaTopics.reduce(
    (acc, topic) => acc + topic.problems.filter(p => p.revisionInterval && p.revisionInterval > 0).length,
    0
  );
  // Mastered topics act as finished revisions
  const revisionCompletion = revisionTotalCount > 0 ? Math.min(100, Math.round((revisionTotalCount / 15) * 100)) : 0;

  const readinessScore = calculateReadinessScore(
    dsaCompletion,
    devCompletion,
    projectCompletionPercentage,
    state.streak,
    aiDependencyScore,
    aiLogsCount
  );

  const overallCompletion = Math.round(
    (state.completedWeeks.length / DEFAULT_WEEK_PLAN.length) * 100
  );

  // Dynamic level progression system (RPG-style)
  const { level, xpProgress } = getLevelInfo(state.xp);

  const getLevelTitle = (lvl: number) => {
    if (lvl >= 10) return "Tech Lead";
    if (lvl >= 8) return "Senior Engineer";
    if (lvl >= 5) return "Software Engineer II";
    if (lvl >= 3) return "Junior Engineer";
    return "Intern";
  };
  const levelTitle = getLevelTitle(level);

  // Actions
  const toggleWeek = (weekId: string) => {
    updateState(prev => {
      const isCompleted = prev.completedWeeks.includes(weekId);
      const completedWeeks = isCompleted
        ? prev.completedWeeks.filter(id => id !== weekId)
        : [...prev.completedWeeks, weekId];

      if (!isCompleted) {
        // Week completed confetti!
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }

      return { ...prev, completedWeeks };
    });
  };

  const toggleDsaProblem = (topicId: string, problemId: string) => {
    updateState(prev => {
      let xpDiff = 0;
      const dsaTopics = prev.dsaTopics.map(topic => {
        if (topic.id !== topicId) return topic;
        const problems = topic.problems.map(prob => {
          if (prob.id !== problemId) return prob;
          const isCompleted = !prob.isCompleted;
          
          if (isCompleted) {
            xpDiff += prob.difficulty === "Hard" ? 100 : prob.difficulty === "Medium" ? 50 : 20;
          } else {
            xpDiff -= prob.difficulty === "Hard" ? 100 : prob.difficulty === "Medium" ? 50 : 20;
          }
          
          // Habit triggers: solving a problem registers for daily habit
          return {
            ...prob,
            isCompleted,
            lastSolved: isCompleted ? getTodayString() : prob.lastSolved,
            // Automatically queue for revision in 3 days if solved
            revisionInterval: isCompleted ? 3 : undefined,
            nextRevisionDate: isCompleted
              ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
              : undefined
          };
        });
        return { ...topic, problems };
      });

      // Update today's streak and habits if solving first problem
      let dailyHabits = { ...prev.dailyHabits };
      let streak = prev.streak;

      const totalSolvedToday = dsaTopics.reduce((acc, t) => {
        return acc + t.problems.filter(p => p.isCompleted && p.lastSolved === getTodayString()).length;
      }, 0);

      if (totalSolvedToday > 0 && !prev.dailyHabits.solveDsa) {
        dailyHabits.solveDsa = true;
        xpDiff += 10;
        if (prev.streak === 0) {
          streak = 1;
        } else {
          // Increment streak if last action was yesterday
          const yesterday = getYesterdayString();
          if (prev.lastActiveDate === yesterday) {
            streak = prev.streak + 1;
          }
        }
      }

      return {
        ...prev,
        dsaTopics,
        dailyHabits,
        streak,
        xp: Math.max(0, prev.xp + xpDiff),
        lastActiveDate: getTodayString()
      };
    });
  };

  const updateDsaNotes = (topicId: string, problemId: string, notes: string) => {
    updateState(prev => {
      const dsaTopics = prev.dsaTopics.map(topic => {
        if (topic.id !== topicId) return topic;
        const problems = topic.problems.map(prob => {
          if (prob.id !== problemId) return prob;
          return { ...prob, notes };
        });
        return { ...topic, problems };
      });
      return { ...prev, dsaTopics };
    });
  };

  const toggleDsaWeak = (topicId: string, problemId: string) => {
    updateState(prev => {
      const dsaTopics = prev.dsaTopics.map(topic => {
        if (topic.id !== topicId) return topic;
        const problems = topic.problems.map(prob => {
          if (prob.id !== problemId) return prob;
          return { ...prob, isWeak: !prob.isWeak };
        });
        return { ...topic, problems };
      });
      return { ...prev, dsaTopics };
    });
  };

  const scheduleRevision = (topicId: string, problemId: string, interval: number) => {
    updateState(prev => {
      let xpDiff = 0;
      const dsaTopics = prev.dsaTopics.map(topic => {
        if (topic.id !== topicId) return topic;
        const problems = topic.problems.map(prob => {
          if (prob.id !== problemId) return prob;
          const nextRevisionDate = interval > 0
            ? new Date(Date.now() + interval * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
            : undefined;

          const prevInterval = prob.revisionInterval || 0;
          if (interval >= 30 && prevInterval < 30) {
            xpDiff += 150; // Graduate revision gives 150 XP!
          } else if (interval < 30 && prevInterval >= 30) {
            xpDiff -= 150; // Demote from graduate
          }

          return { ...prob, revisionInterval: interval, nextRevisionDate };
        });
        return { ...topic, problems };
      });
      return { ...prev, dsaTopics, xp: Math.max(0, prev.xp + xpDiff) };
    });
  };

  const updateDsaComplexity = (
    topicId: string,
    problemId: string,
    timeComplexity: string,
    spaceComplexity: string
  ) => {
    updateState(prev => {
      const dsaTopics = prev.dsaTopics.map(topic => {
        if (topic.id !== topicId) return topic;
        const problems = topic.problems.map(prob => {
          if (prob.id !== problemId) return prob;
          return { ...prob, timeComplexity, spaceComplexity };
        });
        return { ...topic, problems };
      });
      return { ...prev, dsaTopics };
    });
  };

  const updateDsaMastery = (topicId: string, mastery: "Beginner" | "Intermediate" | "Master") => {
    updateState(prev => {
      const dsaTopics = prev.dsaTopics.map(topic => {
        if (topic.id !== topicId) return topic;
        return { ...topic, mastery };
      });
      return { ...prev, dsaTopics };
    });
  };

  const updateDevSkill = (
    skillId: string,
    field: "learned" | "practiced" | "built" | "deployed" | "revised"
  ) => {
    updateState(prev => {
      let xpDiff = 0;
      const devCategories = prev.devCategories.map(cat => {
        const skills = cat.skills.map(skill => {
          if (skill.id !== skillId) return skill;
          const nextVal = !skill[field];
          xpDiff += nextVal ? 15 : -15;
          return { ...skill, [field]: nextVal };
        });
        return { ...cat, skills };
      });

      // Update habits trigger if building/deploying items
      let dailyHabits = { ...prev.dailyHabits };
      if (field === "built" && !prev.dailyHabits.buildFeature) {
        dailyHabits.buildFeature = true;
        xpDiff += 10;
      }

      return {
        ...prev,
        devCategories,
        dailyHabits,
        xp: Math.max(0, prev.xp + xpDiff),
        lastActiveDate: getTodayString()
      };
    });
  };

  const addAiLog = (logData: Omit<AiLog, "id" | "date">) => {
    updateState(prev => {
      const today = getTodayString();
      const existingIndex = prev.aiLogs.findIndex(l => l.date === today);

      const newLog: AiLog = {
        id: existingIndex >= 0 ? prev.aiLogs[existingIndex].id : Math.random().toString(36).substring(7),
        date: today,
        ...logData
      };

      let aiLogs = [...prev.aiLogs];
      if (existingIndex >= 0) {
        aiLogs[existingIndex] = newLog;
      } else {
        aiLogs.push(newLog);
      }

      // Check anti-vibe habits
      let dailyHabits = { ...prev.dailyHabits };
      if (logData.aiPercentage < 30) {
        dailyHabits.avoidAi = true;
      }

      return { ...prev, aiLogs, dailyHabits, lastActiveDate: today };
    });
  };

  const toggleHabit = (key: keyof DailyHabitState) => {
    updateState(prev => {
      const dailyHabits = { ...prev.dailyHabits, [key]: !prev.dailyHabits[key] };
      const nextVal = dailyHabits[key];
      const xpDiff = nextVal ? 10 : -10;
      
      // If turning habit to true, evaluate streak check
      let streak = prev.streak;
      const totalCompleted = Object.values(dailyHabits).filter(Boolean).length;
      
      if (totalCompleted === 1 && prev.streak === 0) {
        streak = 1;
      } else if (totalCompleted === 1) {
        const yesterday = getYesterdayString();
        if (prev.lastActiveDate === yesterday) {
          streak = prev.streak + 1;
        }
      }

      return {
        ...prev,
        dailyHabits,
        streak,
        xp: Math.max(0, prev.xp + xpDiff),
        lastActiveDate: getTodayString()
      };
    });
  };

  const addCustomTask = (name: string) => {
    updateState(prev => {
      const newTask: CustomTask = {
        id: Math.random().toString(36).substring(7),
        name,
        isCompleted: false
      };
      return { ...prev, customTasks: [...prev.customTasks, newTask] };
    });
  };

  const toggleCustomTask = (id: string) => {
    updateState(prev => {
      let xpDiff = 0;
      const customTasks = prev.customTasks.map(task => {
        if (task.id !== id) return task;
        const isCompleted = !task.isCompleted;
        xpDiff += isCompleted ? 10 : -10;
        return { ...task, isCompleted };
      });
      return { ...prev, customTasks, xp: Math.max(0, prev.xp + xpDiff) };
    });
  };

  const deleteCustomTask = (id: string) => {
    updateState(prev => {
      const customTasks = prev.customTasks.filter(task => task.id !== id);
      return { ...prev, customTasks };
    });
  };

  const addProject = (projectData: Omit<Project, "id">) => {
    updateState(prev => {
      const newProject: Project = {
        id: Math.random().toString(36).substring(7),
        ...projectData
      };
      return { ...prev, projects: [...prev.projects, newProject] };
    });
  };

  const updateProject = (updatedProject: Project) => {
    updateState(prev => {
      const projects = prev.projects.map(p => (p.id === updatedProject.id ? updatedProject : p));
      return { ...prev, projects };
    });
  };

  const deleteProject = (id: string) => {
    updateState(prev => {
      const projects = prev.projects.filter(p => p.id !== id);
      return { ...prev, projects };
    });
  };

  const addChatMessage = (role: "user" | "assistant", content: string) => {
    updateState(prev => {
      const newMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role,
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      
      const activeId = prev.currentSessionId || "default-session";
      let chatSessions = prev.chatSessions || [];
      if (chatSessions.length === 0) {
        chatSessions = [{
          id: "default-session",
          title: "Placement Chat Room",
          messages: [],
          createdAt: new Date().toLocaleDateString(),
          isPinned: false
        }];
      }

      const updatedSessions = chatSessions.map(session => {
        if (session.id !== activeId) return session;
        let title = session.title;
        if (session.messages.length === 0 && role === "user") {
          title = content.length > 30 ? content.slice(0, 30) + "..." : content;
        }
        return {
          ...session,
          title,
          messages: [...session.messages, newMsg]
        };
      });

      const activeSession = updatedSessions.find(s => s.id === activeId);
      const chatMessages = activeSession ? activeSession.messages : [];

      return {
        ...prev,
        chatSessions: updatedSessions,
        chatMessages
      };
    });
  };

  const clearChatHistory = () => {
    updateState(prev => {
      const activeId = prev.currentSessionId || "default-session";
      const chatSessions = (prev.chatSessions || []).map(s => {
        if (s.id !== activeId) return s;
        return { ...s, messages: [] };
      });
      return {
        ...prev,
        chatSessions,
        chatMessages: []
      };
    });
  };

  const createNewSession = (title?: string) => {
    updateState(prev => {
      const newSession: ChatSession = {
        id: Math.random().toString(36).substring(7),
        title: title || "New Chat Session",
        messages: [],
        createdAt: new Date().toLocaleDateString(),
        isPinned: false
      };
      const chatSessions = [...(prev.chatSessions || []), newSession];
      return {
        ...prev,
        chatSessions,
        currentSessionId: newSession.id,
        chatMessages: []
      };
    });
  };

  const setActiveSession = (sessionId: string) => {
    updateState(prev => {
      const chatSessions = prev.chatSessions || [];
      const session = chatSessions.find(s => s.id === sessionId);
      return {
        ...prev,
        currentSessionId: sessionId,
        chatMessages: session ? session.messages : []
      };
    });
  };

  const deleteSession = (sessionId: string) => {
    updateState(prev => {
      let chatSessions = (prev.chatSessions || []).filter(s => s.id !== sessionId);
      let currentSessionId = prev.currentSessionId;
      
      if (chatSessions.length === 0) {
        const defaultSession: ChatSession = {
          id: "default-session",
          title: "Placement Chat Room",
          messages: [],
          createdAt: new Date().toLocaleDateString(),
          isPinned: false
        };
        chatSessions = [defaultSession];
        currentSessionId = "default-session";
      } else if (currentSessionId === sessionId) {
        currentSessionId = chatSessions[0].id;
      }
      
      const activeSession = chatSessions.find(s => s.id === currentSessionId);
      
      return {
        ...prev,
        chatSessions,
        currentSessionId,
        chatMessages: activeSession ? activeSession.messages : []
      };
    });
  };

  const togglePinSession = (sessionId: string) => {
    updateState(prev => {
      const chatSessions = (prev.chatSessions || []).map(s => {
        if (s.id !== sessionId) return s;
        return { ...s, isPinned: !s.isPinned };
      });
      return {
        ...prev,
        chatSessions
      };
    });
  };

  const renameSession = (sessionId: string, title: string) => {
    updateState(prev => {
      const chatSessions = (prev.chatSessions || []).map(s => {
        if (s.id !== sessionId) return s;
        return { ...s, title };
      });
      return {
        ...prev,
        chatSessions
      };
    });
  };

  const addNote = (noteData: Omit<Note, "id" | "updatedAt">) => {
    updateState(prev => {
      const newNote: Note = {
        id: Math.random().toString(36).substring(7),
        updatedAt: new Date().toLocaleString(),
        ...noteData
      };
      return { ...prev, notes: [newNote, ...prev.notes] };
    });
  };

  const updateNote = (updatedNote: Note) => {
    updateState(prev => {
      const notes = prev.notes.map(n =>
        n.id === updatedNote.id
          ? { ...updatedNote, updatedAt: new Date().toLocaleString() }
          : n
      );
      return { ...prev, notes };
    });
  };

  const deleteNote = (id: string) => {
    updateState(prev => {
      const notes = prev.notes.filter(n => n.id !== id);
      return { ...prev, notes };
    });
  };

  const updateSettings = (updatedFields: Partial<AppSettings>) => {
    updateState(prev => {
      return {
        ...prev,
        settings: { ...prev.settings, ...updatedFields }
      };
    });
  };

  const resetAllData = () => {
    setState({
      ...INITIAL_STATE,
      lastActiveDate: getTodayString()
    });
  };

  const seedMockData = () => {
    updateState(prev => {
      const today = getTodayString();
      const yesterday = getYesterdayString();
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

      // Mark first 4 weeks completed
      const completedWeeks = ["week-1", "week-2", "week-3", "week-4"];

      // Solve 12 DSA problems
      const dsaTopics = prev.dsaTopics.map(topic => {
        if (topic.id === "arrays-hashing") {
          return {
            ...topic,
            mastery: "Intermediate" as const,
            problems: topic.problems.map((p, idx) =>
              idx < 4
                ? {
                    ...p,
                    isCompleted: true,
                    lastSolved: threeDaysAgo,
                    revisionInterval: 3,
                    nextRevisionDate: today
                  }
                : p
            )
          };
        }
        if (topic.id === "two-pointers") {
          return {
            ...topic,
            mastery: "Intermediate" as const,
            problems: topic.problems.map((p, idx) =>
              idx < 3
                ? {
                    ...p,
                    isCompleted: true,
                    lastSolved: yesterday,
                    revisionInterval: 7,
                    nextRevisionDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
                  }
                : p
            )
          };
        }
        if (topic.id === "sliding-window") {
          return {
            ...topic,
            problems: topic.problems.map((p, idx) =>
              idx < 2 ? { ...p, isCompleted: true, lastSolved: yesterday } : p
            )
          };
        }
        return topic;
      });

      // Complete some dev skills
      const devCategories = prev.devCategories.map(cat => {
        if (cat.id === "frontend-cat") {
          return {
            ...cat,
            skills: cat.skills.map((s, idx) =>
              idx < 3
                ? { ...s, learned: true, practiced: true, built: true, deployed: true, revised: true }
                : s
            )
          };
        }
        if (cat.id === "backend-cat") {
          return {
            ...cat,
            skills: cat.skills.map((s, idx) =>
              idx === 0 ? { ...s, learned: true, practiced: true, built: true } : s
            )
          };
        }
        return cat;
      });

      // Add a couple of projects
      const projects: Project[] = [
        {
          id: "mock-proj-1",
          name: "DevPrep Cockpit Portal",
          status: "In Progress",
          difficulty: "Medium",
          completion: 70,
          techStack: ["React", "TypeScript", "Tailwind", "Zustand"],
          notes: "A premium placement dashboard built for personal learning operations.",
          links: { github: "https://github.com/coder/devprep" },
          checklists: { readme: true, deployment: false, interviewReady: true },
          interviewNotes: {
            situation: "Helps student transition from mindless AI copy-pasting to deep concept ownership.",
            task: "Build a single-user personal OS dashboard integrating LeetCode, full-stack checklist, and revision modules.",
            action: "Integrated context state sync'd with localStorage, custom radial dot backgrounds, and dynamic XP metrics.",
            result: "Fully responsive tracking engine, loads in <200ms, eliminates 'vibe-coding' dependency via logged AI scores."
          }
        },
        {
          id: "mock-proj-2",
          name: "Fast-Cache Redis Middleware",
          status: "Deployed",
          difficulty: "Hard",
          completion: 100,
          techStack: ["Node.js", "Express", "Redis", "TypeScript"],
          notes: "Custom caching layer for high read API loads, boosting performance by 300%.",
          links: { github: "https://github.com/coder/fast-cache", live: "https://fast-cache.render.com" },
          checklists: { readme: true, deployment: true, interviewReady: true },
          interviewNotes: {
            situation: "API latency and database connection bottlenecks under heavy reading pressure.",
            task: "Intercept high-frequency requests, look up query results from redis buffer, validate schema schemas using Zod.",
            action: "Implemented Express middleware logic routing database queries through redis cache cache, configured eviction protocols.",
            result: "Reduced average query response time from 180ms down to 12ms under 10k requests/min loads."
          }
        }
      ];

      // Add some logs
      const aiLogs: AiLog[] = [
        {
          id: "log-1",
          date: fiveDaysAgo,
          aiPercentage: 80,
          selfSolvedTime: 10,
          aiAssistedTime: 50,
          triedFirst: false,
          firstDraftSelf: false,
          understoodCode: false,
          copiedDirectly: true,
          canRebuild: false
        },
        {
          id: "log-2",
          date: fourDaysAgo,
          aiPercentage: 50,
          selfSolvedTime: 20,
          aiAssistedTime: 30,
          triedFirst: true,
          firstDraftSelf: false,
          understoodCode: true,
          copiedDirectly: true,
          canRebuild: false
        },
        {
          id: "log-3",
          date: threeDaysAgo,
          aiPercentage: 20,
          selfSolvedTime: 45,
          aiAssistedTime: 15,
          triedFirst: true,
          firstDraftSelf: true,
          understoodCode: true,
          copiedDirectly: false,
          canRebuild: true
        },
        {
          id: "log-4",
          date: yesterday,
          aiPercentage: 10,
          selfSolvedTime: 60,
          aiAssistedTime: 10,
          triedFirst: true,
          firstDraftSelf: true,
          understoodCode: true,
          copiedDirectly: false,
          canRebuild: true
        }
      ];

      // Habit history for heatmaps
      const habitHistory: HistoryItem[] = [
        { date: fiveDaysAgo, habitsCompleted: 2 },
        { date: fourDaysAgo, habitsCompleted: 4 },
        { date: threeDaysAgo, habitsCompleted: 6 },
        { date: yesterday, habitsCompleted: 5 }
      ];

      // Add some sample notes
      const notes: Note[] = [
        {
          id: "note-1",
          title: "Monotonic Stack Pattern Guide",
          content: "Use monotonic stacks when looking for the 'Next Greater Element' or 'Previous Smaller Element'. Iterate through items and pop stack elements that fail the condition. Store indices in stack rather than raw values to calculate distance offsets.",
          category: "DSA",
          tags: ["Stack", "Array", "Optimization"],
          updatedAt: yesterday
        },
        {
          id: "note-2",
          title: "JWT Cookie Security Best Practices",
          content: "Always store authentication tokens in HTTP-only, secure, sameSite cookies. This prevents accessibility via `document.cookie` scripts and blocks basic XSS token theft. Set appropriate token expiry durations.",
          category: "Development",
          tags: ["Auth", "Security", "Backend"],
          updatedAt: threeDaysAgo
        }
      ];

      return {
        ...prev,
        completedWeeks,
        dsaTopics,
        devCategories,
        projects,
        aiLogs,
        habitHistory,
        notes,
        streak: 5,
        xp: 450,
        lastActiveDate: today
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        overallCompletion,
        dsaCompletion,
        devCompletion,
        aiDependencyScore,
        readinessScore,
        projectCount,
        revisionCompletion,
        level,
        xpProgress,
        levelTitle,
        loginUser,
        logoutUser,
        updateUserProfile,
        toggleWeek,
        toggleDsaProblem,
        updateDsaNotes,
        toggleDsaWeak,
        scheduleRevision,
        updateDsaMastery,
        updateDsaComplexity,
        updateDevSkill,
        addAiLog,
        toggleHabit,
        addCustomTask,
        toggleCustomTask,
        deleteCustomTask,
        addProject,
        updateProject,
        deleteProject,
        addChatMessage,
        clearChatHistory,
        createNewSession,
        setActiveSession,
        deleteSession,
        togglePinSession,
        renameSession,
        addNote,
        updateNote,
        deleteNote,
        updateSettings,
        resetAllData,
        seedMockData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
