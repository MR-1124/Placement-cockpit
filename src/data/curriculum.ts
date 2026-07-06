export type PlanLayoutType = 'timeline' | 'grid' | 'kanban' | 'compact-list';
export type SegmentType = 'week' | 'day' | 'phase' | 'topic' | 'milestone';

export interface DsaProblem {
  id: string;
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  url: string;
  isCompleted: boolean;
  isWeak: boolean;
  notes: string;
  level: "Beginner" | "Intermediate" | "Master";
  lastSolved?: string;
  revisionInterval?: number; // days
  nextRevisionDate?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  source?: string;
  tags?: string[];
  pattern?: string;
  companies?: string[];
  frequency?: "High" | "Medium" | "Low";
  starred?: boolean;
  submissions?: number;
  revisionCount?: number;
}

export interface DsaTopic {
  id: string;
  name: string;
  description: string;
  problems: DsaProblem[];
  mastery: "Beginner" | "Intermediate" | "Master";
}

export interface DevSkill {
  id: string;
  name: string;
  description: string;
  learned: boolean;
  practiced: boolean;
  built: boolean;
  deployed: boolean;
  revised: boolean;
  prerequisites?: string[];
}

export interface DevCategory {
  id: string;
  name: "Frontend" | "Backend" | "Database" | "Systems & Deployment";
  skills: DevSkill[];
}



export interface PlanModule {
  type: "dsa" | "dev" | "core" | "system_design" | "project" | "mock" | "reading" | "aptitude";
  title: string;
  description?: string;
  targetIds?: string[]; // IDs of the topics/problems/skills to complete
  customContent?: string; // Markdown or text for ad-hoc modules
}

export interface PlanSegment {
  id: string;
  title: string; // e.g., "Week 1", "Day 1", "Phase 1"
  phase: string;
  focus: string;
  goals: string[];
  estimatedTime: string;
  modules: PlanModule[]; // Dynamic array instead of hardcoded dsaTopics/devSkills
}

export interface Plan {
  id: string;
  title: string;
  duration: number;
  durationType: "Days" | "Weeks" | "Months" | "Phases";
  description: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Extreme";
  estimatedHoursPerDay: string;
  tags: string[];
  layoutType?: PlanLayoutType;
  segmentType?: SegmentType;
  segments: PlanSegment[];
  category: "Mastery" | "Placement" | "Sprint" | "Subject-Specific";
  recommendedFor: string[];
}

export interface UserPlan {
  planId: string;
  active: boolean;
  primary: boolean;
  startedAt: string;
  paused: boolean;
  completedSegments: string[]; // segment IDs
  customProgress: Record<string, any>;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "DSA" | "DEV" | "AI" | "STREAK" | "REVISION";
  requirement: string;
}


import { DEFAULT_DSA_TOPICS } from "./dsaTopics";
import { DEFAULT_DEV_CATEGORIES } from "./devCategories";
import { DEFAULT_BADGES } from "./badges";

export { DEFAULT_DSA_TOPICS, DEFAULT_DEV_CATEGORIES, DEFAULT_BADGES };


import planMastery from './plans/16-week-mastery.json';
import planReadiness from './plans/2-month-readiness.json';
import planSprint from './plans/1-month-sprint.json';
import plan100Days from './plans/100-days-of-code.json';
import plan3Month from './plans/3-month-crash-course.json';

export const ALL_PLANS: Plan[] = [
  planMastery as Plan,
  planReadiness as Plan,
  planSprint as Plan,
  plan100Days as Plan,
  plan3Month as Plan
];
