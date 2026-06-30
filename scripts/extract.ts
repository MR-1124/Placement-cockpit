import fs from 'fs';
import path from 'path';
import { ALL_PLANS } from '../src/data/curriculum';

const plansDir = path.resolve('./src/data/plans');
if (!fs.existsSync(plansDir)) {
    fs.mkdirSync(plansDir, { recursive: true });
}

function convertWeekPlanToSegment(week: any, idx: number) {
    const modules: any[] = [];
    
    if (week.dsaTopics && week.dsaTopics.length > 0) {
        modules.push({
            type: "dsa",
            title: "Data Structures & Algorithms",
            targetIds: week.dsaTopics,
            customContent: week.dsaProblems ? "Key Problems: " + week.dsaProblems.join(", ") : undefined
        });
    }
    
    if (week.devSkills && week.devSkills.length > 0) {
        modules.push({
            type: "dev",
            title: "Development Skills",
            targetIds: week.devSkills
        });
    }
    
    if (week.projectMilestone && week.projectMilestone !== "None") {
        modules.push({
            type: "project",
            title: "Project Milestone",
            description: week.projectMilestone
        });
    }
    
    if (week.revisionFocus && week.revisionFocus !== "None") {
        modules.push({
            type: "reading",
            title: "Revision Focus",
            description: week.revisionFocus
        });
    }

    return {
        id: week.id,
        title: week.title || `Week ${idx + 1}`,
        phase: week.phase,
        focus: week.focus,
        goals: week.goals,
        estimatedTime: week.estimatedTime,
        modules: modules
    };
}

const newPlans = ALL_PLANS.map((plan: any) => {
    return {
        id: plan.id,
        title: plan.title,
        duration: plan.durationWeeks,
        durationType: "Weeks",
        description: plan.description,
        difficulty: plan.difficulty,
        tags: plan.tags,
        estimatedHoursPerDay: plan.estimatedHoursPerDay,
        category: plan.category,
        recommendedFor: plan.recommendedFor,
        segments: plan.roadmap.map((w: any, idx: number) => convertWeekPlanToSegment(w, idx))
    };
});

newPlans.forEach((plan: any) => {
    const filePath = path.join(plansDir, `${plan.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(plan, null, 2));
    console.log(`Wrote ${plan.id}.json`);
});
