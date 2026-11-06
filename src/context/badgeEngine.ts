import confetti from "canvas-confetti";
import type { AppState } from "./AppStateTypes";
import type { Badge } from "../data/curriculum";
import { calculateReadinessScore } from "./stateMigrations";

export const checkAndUnlockBadges = (updatedState: AppState, curriculum: any, prevState?: AppState): AppState => {
  // Short-circuit: if all possible badges are already unlocked, skip checks completely
  if (updatedState.unlockedBadges && updatedState.unlockedBadges.length >= 10) {
    return updatedState;
  }

  // Short-circuit: if previous state exists, compare references to see if badge-relevant data changed
  if (prevState) {
    const dsaChanged = updatedState.dsaTopics !== prevState.dsaTopics;
    const devChanged = updatedState.devCategories !== prevState.devCategories;
    const logsChanged = updatedState.aiLogs !== prevState.aiLogs;
    const streakChanged = updatedState.streak !== prevState.streak;
    const projectsChanged = updatedState.projects !== prevState.projects;

    if (!dsaChanged && !devChanged && !logsChanged && !streakChanged && !projectsChanged) {
      return updatedState;
    }
  }

  const freshlyUnlocked: string[] = [];

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

  const hasFullStackProject = updatedState.projects.some(p => p.completion === 100);

  curriculum.DEFAULT_BADGES.forEach((badge: Badge) => {
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

  if (hasFullStackProject && dsaSolvedCount >= 10 && readinessScore >= 60 && !updatedState.unlockedBadges.includes("pioneer")) {
    freshlyUnlocked.push("pioneer");
  }

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
