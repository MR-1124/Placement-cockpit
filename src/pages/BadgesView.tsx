import React from "react";
import { useAppState } from "../context/AppStateContext";
import { DEFAULT_BADGES } from "../data/curriculum";
import { GlassCard } from "../components/Common";

export const BadgesView: React.FC = () => {
  const { state } = useAppState();

  const isBadgeUnlocked = (badgeId: string) => {
    return state.unlockedBadges.includes(badgeId);
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
                <span className={unlocked ? "text-slate-400" : "text-slate-600"}>
                  {badge.requirement.includes("dsaCount")
                    ? "Solve DSA Problems"
                    : badge.requirement.includes("devCount")
                    ? "Master dev skills"
                    : badge.requirement.includes("avgAiPercent")
                    ? "Keep low AI reliance"
                    : badge.requirement.includes("streak")
                    ? "Daily Prep streak"
                    : badge.requirement.includes("revision")
                    ? "Spaced Reviews"
                    : "Readiness Index"}
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
