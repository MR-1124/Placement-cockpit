import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, hasFirebaseKeys } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Loader2, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserPlan } from "../data/curriculum";
import type { AppState, SerializedProgress, AppContextType } from "./AppStateTypes";
import { SCHEMA_VERSION, serializeState, deserializeState, calculateReadinessScore, getLevelInfo } from "./stateMigrations";
import { checkAndUnlockBadges } from "./badgeEngine";
import { audioTelemetry } from "../lib/audioTelemetry";

// Export context-specific types for backwards compatibility
export type { AppState, SerializedProgress, AppContextType };

// Arch Debt #13 fix: import all domain types from centralised types file.
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
  InterviewPhase,
  WeeklyGoal,
  DailyChallenge,
  Flashcard,
  FlashcardDeck,
  FlashcardSession,
  CompanyRoadmap,
  AtsReport
} from "../types/AppTypes";

// Re-export all types so existing consumers (import { X } from '../context/AppStateContext')
// continue to work without any changes across the codebase.
export type {
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
  InterviewPhase,
  WeeklyGoal,
  DailyChallenge,
  Flashcard,
  CompanyRoadmap,
  AtsReport
};

// All domain interfaces are now in src/types/AppTypes.ts (Arch Debt #13).
// They are imported above and re-exported for backwards compatibility.

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = "placement_cockpit_state";

export const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const getTodayString = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

const getYesterdayString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

const applyDayTransition = (state: AppState, today: string, yesterday: string): AppState => {
  if (!state.lastActiveDate || state.lastActiveDate === today) return state;

  const completedCount = Object.values(state.dailyHabits || {}).filter(Boolean).length;
  const historyItem: HistoryItem = {
    date: state.lastActiveDate,
    habitsCompleted: completedCount
  };

  const filteredHistory = (state.habitHistory || []).filter(h => h.date !== state.lastActiveDate);

  let streak = state.streak || 0;
  if (state.lastActiveDate === yesterday) {
    // Keep streak
  } else {
    // Reset streak
    streak = 0;
  }

  return {
    ...state,
    habitHistory: [...filteredHistory, historyItem],
    dailyHabits: {
      solveDsa: false,
      reviseOld: false,
      buildFeature: false,
      avoidAi: false,
      pushGithub: false,
      readDoc: false
    },
    customTasks: (state.customTasks || []).filter(t => !t.isCompleted),
    streak,
    lastActiveDate: today
  };
};

const getInitialState = (curriculum: any): AppState => ({
  version: SCHEMA_VERSION,
  isLoadingUser: true,
  user: null,
  dsaTopics: curriculum.DEFAULT_DSA_TOPICS,
  devCategories: curriculum.DEFAULT_DEV_CATEGORIES,
  projects: [],
    completedSkills: [],
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
    theme: "dark",
    accentColor: "violet",
    compactUi: false,
    reminderFrequency: "weekly",
    showSections: {
      dashboard: true,
      segments: true,
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
    nvidiaModelName: "meta/llama-3.1-70b-instruct",
    nvidiaInterviewerModelName: undefined,
    soundEnabled: true,
    soundVolume: 0.35,
    voiceEnabled: false,
    voiceRate: 1.0
  },
  streak: 0,
  lastActiveDate: "",
  unlockedBadges: [],
  xp: 0,
  practiceProblemsSolved: {},

  chatSessions: {
    "default-session": {
      id: "default-session",
      title: "Placement Chat Room",
      messages: [],
      createdAt: getTodayString(),
      isPinned: false
    }
  },
  currentSessionId: "default-session",
  userPlans: [
    {
      planId: "16-week-mastery",
      active: true,
      primary: true,
      startedAt: new Date().toISOString(),
      paused: false,
      completedSegments: [] as string[],
      customProgress: {}
    }
  ],
  primaryPlanId: "16-week-mastery",
  mockInterviews: [],
  activeInterviewSession: null,
  flashcards: [],
  customDecks: [],
  flashcardHistory: [],
  activeRoadmaps: [],
  atsReports: [],
  devPlanEnrolled: false,
  devPlanTargetDate: "",
  devPlanActiveSkillId: null,
  devQuizHistory: [],
  devSkillNotes: {},
  aptitudeQuizHistory: [],
  aptitudeTopicProgress: {}
});

const AppStateProviderInner: React.FC<{ children: React.ReactNode; curriculum: any }> = ({ children, curriculum }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AppState;
        
        // --- Schema Versioning Migration Logic ---
        // If parsed.version < SCHEMA_VERSION, apply migrations here in the future
          if (!parsed.version) {
            parsed.version = SCHEMA_VERSION;
          }

          if (parsed.settings?.nvidiaApiKey) {
            try {
              if (parsed.settings.nvidiaApiKey.startsWith("nvapi-")) {
                // If it starts with nvapi-, it was stored in plaintext, leave as is, will be encoded on next save
              } else {
                parsed.settings.nvidiaApiKey = atob(parsed.settings.nvidiaApiKey);
              }
            } catch (e) {
              // Ignore decoding errors, might be plaintext
            }
          }
          
          // Dynamic day check for habits reset & streak retention
        const today = getTodayString();
        const yesterday = getYesterdayString();
        let updatedState = { ...parsed };
        // Ensure all top-level arrays exist to prevent length crashes
        updatedState.completedSkills = updatedState.completedSkills || [];
        updatedState.activeRoadmaps = updatedState.activeRoadmaps || [];
        updatedState.atsReports = updatedState.atsReports || [];
        updatedState.projects = updatedState.projects || [];
        updatedState.aptitudeQuizHistory = updatedState.aptitudeQuizHistory || [];
        updatedState.aptitudeTopicProgress = updatedState.aptitudeTopicProgress || {};
        updatedState.userPlans = updatedState.userPlans || [];
        // Ensure each userPlan has completedSegments
        updatedState.userPlans = updatedState.userPlans.map((up: any) => {
          if (up.completedSegments === undefined) {
             // Migrate from old completedWeeks if it exists
             up.completedSegments = up.completedWeeks ? up.completedWeeks.map((w: any) => String(w)) : [];
          }
          return up;
        });
        const lastUser = localStorage.getItem("last_logged_in_user");
        if (lastUser) {
          try {
            updatedState.user = JSON.parse(lastUser);
          } catch {
            updatedState.user = null;
          }
        } else {
          updatedState.user = null;
        }

        // Merge saved dsaTopics progress with fresh DEFAULT_DSA_TOPICS definitions
        updatedState.dsaTopics = curriculum.DEFAULT_DSA_TOPICS.map((defaultTopic: any) => {
          const savedTopic = (parsed.dsaTopics || []).find(t => t.id === defaultTopic.id);
          if (!savedTopic) return defaultTopic;

          const mergedProblems = defaultTopic.problems.map((defaultProb: any) => {
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
              spaceComplexity: savedProb.spaceComplexity ?? defaultProb.spaceComplexity,
              submissions: savedProb.submissions ?? 0
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
        


        if (updatedState.chatSessions === undefined || Object.keys(updatedState.chatSessions || {}).length === 0) {
          updatedState.chatSessions = {
            "default-session": {
              id: "default-session",
              title: "Placement Chat Room",
              messages: (updatedState as any).chatMessages || [],
              createdAt: getTodayString(),
              isPinned: false
            }
          };
          updatedState.currentSessionId = "default-session";
        }

        if (updatedState.settings.nvidiaApiKey === undefined) {
          updatedState.settings.nvidiaApiKey = "";
        }

        if (updatedState.settings.nvidiaModelName === undefined) {
          updatedState.settings.nvidiaModelName = "meta/llama-3.1-70b-instruct";
        }

        if (updatedState.primaryPlanId === undefined) {
          updatedState.primaryPlanId = "16-week-mastery";
        }

        if (updatedState.mockInterviews === undefined) {
          updatedState.mockInterviews = [];
        }

        if (updatedState.activeInterviewSession === undefined) {
          updatedState.activeInterviewSession = null;
        }

        if (updatedState.userPlans === undefined || updatedState.userPlans.length === 0) {
          const migratedCompletedWeeks: string[] = (parsed as any).completedSegments || [];

          updatedState.userPlans = [
            {
              planId: "16-week-mastery",
              active: true,
              primary: true,
              startedAt: new Date().toISOString(),
              paused: false,
              completedSegments: migratedCompletedWeeks,
              customProgress: {}
            }
          ];
        }

        updatedState = applyDayTransition(updatedState, today, yesterday);

        return updatedState;
      } catch (e) {
        console.error("Failed to parse saved state, using initial state", e);
      }
    }
    const lastUser = localStorage.getItem("last_logged_in_user");
    let initialUser = null;
    if (lastUser) {
      try {
        initialUser = JSON.parse(lastUser);
      } catch {}
    }
    return {
      ...getInitialState(curriculum),
      user: initialUser,
      lastActiveDate: getTodayString()
    };
  });

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    severity?: "info" | "warning" | "danger";
  }>({
    isOpen: false,
    title: "",
    message: ""
  });

  const onConfirmRef = useRef<(() => void) | null>(null);

  const resetAllData = async () => {
    const initialState = getInitialState(curriculum);
    const newState = {
      ...initialState,
      isLoadingUser: false,
      user: state.user,
      userPlans: [
        {
          planId: "16-week-mastery",
          active: true,
          primary: true,
          startedAt: new Date().toISOString(),
          paused: false,
          completedSegments: [] as string[],
          customProgress: {}
        }
      ],
      primaryPlanId: "16-week-mastery",
      mockInterviews: [],
      activeInterviewSession: null,
      settings: {
        ...initialState.settings,
        nvidiaApiKey: state.settings.nvidiaApiKey,
        nvidiaModelName: state.settings.nvidiaModelName,
        nvidiaInterviewerModelName: state.settings.nvidiaInterviewerModelName,
        accentColor: state.settings.accentColor
      }
    };
    
    setState(newState);
    localStorage.removeItem(STORAGE_KEY);

    // Force an immediate wipe on the cloud to prevent debounced sync issues
    if (state.user && hasFirebaseKeys) {
      try {
        const userDocRef = doc(db, "users", state.user.uid);
        await setDoc(userDocRef, serializeState(newState));
      } catch (err) {
        console.error("Failed to wipe Firestore", err);
      }
    }
  };

  const confirmAction = (options: ConfirmationOptions) => {
    onConfirmRef.current = options.onConfirm;
    setConfirmState({
      isOpen: true,
      title: options.title,
      message: options.message,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      severity: options.severity || "info"
    });
  };

  // Dynamic check for date transition (midnight reset) while tab is open
  useEffect(() => {
    const checkDateTransition = () => {
      const today = getTodayString();
      const yesterday = getYesterdayString();
      setState(prev => applyDayTransition(prev, today, yesterday));
    };

    checkDateTransition();
    const interval = setInterval(checkDateTransition, 30000);
    return () => clearInterval(interval);
  }, []);

  // Save state to localStorage whenever it changes (debounced to avoid blocking render)
  useEffect(() => {
    const saveState = () => {
      const stateToSave = {
        ...state,
        chatSessions: state.chatSessions || {},
        settings: {
          ...state.settings,
          nvidiaApiKey: state.settings.nvidiaApiKey ? btoa(state.settings.nvidiaApiKey) : ""
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    };

    const handler = setTimeout(saveState, 1000);

    const handleBeforeUnload = () => {
      saveState();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

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

    // Apply theme mode class to documentElement
    const theme = state.settings.theme || "dark";
    if (theme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else if (theme === "dark") {
      root.classList.remove("light");
      root.classList.add("dark");
    } else if (theme === "system") {
      const isSystemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isSystemDark) {
        root.classList.remove("light");
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
        root.classList.add("light");
      }
    }

    return () => {
      clearTimeout(handler);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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
                const deserialized = deserializeState(data as SerializedProgress, curriculum);
  
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
                localStorage.setItem("last_logged_in_user", JSON.stringify(userProfile));
                setState(prev => ({ ...prev, ...deserialized, user: userProfile, isLoadingUser: false }));
              } else {
                localStorage.setItem(`profile_${firebaseUser.uid}`, JSON.stringify(userProfile));
                localStorage.setItem("last_logged_in_user", JSON.stringify(userProfile));
                
                setState(prev => {
                  if (!prev.user) {
                    // Guest user migrating to cloud: Keep local data and sync UP.
                    return { ...prev, user: userProfile, isLoadingUser: false };
                  } else {
                    // Wiped cloud account OR switching accounts: Wipe local data to prevent bleeding.
                    const emptyState = getInitialState(curriculum);
                    return { 
                      ...emptyState, 
                      user: userProfile, 
                      isLoadingUser: false, 
                      settings: prev.settings // keep settings like API keys
                    };
                  }
                });
              }
            } catch (err) {
            console.error("Error loading user data from Firestore:", err);
            localStorage.setItem(`profile_${firebaseUser.uid}`, JSON.stringify(userProfile));
            localStorage.setItem("last_logged_in_user", JSON.stringify(userProfile));
            setState(prev => ({ ...prev, user: userProfile, isLoadingUser: false }));
          }
        } else {
          localStorage.setItem(`profile_${firebaseUser.uid}`, JSON.stringify(userProfile));
          localStorage.setItem("last_logged_in_user", JSON.stringify(userProfile));
          setState(prev => ({ ...prev, user: userProfile, isLoadingUser: false }));
        }
      } else {
        localStorage.removeItem("last_logged_in_user");
        setState(prev => ({ ...prev, user: null, isLoadingUser: false }));
      }
    });

    return () => unsubscribe();
  }, []);

  // Debounced state save to Firestore
  useEffect(() => {
    if (!state.user || !hasFirebaseKeys || state.isLoadingUser) return;

    const timer = setTimeout(async () => {
      try {
        const serialized = serializeState(state);
        const userDocRef = doc(db, "users", state.user!.uid);
        await setDoc(userDocRef, serialized);
      } catch (err) {
        console.error("Failed to save state to Firestore:", err);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [state, state.user?.uid]);

  const loginUser = (userProfile: UserProfile) => {
    localStorage.setItem("last_logged_in_user", JSON.stringify(userProfile));
    setState(prev => ({ ...prev, user: userProfile }));
  };

  const logoutUser = () => {
    localStorage.removeItem("last_logged_in_user");
    // Wipe the device data so the next person/guest gets a clean slate
    const emptyState = getInitialState(curriculum);
    setState(prev => ({ 
      ...emptyState, 
      isLoadingUser: false,
      settings: prev.settings // Keep settings like API keys
    }));
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUserProfile = (profileUpdate: Partial<UserProfile>) => {
    setState(prev => {
      const currentUser = prev.user || {
        uid: "guest-user",
        name: "Guest Student",
        email: "guest@example.com",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=guest",
        targetCompanies: [],
        linkedinUrl: "",
        githubUrl: "",
        resumeLink: "",
        cohort: "CSE 2026",
        savedIntro: ""
      };
      const updatedUser = { ...currentUser, ...profileUpdate };
      localStorage.setItem(`profile_${currentUser.uid}`, JSON.stringify(updatedUser));
      localStorage.setItem("last_logged_in_user", JSON.stringify(updatedUser));
      return { ...prev, user: updatedUser };
    });
  };



  // Helper to safely wrap updates, checking badges and streaks
  const updateState = (updater: (prev: AppState) => AppState) => {
    setState(prev => {
      const next = updater(prev);
      return checkAndUnlockBadges(next, curriculum, prev);
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

  const primaryPlanId = state.primaryPlanId || "16-week-mastery";
  const primaryPlan = curriculum.ALL_PLANS.find((p: any) => p.id === primaryPlanId) || curriculum.ALL_PLANS[0];
  const primaryUserPlan = (state.userPlans || []).find((up: any) => up.planId === primaryPlanId);
  const primaryCompletedSegments = primaryUserPlan?.completedSegments || [];
  // BUG-C1 fix: guard against zero-length segments to prevent divide-by-zero crash
  const overallCompletion = primaryPlan?.segments?.length
    ? Math.min(100, Math.round((primaryCompletedSegments.length / primaryPlan.segments.length) * 100))
    : 0;

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
      const primaryPlanId = prev.primaryPlanId || "16-week-mastery";
      const userPlans = prev.userPlans || [];
      const primaryUserPlan = userPlans.find(up => up.planId === primaryPlanId);

      const segmentId = weekId; // reuse arg name
      const isCompleted = primaryUserPlan?.completedSegments.includes(segmentId) ?? false;

      const updatedUserPlans = userPlans.map(up => {
        if (up.planId !== primaryPlanId) return up;
        const completedSegmentsList = isCompleted
          ? up.completedSegments.filter((w: string) => String(w) !== String(segmentId))
          : [...up.completedSegments, String(segmentId)];
        return { ...up, completedSegments: completedSegmentsList };
      });



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

      return {
        ...prev,
        userPlans: updatedUserPlans
      };
    });
  };

  const toggleDsaProblem = (topicId: string, problemId: string) => {
    updateState(prev => {
      let xpDiff = 0;
      let problemSolved = false;
      const dsaTopics = prev.dsaTopics.map(topic => {
        if (topic.id !== topicId) return topic;
        const problems = topic.problems.map(prob => {
          if (prob.id !== problemId) return prob;
          const isCompleted = !prob.isCompleted;
          problemSolved = isCompleted;
          
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
            revisionInterval: isCompleted ? 3 : 0,
            nextRevisionDate: isCompleted
              ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
              : ""
          };
        });
        return { ...topic, problems };
      });

      if (problemSolved) {
        audioTelemetry.check();
      } else {
        audioTelemetry.click();
      }

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
            : "";

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

  const incrementDsaSubmissions = (topicId: string, problemId: string) => {
    updateState(prev => {
      const dsaTopics = prev.dsaTopics.map(topic => {
        if (topic.id !== topicId) return topic;
        const problems = topic.problems.map(prob => {
          if (prob.id !== problemId) return prob;
          return { ...prob, submissions: ((prob as any).submissions || 0) + 1 };
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
      let completedSkillId: string | null = null;
      const devCategories = prev.devCategories.map(cat => {
        const skills = cat.skills.map(skill => {
          if (skill.id !== skillId) return skill;
          const nextVal = !skill[field];
          xpDiff += nextVal ? 15 : -15;
          const updatedSkill = { ...skill, [field]: nextVal };
          const allDone = updatedSkill.learned && updatedSkill.practiced && updatedSkill.built && updatedSkill.deployed && updatedSkill.revised;
          const wasComplete = skill.learned && skill.practiced && skill.built && skill.deployed && skill.revised;
          if (!wasComplete && allDone) {
            completedSkillId = skillId;
            xpDiff += 50; // Completion bonus
          }
          return updatedSkill;
        });
        return { ...cat, skills };
      });

      // Update habits trigger if building/deploying items
      let dailyHabits = { ...prev.dailyHabits };
      if (field === "built" && !prev.dailyHabits.buildFeature) {
        dailyHabits.buildFeature = true;
        xpDiff += 10;
      }

      // ENH-8: Record completion timestamp
      const devSkillTimestamps = completedSkillId
        ? { ...(prev.devSkillTimestamps || {}), [completedSkillId]: Date.now() }
        : (prev.devSkillTimestamps || {});

      return {
        ...prev,
        devCategories,
        dailyHabits,
        devSkillTimestamps,
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
        id: existingIndex >= 0 ? prev.aiLogs[existingIndex].id : generateId(),
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

      if (nextVal) {
        audioTelemetry.check();
      } else {
        audioTelemetry.click();
      }
      
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
        id: generateId(),
        name,
        isCompleted: false
      };
      return { ...prev, customTasks: [...prev.customTasks, newTask] };
    });
  };

  const toggleCustomTask = (id: string) => {
    updateState(prev => {
      let xpDiff = 0;
      let completed = false;
      const customTasks = prev.customTasks.map(task => {
        if (task.id !== id) return task;
        const isCompleted = !task.isCompleted;
        completed = isCompleted;
        xpDiff += isCompleted ? 10 : -10;
        return { ...task, isCompleted };
      });
      if (completed) {
        audioTelemetry.check();
      } else {
        audioTelemetry.click();
      }
      return { ...prev, customTasks, xp: Math.max(0, prev.xp + xpDiff) };
    });
  };
  const deleteCustomTask = (id: string) => {
    updateState(prev => {
      const customTasks = prev.customTasks.filter(task => task.id !== id);
      return { ...prev, customTasks };
    });
  };

  const addWeeklyGoal = (text: string) => {
    updateState(prev => {
      const newGoal: WeeklyGoal = {
        id: generateId(),
        text,
        isCompleted: false
      };
      return { ...prev, weeklyGoals: [...(prev.weeklyGoals || []), newGoal] };
    });
  };

  const toggleWeeklyGoal = (id: string) => {
    updateState(prev => {
      const weeklyGoals = (prev.weeklyGoals || []).map(goal =>
        goal.id === id ? { ...goal, isCompleted: !goal.isCompleted } : goal
      );
      return { ...prev, weeklyGoals };
    });
  };

  const deleteWeeklyGoal = (id: string) => {
    updateState(prev => {
      const weeklyGoals = (prev.weeklyGoals || []).filter(goal => goal.id !== id);
      return { ...prev, weeklyGoals };
    });
  };

  const addProject = (projectData: Omit<Project, "id">) => {
    updateState(prev => {
      const newProject: Project = {
        id: generateId(),
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

  const openChatWithPrompt = (prompt: string) => {
    addChatMessage("user", prompt);
  };

  const addChatMessage = (role: "user" | "assistant", content: string) => {
    updateState(prev => {
      const newMsg: ChatMessage = {
        id: generateId(),
        role,
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      const activeId = prev.currentSessionId || "default-session";
      const chatSessions: Record<string, ChatSession> = prev.chatSessions || {};
      const activeSession = chatSessions[activeId] || {
        id: activeId, title: "Placement Chat Room", messages: [],
        createdAt: getTodayString(), isPinned: false
      };
      const title = activeSession.messages.length === 0 && role === "user"
        ? (content.length > 30 ? content.slice(0, 30) + "..." : content)
        : activeSession.title;
      return {
        ...prev,
        chatSessions: { ...chatSessions, [activeId]: { ...activeSession, title, messages: [...activeSession.messages, newMsg] } }
      };
    });
  };

  const toggleSkill = (skillId: string) => {
    updateState(prev => {
      const isCompleted = (prev.completedSkills || []).includes(skillId);
      const newSkills = isCompleted 
        ? prev.completedSkills.filter(s => s !== skillId)
        : [...(prev.completedSkills || []), skillId];
      const xpDiff = isCompleted ? -100 : 100;
      return { 
        ...prev, 
        completedSkills: newSkills,
        xp: Math.max(0, (prev.xp || 0) + xpDiff)
      };
    });
  };

  const clearChatHistory = () => {
    updateState(prev => {
      const activeId = prev.currentSessionId || "default-session";
      const chatSessions = prev.chatSessions || {};
      const s = chatSessions[activeId];
      if (!s) return prev;
      return { ...prev, chatSessions: { ...chatSessions, [activeId]: { ...s, messages: [] } } };
    });
  };

  const createNewSession = (title?: string) => {
    updateState(prev => {
      const newSession: ChatSession = {
        id: generateId(),
        title: title || "New Chat Session",
        messages: [],
        createdAt: getTodayString(),
        isPinned: false
      };
      return {
        ...prev,
        chatSessions: { ...(prev.chatSessions || {}), [newSession.id]: newSession },
        currentSessionId: newSession.id
      };
    });
  };

  const setActiveSession = (sessionId: string) => {
    updateState(prev => {
      return {
        ...prev,
        currentSessionId: sessionId
      };
    });
  };

  const deleteSession = (sessionId: string) => {
    updateState(prev => {
      const chatSessions: Record<string, ChatSession> = { ...(prev.chatSessions || {}) };
      delete chatSessions[sessionId];
      let currentSessionId = prev.currentSessionId;
      
      if (Object.keys(chatSessions).length === 0) {
        const defaultSession: ChatSession = {
          id: "default-session",
          title: "Placement Chat Room",
          messages: [],
          createdAt: getTodayString(),
          isPinned: false
        };
        chatSessions["default-session"] = defaultSession;
        currentSessionId = "default-session";
      } else if (currentSessionId === sessionId) {
        currentSessionId = Object.keys(chatSessions)[0];
      }
      
      return {
        ...prev,
        chatSessions,
        currentSessionId
      };
    });
  };

  const togglePinSession = (sessionId: string) => {
    updateState(prev => {
      const chatSessions = prev.chatSessions || {};
      const s = chatSessions[sessionId];
      if (!s) return prev;
      return { ...prev, chatSessions: { ...chatSessions, [sessionId]: { ...s, isPinned: !s.isPinned } } };
    });
  };

  const renameSession = (sessionId: string, title: string) => {
    updateState(prev => {
      const chatSessions = prev.chatSessions || {};
      const s = chatSessions[sessionId];
      if (!s) return prev;
      return { ...prev, chatSessions: { ...chatSessions, [sessionId]: { ...s, title } } };
    });
  };

  const updateSessionSystemPrompt = (sessionId: string, systemPrompt: string) => {
    updateState(prev => {
      const chatSessions = prev.chatSessions || {};
      const s = chatSessions[sessionId];
      if (!s) return prev;
      return { ...prev, chatSessions: { ...chatSessions, [sessionId]: { ...s, systemPrompt } } };
    });
  };

  const branchSession = (sessionId: string) => {
    updateState(prev => {
      const sessionToBranch = (prev.chatSessions || {})[sessionId];
      if (!sessionToBranch) return prev;
      
      const newSession: ChatSession = {
        ...sessionToBranch,
        id: generateId(),
        title: `${sessionToBranch.title} (Fork)`,
        createdAt: getTodayString()
      };

      return {
        ...prev,
        chatSessions: { ...(prev.chatSessions || {}), [newSession.id]: newSession },
        currentSessionId: newSession.id
      };
    });
  };

  const removeLastAssistantMessage = () => {
    updateState(prev => {
      const sessionId = prev.currentSessionId;
      if (!sessionId) return prev;
      
      const chatSessions = prev.chatSessions || {};
      const s = chatSessions[sessionId];
      if (!s || s.messages.length === 0) return prev;
      const lastMessage = s.messages[s.messages.length - 1];
      if (lastMessage.role === "assistant") {
        return { ...prev, chatSessions: { ...chatSessions, [sessionId]: { ...s, messages: s.messages.slice(0, -1) } } };
      }
      return prev;
    });
  };

  const addNote = (noteData: Omit<Note, "id" | "updatedAt">) => {
    updateState(prev => {
      const newNote: Note = {
        id: generateId(),
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
    if (updatedFields.soundEnabled !== undefined) {
      audioTelemetry.setMuted(!updatedFields.soundEnabled);
    }
    if (updatedFields.soundVolume !== undefined) {
      audioTelemetry.setVolume(updatedFields.soundVolume);
    }
    updateState(prev => {
      return {
        ...prev,
        settings: { ...prev.settings, ...updatedFields }
      };
    });
  };

  const toggleTheme = () => {
    updateState(prev => {
      const currentTheme = prev.settings.theme || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      return {
        ...prev,
        settings: { ...prev.settings, theme: newTheme }
      };
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
      const completedSegments = ["week-1", "week-2", "week-3", "week-4"];

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

      // BUG-C5 fix: also update the primary userPlan's completedSegments so plan page shows correct progress
      const updatedUserPlans = (prev.userPlans || []).map((up: any) => {
        if (up.planId === (prev.primaryPlanId || "16-week-mastery")) {
          return { ...up, completedSegments };
        }
        return up;
      });

      return {
        ...prev,
        userPlans: updatedUserPlans,
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

  const followPlan = (planId: string) => {
    updateState(prev => {
      const userPlans = prev.userPlans || [];
      if (userPlans.some(up => up.planId === planId)) return prev;

      const newPlan: UserPlan = {
        planId,
        active: true,
        primary: false,
        startedAt: new Date().toISOString(),
        paused: false,
        completedSegments: [] as string[],
        customProgress: {}
      };

      return {
        ...prev,
        userPlans: [...userPlans, newPlan]
      };
    });
  };

  const pausePlan = (planId: string) => {
    updateState(prev => {
      const userPlans = (prev.userPlans || []).map(up => {
        if (up.planId !== planId) return up;
        return { ...up, paused: !up.paused };
      });
      return { ...prev, userPlans };
    });
  };

  const unfollowPlan = (planId: string) => {
    updateState(prev => {
      if (planId === "16-week-mastery") return prev;

      const userPlans = (prev.userPlans || []).filter(up => up.planId !== planId);
      
      let primaryPlanId = prev.primaryPlanId;
      if (primaryPlanId === planId) {
        primaryPlanId = "16-week-mastery";
      }

      const updatedUserPlans = userPlans.map(up => ({
        ...up,
        primary: up.planId === primaryPlanId
      }));

      return {
        ...prev,
        userPlans: updatedUserPlans,
        primaryPlanId
      };
    });
  };

  const setPrimaryPlan = (planId: string) => {
    updateState(prev => {
      const userPlans = prev.userPlans || [];
      
      let updatedUserPlans = [...userPlans];
      if (!updatedUserPlans.some(up => up.planId === planId)) {
        updatedUserPlans.push({
          planId,
          active: true,
          primary: false,
          startedAt: new Date().toISOString(),
          paused: false,
          completedSegments: [] as string[],
          customProgress: {}
        });
      }

      updatedUserPlans = updatedUserPlans.map(up => ({
        ...up,
        primary: up.planId === planId
      }));

      return {
        ...prev,
        userPlans: updatedUserPlans,
        primaryPlanId: planId
      };
    });
  };

  const togglePlanWeek = (planId: string, segmentId: string) => {
    updateState(prev => {
      const targetUserPlan = (prev.userPlans || []).find(up => up.planId === planId);
      const isCompleted = targetUserPlan?.completedSegments.includes(segmentId) ?? false;

      const userPlans = (prev.userPlans || []).map(up => {
        if (up.planId !== planId) return up;
        const completedSegments = isCompleted
          ? up.completedSegments.filter((w: string) => w !== segmentId)
          : [...up.completedSegments, segmentId];
        return { ...up, completedSegments };
      });

      if (!isCompleted) {
        // Week/Segment completed confetti!
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

      return {
        ...prev,
        userPlans
      };
    });
  };

  const togglePlanTask = (planId: string, taskKey: string) => {
    updateState(prev => {
      const userPlans = prev.userPlans || [];
      const updatedUserPlans = userPlans.map(up => {
        if (up.planId !== planId) return up;
        const customProgress = { ...up.customProgress };
        customProgress[taskKey] = !customProgress[taskKey];
        return { ...up, customProgress };
      });
      return {
        ...prev,
        userPlans: updatedUserPlans
      };
    });
  };

  const startInterviewSession = (
    topic: string,
    difficulty: "Easy" | "Medium" | "Hard",
    personality: "Helpful Mentor" | "Quiet Observer" | "Strict Interviewer",
    problemDescription: string,
    resumeText?: string,
    resumeFileName?: string
  ) => {
    updateState(prev => {
      // Arch Debt #16 fix: fall back to user-profile resume when no upload in this session.
      // This means users only need to upload once; subsequent interviews pick it up automatically.
      const effectiveResumeText = resumeText !== undefined ? resumeText : (prev.user?.resumeText || "");
      const effectiveResumeFileName = resumeFileName !== undefined ? resumeFileName : (prev.user?.resumeFileName || "");

      // If a new resume was uploaded this session, persist it to the user profile.
      const updatedUser = prev.user
        ? { ...prev.user, resumeText: effectiveResumeText, resumeFileName: effectiveResumeFileName }
        : prev.user;

      return {
        ...prev,
        user: updatedUser,
        activeInterviewSession: {
          topic,
          difficulty,
          interviewerPersonality: personality,
          timeLeft: 45 * 60,
          code: "",
          language: "cpp",
          chatHistory: [
            {
              id: `msg-${Date.now()}`,
              role: "assistant",
              content: effectiveResumeText
                ? `Hello! Welcome to your technical interview. I will be your interviewer today, acting as a ${personality}.\n\nI have received and reviewed your resume (${effectiveResumeFileName || "uploaded file"}). Let's start the session. To begin, could you please introduce yourself, highlight some of your key projects, and tell me about your background?`
                : `Hello! Welcome to your technical interview. I will be your interviewer today, acting as a ${personality}.\n\nThis will be a structured technical interview consisting of several phases:\n1. Introduction & Resume highlights\n2. Data Structures & Algorithms (Easy to Hard progression)\n3. Core Computer Science concepts\n4. Brain Teaser / Puzzle\n5. Situational & HR questions\n\nTo begin, could you please introduce yourself, highlight your key projects, and tell me about your background?`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ],
          currentPhase: "intro",
          lastSavedTime: Date.now(),
          goal: problemDescription,
          resumeText: effectiveResumeText,
          resumeFileName: effectiveResumeFileName
        }
      };
    });
  };

  const updateInterviewSession = (
    timeLeft: number,
    code: string,
    language: string,
    chatHistory: ChatMessage[],
    currentPhase: "intro" | "dsa" | "core" | "puzzles" | "hr" | "evaluating",
    subPhaseStatus?: string
  ) => {
    updateState(prev => {
      if (!prev.activeInterviewSession) return prev;
      return {
        ...prev,
        activeInterviewSession: {
          ...prev.activeInterviewSession,
          timeLeft,
          code,
          language,
          chatHistory,
          currentPhase,
          subPhaseStatus: subPhaseStatus !== undefined ? subPhaseStatus : prev.activeInterviewSession.subPhaseStatus,
          lastSavedTime: Date.now()
        }
      };
    });
  };

  const addInterviewChatMessage = (role: "user" | "assistant", content: string) => {
    updateState(prev => {
      if (!prev.activeInterviewSession) return prev;
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role,
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      return {
        ...prev,
        activeInterviewSession: {
          ...prev.activeInterviewSession,
          chatHistory: [...prev.activeInterviewSession.chatHistory, newMessage],
          lastSavedTime: Date.now()
        }
      };
    });
  };

  const endInterviewSession = (completed: boolean, report?: MockInterviewReport) => {
    updateState(prev => {
      const mockInterviews = prev.mockInterviews || [];
      const updatedReports = report ? [...mockInterviews, report] : mockInterviews;
      
      let xpDiff = 0;
      if (completed && report) {
        xpDiff = 300;
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#8b5cf6", "#10b981", "#3b82f6"]
        });
      }
      
      return {
        ...prev,
        mockInterviews: updatedReports,
        activeInterviewSession: null,
        xp: Math.max(0, prev.xp + xpDiff)
      };
    });
  };

  const deleteMockInterviewReport = (id: string) => {
    updateState(prev => {
      const mockInterviews = prev.mockInterviews || [];
      return {
        ...prev,
        mockInterviews: mockInterviews.filter(r => r.id !== id)
      };
    });
  };

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

  const setSessionNvidiaKey = (key: string) => {
    updateState(prev => ({ ...prev, sessionNvidiaKey: key }));
  };

  const refreshDailyChallenge = () => {
    updateState(prev => {
      const today = getTodayStr();
      if (prev.dailyChallenge?.date === today && !prev.dailyChallenge?.isCompleted) return prev;
      return { ...prev, dailyChallenge: generateDailyChallenge(prev) };
    });
  };



  const updateFlashcardReview = (flashcardId: string, easeFactor: number, interval: number, nextReviewDate: string, repetition: number) => {
    updateState(prev => {
      const flashcards = prev.flashcards || [];
      const index = flashcards.findIndex(c => c.id === flashcardId);
      if (index === -1) return prev;
      const newFlashcards = [...flashcards];
      newFlashcards[index] = { ...newFlashcards[index], easeFactor, interval, nextReviewDate, repetition };
      return { ...prev, flashcards: newFlashcards };
    });
  };

  const enrollCompanyRoadmap = (roadmap: CompanyRoadmap) => {
    updateState(prev => {
      const activeRoadmaps = prev.activeRoadmaps || [];
      if (activeRoadmaps.some(r => r.id === roadmap.id)) return prev;
      return { ...prev, activeRoadmaps: [...activeRoadmaps, roadmap] };
    });
  };


  const saveAtsReport = (report: AtsReport) => {
    updateState(prev => {
      const currentReports = prev.atsReports || [];
      return {
        ...prev,
        atsReports: [report, ...currentReports]
      };
    });
  };

  const enrollInDevPlan = (enrolled: boolean, targetDate?: string, intensity?: "Casual" | "Normal" | "Intense") => {
    updateState(prev => ({
      ...prev,
      devPlanEnrolled: enrolled,
      devPlanTargetDate: targetDate || "",
      devPlanIntensity: intensity || "Normal"
    }));
  };

  const setDevPlanActiveSkillId = (skillId: string | null) => {
    updateState(prev => ({
      ...prev,
      devPlanActiveSkillId: skillId
    }));
  };

  const saveDevQuizAttempt = (attempt: import("./AppStateTypes").DevQuizAttempt) => {
    updateState(prev => ({
      ...prev,
      devQuizHistory: [...(prev.devQuizHistory || []), attempt]
    }));
  };

  const updateDevSkillNote = (skillId: string, note: string) => {
    updateState(prev => ({
      ...prev,
      devSkillNotes: { ...(prev.devSkillNotes || {}), [skillId]: note }
    }));
  };

  const markPracticeProblemSolved = (problemId: string, duration: number) => {
    updateState(prev => {
      const practiceProblemsSolved = {
        ...(prev.practiceProblemsSolved || {}),
        [problemId]: {
          timestamp: new Date().toISOString(),
          duration
        }
      };

      let dailyHabits = { ...prev.dailyHabits };
      let xpDiff = 50; // default 50 XP
      if (!prev.dailyHabits.solveDsa) {
        dailyHabits.solveDsa = true;
        xpDiff += 10; // extra 10 XP for habit completion
      }

      return {
        ...prev,
        practiceProblemsSolved,
        dailyHabits,
        xp: Math.max(0, prev.xp + xpDiff),
        lastActiveDate: getTodayString()
      };
    });
  };

  const markAptitudeTopicCompleted = (topicId: string) => {
    updateState(prev => {
      const aptitudeTopicProgress = { ...(prev.aptitudeTopicProgress || {}) };
      const current = aptitudeTopicProgress[topicId] || {
        topicId,
        completed: false,
        timeSpent: 0
      };

      const wasCompleted = current.completed;
      aptitudeTopicProgress[topicId] = {
        ...current,
        completed: true
      };

      return {
        ...prev,
        aptitudeTopicProgress,
        xp: prev.xp + (wasCompleted ? 0 : 50),
        lastActiveDate: getTodayString()
      };
    });
  };

  const submitAptitudeQuiz = (
    topicId: string,
    correctCount: number,
    totalCount: number,
    timeSpent: number,
    answers: Record<number, { selected: string; correct: boolean }>
  ) => {
    updateState(prev => {
      const attempt = {
        topicId,
        correctCount,
        totalCount,
        timeSpent,
        timestamp: new Date().toISOString(),
        answers
      };

      const aptitudeQuizHistory = [...(prev.aptitudeQuizHistory || []), attempt];

      const aptitudeTopicProgress = { ...(prev.aptitudeTopicProgress || {}) };
      const current = aptitudeTopicProgress[topicId] || {
        topicId,
        completed: false,
        timeSpent: 0
      };

      const newBestScore = Math.max(current.bestScore || 0, correctCount);
      const newTotalSolved = (current.totalQuestionsSolved || 0) + correctCount;
      const newTimeSpent = current.timeSpent + timeSpent;

      aptitudeTopicProgress[topicId] = {
        ...current,
        lastAttempted: new Date().toISOString(),
        bestScore: newBestScore,
        totalQuestionsSolved: newTotalSolved,
        timeSpent: newTimeSpent
      };

      const xpEarned = correctCount * 15;

      return {
        ...prev,
        aptitudeQuizHistory,
        aptitudeTopicProgress,
        xp: prev.xp + xpEarned,
        lastActiveDate: getTodayString()
      };
    });
  };

  const updateRoadmapProgress = (roadmapId: string, milestoneId: string, completed: boolean) => {
    updateState(prev => {
      const activeRoadmaps = prev.activeRoadmaps || [];
      const updated = activeRoadmaps.map(r => {
        if (r.id !== roadmapId) return r;
        const newPhases = r.phases.map(p => ({
          ...p,
          milestones: p.milestones.map(m => m.id === milestoneId ? { ...m, isCompleted: completed } : m)
        }));
        
        let total = 0;
        let completedCount = 0;
        newPhases.forEach(p => p.milestones.forEach(m => {
          total++;
          if (m.isCompleted) completedCount++;
        }));
        const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;
        
        return { ...r, phases: newPhases, progress };
      });
      return { ...prev, activeRoadmaps: updated };
    });
  };


  const addCustomDeck = (deck: FlashcardDeck) => {
    updateState(prev => ({ ...prev, customDecks: [...(prev.customDecks || []), deck] }));
  };

  const deleteCustomDeck = (deckId: string) => {
    updateState(prev => ({
      ...prev,
      customDecks: (prev.customDecks || []).filter(d => d.id !== deckId),
      flashcards: (prev.flashcards || []).filter(c => c.deckId !== deckId)
    }));
  };

  const addFlashcards = (_deckId: string, cards: Flashcard[]) => {
    updateState(prev => ({
      ...prev,
      flashcards: [...(prev.flashcards || []), ...cards]
    }));
  };

  const deleteFlashcard = (cardId: string) => {
    updateState(prev => ({
      ...prev,
      flashcards: (prev.flashcards || []).filter(c => c.id !== cardId)
    }));
  };

  const updateFlashcard = (cardId: string, updates: Partial<Flashcard>) => {
    updateState(prev => ({
      ...prev,
      flashcards: (prev.flashcards || []).map(c => c.id === cardId ? { ...c, ...updates } : c)
    }));
  };

  const saveFlashcardSession = (session: FlashcardSession) => {
    updateState(prev => ({
      ...prev,
      flashcardHistory: [session, ...(prev.flashcardHistory || [])]
    }));
  };

  const importFlashcards = (deck: FlashcardDeck, cards: Flashcard[]) => {
    updateState(prev => {
      const existing = prev.flashcards || [];
      // Replace existing cards for this deck
      const filtered = existing.filter(c => c.deckId !== deck.id);
      return { ...prev, flashcards: [...filtered, ...cards] };
    });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        curriculum,
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
        incrementDsaSubmissions,
        updateDevSkill,
        addAiLog,
        toggleHabit,
        addCustomTask,
        toggleCustomTask,
        deleteCustomTask,
        addWeeklyGoal,
        toggleWeeklyGoal,
        deleteWeeklyGoal,
        addProject,
        updateProject,
        deleteProject,
        addChatMessage,
        openChatWithPrompt,
        clearChatHistory,
        toggleSkill,
        createNewSession,
        setActiveSession,
        deleteSession,
        togglePinSession,
        renameSession,
        updateSessionSystemPrompt,
        branchSession,
        removeLastAssistantMessage,
        addNote,
        updateNote,
        deleteNote,
        updateSettings,
        toggleTheme,
        resetAllData,
        seedMockData,
        followPlan,
        pausePlan,
        unfollowPlan,
        setPrimaryPlan,
        togglePlanWeek,
        togglePlanTask,
        confirmAction,
        startInterviewSession,
        updateInterviewSession,
        addInterviewChatMessage,
        endInterviewSession,
        deleteMockInterviewReport,
        completeDailyChallenge,
        refreshDailyChallenge,
        setSessionNvidiaKey,
        updateFlashcardReview,
        enrollCompanyRoadmap,
        updateRoadmapProgress,
        enrollInDevPlan,
        setDevPlanActiveSkillId,

        importFlashcards,
        addCustomDeck,
        deleteCustomDeck,
        addFlashcards,
        deleteFlashcard,
        updateFlashcard,
        saveFlashcardSession,

        saveAtsReport,
        saveDevQuizAttempt,
        updateDevSkillNote,
        markPracticeProblemSolved,
        markAptitudeTopicCompleted,
        submitAptitudeQuiz
      }}

    >
      {children}
      <AnimatePresence>
        {confirmState.isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-md bg-darkCard/95 border border-white/[0.08] shadow-2xl relative rounded-2xl overflow-hidden glass-panel"
            >
              {/* Glow border depending on severity */}
              <div 
                className={`h-1.5 w-full ${
                  confirmState.severity === "danger" 
                    ? "bg-rose-500" 
                    : confirmState.severity === "warning" 
                    ? "bg-amber-500" 
                    : "bg-accentPrimary"
                }`}
              />

              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div 
                    className={`p-3 rounded-full shrink-0 border ${
                      confirmState.severity === "danger" 
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                        : confirmState.severity === "warning" 
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                        : "bg-accentPrimary/10 text-accentPrimary border-accentPrimary/20"
                    }`}
                  >
                    {confirmState.severity === "danger" ? (
                      <AlertCircle className="w-6 h-6" />
                    ) : confirmState.severity === "warning" ? (
                      <AlertTriangle className="w-6 h-6" />
                    ) : (
                      <Info className="w-6 h-6" />
                    )}
                  </div>
                  
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white tracking-tight leading-none">
                      {confirmState.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed pt-2">
                      {confirmState.message}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all cursor-pointer"
                  >
                    {confirmState.cancelText || "Cancel"}
                  </button>
                  <button
                    onClick={() => {
                      if (onConfirmRef.current) onConfirmRef.current();
                      setConfirmState(prev => ({ ...prev, isOpen: false }));
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
                      confirmState.severity === "danger"
                        ? "bg-rose-600 hover:bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                        : confirmState.severity === "warning"
                        ? "bg-amber-600 hover:bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                        : "bg-accentPrimary hover:bg-accentPrimary/90 shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]"
                    }`}
                  >
                    {confirmState.confirmText || "Confirm"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppContext.Provider>
  );
};

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [curriculumLoaded, setCurriculumLoaded] = useState(false);
  const [curriculumData, setCurriculumData] = useState<any>(null);

  useEffect(() => {
    import("../data/curriculum").then((mod) => {
      setCurriculumData(mod);
      setCurriculumLoaded(true);
    });
  }, []);

  if (!curriculumLoaded) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-accentPrimary" />
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Loading Curriculum Data...</span>
      </div>
    );
  }

  return <AppStateProviderInner curriculum={curriculumData}>{children}</AppStateProviderInner>;
};

export function useAppState<T = AppContextType>(selector?: (state: AppContextType) => T): T {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  if (selector) {
    return selector(context);
  }
  return context as unknown as T;
}


