import React from "react";
import { useAppState } from "../context/AppStateContext";
import { SpotlightCard } from "../components/Common";
import { Trophy, CheckCircle2, Lock } from "lucide-react";

export const BadgesView: React.FC = () => {
  const state = useAppState(s => s.state);
  const curriculum = useAppState(s => s.curriculum);

  const DEFAULT_BADGES = curriculum.DEFAULT_BADGES;

  const isBadgeUnlocked = (badgeId: string) => {
    return state.unlockedBadges.includes(badgeId);
  };

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
    if (p.isCompleted && p.revisionInterval && p.revisionInterval > 3) revisionCount++;
  }));
  
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
    return "In Progress";
  };

  const unlockedCount = DEFAULT_BADGES.filter(b => isBadgeUnlocked(b.id)).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <SpotlightCard className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accentPrimary font-bold bg-accentPrimary/10 border border-accentPrimary/25 px-2.5 py-0.5 rounded-md">
                Gamification Vault
              </span>
              <span className="text-[10px] font-mono text-slate-500">• Placement Credentials</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Achievements & Badges</h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Earn milestone credentials by proving consistency across DSA algorithms, fullstack architectures, and zero-AI sessions.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] p-3.5 rounded-2xl">
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Unlocked</span>
              <span className="text-xl font-bold font-mono text-white">{unlockedCount} / {DEFAULT_BADGES.length}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Trophy className="w-6 h-6" />
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEFAULT_BADGES.map(badge => {
          const unlocked = isBadgeUnlocked(badge.id);

          return (
            <SpotlightCard
              key={badge.id}
              className={`p-6 flex flex-col justify-between items-start gap-4 transition-all relative overflow-hidden ${
                unlocked
                  ? "border-accentPrimary/30 bg-accentPrimary/[0.03] shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]"
                  : "border-white/[0.04] bg-white/[0.01] opacity-60 hover:opacity-100"
              }`}
            >
              {/* Top Row: Icon + Lock/Unlock badge */}
              <div className="flex justify-between items-start w-full">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl select-none transition-transform group-hover:scale-110 ${
                    unlocked
                      ? "bg-accentPrimary/15 border border-accentPrimary/30 shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)]"
                      : "bg-white/[0.02] border border-white/[0.06] grayscale opacity-50"
                  }`}
                >
                  {badge.icon}
                </div>
                
                <span className={`text-[9px] font-mono border px-2.5 py-1 rounded-lg uppercase tracking-wider font-bold flex items-center gap-1.5 ${
                  unlocked
                    ? "neon-pill-emerald"
                    : "bg-white/[0.03] text-slate-500 border-white/[0.06]"
                }`}>
                  {unlocked ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Unlocked</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-slate-500" />
                      <span>Locked</span>
                    </>
                  )}
                </span>
              </div>

              {/* Text Block */}
              <div className="space-y-1.5 z-10">
                <h3 className={`text-sm font-bold ${unlocked ? "text-white" : "text-slate-400"}`}>
                  {badge.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Requirement description */}
              <div className="w-full border-t border-white/[0.05] pt-3.5 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500 uppercase">Requirement</span>
                <span className={unlocked ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                  {unlocked ? "Completed (+100 XP)" : `Progress: ${getProgressString(badge)}`}
                </span>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  );
};
