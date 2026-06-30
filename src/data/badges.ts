import type { Badge } from "./curriculum";

export const DEFAULT_BADGES: Badge[] = [
  { id: "badge-1", name: "Code Warrior", description: "Solve 10 DSA practice problems.", icon: "⚔️", category: "DSA", requirement: "dsaCount >= 10" },
  { id: "badge-2", name: "Algorithm Sage", description: "Solve 40 DSA practice problems.", icon: "🧙‍♂️", category: "DSA", requirement: "dsaCount >= 40" },
  { id: "badge-3", name: "Stack Builder", description: "Master 5 Full Stack core topics.", icon: "🧱", category: "DEV", requirement: "devCount >= 5" },
  { id: "badge-4", name: "System Architect", description: "Master 12 Full Stack core topics.", icon: "🏛️", category: "DEV", requirement: "devCount >= 12" },
  { id: "badge-5", name: "AI Ascetic", description: "Maintain a daily average AI Dependency below 20% for 3 logs.", icon: "🛡️", category: "AI", requirement: "avgAiPercent <= 20 && logCount >= 3" },
  { id: "badge-6", name: "Solo Pilot", description: "Log 5 consecutive projects/tasks built with 0% direct copy.", icon: "✈️", category: "AI", requirement: "zeroCopyLogs >= 5" },
  { id: "badge-7", name: "Unstoppable", description: "Achieve a learning streak of 7 days.", icon: "🔥", category: "STREAK", requirement: "streak >= 7" },
  { id: "badge-8", name: "Spaced Out", description: "Complete 10 revision topics successfully.", icon: "📅", category: "REVISION", requirement: "revisionCount >= 10" },
  { id: "badge-9", name: "Interview Ready", description: "Achieve a Placement Readiness Score of 85+.", icon: "🎯", category: "STREAK", requirement: "readinessScore >= 85" }
];
