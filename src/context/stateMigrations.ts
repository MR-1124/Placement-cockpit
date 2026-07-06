import type { AppState, SerializedProgress } from "./AppStateTypes";
import type { DsaTopic, DevCategory } from "../data/curriculum";

export const SCHEMA_VERSION = 1;

const getTodayString = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

export const serializeState = (state: AppState): SerializedProgress => {
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
        prob.spaceComplexity ||
        (prob as any).submissions
      ) {
        dsaProblems[prob.id] = {
          ...(prob.isCompleted && { isCompleted: true }),
          ...(prob.isWeak && { isWeak: true }),
          ...(prob.notes && { notes: prob.notes }),
          ...(prob.lastSolved && { lastSolved: prob.lastSolved }),
          ...(prob.revisionInterval !== undefined && { revisionInterval: prob.revisionInterval }),
          ...(prob.nextRevisionDate && { nextRevisionDate: prob.nextRevisionDate }),
          ...(prob.timeComplexity && { timeComplexity: prob.timeComplexity }),
          ...(prob.spaceComplexity && { spaceComplexity: prob.spaceComplexity }),
          ...((prob as any).submissions && { submissions: (prob as any).submissions })
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
    version: state.version,
    user: state.user || undefined,
    dsaProblems,
    dsaTopicMastery,
    devSkills,
    projects: state.projects || [],
    completedSkills: state.completedSkills || [],
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
    chatSessions: state.chatSessions || {},
    currentSessionId: state.currentSessionId || "default-session",
    userPlans: state.userPlans || [],
    primaryPlanId: state.primaryPlanId || "16-week-mastery",
    mockInterviews: state.mockInterviews || [],
    activeInterviewSession: state.activeInterviewSession || null,
    profile: state.user ? {
      name: state.user.name,
      email: state.user.email,
      avatar: state.user.avatar,
      targetCompanies: state.user.targetCompanies || [],
      linkedinUrl: state.user.linkedinUrl || "",
      githubUrl: state.user.githubUrl || "",
      resumeLink: state.user.resumeLink || "",
      cohort: state.user.cohort || "",
      savedIntro: state.user.savedIntro || "",
      resumeText: state.user.resumeText || "",
      resumeFileName: state.user.resumeFileName || ""
    } : undefined,
    flashcards: state.flashcards || [],
    customDecks: state.customDecks || [],
    flashcardHistory: state.flashcardHistory || [],
    activeRoadmaps: state.activeRoadmaps || [],
    atsReports: state.atsReports || [],
    devPlanEnrolled: state.devPlanEnrolled || false,
    devPlanTargetDate: state.devPlanTargetDate || "",
    devPlanActiveSkillId: state.devPlanActiveSkillId || null,
    devQuizHistory: state.devQuizHistory || [],
    devSkillNotes: state.devSkillNotes || {}
  };
};

export const deserializeState = (serialized: Partial<SerializedProgress>, curriculum: any): AppState => {
  const dsaTopics = curriculum.DEFAULT_DSA_TOPICS.map((defaultTopic: DsaTopic) => {
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
        spaceComplexity: savedProb.spaceComplexity ?? defaultProb.spaceComplexity,
        submissions: savedProb.submissions ?? 0
      };
    });
    return {
      ...defaultTopic,
      mastery,
      problems
    };
  });

  const devCategories = curriculum.DEFAULT_DEV_CATEGORIES.map((defaultCat: DevCategory) => {
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
    isLoadingUser: false,
    version: serialized.version || SCHEMA_VERSION,
    user: serialized.user || null,
    dsaTopics,
    devCategories,
    projects: serialized.projects || [],
    completedSkills: serialized.completedSkills || [],
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
      reminderFrequency: serialized.settings?.reminderFrequency ?? "weekly",
      showSections: serialized.settings?.showSections ?? {
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
      nvidiaApiKey: serialized.settings?.nvidiaApiKey ?? "",
      nvidiaModelName: serialized.settings?.nvidiaModelName ?? "meta/llama-3.1-70b-instruct",
      nvidiaInterviewerModelName: serialized.settings?.nvidiaInterviewerModelName
    },
    streak: serialized.streak || 0,
    lastActiveDate: serialized.lastActiveDate || getTodayString(),
    unlockedBadges: serialized.unlockedBadges || [],
    xp: serialized.xp || 0,
    chatSessions: serialized.chatSessions || {
      "default-session": {
        id: "default-session",
        title: "Placement Chat Room",
        messages: [],
        createdAt: getTodayString(),
        isPinned: false
      }
    },
    currentSessionId: serialized.currentSessionId || "default-session",
    userPlans: (serialized.userPlans || []).map((up: any) => ({
      ...up,
      completedSegments: up.completedSegments !== undefined ? up.completedSegments : (up.completedWeeks ? up.completedWeeks.map((w: any) => String(w)) : [])
    })),
    primaryPlanId: serialized.primaryPlanId || "16-week-mastery",
    mockInterviews: serialized.mockInterviews || [],
    activeInterviewSession: serialized.activeInterviewSession || null,
    flashcards: serialized.flashcards || [],
    customDecks: serialized.customDecks || [],
    flashcardHistory: serialized.flashcardHistory || [],
    activeRoadmaps: serialized.activeRoadmaps || [],
    atsReports: serialized.atsReports || [],
    devPlanEnrolled: serialized.devPlanEnrolled || false,
    devPlanTargetDate: serialized.devPlanTargetDate || "",
    devPlanActiveSkillId: serialized.devPlanActiveSkillId || null,
    devQuizHistory: serialized.devQuizHistory || [],
    devSkillNotes: serialized.devSkillNotes || {}
  };
};

export const calculateReadinessScore = (
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

export const getLevelInfo = (totalXp: number) => {
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
