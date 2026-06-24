import React from "react";
import { useAppState } from "../context/AppStateContext";

import { GlassCard } from "../components/Common";

export const BadgesView: React.FC = () => {
  const { state, curriculum } = useAppState();
  const DEFAULT_BADGES = curriculum.DEFAULT_BADGES;

  const isBadgeUnlocked = (badgeId: string) => {
    return state.unlockedBadges.includes(badgeId);
  };

  // Pre-calculate metrics for progress tracking
  const dsaCount = state.dsaTopics.flatMap(t => t.problems).filter(p => p.isCompleted).length;
  const devCount = state.devCategories.flatMap(c => c.skills).filter(t => t.learned).length;
  const logCount = state.aiLogs.length;
  const avgAiPercent = logCount > 0 ? Math.round(state.aiLogs.reduce((acc: number, l: any) => acc + l.aiPercentage, 0) / logCount) : 0;
  
  let consecutiveZero = 0;
  let maxConsecutiveZero = 0;
  for (const log of state.aiLogs) {
    if (log.aiPercentage === 0) {
      consecutiveZero++;
      maxConsecutiveZero = Math.max(maxConsecutiveZero, consecutiveZero);
    } else {
      consecutiveZero = 0;
    }
  }
  const zeroCopyLogs = maxConsecutiveZero;
  const streak = state.streak;
  
  let revisionCount = 0;
  state.dsaTopics.forEach(t => t.problems.forEach(p => {
    if (p.isCompleted && p.revisionInterval && p.revisionInterval > 3) revisionCount++; // Assuming > Level 1 is a successful revision
  }));
  
  // A rough mock for readinessScore since we don't calculate it globally here yet
  const readinessScore = Math.min(100, Math.round(((dsaCount/40) * 50) + ((devCount/12) * 50)));

  const getProgressString = (badge: any) => {
    if (badge.requirement.includes("dsaCount >= 10")) return `${dsaCount} / 10`;
    if (badge.requirement.includes("dsaCount >= 40")) return `${dsaCount} / 40`;
    if (badge.requirement.includes("devCount >= 5")) return `${devCount} / 5`;
    if (badge.requirement.includes("devCount >= 12")) return `${devCount} / 12`;
    if (badge.requirement.includes("avgAiPercent <= 20")) return `Avg AI: ${avgAiPercent}% (Logs: ${logCount}/3)`;
    if (badge.requirement.includes("zeroCopyLogs >= 5")) return `${zeroCopyLogs} / 5 consecutive`;
    if (badge.requirement.includes("streak >= 7")) return `${streak} / 7 days`;
    if (badge.requirement.includes("revisionCount >= 10")) return `${revisionCount} / 10 topics`;
    if (badge.requirement.includes("readinessScore >= 85")) return `${readinessScore} / 85 score`;
    return "Locked";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-500">Gamification Cabin</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">Achievements & Badges</h1>
          <p className="text-sm text-slate-400 mt-1">
            Stay motivated. Complete objectives in DSA, Full Stack, habit consistency, and AI avoidance to unlock credentials.
          </p>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEFAULT_BADGES.map(badge => {
          const unlocked = isBadgeUnlocked(badge.id);

          return (
            <GlassCard
              key={badge.id}
              className={`p-6 border flex flex-col justify-between items-start gap-4 transition-all relative overflow-hidden ${
                unlocked
                  ? "border-accentPrimary/20 bg-accentPrimary/[0.02] shadow-lg shadow-accentPrimary/[0.02]"
                  : "border-white/[0.02] bg-white/[0.002] opacity-50"
              }`}
            >
              {/* Unlock Indicator Glow */}
              {unlocked && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-accentPrimary/10 blur-xl rounded-full -mr-4 -mt-4" />
              )}

              {/* Top Row: Icon + Lock/Unlock badge */}
              <div className="flex justify-between items-start w-full">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl select-none ${
                    unlocked
                      ? "bg-accentPrimary/10 border border-accentPrimary/20 shadow-inner"
                      : "bg-white/[0.02] border border-white/[0.04] grayscale"
                  }`}
                >
                  {badge.icon}
                </div>
                
                <span className={`text-[9px] font-mono border px-2 py-0.5 rounded uppercase tracking-wider ${
                  unlocked
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-glow"
                    : "bg-slate-500/10 text-slate-500 border-slate-500/10"
                }`}>
                  {unlocked ? "Unlocked" : "Locked"}
                </span>
              </div>

              {/* Text Block */}
              <div className="space-y-1.5 z-10">
                <h3 className={`text-sm font-bold ${unlocked ? "text-white" : "text-slate-500"}`}>
                  {badge.name}
                </h3>
                <p className="text-xs text-slate-400 leading-normal">
                  {badge.description}
                </p>
              </div>

              {/* Requirement description */}
              <div className="w-full border-t border-white/[0.04] pt-3 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Objective</span>
                <span className={unlocked ? "text-slate-400" : "text-amber-500/80 font-bold tracking-tight"}>
                  {unlocked ? "Unlocked" : `Progress: ${getProgressString(badge)}`}
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
